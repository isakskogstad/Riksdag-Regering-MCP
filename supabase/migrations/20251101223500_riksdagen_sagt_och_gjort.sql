-- =====================================================
-- SAGT OCH GJORT - LEDAMÖTERS AKTIVITETER
-- Data från riksdagens CSV om ledamöters anföranden,
-- motioner, frågor och interpellationer (2010/11→)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.riksdagen_sagt_och_gjort (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intressent_id TEXT NOT NULL, -- FK till riksdagen_ledamoter
  fodd INTEGER,
  kon TEXT,
  valkrets TEXT,
  dokumenttyp TEXT NOT NULL, -- anf, mot, fr, ip
  subtyp TEXT,
  riksmote TEXT,
  dokument_id TEXT,
  beteckning TEXT,
  organ TEXT,
  datum DATE,
  talare TEXT,
  parti TEXT,
  roll TEXT,
  titel TEXT,
  talartid INTEGER, -- i sekunder
  tecken INTEGER, -- antal tecken i texten
  aktiviteter INTEGER, -- antal aktiviteter i sammanhanget
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- INDEX FÖR PRESTANDA
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_sagt_och_gjort_intressent ON public.riksdagen_sagt_och_gjort(intressent_id);
CREATE INDEX IF NOT EXISTS idx_sagt_och_gjort_riksmote ON public.riksdagen_sagt_och_gjort(riksmote);
CREATE INDEX IF NOT EXISTS idx_sagt_och_gjort_dokumenttyp ON public.riksdagen_sagt_och_gjort(dokumenttyp);
CREATE INDEX IF NOT EXISTS idx_sagt_och_gjort_parti ON public.riksdagen_sagt_och_gjort(parti);
CREATE INDEX IF NOT EXISTS idx_sagt_och_gjort_datum ON public.riksdagen_sagt_och_gjort(datum DESC);
CREATE INDEX IF NOT EXISTS idx_sagt_och_gjort_dokid ON public.riksdagen_sagt_och_gjort(dokument_id);

-- Composite index för vanliga queries
CREATE INDEX IF NOT EXISTS idx_sagt_och_gjort_intressent_typ ON public.riksdagen_sagt_och_gjort(intressent_id, dokumenttyp);
CREATE INDEX IF NOT EXISTS idx_sagt_och_gjort_parti_riksmote ON public.riksdagen_sagt_och_gjort(parti, riksmote);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.riksdagen_sagt_och_gjort ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa sagt och gjort"
  ON public.riksdagen_sagt_och_gjort
  FOR SELECT
  USING (true);

-- =====================================================
-- VIEWS FÖR AGGREGERAD STATISTIK
-- =====================================================

-- Statistik per ledamot
CREATE OR REPLACE VIEW public.v_ledamot_statistik AS
SELECT
  l.intressent_id,
  l.fornamn,
  l.efternamn,
  l.parti,
  l.valkrets,
  COUNT(sog.id) AS totalt_antal_aktiviteter,
  COUNT(CASE WHEN sog.dokumenttyp = 'anf' THEN 1 END) AS antal_anforanden,
  COUNT(CASE WHEN sog.dokumenttyp = 'mot' THEN 1 END) AS antal_motioner,
  COUNT(CASE WHEN sog.dokumenttyp = 'fr' THEN 1 END) AS antal_fragor,
  COUNT(CASE WHEN sog.dokumenttyp = 'ip' THEN 1 END) AS antal_interpellationer,
  SUM(COALESCE(sog.talartid, 0)) AS total_talartid_sekunder,
  SUM(COALESCE(sog.tecken, 0)) AS totalt_antal_tecken,
  MIN(sog.datum) AS forsta_aktivitet,
  MAX(sog.datum) AS senaste_aktivitet
FROM public.riksdagen_ledamoter l
LEFT JOIN public.riksdagen_sagt_och_gjort sog ON l.intressent_id = sog.intressent_id
GROUP BY l.intressent_id, l.fornamn, l.efternamn, l.parti, l.valkrets;

COMMENT ON VIEW public.v_ledamot_statistik IS 'Aggregerad statistik per ledamot från Sagt och gjort-data';

-- Statistik per parti och riksmöte
CREATE OR REPLACE VIEW public.v_parti_statistik AS
SELECT
  parti,
  riksmote,
  COUNT(*) AS antal_aktiviteter,
  COUNT(DISTINCT intressent_id) AS antal_aktiva_ledamoter,
  COUNT(CASE WHEN dokumenttyp = 'anf' THEN 1 END) AS antal_anforanden,
  COUNT(CASE WHEN dokumenttyp = 'mot' THEN 1 END) AS antal_motioner,
  COUNT(CASE WHEN dokumenttyp = 'fr' THEN 1 END) AS antal_fragor,
  COUNT(CASE WHEN dokumenttyp = 'ip' THEN 1 END) AS antal_interpellationer,
  SUM(COALESCE(talartid, 0)) AS total_talartid_sekunder,
  SUM(COALESCE(tecken, 0)) AS totalt_antal_tecken
FROM public.riksdagen_sagt_och_gjort
GROUP BY parti, riksmote
ORDER BY riksmote DESC, parti;

COMMENT ON VIEW public.v_parti_statistik IS 'Aggregerad statistik per parti och riksmöte';

-- Statistik per dokumenttyp och riksmöte
CREATE OR REPLACE VIEW public.v_aktivitetstyp_statistik AS
SELECT
  dokumenttyp,
  riksmote,
  COUNT(*) AS antal,
  COUNT(DISTINCT intressent_id) AS antal_unika_ledamoter,
  AVG(COALESCE(talartid, 0)) AS genomsnittlig_talartid,
  AVG(COALESCE(tecken, 0)) AS genomsnittligt_antal_tecken
FROM public.riksdagen_sagt_och_gjort
GROUP BY dokumenttyp, riksmote
ORDER BY riksmote DESC, dokumenttyp;

COMMENT ON VIEW public.v_aktivitetstyp_statistik IS 'Statistik per aktivitetstyp och riksmöte';

-- Mest aktiva ledamöter (top 100)
CREATE OR REPLACE VIEW public.v_mest_aktiva_ledamoter AS
SELECT
  l.intressent_id,
  l.fornamn || ' ' || l.efternamn AS namn,
  l.parti,
  l.valkrets,
  COUNT(sog.id) AS totalt_antal_aktiviteter,
  COUNT(CASE WHEN sog.dokumenttyp = 'anf' THEN 1 END) AS antal_anforanden,
  COUNT(CASE WHEN sog.dokumenttyp = 'mot' THEN 1 END) AS antal_motioner,
  SUM(COALESCE(sog.talartid, 0)) AS total_talartid_sekunder
FROM public.riksdagen_ledamoter l
INNER JOIN public.riksdagen_sagt_och_gjort sog ON l.intressent_id = sog.intressent_id
GROUP BY l.intressent_id, l.fornamn, l.efternamn, l.parti, l.valkrets
ORDER BY totalt_antal_aktiviteter DESC
LIMIT 100;

COMMENT ON VIEW public.v_mest_aktiva_ledamoter IS 'Top 100 mest aktiva ledamöter baserat på Sagt och gjort-data';

-- =====================================================
-- COMMENTS FÖR DOKUMENTATION
-- =====================================================

COMMENT ON TABLE public.riksdagen_sagt_och_gjort IS
'Ledamöters aktiviteter: anföranden, motioner, skriftliga frågor och interpellationer från riksmötet 2010/11 och framåt. Källa: Riksdagens CSV-export.';

COMMENT ON COLUMN public.riksdagen_sagt_och_gjort.dokumenttyp IS
'anf=anförande, mot=motion, fr=skriftlig fråga, ip=interpellation';

COMMENT ON COLUMN public.riksdagen_sagt_och_gjort.talartid IS
'Talartid i sekunder (endast för anföranden)';

COMMENT ON COLUMN public.riksdagen_sagt_och_gjort.tecken IS
'Antal tecken i dokumentet. Anföranden i textformat, övriga i HTML-format.';

COMMENT ON COLUMN public.riksdagen_sagt_och_gjort.aktiviteter IS
'Antal personaktiviteter i sammanhanget';
