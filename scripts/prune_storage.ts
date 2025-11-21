/**
 * Tar bort gamla filer från Supabase Storage (t.ex. äldre fallback-json).
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.PRUNE_BUCKET || 'riksdagen-dokument';
const KEEP_DAYS = parseInt(process.env.PRUNE_KEEP_DAYS || '30', 10);

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before pruning storage.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  const cutoff = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;
  const { data, error } = await supabase.storage.from(BUCKET).list(undefined, { limit: 1000 });
  if (error) {
    throw error;
  }

  const toRemove = (data || [])
    .filter((file) => file?.created_at && new Date(file.created_at).getTime() < cutoff)
    .map((file) => file.name);

  if (toRemove.length === 0) {
    console.log('No files to prune.');
    return;
  }

  const { error: removeError } = await supabase.storage.from(BUCKET).remove(toRemove);
  if (removeError) {
    throw removeError;
  }

  console.log(`Removed ${toRemove.length} files from bucket ${BUCKET}.`);
}

main().catch((error) => {
  console.error('Prune failed:', error);
  process.exit(1);
});
