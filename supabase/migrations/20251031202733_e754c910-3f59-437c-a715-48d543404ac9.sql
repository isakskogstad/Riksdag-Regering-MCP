-- Skapa tabell för anföranden
CREATE TABLE public.riksdagen_anforanden (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  anforande_id TEXT NOT NULL UNIQUE,
  intressent_id TEXT,
  dok_id TEXT,
  debattnamn TEXT,
  debattsekund INTEGER,
  anftext TEXT,
  anfdatum DATE,
  avsnittsrubrik TEXT,
  parti TEXT,
  talare TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa tabell för voteringar
CREATE TABLE public.riksdagen_voteringar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  votering_id TEXT NOT NULL UNIQUE,
  rm TEXT,
  beteckning TEXT,
  punkt INTEGER,
  votering_typ TEXT,
  vinnare TEXT,
  votering_datum DATE,
  titel TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa tabell för hur ledamöter röstade
CREATE TABLE public.riksdagen_votering_ledamoter (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  votering_id TEXT NOT NULL,
  intressent_id TEXT,
  parti TEXT,
  rost TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa tabell för utskott
CREATE TABLE public.riksdagen_utskott (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  utskott_kod TEXT NOT NULL UNIQUE,
  namn TEXT,
  beskrivning TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Aktivera RLS på alla tabeller
ALTER TABLE public.riksdagen_anforanden ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_voteringar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_votering_ledamoter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_utskott ENABLE ROW LEVEL SECURITY;

-- Skapa publika SELECT-policyer
CREATE POLICY "Alla kan läsa anföranden"
ON public.riksdagen_anforanden
FOR SELECT
USING (true);

CREATE POLICY "Alla kan läsa voteringar"
ON public.riksdagen_voteringar
FOR SELECT
USING (true);

CREATE POLICY "Alla kan läsa votering_ledamoter"
ON public.riksdagen_votering_ledamoter
FOR SELECT
USING (true);

CREATE POLICY "Alla kan läsa utskott"
ON public.riksdagen_utskott
FOR SELECT
USING (true);

-- Skapa triggers för updated_at
CREATE TRIGGER update_riksdagen_anforanden_updated_at
BEFORE UPDATE ON public.riksdagen_anforanden
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_riksdagen_voteringar_updated_at
BEFORE UPDATE ON public.riksdagen_voteringar
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_riksdagen_utskott_updated_at
BEFORE UPDATE ON public.riksdagen_utskott
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();