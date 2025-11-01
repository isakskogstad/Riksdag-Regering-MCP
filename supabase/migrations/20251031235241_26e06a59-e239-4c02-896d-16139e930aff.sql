-- ============================================
-- FAS 1.1: Fix storage_statistics view
-- ============================================

-- Drop old view
DROP MATERIALIZED VIEW IF EXISTS storage_statistics;

-- Create new view with correct column names
CREATE MATERIALIZED VIEW storage_statistics AS
SELECT 
  bucket_id as bucket_name,
  COUNT(*) as file_count,
  COALESCE(SUM((metadata->>'size')::bigint), 0) as total_size_bytes,
  MAX(updated_at) as last_updated
FROM storage.objects
WHERE bucket_id IN ('regeringskansliet-files', 'riksdagen-images')
GROUP BY bucket_id;

-- Create unique index
CREATE UNIQUE INDEX idx_storage_stats_bucket ON storage_statistics(bucket_name);

-- Grant access
GRANT SELECT ON storage_statistics TO authenticated;