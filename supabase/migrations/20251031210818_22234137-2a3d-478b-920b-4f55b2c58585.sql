-- Storage policies för riksdagen-images bucket
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Alla kan ladda upp bilder till riksdagen-images'
  ) THEN
    CREATE POLICY "Alla kan ladda upp bilder till riksdagen-images" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'riksdagen-images');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Alla kan uppdatera bilder i riksdagen-images'
  ) THEN
    CREATE POLICY "Alla kan uppdatera bilder i riksdagen-images" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'riksdagen-images');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Alla kan läsa bilder från riksdagen-images'
  ) THEN
    CREATE POLICY "Alla kan läsa bilder från riksdagen-images" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'riksdagen-images');
  END IF;
END $$;

-- Storage policies för regeringskansliet-files bucket
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Alla kan ladda upp filer till regeringskansliet-files'
  ) THEN
    CREATE POLICY "Alla kan ladda upp filer till regeringskansliet-files" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'regeringskansliet-files');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Alla kan uppdatera filer i regeringskansliet-files'
  ) THEN
    CREATE POLICY "Alla kan uppdatera filer i regeringskansliet-files" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'regeringskansliet-files');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Alla kan läsa filer från regeringskansliet-files'
  ) THEN
    CREATE POLICY "Alla kan läsa filer från regeringskansliet-files" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'regeringskansliet-files');
  END IF;
END $$;