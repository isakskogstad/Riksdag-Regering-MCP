-- Lägg till kolumner för lokala filer i Riksdagen-tabeller
ALTER TABLE riksdagen_ledamoter ADD COLUMN IF NOT EXISTS local_bild_url TEXT;
ALTER TABLE riksdagen_dokument ADD COLUMN IF NOT EXISTS local_pdf_url TEXT;
ALTER TABLE riksdagen_dokument ADD COLUMN IF NOT EXISTS local_html_url TEXT;

-- Lägg till kolumner för lokala filer i Regeringskansliet-tabeller
ALTER TABLE regeringskansliet_propositioner ADD COLUMN IF NOT EXISTS local_pdf_url TEXT;
ALTER TABLE regeringskansliet_pressmeddelanden ADD COLUMN IF NOT EXISTS local_bilagor JSONB;
ALTER TABLE regeringskansliet_dokument ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_departementsserien ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_forordningsmotiv ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_kommittedirektiv ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_lagradsremiss ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_skrivelse ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_sou ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_internationella_overenskommelser ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_faktapromemoria ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_informationsmaterial ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_mr_granskningar ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_dagordningar ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_rapporter ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_remisser ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_regeringsuppdrag ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_regeringsarenden ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_sakrad ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_bistands_strategier ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_overenskommelser_avtal ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_arendeforteckningar ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_artiklar ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_debattartiklar ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_tal ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_ud_avrader ADD COLUMN IF NOT EXISTS local_files JSONB;
ALTER TABLE regeringskansliet_uttalanden ADD COLUMN IF NOT EXISTS local_files JSONB;

-- Skapa tabell för att spara hämtningsframsteg
CREATE TABLE IF NOT EXISTS data_fetch_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL, -- 'riksdagen' eller 'regeringskansliet'
  data_type TEXT NOT NULL, -- 'dokument', 'ledamoter', 'pressmeddelanden' etc
  current_page INTEGER DEFAULT 1,
  total_pages INTEGER,
  total_items INTEGER,
  items_fetched INTEGER DEFAULT 0,
  last_fetched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed', 'paused'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(source, data_type)
);

-- RLS för progress-tabellen
ALTER TABLE data_fetch_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa progress" ON data_fetch_progress
  FOR SELECT USING (true);

CREATE POLICY "Service role kan uppdatera progress" ON data_fetch_progress
  FOR ALL USING (true);

-- Trigger för updated_at
CREATE TRIGGER update_data_fetch_progress_updated_at
  BEFORE UPDATE ON data_fetch_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();