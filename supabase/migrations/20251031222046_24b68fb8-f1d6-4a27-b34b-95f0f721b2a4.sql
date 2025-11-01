-- Create RPC function to get user roles with emails
-- This allows fetching user emails from auth.users which is not accessible from client
CREATE OR REPLACE FUNCTION public.get_user_roles_with_emails()
RETURNS TABLE (
  id UUID, 
  user_id UUID, 
  role app_role, 
  created_at TIMESTAMPTZ,
  email TEXT
)
SECURITY DEFINER
SET search_path TO 'public'
LANGUAGE SQL
AS $$
  SELECT 
    ur.id, 
    ur.user_id, 
    ur.role, 
    ur.created_at,
    au.email
  FROM public.user_roles ur
  LEFT JOIN auth.users au ON ur.user_id = au.id
  ORDER BY ur.created_at DESC;
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_roles_with_emails() TO authenticated;