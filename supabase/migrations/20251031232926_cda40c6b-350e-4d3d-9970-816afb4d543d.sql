-- Fas 1: Utöka data_fetch_progress för automatisk återupptagning
ALTER TABLE public.data_fetch_progress 
ADD COLUMN IF NOT EXISTS next_page_url TEXT,
ADD COLUMN IF NOT EXISTS pages_processed INTEGER DEFAULT 0;

-- Fas 2: Skapa funktion för att hämta tabellstorlekar och statistik
CREATE OR REPLACE FUNCTION public.get_table_sizes()
RETURNS TABLE (
  table_name TEXT,
  row_count BIGINT,
  total_size TEXT,
  size_bytes BIGINT,
  last_updated TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.tablename::TEXT,
    COALESCE(
      (SELECT COUNT(*)::BIGINT FROM public.data_fetch_progress p 
       WHERE p.source || '_' || REPLACE(p.data_type, '-', '_') = t.tablename
       AND p.items_fetched > 0
       LIMIT 1),
      0
    ) AS row_count,
    pg_size_pretty(pg_total_relation_size(t.schemaname||'.'||t.tablename))::TEXT AS total_size,
    pg_total_relation_size(t.schemaname||'.'||t.tablename)::BIGINT AS size_bytes,
    COALESCE(
      (SELECT MAX(p.updated_at) FROM public.data_fetch_progress p 
       WHERE p.source || '_' || REPLACE(p.data_type, '-', '_') = t.tablename),
      NOW()
    ) AS last_updated
  FROM pg_tables t
  WHERE t.schemaname = 'public'
    AND (t.tablename LIKE 'riksdagen_%' OR t.tablename LIKE 'regeringskansliet_%')
  ORDER BY pg_total_relation_size(t.schemaname||'.'||t.tablename) DESC;
END;
$$;

COMMENT ON FUNCTION public.get_table_sizes() IS 'Returnerar tabellstorlekar, antal rader och senaste uppdatering för riksdagen och regeringskansliet tabeller';