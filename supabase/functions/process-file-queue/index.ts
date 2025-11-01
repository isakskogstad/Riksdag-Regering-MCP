import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function sanitizeStoragePath(path: string): string {
  return path.replace(/[^a-zA-Z0-9-_./]/g, '_');
}

function generateConsistentPath(dataType: string, documentId: string, filename: string): string {
  const year = new Date().getFullYear();
  const sanitizedFilename = sanitizeStoragePath(filename);
  return `${dataType}/${year}/${documentId}/${sanitizedFilename}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: adminRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!adminRole) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: queueItems } = await supabaseClient
      .from('file_download_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(100); // Increased from 50 to 100 for faster auto-processing

    let processed = 0;
    let failed = 0;

    for (const item of queueItems || []) {
      await supabaseClient
        .from('file_download_queue')
        .update({ status: 'processing', started_at: new Date().toISOString() })
        .eq('id', item.id);

      try {
        const headResponse = await fetch(item.file_url, { method: 'HEAD' });
        if (!headResponse.ok) {
          throw new Error(`URL returned HTTP ${headResponse.status}`);
        }

        const contentLength = headResponse.headers.get('content-length');
        const contentType = headResponse.headers.get('content-type') || 'application/pdf';

        const response = await fetch(item.file_url);
        if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const sizeBytes = arrayBuffer.byteLength;

        const filename = item.storage_path.split('/').pop() || 'file';
        const consistentPath = generateConsistentPath(
          item.table_name.replace('regeringskansliet_', ''),
          item.record_id,
          filename
        );

        const { error: uploadError } = await supabaseClient.storage
          .from(item.bucket)
          .upload(consistentPath, arrayBuffer, { contentType, upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabaseClient.storage
          .from(item.bucket)
          .getPublicUrl(consistentPath);

        const fileMetadata = {
          name: filename,
          url: publicUrl,
          original_url: item.file_url,
          size_bytes: sizeBytes,
          mime_type: contentType,
          uploaded_at: new Date().toISOString()
        };

        const { data: existingDoc } = await supabaseClient
          .from(item.table_name)
          .select(item.column_name)
          .eq('id', item.record_id)
          .single();

        let updatedFiles = [fileMetadata];
        if (existingDoc?.[item.column_name]) {
          const existing = existingDoc[item.column_name];
          
          // Ensure existing is an array
          if (Array.isArray(existing)) {
            const fileExists = existing.some((f: any) => f.name === filename);
            updatedFiles = fileExists 
              ? existing.map((f: any) => f.name === filename ? fileMetadata : f)
              : [...existing, fileMetadata];
          }
        }

        await supabaseClient
          .from(item.table_name)
          .update({ [item.column_name]: updatedFiles })
          .eq('id', item.record_id);

        await supabaseClient
          .from('file_download_queue')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('id', item.id);

        processed++;
      } catch (error: any) {
        const newAttempts = item.attempts + 1;
        const newStatus = newAttempts >= item.max_attempts ? 'failed' : 'pending';

        await supabaseClient
          .from('file_download_queue')
          .update({
            status: newStatus,
            attempts: newAttempts,
            error_message: error.message
          })
          .eq('id', item.id);

        failed++;
      }
    }

    return new Response(JSON.stringify({ processed, failed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred', requestId: crypto.randomUUID() }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
