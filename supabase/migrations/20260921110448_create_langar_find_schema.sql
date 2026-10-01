/*
# Langar Find — Core Database Schema

## Overview
Creates the complete schema for the Langar Find community platform:
- `profiles`: user profiles linked to Supabase auth, with role system (user/organizer/admin)
- `langars`: the main listings table for free community meal locations
- `saved_langars`: user bookmarks
- `langar_reports`: community "report incorrect listing" flags
- `notifications`: user notification settings and events

## Tables

### profiles
- `id` (uuid, PK, references auth.users) — one row per user
- `name` (text) — display name
- `email` (text) — email address
- `role` (text) — 'user' | 'organizer' | 'admin', default 'user'
- `avatar_url` (text) — optional profile photo
- `language` (text) — preferred language: 'en' | 'pa' | 'hi', default 'en'
- `notifications_enabled` (boolean) — master notification toggle, default true
- `created_at` (timestamptz)

### langars
- `id` (uuid, PK)
- `name` (text) — Gurudwara or organizer name
- `description` (text) — langar details / food items description
- `food_items` (text[]) — array of food items (Roti, Sabzi, Daal, etc.)
- `address` (text) — full street address
- `city` (text) — city name for SEO landing pages
- `area` (text) — area/neighborhood
- `latitude` (double precision) — geographic coordinate
- `longitude` (double precision) — geographic coordinate
- `date` (date) — date of langar (for one-time events)
- `start_time` (time) — start time
- `end_time` (time) — end time
- `is_recurring` (boolean) — whether this is a recurring langar
- `recurring_type` (text) — 'daily' | 'weekly' | null
- `recurring_day` (text) — day of week for weekly, null otherwise
- `is_special_occasion` (boolean) — special occasion tag
- `special_occasion_name` (text) — name of the occasion
- `contact_number` (text) — phone number for click-to-call
- `photo_url` (text) — cover photo URL
- `venue_type` (text) — 'gurudwara' | 'community' | 'special_occasion'
- `is_verified` (boolean) — admin verification status (blue check badge)
- `status` (text) — 'pending' | 'approved' | 'rejected', default 'pending'
- `views_count` (integer) — analytics: page views
- `saves_count` (integer) — analytics: bookmark count
- `directions_count` (integer) — analytics: directions requested
- `created_by` (uuid, references profiles) — owner/creator
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### saved_langars
- `id` (uuid, PK)
- `user_id` (uuid, references profiles) — who saved it
- `langar_id` (uuid, references langars) — which langar
- `created_at` (timestamptz)
- UNIQUE constraint on (user_id, langar_id)

### langar_reports
- `id` (uuid, PK)
- `langar_id` (uuid, references langars) — which listing is reported
- `reported_by` (uuid, references profiles) — who reported it
- `reason` (text) — reason for report
- `status` (text) — 'open' | 'resolved' | 'dismissed', default 'open'
- `created_at` (timestamptz)

### notifications
- `id` (uuid, PK)
- `user_id` (uuid, references profiles) — recipient
- `langar_id` (uuid, references langars, nullable) — related langar
- `type` (text) — 'new_langar_nearby' | 'verification_update' | 'report_update'
- `message` (text) — notification text
- `read` (boolean) — read status, default false
- `created_at` (timestamptz)

## Security (RLS)
- `profiles`: users can read all profiles (for organizer info), update only their own
- `langars`: anyone can read approved langars; authenticated users can insert (as pending); owners can update/delete their own; admins can update all
- `saved_langars`: users can CRUD only their own bookmarks
- `langar_reports`: authenticated users can create reports; admins can read all; users can read their own
- `notifications`: users can CRUD only their own notifications

## Notes
1. Langar listings default to 'pending' status — not publicly visible until admin approves
2. The is_verified flag is separate from status and controlled by admins only
3. Analytics counters (views, saves, directions) are incremented via RPC functions for atomicity
4. Geographic queries use standard haversine distance formula
*/

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'admin')),
  avatar_url text,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'pa', 'hi')),
  notifications_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- ============================================================
-- LANGARS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS langars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  food_items text[] DEFAULT '{}',
  address text NOT NULL,
  city text,
  area text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  date date,
  start_time time,
  end_time time,
  is_recurring boolean NOT NULL DEFAULT false,
  recurring_type text CHECK (recurring_type IN ('daily', 'weekly')),
  recurring_day text,
  is_special_occasion boolean NOT NULL DEFAULT false,
  special_occasion_name text,
  contact_number text,
  photo_url text,
  venue_type text NOT NULL DEFAULT 'gurudwara' CHECK (venue_type IN ('gurudwara', 'community', 'special_occasion')),
  is_verified boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  views_count integer NOT NULL DEFAULT 0,
  saves_count integer NOT NULL DEFAULT 0,
  directions_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE langars ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can read approved langars
