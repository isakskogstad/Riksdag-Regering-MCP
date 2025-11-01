import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Sanitize file paths to remove invalid characters for Supabase Storage
function sanitizeStoragePath(path: string): string {
  // Remove or replace invalid characters: : " * ? < > | and leading/trailing spaces
  return path
    .replace(/:/g, '-')  // Replace colons with hyphens
    .replace(/["\*\?<>\|]/g, '_')  // Replace other invalid chars with underscores
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/\/+/g, '/')  // Collapse multiple slashes
    .replace(/^\/|\/$/g, '');  // Remove leading/trailing slashes
}

// Lägg till fil i nedladdningskö istället för att ladda ner direkt
async function enqueueFileDownload(
  supabaseClient: any,
  fileUrl: string,
  bucket: string,
  path: string,
  tableName: string,
  recordId: string,
  columnName: string
) {
  try {
    // Fixa relativa URLs från regeringen.se
    let fullUrl = fileUrl;
    if (fileUrl.startsWith('/')) {
      fullUrl = `https://www.regeringen.se${fileUrl}`;
    }
    
    await supabaseClient
      .from('file_download_queue')
      .insert({
        file_url: fullUrl,
        bucket,
        storage_path: sanitizeStoragePath(path),  // Sanitize path before storing
        table_name: tableName,
        record_id: recordId,
        column_name: columnName,
        status: 'pending'
      });
    console.log(`Fil tillagd i kö: ${sanitizeStoragePath(path)}`);
  } catch (err) {
    console.error('Fel vid tillägg i filkö:', err);
  }
}

// Kontrollera om hämtning ska stoppas
async function shouldStop(supabaseClient: any, dataType: string): Promise<boolean> {
  const { data } = await supabaseClient
    .from('data_fetch_control')
    .select('should_stop')
    .eq('source', 'regeringskansliet')
    .eq('data_type', dataType)
    .maybeSingle();
  
  return data?.should_stop === true;
}

// Uppdatera progress
async function updateProgress(
  supabaseClient: any,
  dataType: string,
  updates: any
) {
  await supabaseClient
    .from('data_fetch_progress')
    .upsert({
      source: 'regeringskansliet',
      data_type: dataType,
      ...updates,
      last_fetched_at: new Date().toISOString()
    }, { onConflict: 'source,data_type' });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
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
    )

    // Verify the user is authenticated and is an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth verification failed:', authError?.message, 'User:', user?.id);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id, user.email);

    // Check if user has admin role (using service role to bypass RLS)
    const { data: adminRole, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    console.log('Admin check result:', { adminRole, roleError, userId: user.id });

    if (roleError || !adminRole) {
      console.error('Admin check failed:', roleError?.message, 'Role found:', adminRole);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    const requestBody = await req.json();
    if (!requestBody || typeof requestBody.dataType !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid request: dataType required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rawDataType = requestBody.dataType.trim();
    if (rawDataType.length === 0 || rawDataType.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid dataType length' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalisera dataType - konvertera understreck till bindestreck för konsistens
    const dataType = rawDataType.replace(/_/g, "-");
    console.log(`Hämtar ${dataType} data från g0v.se API... (original: ${rawDataType})`);

    // Block 'dokument' endpoint as it returns 10,000+ items causing memory issues
    if (dataType === 'dokument') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Endpointen "dokument" returnerar för mycket data (~10,000+ poster) och kan inte användas direkt. Använd istället specifika dokumenttyper som "propositioner", "sou", "departementsserien", etc.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const endpointMap: Record<string, { url: string, table: string }> = {
      'pressmeddelanden': { url: 'https://g0v.se/pressmeddelanden.json', table: 'regeringskansliet_pressmeddelanden' },
      'propositioner': { url: 'https://g0v.se/rattsliga-dokument/proposition.json', table: 'regeringskansliet_propositioner' },
      'kategorier': { url: 'https://g0v.se/api/codes.json', table: 'regeringskansliet_kategorier' },
      'departementsserien': { url: 'https://g0v.se/rattsliga-dokument/departementsserien-och-promemorior.json', table: 'regeringskansliet_departementsserien' },
      'forordningsmotiv': { url: 'https://g0v.se/rattsliga-dokument/forordningsmotiv.json', table: 'regeringskansliet_forordningsmotiv' },
      'kommittedirektiv': { url: 'https://g0v.se/rattsliga-dokument/kommittedirektiv.json', table: 'regeringskansliet_kommittedirektiv' },
      'lagradsremiss': { url: 'https://g0v.se/rattsliga-dokument/lagradsremiss.json', table: 'regeringskansliet_lagradsremiss' },
      'skrivelse': { url: 'https://g0v.se/rattsliga-dokument/skrivelse.json', table: 'regeringskansliet_skrivelse' },
      'sou': { url: 'https://g0v.se/rattsliga-dokument/statens-offentliga-utredningar.json', table: 'regeringskansliet_sou' },
      'internationella-overenskommelser': { url: 'https://g0v.se/rattsliga-dokument/sveriges-internationella-overenskommelser.json', table: 'regeringskansliet_internationella_overenskommelser' },
      'faktapromemoria': { url: 'https://g0v.se/faktapromemoria.json', table: 'regeringskansliet_faktapromemoria' },
      'informationsmaterial': { url: 'https://g0v.se/informationsmaterial.json', table: 'regeringskansliet_informationsmaterial' },
      'mr-granskningar': { url: 'https://g0v.se/internationella-mr-granskningar-av-sverige.json', table: 'regeringskansliet_mr_granskningar' },
      'dagordningar': { url: 'https://g0v.se/kommenterade-dagordningar.json', table: 'regeringskansliet_dagordningar' },
      'rapporter': { url: 'https://g0v.se/rapporter.json', table: 'regeringskansliet_rapporter' },
      'remisser': { url: 'https://g0v.se/remisser.json', table: 'regeringskansliet_remisser' },
      'regeringsuppdrag': { url: 'https://g0v.se/regeringsuppdrag.json', table: 'regeringskansliet_regeringsuppdrag' },
      'regeringsarenden': { url: 'https://g0v.se/regeringsarenden.json', table: 'regeringskansliet_regeringsarenden' },
      'sakrad': { url: 'https://g0v.se/sakrad.json', table: 'regeringskansliet_sakrad' },
      'bistands-strategier': { url: 'https://g0v.se/strategier-for-internationellt-bistand.json', table: 'regeringskansliet_bistands_strategier' },
      'overenskommelser-avtal': { url: 'https://g0v.se/overenskommelser-och-avtal.json', table: 'regeringskansliet_overenskommelser_avtal' },
      'arendeforteckningar': { url: 'https://g0v.se/arendeforteckningar.json', table: 'regeringskansliet_arendeforteckningar' },
      'artiklar': { url: 'https://g0v.se/artiklar.json', table: 'regeringskansliet_artiklar' },
      'debattartiklar': { url: 'https://g0v.se/debattartiklar.json', table: 'regeringskansliet_debattartiklar' },
      'tal': { url: 'https://g0v.se/tal.json', table: 'regeringskansliet_tal' },
      'ud-avrader': { url: 'https://g0v.se/ud-avrader.json', table: 'regeringskansliet_ud_avrader' },
      'uttalanden': { url: 'https://g0v.se/uttalanden.json', table: 'regeringskansliet_uttalanden' },
    };

    const endpoint = endpointMap[dataType];
    
    if (!endpoint) {
      const availableTypes = Object.keys(endpointMap).join(', ');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Okänd datatyp: "${dataType}". Tillgängliga: ${availableTypes}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const apiUrl = endpoint.url;
    const tableName = endpoint.table;

    console.log(`Anropar: ${apiUrl}`);
    
    await updateProgress(supabaseClient, dataType, {
      current_page: 1,
      total_pages: 1,
      items_fetched: 0,
      status: 'in_progress'
    });

    // Helper function to fetch with retries
    const fetchWithRetry = async (url: string, maxRetries = 3): Promise<Response> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Försök ${attempt}/${maxRetries} för ${url}`);
          
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; SvensktPolitikArkiv/1.0)',
              'Accept': 'application/json',
              'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.8',
            },
            signal: AbortSignal.timeout(30000), // 30 second timeout
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          return response;
        } catch (error) {
          const isLastAttempt = attempt === maxRetries;
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          console.error(`Försök ${attempt} misslyckades:`, errorMessage);
          
          if (isLastAttempt) {
            throw new Error(`Kunde inte hämta data efter ${maxRetries} försök: ${errorMessage}`);
          }
          
          console.log(`Väntar ${waitTime}ms innan nästa försök...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
      throw new Error('Unexpected error in fetchWithRetry');
    };

    // Hämta data från g0v.se API
    const response = await fetchWithRetry(apiUrl);

    const data = await response.json();
    console.log('Data hämtad från g0v.se API');

    // Batching configuration to prevent resource exhaustion
    const BATCH_SIZE = 25; // Process max 25 items per execution to avoid memory issues
    let insertedCount = 0;
    let errors = 0;
    let totalItems = 0;
    let processedItems = 0;

    // Get current progress to support resumption
    const { data: currentProgress } = await supabaseClient
      .from('data_fetch_progress')
      .select('items_fetched')
      .eq('data_type', dataType)
      .single();
    
    const startIndex = currentProgress?.items_fetched || 0;

    if (dataType === 'pressmeddelanden' && Array.isArray(data)) {
      const items = data;
      totalItems = items.length;
      
      await updateProgress(supabaseClient, dataType, { total_items: totalItems });
      
      // Process only a batch of items to avoid resource exhaustion
      const endIndex = Math.min(startIndex + BATCH_SIZE, items.length);
      const itemsToProcess = items.slice(startIndex, endIndex);
      
      console.log(`Bearbetar items ${startIndex + 1}-${endIndex} av ${totalItems}`);
      
      for (const item of itemsToProcess) {
        // Kontrollera stoppsignal
        if (await shouldStop(supabaseClient, dataType)) {
          console.log('Stoppsignal mottagen, avbryter hämtning');
          await updateProgress(supabaseClient, dataType, {
            status: 'stopped',
            error_message: 'Manuellt stoppad av användare'
          });
          break;
        }
        
        try {
          const pressData: any = {
            document_id: item.id || item.url,
            titel: item.title,
            publicerad_datum: item.published,
            departement: item.sender,
            url: item.url,
            innehall: item.summary || item.description,
          };

          // Lägg till bilagor i nedladdningskö istället för direkt nedladdning
          const { data: insertedPress, error: insertError } = await supabaseClient
            .from(tableName)
            .upsert(pressData, { onConflict: 'document_id' })
            .select('id')
            .single();

          if (insertedPress && item.attachments && Array.isArray(item.attachments)) {
            for (const attachment of item.attachments) {
              // Fixa relativa URLs
              let attachmentUrl = attachment.url;
              if (attachmentUrl.startsWith('/')) {
                attachmentUrl = `https://www.regeringen.se${attachmentUrl}`;
              }
              
              const fileName = attachmentUrl.split('/').pop() || `bilaga_${Date.now()}.pdf`;
              const filePath = `pressmeddelanden/${item.id || Date.now()}/${fileName}`;
              await enqueueFileDownload(
                supabaseClient,
                attachmentUrl,
                'regeringskansliet-files',
                filePath,
                tableName,
                insertedPress.id,
                'local_bilagor'
              );
            }
          }

          if (insertError) {
            console.error('Fel vid insättning:', insertError);
            errors++;
          } else {
            insertedCount++;
          }
          processedItems++;
        } catch (err) {
          console.error('Fel vid bearbetning:', err);
          errors++;
          processedItems++;
        }
      }
      
      // Check if more items remain
      const hasMoreItems = endIndex < totalItems;
      const finalStatus = hasMoreItems ? 'in_progress' : 'completed';
      
      console.log(`Batch complete: ${insertedCount} inserted, ${errors} errors. Status: ${finalStatus}`);
      if (hasMoreItems) {
        console.log(`${totalItems - endIndex} items remaining. Call function again to continue.`);
      }
    } else if (dataType === 'propositioner' && Array.isArray(data)) {
      const items = data;
      totalItems = items.length;
      
      await updateProgress(supabaseClient, dataType, { total_items: totalItems });
      
      // Process only a batch of items
      const endIndex = Math.min(startIndex + BATCH_SIZE, items.length);
      const itemsToProcess = items.slice(startIndex, endIndex);
      
      console.log(`Bearbetar items ${startIndex + 1}-${endIndex} av ${totalItems}`);
      
      for (const item of itemsToProcess) {
        // Kontrollera stoppsignal
        if (await shouldStop(supabaseClient, dataType)) {
          console.log('Stoppsignal mottagen, avbryter hämtning');
          await updateProgress(supabaseClient, dataType, {
            status: 'stopped',
            error_message: 'Manuellt stoppad av användare'
          });
          break;
        }
        
        try {
          const propData: any = {
            document_id: item.id || item.url,
            titel: item.title,
            publicerad_datum: item.published,
            beteckningsnummer: item.identifier,
            departement: item.sender,
            url: item.url,
            pdf_url: item.attachments?.[0]?.url,
          };

          // Lägg till PDF i nedladdningskö istället för direkt nedladdning
          const { data: insertedProp, error: insertError } = await supabaseClient
            .from(tableName)
            .upsert(propData, { onConflict: 'document_id' })
            .select('id')
            .single();

          if (insertedProp && propData.pdf_url) {
            // Fixa relativa URLs
            let pdfUrl = propData.pdf_url;
            if (pdfUrl.startsWith('/')) {
              pdfUrl = `https://www.regeringen.se${pdfUrl}`;
            }
            
            const fileName = `${item.identifier || item.id || Date.now()}.pdf`;
            const filePath = `propositioner/${fileName}`;
            await enqueueFileDownload(
              supabaseClient,
              pdfUrl,
              'regeringskansliet-files',
              filePath,
              tableName,
              insertedProp.id,
              'local_pdf_url'
            );
          }

          if (insertError) {
            console.error('Fel vid insättning:', insertError);
            errors++;
          } else {
            insertedCount++;
          }
          processedItems++;
        } catch (err) {
          console.error('Fel vid bearbetning:', err);
          errors++;
          processedItems++;
        }
      }
      
      // Check if more items remain
      const hasMoreItems = endIndex < totalItems;
      const finalStatus = hasMoreItems ? 'in_progress' : 'completed';
      
      console.log(`Batch complete: ${insertedCount} inserted, ${errors} errors. Status: ${finalStatus}`);
      if (hasMoreItems) {
        console.log(`${totalItems - endIndex} items remaining. Call function again to continue.`);
      }
    } else if (dataType === 'kategorier' && typeof data === 'object') {
      // Kategorier kommer som objekt med koder som nycklar
      const entries = Object.entries(data);
      totalItems = entries.length;
      
      await updateProgress(supabaseClient, dataType, { total_items: totalItems });
      
      // Process only a batch
      const endIndex = Math.min(startIndex + BATCH_SIZE, entries.length);
      const entriesToProcess = entries.slice(startIndex, endIndex);
      
      console.log(`Bearbetar items ${startIndex + 1}-${endIndex} av ${totalItems}`);
      
      for (const [kod, namn] of entriesToProcess) {
        // Kontrollera stoppsignal
        if (await shouldStop(supabaseClient, dataType)) {
          console.log('Stoppsignal mottagen, avbryter hämtning');
          await updateProgress(supabaseClient, dataType, {
            status: 'stopped',
            error_message: 'Manuellt stoppad av användare'
          });
          break;
        }
        
        try {
          const kategoriData = {
            kod: kod,
            namn: namn as string,
          };

          const { error } = await supabaseClient
            .from(tableName)
            .upsert(kategoriData, { onConflict: 'kod' });

          if (error) {
            console.error('Fel vid insättning:', error);
            errors++;
          } else {
            insertedCount++;
          }
          processedItems++;
        } catch (err) {
          console.error('Fel vid bearbetning:', err);
          errors++;
          processedItems++;
        }
      }
      
      // Check if more items remain
      const hasMoreItems = endIndex < totalItems;
      const finalStatus = hasMoreItems ? 'in_progress' : 'completed';
      
      console.log(`Batch complete: ${insertedCount} inserted, ${errors} errors. Status: ${finalStatus}`);
      if (hasMoreItems) {
        console.log(`${totalItems - endIndex} items remaining. Call function again to continue.`);
      }
    } else if (Array.isArray(data)) {
      // Hantera alla andra dokumenttyper med standardformat
      const items = data;
      totalItems = items.length;
      
      await updateProgress(supabaseClient, dataType, { total_items: totalItems });
      
      // Process only a batch
      const endIndex = Math.min(startIndex + BATCH_SIZE, items.length);
      const itemsToProcess = items.slice(startIndex, endIndex);
      
      console.log(`Bearbetar items ${startIndex + 1}-${endIndex} av ${totalItems}`);
      
      for (const item of itemsToProcess) {
        // Kontrollera stoppsignal
        if (await shouldStop(supabaseClient, dataType)) {
          console.log('Stoppsignal mottagen, avbryter hämtning');
          await updateProgress(supabaseClient, dataType, {
            status: 'stopped',
            error_message: 'Manuellt stoppad av användare'
          });
          break;
        }
        
        try {
          const docData: any = {
            document_id: item.id || item.url,
            titel: item.title,
            publicerad_datum: item.published,
            uppdaterad_datum: item.updated,
            typ: item.type,
            kategorier: item.categories,
            avsandare: item.sender,
            beteckningsnummer: item.identifier,
            url: item.url,
            markdown_url: item.url ? item.url.replace('regeringen.se', 'g0v.se').replace(/\/$/, '.md') : null,
          };

          // Lägg till bilagor i nedladdningskö istället för direkt nedladdning
          const { data: insertedDoc, error: insertError } = await supabaseClient
            .from(tableName)
            .upsert(docData, { onConflict: 'document_id' })
            .select('id')
            .single();

          if (insertedDoc && item.attachments && Array.isArray(item.attachments)) {
            for (const attachment of item.attachments) {
              // Fixa relativa URLs
              let attachmentUrl = attachment.url;
              if (attachmentUrl.startsWith('/')) {
                attachmentUrl = `https://www.regeringen.se${attachmentUrl}`;
              }
              
              const fileName = attachmentUrl.split('/').pop() || `file_${Date.now()}`;
              const filePath = `${dataType}/${item.id || Date.now()}/${fileName}`;
              await enqueueFileDownload(
                supabaseClient,
                attachmentUrl,
                'regeringskansliet-files',
                filePath,
                tableName,
                insertedDoc.id,
                'local_files'
              );
            }
          }

          if (insertError) {
            console.error('Fel vid insättning:', insertError);
            errors++;
          } else {
            insertedCount++;
          }
          processedItems++;
        } catch (err) {
          console.error('Fel vid bearbetning:', err);
          errors++;
          processedItems++;
        }
      }
      
      // Check if more items remain
      const hasMoreItems = endIndex < totalItems;
      const finalStatus = hasMoreItems ? 'in_progress' : 'completed';
      
      console.log(`Batch complete: ${insertedCount} inserted, ${errors} errors. Status: ${finalStatus}`);
      if (hasMoreItems) {
        console.log(`${totalItems - endIndex} items remaining. Call function again to continue.`);
      }
    }

    // Uppdatera progress med batchad status
    const totalProcessed = startIndex + processedItems;
    const isComplete = totalProcessed >= totalItems;
    const batchStatus = isComplete ? 'completed' : 'in_progress';
    
    await updateProgress(supabaseClient, dataType, {
      items_fetched: totalProcessed,
      total_items: totalItems,
      status: batchStatus
    });

    // Logga API-anropet
    await supabaseClient.from('regeringskansliet_api_log').insert({
      endpoint: dataType,
      status: isComplete ? 'success' : 'partial',
      antal_poster: insertedCount,
      felmeddelande: errors > 0 ? `${errors} fel uppstod i batch` : null,
    });

    console.log(`Batch slutfört! Infogade ${insertedCount} poster, ${errors} fel. Progress: ${totalProcessed}/${totalItems}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        inserted: insertedCount,
        errors: errors,
        totalProcessed: totalProcessed,
        totalItems: totalItems,
        complete: isComplete,
        message: isComplete 
          ? `Hämtade och sparade ${totalProcessed} ${dataType}` 
          : `Bearbetade batch: ${insertedCount} items. ${totalItems - totalProcessed} kvarstår. Anropa funktionen igen för att fortsätta.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Log detailed error for debugging
    console.error('Edge function error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    // Return generic error to client
    const requestId = crypto.randomUUID();
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'An error occurred processing your request',
        requestId: requestId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
