
ALTER TABLE langars ADD COLUMN IF NOT EXISTS region text CHECK (region IN ('punjab', 'delhi', 'bengal'));
ALTER TABLE langars ADD COLUMN IF NOT EXISTS is_regular_feeder boolean NOT NULL DEFAULT false;
ALTER TABLE langars ADD COLUMN IF NOT EXISTS is_historical boolean NOT NULL DEFAULT false;
ALTER TABLE langars ADD COLUMN IF NOT EXISTS historical_significance text;

-- Backfill region for existing rows based on known cities
UPDATE langars SET region = 'punjab' WHERE city IN ('Amritsar','Jalandhar','Ludhiana','Phagwara','Patiala','Bathinda','Chandigarh','Mohali','Jalandhar','Patiala') AND region IS NULL;
UPDATE langars SET region = 'delhi' WHERE city ILIKE '%delhi%' AND region IS NULL;

-- Add index for region filtering
CREATE INDEX IF NOT EXISTS idx_langars_region ON langars(region);
