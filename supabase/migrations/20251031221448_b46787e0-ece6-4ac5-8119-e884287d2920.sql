-- Fix: Add search_path to is_admin() function for enhanced security
-- This prevents potential search_path manipulation attacks in SECURITY DEFINER functions

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'  -- Added for security best practice
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = (SELECT auth.uid())::uuid
      AND ur.role = 'admin'
  );
$$;