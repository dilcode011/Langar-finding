/*
# Seed Sample Langar Data

## Overview
Inserts sample langar listings across multiple cities in Punjab, India
to populate the app with realistic data for development and demonstration.
All listings are set to 'approved' status with verified flags on some.
created_by is NULL for seed data since there are no real auth users yet.

## Sample Data
- 8 langar listings across Phagwara, Jalandhar, Ludhiana, Amritsar
- Mix of gurudwara, community, and special occasion types
- Includes recurring (daily/weekly) and one-time events
- Realistic food items, timings, and coordinates
*/

INSERT INTO langars (name, description, food_items, address, city, area, latitude, longitude, date, start_time, end_time, is_recurring, recurring_type, recurring_day, is_special_occasion, special_occasion_name, contact_number, photo_url, venue_type, is_verified, status, created_by) VALUES
(
  'Gurudwara Sahib Phagwara',
  'Daily langar served to all visitors. Free community meal open to everyone regardless of background.',
  ARRAY['Roti', 'Sabzi', 'Daal', 'Chawal', 'Kheer', 'Chaa'],
  'GT Road, Phagwara, Punjab 144401',
  'Phagwara', 'GT Road',
  31.2240, 75.7660,
  NULL, '12:00', '14:00',
  true, 'daily', NULL,
  false, NULL,
  '+91-98765-43210',
  NULL,
  'gurudwara', true, 'approved',
  NULL
),
(
  'Gurudwara Singh Sabha Jalandhar',
  'Weekly Sunday langar with special prasad. All are welcome.',
  ARRAY['Roti', 'Sabzi', 'Daal Makhani', 'Kheer', 'Lassi'],
  'G.T. Road, Jalandhar, Punjab 144001',
  'Jalandhar', 'GT Road',
  31.3260, 75.5760,
  NULL, '11:00', '13:30',
  true, 'weekly', 'Sunday',
  false, NULL,
  '+91-98100-12345',
  NULL,
  'gurudwara', true, 'approved',
  NULL
),
(
  'Gurudwara Shri Data Bandi Chhor Sahib Ludhiana',
  'Daily langar with fresh rotis and seasonal vegetables. Open 365 days a year.',
  ARRAY['Roti', 'Sabzi', 'Daal', 'Rice', 'Salad', 'Chaa'],
  'Ludhiana, Punjab 141001',
  'Ludhiana', 'Model Town',
  30.9010, 75.8570,
  NULL, '12:30', '15:00',
  true, 'daily', NULL,
  false, NULL,
  '+91-99887-76655',
  NULL,
  'gurudwara', true, 'approved',
  NULL
),
(
  'Golden Temple Langar Hall Amritsar',
  'Worlds largest free kitchen. Langar served to 50,000+ visitors daily.',
  ARRAY['Roti', 'Sabzi', 'Daal', 'Rice', 'Kheer', 'Chaa', 'Pani'],
  'Golden Temple, Amritsar, Punjab 143001',
  'Amritsar', 'Golden Temple',
  31.6200, 74.8760,
  NULL, '09:00', '21:00',
  true, 'daily', NULL,
  false, NULL,
  '+91-183-250-5555',
  NULL,
  'gurudwara', true, 'approved',
  NULL
),
(
  'Sehaj Path Sewa Phagwara',
  'Weekly Wednesday langar organized by the community during Sehaj Path.',
  ARRAY['Roti', 'Sabzi', 'Daal', 'Kheer', 'Lassi', 'Halwa'],
  'Hargobind Nagar, Phagwara, Punjab 144401',
  'Phagwara', 'Hargobind Nagar',
  31.2180, 75.7710,
  NULL, '17:00', '19:00',
  true, 'weekly', 'Wednesday',
  false, NULL,
  '+91-97790-11223',
  NULL,
  'community', false, 'approved',
  NULL
),
(
  'Guru Nanak Jayanti Special Langar Jalandhar',
  'Special occasion langar celebrating Guru Nanak Dev Ji Gurpurab. Open for everyone.',
  ARRAY['Roti', 'Sabzi', 'Daal', 'Rice', 'Kheer', 'Halwa', 'Chaa', 'Lassi'],
  'Model Town, Jalandhar, Punjab 144003',
  'Jalandhar', 'Model Town',
  31.3100, 75.5800,
  CURRENT_DATE + 3, '10:00', '14:00',
  false, NULL, NULL,
  true, 'Guru Nanak Jayanti',
  '+91-98765-99887',
  NULL,
  'special_occasion', false, 'approved',
  NULL
),
(
  'Community Langar at Civil Hospital Ludhiana',
  'Community organized langar for patients and families at civil hospital.',
  ARRAY['Roti', 'Sabzi', 'Daal', 'Rice', 'Chaa'],
  'Civil Lines, Ludhiana, Punjab 141001',
  'Ludhiana', 'Civil Lines',
  30.9120, 75.8490,
  NULL, '13:00', '14:30',
  true, 'daily', NULL,
  false, NULL,
  '+91-98140-55667',
  NULL,
  'community', false, 'approved',
  NULL
),
(
  'Gurudwara Sahib Hargobindpur Amritsar',
  'Daily morning langar with tea and prasad. Peaceful atmosphere.',
  ARRAY['Roti', 'Sabzi', 'Daal', 'Kheer', 'Chaa', 'Prasad'],
  'Hargobindpur, Amritsar, Punjab 143109',
  'Amritsar', 'Hargobindpur',
  31.6350, 74.8600,
  NULL, '07:00', '09:00',
  true, 'daily', NULL,
  false, NULL,
  '+91-183-255-1234',
  NULL,
  'gurudwara', true, 'approved',
  NULL
)
ON CONFLICT DO NOTHING;