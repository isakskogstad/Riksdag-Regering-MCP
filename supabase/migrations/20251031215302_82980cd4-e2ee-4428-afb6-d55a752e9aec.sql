-- Drop the overly permissive RLS policy that allows anyone to manipulate system controls
DROP POLICY IF EXISTS "Alla kan uppdatera kontroll" ON public.data_fetch_control;

-- Verify that admin-only policies remain in place
-- The following policies should still exist and provide proper protection:
-- - "Admins can insert control" (for INSERT)
-- - "Admins can update control" (for UPDATE)
-- - "Admins can delete control" (for DELETE)
-- - "Anyone can view control" or "Alla kan läsa kontroll" (for SELECT only)