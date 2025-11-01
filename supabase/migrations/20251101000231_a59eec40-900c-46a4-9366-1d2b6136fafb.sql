-- ============================================================
-- MIGRATION: Åtgärda Storage Statistics Materialized View
-- SYFTE: Ersätt materialized view med RLS-skyddad tabell
-- SÄKERHET: Admins-only access till storage-statistik
-- ============================================================

-- 1. Drop befintlig materialized view
DROP MATERIALIZED VIEW IF EXISTS public.storage_statistics CASCADE;

-- 2. Skapa ny RLS-skyddad tabell
CREATE TABLE public.storage_statistics (
  bucket_id text PRIMARY KEY,
  file_count bigint NOT NULL DEFAULT 0,
  total_size_bytes bigint NOT NULL DEFAULT 0,
  last_updated timestamptz NOT NULL DEFAULT now()
);

-- 3. Aktivera RLS
ALTER TABLE public.storage_statistics ENABLE ROW LEVEL SECURITY;

-- 4. Skapa admin-only policy för läsning
CREATE POLICY "Admins can read storage statistics"
ON public.storage_statistics
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Skapa admin-only policy för skrivning (används av refresh-funktionen)
CREATE POLICY "Service role can write storage statistics"
ON public.storage_statistics
FOR ALL
TO service_role
WITH CHECK (true);

-- 6. Återskapa refresh-funktionen att populera tabell istället
CREATE OR REPLACE FUNCTION public.refresh_storage_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Rensa befintlig data
  DELETE FROM public.storage_statistics;
  
  -- Populera med aktuell statistik från storage.objects
  INSERT INTO public.storage_statistics (bucket_id, file_count, total_size_bytes, last_updated)
  SELECT 
    bucket_id,
    COUNT(*) as file_count,
    COALESCE(SUM(
      CASE 
        WHEN (metadata->>'size')::bigint > 0 
        THEN (metadata->>'size')::bigint 
        ELSE 0 
      END
    ), 0) as total_size_bytes,
    now() as last_updated
  FROM storage.objects
  GROUP BY bucket_id
  ON CONFLICT (bucket_id) 
  DO UPDATE SET
    file_count = EXCLUDED.file_count,
    total_size_bytes = EXCLUDED.total_size_bytes,
    last_updated = EXCLUDED.last_updated;
END;
$$;

-- 7. Initial populering av data
SELECT public.refresh_storage_statistics();

-- 8. Kommentar för dokumentation
COMMENT ON TABLE public.storage_statistics IS 'RLS-skyddad tabell för storage-statistik. Endast admins kan läsa. Uppdateras via refresh_storage_statistics().';
COMMENT ON FUNCTION public.refresh_storage_statistics IS 'Uppdaterar storage_statistics-tabellen med aktuell data från storage.objects. Körs automatiskt från admin-panelen.';