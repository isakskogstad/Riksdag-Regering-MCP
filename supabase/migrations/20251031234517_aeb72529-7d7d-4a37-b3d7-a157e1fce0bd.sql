-- =====================================================
-- SÄKERHETSFÖRBÄTTRING: Storage Policies
-- =====================================================

-- 1. Ta bort existerande policies som tillåter public upload
DROP POLICY IF EXISTS "Alla kan ladda upp regeringskansliet-filer" ON storage.objects;
DROP POLICY IF EXISTS "Alla kan ladda upp riksdagen-bilder" ON storage.objects;
DROP POLICY IF EXISTS "Autentiserade kan ladda upp filer" ON storage.objects;
DROP POLICY IF EXISTS "Alla kan radera regeringskansliet-filer" ON storage.objects;
DROP POLICY IF EXISTS "Alla kan radera riksdagen-bilder" ON storage.objects;

-- 2. Endast service role (edge functions) kan ladda upp
CREATE POLICY "Only service role can upload regeringskansliet files"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'regeringskansliet-files');

CREATE POLICY "Only service role can upload riksdagen images"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'riksdagen-images');

CREATE POLICY "Only service role can update regeringskansliet files"
ON storage.objects
FOR UPDATE
TO service_role
USING (bucket_id = 'regeringskansliet-files');

CREATE POLICY "Only service role can update riksdagen images"
ON storage.objects
FOR UPDATE
TO service_role
USING (bucket_id = 'riksdagen-images');

-- 3. Public read access (för publikt arkiv)
CREATE POLICY "Anyone can read regeringskansliet files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'regeringskansliet-files');

CREATE POLICY "Anyone can read riksdagen images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'riksdagen-images');

-- 4. Endast service role kan radera
CREATE POLICY "Only service role can delete storage files"
ON storage.objects
FOR DELETE
TO service_role
USING (bucket_id IN ('regeringskansliet-files', 'riksdagen-images'));
