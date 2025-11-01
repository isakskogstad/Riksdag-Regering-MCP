-- ============================================
-- FAS 1.2 (Fixed): Migrate local_files to correct JSONB format
-- ============================================

-- Only update tables that have local_files column
DO $$
DECLARE
  tbl text;
  tables_to_fix text[] := ARRAY[
    'regeringskansliet_sakrad',
    'regeringskansliet_pressmeddelanden',
    'regeringskansliet_tal',
    'regeringskansliet_sou',
    'regeringskansliet_remisser',
    'regeringskansliet_rapporter',
    'regeringskansliet_artiklar',
    'regeringskansliet_debattartiklar',
    'regeringskansliet_arendeforteckningar',
    'regeringskansliet_bistands_strategier',
    'regeringskansliet_dagordningar',
    'regeringskansliet_departementsserien',
    'regeringskansliet_faktapromemoria',
    'regeringskansliet_forordningsmotiv',
    'regeringskansliet_informationsmaterial',
    'regeringskansliet_internationella_overenskommelser',
    'regeringskansliet_kommittedirektiv',
    'regeringskansliet_lagradsremiss',
    'regeringskansliet_mr_granskningar',
    'regeringskansliet_overenskommelser_avtal',
    'regeringskansliet_regeringsarenden',
    'regeringskansliet_regeringsuppdrag',
    'regeringskansliet_skrivelse'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables_to_fix
  LOOP
    -- Skip if column doesn't exist
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = tbl
        AND column_name = 'local_files'
    ) THEN
      EXECUTE format('
        UPDATE %I
        SET local_files = jsonb_build_array(
          jsonb_build_object(
            ''name'', regexp_replace(local_files::text, ''.*/([^/]+)$'', ''\1''),
            ''url'', local_files::text,
            ''original_url'', local_files::text,
            ''size_bytes'', NULL,
            ''mime_type'', ''application/pdf'',
            ''uploaded_at'', NOW()
          )
        )
        WHERE local_files IS NOT NULL 
          AND jsonb_typeof(local_files) = ''string''
      ', tbl);
    END IF;
  END LOOP;
END $$;