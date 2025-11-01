-- Skapa storage bucket för riksdagen bilder
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'riksdagen-images',
  'riksdagen-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Skapa storage policies för riksdagen bilder
CREATE POLICY "Alla kan se riksdagen bilder"
ON storage.objects
FOR SELECT
USING (bucket_id = 'riksdagen-images');

CREATE POLICY "Service role kan ladda upp riksdagen bilder"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'riksdagen-images');

-- Skapa storage bucket för regeringskansliet dokument och bilder
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'regeringskansliet-files',
  'regeringskansliet-files',
  true,
  52428800, -- 50MB för dokument
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Skapa storage policies för regeringskansliet
CREATE POLICY "Alla kan se regeringskansliet filer"
ON storage.objects
FOR SELECT
USING (bucket_id = 'regeringskansliet-files');

CREATE POLICY "Service role kan ladda upp regeringskansliet filer"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'regeringskansliet-files');