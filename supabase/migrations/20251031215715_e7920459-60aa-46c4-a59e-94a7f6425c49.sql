-- Ta bort överdrivet tillåtande "service role" policies
-- Edge Functions med service role key bypassa RLS ändå, så dessa policies är redundanta och osäkra

DROP POLICY IF EXISTS "Service role kan uppdatera progress" ON public.data_fetch_progress;
DROP POLICY IF EXISTS "Service role kan hantera filkö" ON public.file_download_queue;