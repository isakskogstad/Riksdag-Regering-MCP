-- =====================================================
-- UTÖKAD DATAMODELL FÖR RIKSDAGENS DATA
-- Lägger till saknade fält och tabeller baserat på API-analys
-- =====================================================

-- =====================================================
-- 1. UTÖKA LEDAMÖTERTABELLEN
-- =====================================================

ALTER TABLE public.riksdagen_ledamoter 
ADD COLUMN IF NOT EXISTS iort TEXT,
ADD COLUMN IF NOT EXISTS kon TEXT,
ADD COLUMN IF NOT EXISTS fodelsear INTEGER,
ADD COLUMN IF NOT EXISTS webbadress TEXT,
ADD COLUMN IF NOT EXISTS epostadress TEXT,
ADD COLUMN IF NOT EXISTS telefonnummer TEXT,
ADD COLUMN IF NOT EXISTS titel TEXT;

-- =====================================================
-- 2. SKAPA TABELL FÖR LEDAMÖTERS UPPDRAG
-- =====================================================

CREATE TABLE IF NOT EXISTS public.riksdagen_ledamoter_uppdrag (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intressent_id TEXT NOT NULL REFERENCES riksdagen_ledamoter(intressent_id),
  uppdragets_typ TEXT,
  uppdragets_organ TEXT,
  roll_i_uppdraget TEXT,
  uppdrag_fran DATE,
  uppdrag_till DATE,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index för prestanda
CREATE INDEX IF NOT EXISTS idx_ledamoter_uppdrag_intressent ON public.riksdagen_ledamoter_uppdrag(intressent_id);
CREATE INDEX IF NOT EXISTS idx_ledamoter_uppdrag_organ ON public.riksdagen_ledamoter_uppdrag(uppdragets_organ);
CREATE INDEX IF NOT EXISTS idx_ledamoter_uppdrag_datum ON public.riksdagen_ledamoter_uppdrag(uppdrag_fran, uppdrag_till);

-- =====================================================
-- 3. SAKNADE DOKUMENTTYPER
-- =====================================================

-- Kommittédirektiv (dir)
CREATE TABLE IF NOT EXISTS public.riksdagen_direktiv (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dokument_id TEXT UNIQUE NOT NULL,
  beteckningsnummer TEXT,
  titel TEXT,
  publicerad_datum DATE,
  departement TEXT,
  url TEXT,
  local_files JSONB,
  innehall TEXT,
  kategorier TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Departementsserien (ds)
CREATE TABLE IF NOT EXISTS public.riksdagen_departementsserien (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dokument_id TEXT UNIQUE NOT NULL,
  beteckningsnummer TEXT,
  titel TEXT,
  publicerad_datum DATE,
  departement TEXT,
  url TEXT,
  local_files JSONB,
  innehall TEXT,
  kategorier TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Statens offentliga utredningar (sou)
CREATE TABLE IF NOT EXISTS public.riksdagen_sou (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dokument_id TEXT UNIQUE NOT NULL,
  beteckningsnummer TEXT,
  titel TEXT,
  publicerad_datum DATE,
  utredare TEXT,
  departement TEXT,
  url TEXT,
  local_files JSONB,
  innehall TEXT,
  kategorier TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- EU-förslag (KOM)
CREATE TABLE IF NOT EXISTS public.riksdagen_eu_forslag (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dokument_id TEXT UNIQUE NOT NULL,
  kom_nummer TEXT,
  titel TEXT,
  publicerad_datum DATE,
  eu_organ TEXT,
  amnesomrade TEXT[],
  url TEXT,
  local_files JSONB,
  innehall TEXT,
  kategorier TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- 4. UTÖKA VOTERINGSTABELLEN
-- =====================================================

ALTER TABLE public.riksdagen_voteringar
ADD COLUMN IF NOT EXISTS voteringstyp TEXT,
ADD COLUMN IF NOT EXISTS beslut TEXT,
ADD COLUMN IF NOT EXISTS ja_roster INTEGER,
ADD COLUMN IF NOT EXISTS nej_roster INTEGER,
ADD COLUMN IF NOT EXISTS avstande_roster INTEGER,
ADD COLUMN IF NOT EXISTS franvarande_roster INTEGER,
ADD COLUMN IF NOT EXISTS dokument_id TEXT;

-- Detaljerade röster per ledamot
CREATE TABLE IF NOT EXISTS public.riksdagen_voteringar_roster (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  votering_id TEXT NOT NULL REFERENCES riksdagen_voteringar(votering_id),
  intressent_id TEXT NOT NULL REFERENCES riksdagen_ledamoter(intressent_id),
  rost TEXT CHECK (rost IN ('Ja', 'Nej', 'Avstår', 'Frånvarande')),
  parti TEXT,
  valkrets TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index för prestanda
CREATE INDEX IF NOT EXISTS idx_voteringar_roster_votering ON public.riksdagen_voteringar_roster(votering_id);
CREATE INDEX IF NOT EXISTS idx_voteringar_roster_intressent ON public.riksdagen_voteringar_roster(intressent_id);
CREATE INDEX IF NOT EXISTS idx_voteringar_roster_parti ON public.riksdagen_voteringar_roster(parti);
CREATE INDEX IF NOT EXISTS idx_voteringar_roster_rost ON public.riksdagen_voteringar_roster(rost);

-- =====================================================
-- 5. UTÖKA ANFÖRANDETABELLEN
-- =====================================================

ALTER TABLE public.riksdagen_anforanden
ADD COLUMN IF NOT EXISTS anforande_nummer INTEGER,
ADD COLUMN IF NOT EXISTS kammaraktivitet TEXT,
ADD COLUMN IF NOT EXISTS protokoll_id TEXT;

-- =====================================================
-- 6. KOPPLINGSTABELLER
-- =====================================================

-- Koppla sagt_och_gjort med API-data
CREATE TABLE IF NOT EXISTS public.riksdagen_data_koppling (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sagt_och_gjort_id UUID REFERENCES riksdagen_sagt_och_gjort(id),
  dokument_id TEXT,
  anforande_id TEXT,
  intressent_id TEXT,
  data_typ TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_data_koppling_sagt_och_gjort ON public.riksdagen_data_koppling(sagt_och_gjort_id);
CREATE INDEX IF NOT EXISTS idx_data_koppling_dokument ON public.riksdagen_data_koppling(dokument_id);

-- =====================================================
-- 7. RLS POLICIES FÖR NYA TABELLER
-- =====================================================

-- Enable RLS
ALTER TABLE public.riksdagen_ledamoter_uppdrag ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_direktiv ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_departementsserien ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_sou ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_eu_forslag ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_voteringar_roster ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_data_koppling ENABLE ROW LEVEL SECURITY;

-- Create read-only policies
CREATE POLICY "Alla kan läsa ledamöter uppdrag" ON public.riksdagen_ledamoter_uppdrag FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa direktiv" ON public.riksdagen_direktiv FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa departementsserien" ON public.riksdagen_departementsserien FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa SOU" ON public.riksdagen_sou FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa EU-förslag" ON public.riksdagen_eu_forslag FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa voteringsröster" ON public.riksdagen_voteringar_roster FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa datakopplingar" ON public.riksdagen_data_koppling FOR SELECT USING (true);

-- =====================================================
-- 8. AGGREGERADE VYER FÖR ANALYS
-- =====================================================

-- Vy för ledamöter med alla uppdrag
CREATE OR REPLACE VIEW public.v_ledamoter_fullstandig AS
SELECT 
  l.*,
  COALESCE(
    json_agg(
      json_build_object(
        'typ', u.uppdragets_typ,
        'organ', u.uppdragets_organ,
        'roll', u.roll_i_uppdraget,
        'fran', u.uppdrag_fran,
        'till', u.uppdrag_till
      ) ORDER BY u.uppdrag_fran DESC
    ) FILTER (WHERE u.id IS NOT NULL),
    '[]'::json
  ) AS uppdrag
FROM public.riksdagen_ledamoter l
LEFT JOIN public.riksdagen_ledamoter_uppdrag u ON l.intressent_id = u.intressent_id
GROUP BY l.intressent_id, l.fornamn, l.efternamn, l.tilltalsnamn, l.parti, l.valkrets, 
         l.status, l.bild_url, l.local_bild_url, l.iort, l.kon, l.fodelsear, 
         l.webbadress, l.epostadress, l.telefonnummer, l.titel, l.created_at, l.updated_at;

-- Vy för voteringar med sammanställda röster
CREATE OR REPLACE VIEW public.v_voteringar_sammanstallning AS
SELECT 
  v.*,
  COUNT(CASE WHEN vr.rost = 'Ja' THEN 1 END) AS ja_roster_detalj,
  COUNT(CASE WHEN vr.rost = 'Nej' THEN 1 END) AS nej_roster_detalj,
  COUNT(CASE WHEN vr.rost = 'Avstår' THEN 1 END) AS avstar_roster_detalj,
  COUNT(CASE WHEN vr.rost = 'Frånvarande' THEN 1 END) AS franvarande_roster_detalj
FROM public.riksdagen_voteringar v
LEFT JOIN public.riksdagen_voteringar_roster vr ON v.votering_id = vr.votering_id
GROUP BY v.id, v.votering_id, v.rm, v.beteckning, v.punkt, v.titel, 
         v.votering_datum, v.voteringstyp, v.beslut, v.ja_roster, v.nej_roster,
         v.avstande_roster, v.franvarande_roster, v.dokument_id, v.created_at, v.updated_at;

-- =====================================================
-- 9. DOKUMENTATION
-- =====================================================

COMMENT ON TABLE public.riksdagen_ledamoter_uppdrag IS 'Ledamöters uppdrag och roller i olika organ/utskott';
COMMENT ON TABLE public.riksdagen_direktiv IS 'Kommittédirektiv - uppdrag till utredningar';
COMMENT ON TABLE public.riksdagen_departementsserien IS 'Departementsserien - promemorior från departementen';
COMMENT ON TABLE public.riksdagen_sou IS 'Statens offentliga utredningar';
COMMENT ON TABLE public.riksdagen_eu_forslag IS 'EU-förslag (KOM-dokument) från EU-kommissionen';
COMMENT ON TABLE public.riksdagen_voteringar_roster IS 'Individuella röster för varje votering';
COMMENT ON TABLE public.riksdagen_data_koppling IS 'Kopplingstabell mellan Sagt och gjort CSV och API-data';

COMMENT ON VIEW public.v_ledamoter_fullstandig IS 'Komplett vy över ledamöter med alla uppdrag';
COMMENT ON VIEW public.v_voteringar_sammanstallning IS 'Voteringar med aggregerade röstningsresultat';