
ALTER TABLE langars ALTER COLUMN status SET DEFAULT 'approved';

-- Make all existing pending langars visible
UPDATE langars SET status = 'approved' WHERE status = 'pending';
