-- =====================================================
-- Storage Statistics Materialized View
-- =====================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS storage_statistics AS
SELECT 
  bucket_id,
  COUNT(*) AS file_count,
  SUM(
    CAST(
      COALESCE(
        (metadata->>'size')::text, 
        '0'
      ) AS bigint
    )
  ) AS total_size_bytes
FROM storage.objects
GROUP BY bucket_id;

-- Index for better query performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_storage_stats_bucket 
ON storage_statistics(bucket_id);

-- Function to refresh statistics
CREATE OR REPLACE FUNCTION public.refresh_storage_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW storage_statistics;
END;
$$;
