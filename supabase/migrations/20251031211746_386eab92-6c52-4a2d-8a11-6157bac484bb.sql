-- Skapa tabell för filnedladdningskö
CREATE TABLE file_download_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  column_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_file_queue_status ON file_download_queue(status);
CREATE INDEX idx_file_queue_created ON file_download_queue(created_at);
CREATE INDEX idx_file_queue_table_record ON file_download_queue(table_name, record_id);

-- RLS policies för filnedladdningskö
ALTER TABLE file_download_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa filkö"
  ON file_download_queue
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Service role kan hantera filkö"
  ON file_download_queue
  FOR ALL
  USING (true);

-- Skapa tabell för kontroll av datahämtning (stoppa/återuppta)
CREATE TABLE data_fetch_control (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  data_type TEXT NOT NULL,
  should_stop BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source, data_type)
);

CREATE INDEX idx_fetch_control_lookup ON data_fetch_control(source, data_type);

-- RLS policies för datahämtningskontroll
ALTER TABLE data_fetch_control ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alla kan läsa kontroll"
  ON data_fetch_control
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Alla kan uppdatera kontroll"
  ON data_fetch_control
  FOR ALL
  TO authenticated, anon
  USING (true);

-- Lägg till trigger för automatisk updated_at
CREATE TRIGGER update_data_fetch_control_updated_at
  BEFORE UPDATE ON data_fetch_control
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();