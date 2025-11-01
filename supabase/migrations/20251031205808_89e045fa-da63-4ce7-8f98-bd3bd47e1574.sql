-- Skapa nya tabeller för alla g0v.se endpoints

-- Departementsserien och promemorior
CREATE TABLE IF NOT EXISTS public.regeringskansliet_departementsserien (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_departementsserien ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa departementsserien"
ON public.regeringskansliet_departementsserien
FOR SELECT
USING (true);

-- Förordningsmotiv
CREATE TABLE IF NOT EXISTS public.regeringskansliet_forordningsmotiv (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_forordningsmotiv ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa förordningsmotiv"
ON public.regeringskansliet_forordningsmotiv
FOR SELECT
USING (true);

-- Kommittédirektiv
CREATE TABLE IF NOT EXISTS public.regeringskansliet_kommittedirektiv (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_kommittedirektiv ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa kommittédirektiv"
ON public.regeringskansliet_kommittedirektiv
FOR SELECT
USING (true);

-- Lagradsremiss
CREATE TABLE IF NOT EXISTS public.regeringskansliet_lagradsremiss (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_lagradsremiss ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa lagradsremiss"
ON public.regeringskansliet_lagradsremiss
FOR SELECT
USING (true);

-- Skrivelse
CREATE TABLE IF NOT EXISTS public.regeringskansliet_skrivelse (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_skrivelse ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa skrivelse"
ON public.regeringskansliet_skrivelse
FOR SELECT
USING (true);

-- Statens offentliga utredningar
CREATE TABLE IF NOT EXISTS public.regeringskansliet_sou (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_sou ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa SOU"
ON public.regeringskansliet_sou
FOR SELECT
USING (true);

-- Sveriges internationella överenskommelser
CREATE TABLE IF NOT EXISTS public.regeringskansliet_internationella_overenskommelser (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_internationella_overenskommelser ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa internationella överenskommelser"
ON public.regeringskansliet_internationella_overenskommelser
FOR SELECT
USING (true);

-- Faktapromemoria
CREATE TABLE IF NOT EXISTS public.regeringskansliet_faktapromemoria (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_faktapromemoria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa faktapromemoria"
ON public.regeringskansliet_faktapromemoria
FOR SELECT
USING (true);

-- Informationsmaterial
CREATE TABLE IF NOT EXISTS public.regeringskansliet_informationsmaterial (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_informationsmaterial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa informationsmaterial"
ON public.regeringskansliet_informationsmaterial
FOR SELECT
USING (true);

-- Internationella MR-granskningar
CREATE TABLE IF NOT EXISTS public.regeringskansliet_mr_granskningar (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_mr_granskningar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa MR-granskningar"
ON public.regeringskansliet_mr_granskningar
FOR SELECT
USING (true);

-- Kommenterade dagordningar
CREATE TABLE IF NOT EXISTS public.regeringskansliet_dagordningar (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_dagordningar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa dagordningar"
ON public.regeringskansliet_dagordningar
FOR SELECT
USING (true);

-- Rapporter
CREATE TABLE IF NOT EXISTS public.regeringskansliet_rapporter (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_rapporter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa rapporter"
ON public.regeringskansliet_rapporter
FOR SELECT
USING (true);

-- Remisser
CREATE TABLE IF NOT EXISTS public.regeringskansliet_remisser (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_remisser ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa remisser"
ON public.regeringskansliet_remisser
FOR SELECT
USING (true);

-- Regeringsuppdrag
CREATE TABLE IF NOT EXISTS public.regeringskansliet_regeringsuppdrag (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_regeringsuppdrag ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa regeringsuppdrag"
ON public.regeringskansliet_regeringsuppdrag
FOR SELECT
USING (true);

-- Regeringsärenden
CREATE TABLE IF NOT EXISTS public.regeringskansliet_regeringsarenden (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_regeringsarenden ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa regeringsärenden"
ON public.regeringskansliet_regeringsarenden
FOR SELECT
USING (true);

-- Sakråd
CREATE TABLE IF NOT EXISTS public.regeringskansliet_sakrad (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_sakrad ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa sakråd"
ON public.regeringskansliet_sakrad
FOR SELECT
USING (true);

-- Strategier för internationellt bistånd
CREATE TABLE IF NOT EXISTS public.regeringskansliet_bistands_strategier (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_bistands_strategier ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa biståndsstrategier"
ON public.regeringskansliet_bistands_strategier
FOR SELECT
USING (true);

-- Överenskommelser och avtal
CREATE TABLE IF NOT EXISTS public.regeringskansliet_overenskommelser_avtal (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_overenskommelser_avtal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa överenskommelser och avtal"
ON public.regeringskansliet_overenskommelser_avtal
FOR SELECT
USING (true);

-- Ärendeförteckningar
CREATE TABLE IF NOT EXISTS public.regeringskansliet_arendeforteckningar (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_arendeforteckningar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa ärendeförteckningar"
ON public.regeringskansliet_arendeforteckningar
FOR SELECT
USING (true);

-- Artiklar
CREATE TABLE IF NOT EXISTS public.regeringskansliet_artiklar (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_artiklar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa artiklar"
ON public.regeringskansliet_artiklar
FOR SELECT
USING (true);

-- Debattartiklar
CREATE TABLE IF NOT EXISTS public.regeringskansliet_debattartiklar (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_debattartiklar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa debattartiklar"
ON public.regeringskansliet_debattartiklar
FOR SELECT
USING (true);

-- Tal
CREATE TABLE IF NOT EXISTS public.regeringskansliet_tal (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_tal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa tal"
ON public.regeringskansliet_tal
FOR SELECT
USING (true);

-- UD avråder
CREATE TABLE IF NOT EXISTS public.regeringskansliet_ud_avrader (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_ud_avrader ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa UD avråder"
ON public.regeringskansliet_ud_avrader
FOR SELECT
USING (true);

-- Uttalanden
CREATE TABLE IF NOT EXISTS public.regeringskansliet_uttalanden (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id text NOT NULL UNIQUE,
  titel text,
  publicerad_datum date,
  uppdaterad_datum date,
  typ text,
  kategorier text[],
  avsandare text,
  beteckningsnummer text,
  url text,
  markdown_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.regeringskansliet_uttalanden ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa uttalanden"
ON public.regeringskansliet_uttalanden
FOR SELECT
USING (true);

-- Lägg till triggers för updated_at på alla nya tabeller
CREATE TRIGGER update_regeringskansliet_departementsserien_updated_at
BEFORE UPDATE ON public.regeringskansliet_departementsserien
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_forordningsmotiv_updated_at
BEFORE UPDATE ON public.regeringskansliet_forordningsmotiv
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_kommittedirektiv_updated_at
BEFORE UPDATE ON public.regeringskansliet_kommittedirektiv
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_lagradsremiss_updated_at
BEFORE UPDATE ON public.regeringskansliet_lagradsremiss
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_skrivelse_updated_at
BEFORE UPDATE ON public.regeringskansliet_skrivelse
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_sou_updated_at
BEFORE UPDATE ON public.regeringskansliet_sou
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_internationella_overenskommelser_updated_at
BEFORE UPDATE ON public.regeringskansliet_internationella_overenskommelser
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_faktapromemoria_updated_at
BEFORE UPDATE ON public.regeringskansliet_faktapromemoria
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_informationsmaterial_updated_at
BEFORE UPDATE ON public.regeringskansliet_informationsmaterial
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_mr_granskningar_updated_at
BEFORE UPDATE ON public.regeringskansliet_mr_granskningar
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_dagordningar_updated_at
BEFORE UPDATE ON public.regeringskansliet_dagordningar
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_rapporter_updated_at
BEFORE UPDATE ON public.regeringskansliet_rapporter
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_remisser_updated_at
BEFORE UPDATE ON public.regeringskansliet_remisser
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_regeringsuppdrag_updated_at
BEFORE UPDATE ON public.regeringskansliet_regeringsuppdrag
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_regeringsarenden_updated_at
BEFORE UPDATE ON public.regeringskansliet_regeringsarenden
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_sakrad_updated_at
BEFORE UPDATE ON public.regeringskansliet_sakrad
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_bistands_strategier_updated_at
BEFORE UPDATE ON public.regeringskansliet_bistands_strategier
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_overenskommelser_avtal_updated_at
BEFORE UPDATE ON public.regeringskansliet_overenskommelser_avtal
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_arendeforteckningar_updated_at
BEFORE UPDATE ON public.regeringskansliet_arendeforteckningar
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_artiklar_updated_at
BEFORE UPDATE ON public.regeringskansliet_artiklar
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_debattartiklar_updated_at
BEFORE UPDATE ON public.regeringskansliet_debattartiklar
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_tal_updated_at
BEFORE UPDATE ON public.regeringskansliet_tal
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_ud_avrader_updated_at
BEFORE UPDATE ON public.regeringskansliet_ud_avrader
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regeringskansliet_uttalanden_updated_at
BEFORE UPDATE ON public.regeringskansliet_uttalanden
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();