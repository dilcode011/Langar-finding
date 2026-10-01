import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Langar = {
  id: string;
  name: string;
  description: string | null;
  food_items: string[];
  address: string;
  city: string | null;
  area: string | null;
  latitude: number;
  longitude: number;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_recurring: boolean;
  recurring_type: string | null;
  recurring_day: string | null;
  is_special_occasion: boolean;
  special_occasion_name: string | null;
  contact_number: string | null;
  photo_url: string | null;
  venue_type: 'gurudwara' | 'community' | 'special_occasion';
  is_verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  region: 'punjab' | 'delhi' | 'bengal' | null;
  is_regular_feeder: boolean;
  is_historical: boolean;
  historical_significance: string | null;
  views_count: number;
  saves_count: number;
  likes_count: number;
  directions_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'organizer' | 'admin';
  avatar_url: string | null;
  language: 'en' | 'pa' | 'hi';
  notifications_enabled: boolean;
  created_at: string;
};

export type SavedLangar = {
  id: string;
  user_id: string;
  langar_id: string;
  created_at: string;
};

export type LangarReport = {
  id: string;
  langar_id: string;
  reported_by: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  langar_id: string | null;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
};
