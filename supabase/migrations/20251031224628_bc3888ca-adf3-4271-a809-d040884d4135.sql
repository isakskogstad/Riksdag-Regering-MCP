-- Standardisera namngivning i data_fetch_progress till bindestreck
UPDATE data_fetch_progress 
SET data_type = 'bistands-strategier' 
WHERE source = 'regeringskansliet' AND data_type = 'bistands_strategier';

UPDATE data_fetch_progress 
SET data_type = 'internationella-overenskommelser' 
WHERE source = 'regeringskansliet' AND data_type = 'internationella_overenskommelser';

UPDATE data_fetch_progress 
SET data_type = 'overenskommelser-avtal' 
WHERE source = 'regeringskansliet' AND data_type = 'overenskommelser_avtal';

UPDATE data_fetch_progress 
SET data_type = 'mr-granskningar' 
WHERE source = 'regeringskansliet' AND data_type = 'mr_granskningar';

UPDATE data_fetch_progress 
SET data_type = 'ud-avrader' 
WHERE source = 'regeringskansliet' AND data_type = 'ud_avrader';

-- Lägg till saknad forordningsmotiv progress-post
INSERT INTO data_fetch_progress (source, data_type, status, items_fetched, total_items, current_page, total_pages)
VALUES ('regeringskansliet', 'forordningsmotiv', 'pending', 0, 0, 1, 1)
ON CONFLICT (source, data_type) DO NOTHING;

-- Standardisera namngivning i data_fetch_control till bindestreck
UPDATE data_fetch_control 
SET data_type = 'bistands-strategier' 
WHERE source = 'regeringskansliet' AND data_type = 'bistands_strategier';

UPDATE data_fetch_control 
SET data_type = 'internationella-overenskommelser' 
WHERE source = 'regeringskansliet' AND data_type = 'internationella_overenskommelser';

UPDATE data_fetch_control 
SET data_type = 'overenskommelser-avtal' 
WHERE source = 'regeringskansliet' AND data_type = 'overenskommelser_avtal';

UPDATE data_fetch_control 
SET data_type = 'mr-granskningar' 
WHERE source = 'regeringskansliet' AND data_type = 'mr_granskningar';

UPDATE data_fetch_control 
SET data_type = 'ud-avrader' 
WHERE source = 'regeringskansliet' AND data_type = 'ud_avrader';

-- Rensa alla stoppsignaler för completed items
UPDATE data_fetch_control
SET should_stop = false, updated_at = now()
WHERE should_stop = true
  AND EXISTS (
    SELECT 1 FROM data_fetch_progress 
    WHERE data_fetch_progress.source = data_fetch_control.source 
      AND data_fetch_progress.data_type = data_fetch_control.data_type
      AND data_fetch_progress.status = 'completed'
  );