import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.BUCKET_NAME || 'riksdagen-dokument';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running ensure_storage_bucket.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((bucket) => bucket.name === BUCKET)) {
    console.log(`Bucket ${BUCKET} already exists.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(BUCKET, { public: false });
  if (error) {
    throw error;
  }
  console.log(`Created bucket ${BUCKET}`);
}

main().catch((error) => {
  console.error('Failed ensuring bucket:', error);
  process.exit(1);
});
