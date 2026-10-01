CREATE TABLE IF NOT EXISTS app_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert reviews" ON app_reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read their own reviews" ON app_reviews
  FOR SELECT USING (auth.uid() = user_id);
