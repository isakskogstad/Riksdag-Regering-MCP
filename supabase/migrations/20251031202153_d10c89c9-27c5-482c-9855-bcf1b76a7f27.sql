-- Skapa tabeller för att lagra data från Riksdagens API

-- Tabell för att lagra dokument från Riksdagen
CREATE TABLE IF NOT EXISTS public.riksdagen_dokument (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dok_id TEXT UNIQUE NOT NULL,
  rm TEXT,
  beteckning TEXT,
  doktyp TEXT,
  typ TEXT,
  subtyp TEXT,
  organ TEXT,
  nummer TEXT,
  datum DATE,
  systemdatum TIMESTAMP WITH TIME ZONE,
  titel TEXT,
  subtitel TEXT,
  status TEXT,
  dokument_url_text TEXT,
  dokument_url_html TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabell för att lagra ledamöter
CREATE TABLE IF NOT EXISTS public.riksdagen_ledamoter (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intressent_id TEXT UNIQUE NOT NULL,
  fornamn TEXT,
  efternamn TEXT,
  tilltalsnamn TEXT,
  parti TEXT,
  valkrets TEXT,
  status TEXT,
  bild_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabell för att logga API-anrop
CREATE TABLE IF NOT EXISTS public.riksdagen_api_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  status TEXT NOT NULL,
  antal_poster INTEGER,
  felmeddelande TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index för snabbare sökning
CREATE INDEX IF NOT EXISTS idx_riksdagen_dokument_datum ON public.riksdagen_dokument(datum DESC);
CREATE INDEX IF NOT EXISTS idx_riksdagen_dokument_doktyp ON public.riksdagen_dokument(doktyp);
CREATE INDEX IF NOT EXISTS idx_riksdagen_ledamoter_parti ON public.riksdagen_ledamoter(parti);

-- Enable RLS
ALTER TABLE public.riksdagen_dokument ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_ledamoter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_api_log ENABLE ROW LEVEL SECURITY;

-- RLS policies - data är offentlig så alla kan läsa
CREATE POLICY "Alla kan läsa dokument"
  ON public.riksdagen_dokument
  FOR SELECT
  USING (true);

CREATE POLICY "Alla kan läsa ledamöter"
  ON public.riksdagen_ledamoter
  FOR SELECT
  USING (true);

CREATE POLICY "Alla kan läsa API-loggar"
  ON public.riksdagen_api_log
  FOR SELECT
  USING (true);

-- Function för att uppdatera updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers för automatiska tidsstämplar
CREATE TRIGGER update_riksdagen_dokument_updated_at
  BEFORE UPDATE ON public.riksdagen_dokument
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_riksdagen_ledamoter_updated_at
  BEFORE UPDATE ON public.riksdagen_ledamoter
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();