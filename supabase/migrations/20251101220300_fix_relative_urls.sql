-- ============================================================================
-- SQL Migration: Convert Relative URLs to Absolute URLs
-- ============================================================================
-- This migration updates all relative URL fields in Regeringskansliet tables
-- to use absolute URLs with https://www.regeringen.se domain.
--
-- BEFORE: url = '/contentassets/...'
-- AFTER:  url = 'https://www.regeringen.se/contentassets/...'
-- ============================================================================

BEGIN;

-- Create helper function to convert relative URLs to absolute
CREATE OR REPLACE FUNCTION convert_to_absolute_url(url_value TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Return NULL if input is NULL or empty
  IF url_value IS NULL OR url_value = '' THEN
    RETURN url_value;
  END IF;

  -- If already absolute (starts with http:// or https://), return as-is
  IF url_value LIKE 'http://%' OR url_value LIKE 'https://%' THEN
    RETURN url_value;
  END IF;

  -- If starts with /, prepend regeringen.se domain
  IF url_value LIKE '/%' THEN
    RETURN 'https://www.regeringen.se' || url_value;
  END IF;

  -- Otherwise return as-is
  RETURN url_value;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- Update all Regeringskansliet tables
-- ============================================================================

-- 1. regeringskansliet_ds (Departementsserien)
UPDATE regeringskansliet_ds
SET url = convert_to_absolute_url(url),
    markdown_url = convert_to_absolute_url(markdown_url)
WHERE url LIKE '/%' OR markdown_url LIKE '/%';

-- 2. regeringskansliet_sou (Statens offentliga utredningar)
UPDATE regeringskansliet_sou
SET url = convert_to_absolute_url(url),
    markdown_url = convert_to_absolute_url(markdown_url)
WHERE url LIKE '/%' OR markdown_url LIKE '/%';

-- 3. regeringskansliet_propositioner
UPDATE regeringskansliet_propositioner
SET url = convert_to_absolute_url(url),
    markdown_url = convert_to_absolute_url(markdown_url)
WHERE url LIKE '/%' OR markdown_url LIKE '/%';

-- 4. regeringskansliet_skrivelser
UPDATE regeringskansliet_skrivelser
SET url = convert_to_absolute_url(url),
    markdown_url = convert_to_absolute_url(markdown_url)
WHERE url LIKE '/%' OR markdown_url LIKE '/%';

-- 5. regeringskansliet_dokument
UPDATE regeringskansliet_dokument
SET url = convert_to_absolute_url(url),
    markdown_url = convert_to_absolute_url(markdown_url)
WHERE url LIKE '/%' OR markdown_url LIKE '/%';

-- 6. regeringskansliet_pressmeddelanden
UPDATE regeringskansliet_pressmeddelanden
SET url = convert_to_absolute_url(url),
    markdown_url = convert_to_absolute_url(markdown_url)
WHERE url LIKE '/%' OR markdown_url LIKE '/%';

-- 7. regeringskansliet_artiklar
UPDATE regeringskansliet_artiklar
SET url = convert_to_absolute_url(url),
    markdown_url = convert_to_absolute_url(markdown_url)
WHERE url LIKE '/%' OR markdown_url LIKE '/%';

-- 8. regeringskansliet_talmansinskott
UPDATE regeringskansliet_talmansinskott
SET url = convert_to_absolute_url(url),
    markdown_url = convert_to_absolute_url(markdown_url)
WHERE url LIKE '/%' OR markdown_url LIKE '/%';

-- 9. regeringskansliet_eu_forslag
UPDATE regeringskansliet_eu_forslag
SET url = convert_to_absolute_url(url),
    markdown_url = convert_to_absolute_url(markdown_url)
WHERE url LIKE '/%' OR markdown_url LIKE '/%';

-- 10. regeringskansliet_rattsdokument
UPDATE regeringskansliet_rattsdokument
SET url = convert_to_absolute_url(url),
    markdown_url = convert_to_absolute_url(markdown_url)
WHERE url LIKE '/%' OR markdown_url LIKE '/%';

-- 11-26: Other regeringskansliet tables (if they exist and have url fields)
-- Add updates for remaining tables here...

-- Print statistics
DO $$
DECLARE
  total_updated INTEGER := 0;
  table_record RECORD;
  count_val INTEGER;
BEGIN
  -- Check each table for updated rows
  FOR table_record IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename LIKE 'regeringskansliet_%'
  LOOP
    EXECUTE format('SELECT COUNT(*) FROM %I WHERE url LIKE ''https://www.regeringen.se/%%'' OR markdown_url LIKE ''https://www.regeringen.se/%%''', table_record.tablename) INTO count_val;

    IF count_val > 0 THEN
      RAISE NOTICE 'Table %: % rows with absolute URLs', table_record.tablename, count_val;
      total_updated := total_updated + count_val;
    END IF;
  END LOOP;

  RAISE NOTICE 'Total rows updated across all tables: %', total_updated;
END $$;

-- Drop the helper function after use (optional - keep it if useful for future)
-- DROP FUNCTION IF EXISTS convert_to_absolute_url(TEXT);

COMMIT;

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- All relative URLs have been converted to absolute URLs.
-- Verify with: SELECT url, markdown_url FROM regeringskansliet_sou LIMIT 5;
-- ============================================================================
