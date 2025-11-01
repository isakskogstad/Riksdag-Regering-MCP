-- Skapa huvudtabell för regeringskansliet dokument
CREATE TABLE public.regeringskansliet_dokument (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id TEXT NOT NULL UNIQUE,
  titel TEXT,
  publicerad_datum DATE,
  uppdaterad_datum DATE,
  typ TEXT,
  kategorier TEXT[],
  avsandare TEXT,
  beteckningsnummer TEXT,
  url TEXT,
  markdown_url TEXT,
  innehall TEXT,
  bilagor JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa tabell för regeringskansliet kategorier
CREATE TABLE public.regeringskansliet_kategorier (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kod TEXT NOT NULL UNIQUE,
  namn TEXT,
  beskrivning TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa tabell för pressmeddelanden
CREATE TABLE public.regeringskansliet_pressmeddelanden (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id TEXT NOT NULL UNIQUE,
  titel TEXT,
  publicerad_datum DATE,
  departement TEXT,
  innehall TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa tabell för propositioner
CREATE TABLE public.regeringskansliet_propositioner (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id TEXT NOT NULL UNIQUE,
  titel TEXT,
  publicerad_datum DATE,
  beteckningsnummer TEXT,
  departement TEXT,
  url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa tabell för API-loggar
CREATE TABLE public.regeringskansliet_api_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  status TEXT NOT NULL,
  antal_poster INTEGER,
  felmeddelande TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Aktivera RLS
ALTER TABLE public.regeringskansliet_dokument ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regeringskansliet_kategorier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regeringskansliet_pressmeddelanden ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regeringskansliet_propositioner ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regeringskansliet_api_log ENABLE ROW LEVEL SECURITY;

-- Skapa publika SELECT-policyer
CREATE POLICY "Alla kan läsa regeringskansliet dokument"
ON public.regeringskansliet_dokument
FOR SELECT
USING (true);

CREATE POLICY "Alla kan läsa regeringskansliet kategorier"
ON public.regeringskansliet_kategorier
FOR SELECT
USING (true);

CREATE POLICY "Alla kan läsa regeringskansliet pressmeddelanden"
ON public.regeringskansliet_pressmeddelanden
FOR SELECT
USING (true);

CREATE POLICY "Alla kan läsa regeringskansliet propositioner"
ON public.regeringskansliet_propositioner
FOR SELECT
USING (true);

CREATE POLICY "Alla kan läsa regeringskansliet API-loggar"
ON public.regeringskansliet_api_log
FOR SELECT
USING (true);

-- Skapa triggers för updated_at
CREATE TRIGGER update_regeringskansliet_dokument_updated_at
BEFORE UPDATE ON public.regeringskansliet_dokument
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_kategorier_updated_at
BEFORE UPDATE ON public.regeringskansliet_kategorier
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_pressmeddelanden_updated_at
BEFORE UPDATE ON public.regeringskansliet_pressmeddelanden
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_propositioner_updated_at
BEFORE UPDATE ON public.regeringskansliet_propositioner
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();