import { Langar } from '@/lib/supabase';

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  if (km < 10) return `${km.toFixed(1)}km`;
  return `${Math.round(km)}km`;
}

export function formatTime(time: string | null): string {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${m} ${period}`;
}

export function formatDate(date: string | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function isToday(date: string | null): boolean {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

export function isTomorrow(date: string | null): boolean {
  if (!date) return false;
  const d = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d.toDateString() === tomorrow.toDateString();
}

export function isThisWeek(date: string | null): boolean {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  return d >= now && d <= weekFromNow;
}

export function getLangarTimingText(langar: Langar): string {
  if (langar.is_recurring) {
    const type = langar.recurring_type === 'daily' ? 'Daily' : `Every ${langar.recurring_day || ''}`;
    const time = langar.start_time && langar.end_time
      ? `${formatTime(langar.start_time)} - ${formatTime(langar.end_time)}`
      : '';
    return `${type}${time ? ' · ' + time : ''}`;
  }
  if (langar.date) {
    const dateStr = formatDate(langar.date);
    const time = langar.start_time && langar.end_time
      ? `${formatTime(langar.start_time)} - ${formatTime(langar.end_time)}`
      : '';
    return `${dateStr}${time ? ' · ' + time : ''}`;
  }
  return '';
}

export function getVenueTypeLabel(venueType: string): string {
  switch (venueType) {
    case 'gurudwara': return 'Gurudwara';
    case 'community': return 'Community';
    case 'special_occasion': return 'Special Occasion';
    default: return venueType;
  }
}

export function getVenueTypeIcon(venueType: string): string {
  switch (venueType) {
    case 'gurudwara': return 'Gurudwara';
    case 'community': return 'Community';
    case 'special_occasion': return 'Special Occasion';
    default: return venueType;
  }
}

export function getRegionLabel(region: string | null): string {
  switch (region) {
    case 'punjab': return 'Punjab';
    case 'delhi': return 'Delhi';
    case 'bengal': return 'Bengal';
    default: return region || '';
  }
}