DROP POLICY IF EXISTS "langars_select_approved" ON langars;
CREATE POLICY "langars_select_approved" ON langars FOR SELECT
  TO anon, authenticated USING (status = 'approved');

-- Authenticated users can insert new langars (as pending)
DROP POLICY IF EXISTS "langars_insert_own" ON langars;
CREATE POLICY "langars_insert_own" ON langars FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by);

-- Owners can update their own langars; admins can update all
DROP POLICY IF EXISTS "langars_update_own_or_admin" ON langars;
CREATE POLICY "langars_update_own_or_admin" ON langars FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = created_by
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    auth.uid() = created_by
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Owners can delete their own langars; admins can delete any
DROP POLICY IF EXISTS "langars_delete_own_or_admin" ON langars;
CREATE POLICY "langars_delete_own_or_admin" ON langars FOR DELETE
  TO authenticated
  USING (
    auth.uid() = created_by
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- SAVED_LANGARS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_langars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  langar_id uuid NOT NULL REFERENCES langars(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, langar_id)
);

ALTER TABLE saved_langars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_select_own" ON saved_langars;
CREATE POLICY "saved_select_own" ON saved_langars FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_insert_own" ON saved_langars;
CREATE POLICY "saved_insert_own" ON saved_langars FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_delete_own" ON saved_langars;
CREATE POLICY "saved_delete_own" ON saved_langars FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- LANGAR_REPORTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS langar_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  langar_id uuid NOT NULL REFERENCES langars(id) ON DELETE CASCADE,
  reported_by uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE langar_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_insert_own" ON langar_reports;
CREATE POLICY "reports_insert_own" ON langar_reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = reported_by);

DROP POLICY IF EXISTS "reports_select_own_or_admin" ON langar_reports;
CREATE POLICY "reports_select_own_or_admin" ON langar_reports FOR SELECT
  TO authenticated
  USING (
    auth.uid() = reported_by
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "reports_update_admin" ON langar_reports;
CREATE POLICY "reports_update_admin" ON langar_reports FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  langar_id uuid REFERENCES langars(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_langars_status ON langars(status);
CREATE INDEX IF NOT EXISTS idx_langars_city ON langars(city);
CREATE INDEX IF NOT EXISTS idx_langars_created_by ON langars(created_by);
CREATE INDEX IF NOT EXISTS idx_langars_date ON langars(date);
CREATE INDEX IF NOT EXISTS idx_langars_coordinates ON langars(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_langars(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_langar ON saved_langars(langar_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_langar ON langar_reports(langar_id);

-- ============================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RPC: Increment analytics counters atomically
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_langar_counter(
  p_langar_id uuid,
  p_counter text
)
RETURNS void AS $$
BEGIN
  IF p_counter = 'views' THEN
    UPDATE langars SET views_count = views_count + 1 WHERE id = p_langar_id;
  ELSIF p_counter = 'directions' THEN
    UPDATE langars SET directions_count = directions_count + 1 WHERE id = p_langar_id;
  ELSIF p_counter = 'saves' THEN
    UPDATE langars SET saves_count = saves_count + 1 WHERE id = p_langar_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC: Decrement saves counter
-- ============================================================
CREATE OR REPLACE FUNCTION public.decrement_saves_counter(
  p_langar_id uuid
)
RETURNS void AS $$
BEGIN
  UPDATE langars SET saves_count = GREATEST(saves_count - 1, 0) WHERE id = p_langar_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC: Get langars within radius (for "near me" queries)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_langars_within_radius(
  p_lat double precision,
  p_lng double precision,
  p_radius_km double precision DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  food_items text[],
  address text,
  city text,
  area text,
  latitude double precision,
  longitude double precision,
  date date,
  start_time time,
  end_time time,
  is_recurring boolean,
  recurring_type text,
  recurring_day text,
  is_special_occasion boolean,
  special_occasion_name text,
  contact_number text,
  photo_url text,
  venue_type text,
  is_verified boolean,
  status text,
  views_count integer,
  saves_count integer,
  directions_count integer,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz,
  distance_km double precision
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.*,
    (
      6371 * acos(
        cos(radians(p_lat)) * cos(radians(l.latitude)) *
        cos(radians(l.longitude) - radians(p_lng)) +
        sin(radians(p_lat)) * sin(radians(l.latitude))
      )
    ) AS distance_km
  FROM langars l
  WHERE l.status = 'approved'
    AND (
      6371 * acos(
        cos(radians(p_lat)) * cos(radians(l.latitude)) *
        cos(radians(l.longitude) - radians(p_lng)) +
        sin(radians(p_lat)) * sin(radians(l.latitude))
      )
    ) <= p_radius_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on RPCs to anon and authenticated
GRANT EXECUTE ON FUNCTION public.increment_langar_counter TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_saves_counter TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_langars_within_radius TO anon, authenticated;