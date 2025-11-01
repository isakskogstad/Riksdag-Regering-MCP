-- Fix is_admin() function to use user_roles table instead of profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Drop the obsolete user_role column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_role;