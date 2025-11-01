-- Cleanup: Remove duplicate RLS policies for cleaner security configuration

-- === file_download_queue: Remove duplicate "Admins only file queue_*" policies ===
-- Keep the more descriptive "Admins can..." versions
DROP POLICY IF EXISTS "Admins only file queue_delete" ON public.file_download_queue;
DROP POLICY IF EXISTS "Admins only file queue_insert" ON public.file_download_queue;
DROP POLICY IF EXISTS "Admins only file queue_select" ON public.file_download_queue;
DROP POLICY IF EXISTS "Admins only file queue_update" ON public.file_download_queue;

-- === user_roles: Remove duplicate "Admins can manage all roles_*" policies ===
-- Keep the more descriptive "Admins can..." versions
DROP POLICY IF EXISTS "Admins can manage all roles_delete" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles_insert" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles_select" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles_update" ON public.user_roles;

-- === user_roles: Remove duplicate "User can view own roles" policy ===
-- Keep the more descriptive "Users can view their own roles"
DROP POLICY IF EXISTS "User can view own roles" ON public.user_roles;

-- Summary of remaining policies per table:
-- file_download_queue: "Admins can delete/insert/view/update queue" (4 policies)
-- user_roles: 
--   - "Admins can delete/insert/update/view all roles" (4 admin policies)
--   - "Users can view their own roles" (1 user policy)
--   - "Anyone can insert first admin" (1 bootstrap policy)
--   Total: 6 policies

-- This cleanup eliminates confusion and makes security audits straightforward