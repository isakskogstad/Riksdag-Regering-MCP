-- Create file_queue_control table for automatic file processing state
CREATE TABLE IF NOT EXISTS public.file_queue_control (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  is_running BOOLEAN DEFAULT false NOT NULL,
  last_run_at TIMESTAMPTZ,
  total_processed INTEGER DEFAULT 0 NOT NULL,
  current_batch INTEGER DEFAULT 0 NOT NULL,
  started_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ,
  stopped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.file_queue_control ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can manage queue control
CREATE POLICY "Admins can manage queue control"
  ON public.file_queue_control
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS Policy: Anyone can view queue control status
CREATE POLICY "Anyone can view queue control"
  ON public.file_queue_control
  FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_file_queue_control_updated_at
  BEFORE UPDATE ON public.file_queue_control
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert singleton row for global state
INSERT INTO public.file_queue_control (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Function to reset stuck auto-process (runs as background maintenance)
CREATE OR REPLACE FUNCTION public.reset_stuck_auto_process()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.file_queue_control
  SET is_running = false
  WHERE is_running = true 
    AND last_run_at < now() - interval '5 minutes';
END;
$$;