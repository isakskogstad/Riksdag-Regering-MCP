-- =====================================================
-- FAS 1: Skapa admin_activity_log tabell
-- =====================================================

CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can read activity log"
ON public.admin_activity_log
FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can insert activity log"
ON public.admin_activity_log
FOR INSERT
WITH CHECK (is_admin());

-- Indexes för performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at 
ON admin_activity_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_activity_action_type 
ON admin_activity_log(action_type);

-- =====================================================
-- FAS 2: log_admin_activity RPC function
-- =====================================================

CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_action_type text,
  p_description text,
  p_metadata jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_activity_log (user_id, action_type, description, metadata)
  VALUES (auth.uid(), p_action_type, p_description, p_metadata);
END;
$$;
