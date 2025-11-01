-- Fixa säkerhetsvarning: Function Search Path Mutable
-- Måste ta bort triggers först
DROP TRIGGER IF EXISTS update_riksdagen_dokument_updated_at ON public.riksdagen_dokument;
DROP TRIGGER IF EXISTS update_riksdagen_ledamoter_updated_at ON public.riksdagen_ledamoter;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Återskapa funktionen med korrekt search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Återskapa triggers
CREATE TRIGGER update_riksdagen_dokument_updated_at
  BEFORE UPDATE ON public.riksdagen_dokument
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_riksdagen_ledamoter_updated_at
  BEFORE UPDATE ON public.riksdagen_ledamoter
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();