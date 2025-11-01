-- =====================================================
-- Fix: Materialized View Security  
-- =====================================================
-- Remove public access to storage_statistics materialized view
-- Only allow access via RPC function

REVOKE ALL ON storage_statistics FROM anon;
REVOKE ALL ON storage_statistics FROM authenticated;

-- Grant access only to postgres role (service role & internal functions)
GRANT SELECT ON storage_statistics TO postgres;
GRANT SELECT ON storage_statistics TO service_role;
