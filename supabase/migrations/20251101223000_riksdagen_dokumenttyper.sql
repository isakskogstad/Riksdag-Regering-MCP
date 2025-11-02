-- =====================================================
-- RIKSDAGENS SPECIFIKA DOKUMENTTYPER
-- Migration för att ersätta generisk riksdagen_dokument
-- med specifika tabeller per dokumenttyp
-- =====================================================

-- Motioner (mot)
CREATE TABLE IF NOT EXISTS public.riksdagen_motioner (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dokument_id TEXT UNIQUE NOT NULL,
  beteckningsnummer TEXT,
  titel TEXT,
  publicerad_datum DATE,
  motionarer TEXT[], -- Array av motionärernas namn
  motionarer_intressent_ids TEXT[], -- Array av intressent_id
  parti TEXT,
  utskott TEXT,
  status TEXT,
  url TEXT,
  local_files JSONB,
  innehall TEXT,
  kategorier TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Protokoll (prot)
CREATE TABLE IF NOT EXISTS public.riksdagen_protokoll (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dokument_id TEXT UNIQUE NOT NULL,
  beteckningsnummer TEXT,
  titel TEXT,
  publicerad_datum DATE,
  sammantradesdag DATE,
  sammantradestyp TEXT,
  url TEXT,
  local_files JSONB,
  innehall TEXT,
  kategorier TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Betänkanden (bet)
CREATE TABLE IF NOT EXISTS public.riksdagen_betankanden (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dokument_id TEXT UNIQUE NOT NULL,
  beteckningsnummer TEXT,
  titel TEXT,
  publicerad_datum DATE,
  utskott TEXT,
  beslut TEXT,
  status TEXT,
  url TEXT,
  local_files JSONB,
  innehall TEXT,
  kategorier TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Interpellationer (ip)
CREATE TABLE IF NOT EXISTS public.riksdagen_interpellationer (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dokument_id TEXT UNIQUE NOT NULL,
  beteckningsnummer TEXT,
  titel TEXT,
  publicerad_datum DATE,
  fraga_stallare_intressent_id TEXT,
  fraga_stallare_namn TEXT,
  svarande_minister TEXT,
  departement TEXT,
  status TEXT,
  url TEXT,
  local_files JSONB,
  innehall TEXT,
  kategorier TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skriftliga frågor (fr)
CREATE TABLE IF NOT EXISTS public.riksdagen_fragor (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dokument_id TEXT UNIQUE NOT NULL,
  beteckningsnummer TEXT,
  titel TEXT,
  publicerad_datum DATE,
  fraga_stallare_intressent_id TEXT,
  fraga_stallare_namn TEXT,
  svarande_minister TEXT,
  departement TEXT,
  status TEXT,
  url TEXT,
  local_files JSONB,
  innehall TEXT,
  kategorier TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Propositioner från riksdagen (prop) - komplement till regeringskansliet_propositioner
CREATE TABLE IF NOT EXISTS public.riksdagen_propositioner (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dokument_id TEXT UNIQUE NOT NULL,
  beteckningsnummer TEXT,
  titel TEXT,
  publicerad_datum DATE,
  departement TEXT,
  minister TEXT,
  status TEXT,
  url TEXT,
  local_files JSONB,
  innehall TEXT,
  kategorier TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- INDEX FÖR PRESTANDA
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_motioner_datum ON public.riksdagen_motioner(publicerad_datum DESC);
CREATE INDEX IF NOT EXISTS idx_motioner_parti ON public.riksdagen_motioner(parti);
CREATE INDEX IF NOT EXISTS idx_motioner_dokid ON public.riksdagen_motioner(dokument_id);

CREATE INDEX IF NOT EXISTS idx_protokoll_datum ON public.riksdagen_protokoll(publicerad_datum DESC);
CREATE INDEX IF NOT EXISTS idx_protokoll_dokid ON public.riksdagen_protokoll(dokument_id);

CREATE INDEX IF NOT EXISTS idx_betankanden_datum ON public.riksdagen_betankanden(publicerad_datum DESC);
CREATE INDEX IF NOT EXISTS idx_betankanden_utskott ON public.riksdagen_betankanden(utskott);
CREATE INDEX IF NOT EXISTS idx_betankanden_dokid ON public.riksdagen_betankanden(dokument_id);

CREATE INDEX IF NOT EXISTS idx_interpellationer_datum ON public.riksdagen_interpellationer(publicerad_datum DESC);
CREATE INDEX IF NOT EXISTS idx_interpellationer_stallare ON public.riksdagen_interpellationer(fraga_stallare_intressent_id);
CREATE INDEX IF NOT EXISTS idx_interpellationer_dokid ON public.riksdagen_interpellationer(dokument_id);

CREATE INDEX IF NOT EXISTS idx_fragor_datum ON public.riksdagen_fragor(publicerad_datum DESC);
CREATE INDEX IF NOT EXISTS idx_fragor_stallare ON public.riksdagen_fragor(fraga_stallare_intressent_id);
CREATE INDEX IF NOT EXISTS idx_fragor_dokid ON public.riksdagen_fragor(dokument_id);

CREATE INDEX IF NOT EXISTS idx_rik_propositioner_datum ON public.riksdagen_propositioner(publicerad_datum DESC);
CREATE INDEX IF NOT EXISTS idx_rik_propositioner_dokid ON public.riksdagen_propositioner(dokument_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.riksdagen_motioner ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_protokoll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_betankanden ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_interpellationer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_fragor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riksdagen_propositioner ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa motioner" ON public.riksdagen_motioner FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa protokoll" ON public.riksdagen_protokoll FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa betänkanden" ON public.riksdagen_betankanden FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa interpellationer" ON public.riksdagen_interpellationer FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa frågor" ON public.riksdagen_fragor FOR SELECT USING (true);
CREATE POLICY "Alla kan läsa propositioner" ON public.riksdagen_propositioner FOR SELECT USING (true);

-- =====================================================
-- COMMENTS FÖR DOKUMENTATION
-- =====================================================

COMMENT ON TABLE public.riksdagen_motioner IS 'Motioner från riksdagens ledamöter - förslag till riksdagsbeslut';
COMMENT ON TABLE public.riksdagen_protokoll IS 'Protokoll från kammarens sammanträden';
COMMENT ON TABLE public.riksdagen_betankanden IS 'Utskottens betänkanden och utlåtanden samt riksdagens beslut';
COMMENT ON TABLE public.riksdagen_interpellationer IS 'Interpellationer från ledamöterna till regeringen';
COMMENT ON TABLE public.riksdagen_fragor IS 'Skriftliga frågor från ledamöterna till regeringen';
COMMENT ON TABLE public.riksdagen_propositioner IS 'Propositioner och skrivelser från regeringen (Riksdagens kopia)';
