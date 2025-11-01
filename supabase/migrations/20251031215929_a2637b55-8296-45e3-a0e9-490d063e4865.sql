-- Cleanup: Ta bort duplicerade och överdrivet tillåtande RLS policies

-- === user_roles: Ta bort duplicerade policies ===
-- Behåll bara de mest beskrivande (engelska) versionerna
DROP POLICY IF EXISTS "Användare kan se sina egna roller" ON public.user_roles;
DROP POLICY IF EXISTS "Admins kan hantera alla roller" ON public.user_roles;

-- === data_fetch_control: Ta bort duplicerade SELECT policies ===
-- Behåll bara "Anyone can view control" (mer specifik än den svenska)
DROP POLICY IF EXISTS "Alla kan läsa kontroll" ON public.data_fetch_control;

-- === data_fetch_progress: Ta bort överdrivet tillåtande public access ===
-- Ta bort policy som tillåter anonym access (role: public)
DROP POLICY IF EXISTS "Alla kan läsa progress" ON public.data_fetch_progress;

-- === file_download_queue: Ta bort onödig anonym access till systeminfo ===
-- Ta bort policy som tillåter anonym/autentiserad access till filkön
-- Bara admins bör se filkön
DROP POLICY IF EXISTS "Alla kan läsa filkö" ON public.file_download_queue;

-- Kommentar: Nu har varje tabell endast nödvändiga policies utan duplikationer
-- user_roles: Användare ser sina egna roller, admins ser alla
-- data_fetch_control: Alla kan läsa status, bara admins kan ändra
-- data_fetch_progress: Alla kan läsa progress, bara admins kan ändra
-- file_download_queue: Bara admins kan se och hantera kön