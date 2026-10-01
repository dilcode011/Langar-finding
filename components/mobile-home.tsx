'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bell, Bookmark, ChevronRight, Clock3, Heart, Map, MapPin, Plus, Search, Utensils, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Langar } from '@/lib/supabase';
import { formatTime, getLangarTimingText } from '@/lib/langar-utils';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

type MobileHomeProps = {
  langars: Langar[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearch: (event: React.FormEvent) => void;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function initials(name: string): string {
  return name.trim().slice(0, 1).toUpperCase() || 'L';
}

export function MobileHome({ langars, loading, searchQuery, setSearchQuery, handleSearch }: MobileHomeProps) {
  const { user, profile } = useAuth();
  const displayName = profile?.name?.split(' ')[0] || 'Seeker';
  const featured = langars[0];
  const nearby = langars.slice(0, 4);
  const saved = langars.slice(1, 4);

  return (
    <div className="bg-white min-h-screen pb-28 text-[#2D5A1E]">
      {/* Langar Finder Lime Top Hero Header */}
      <div className="bg-[#A1CB35] px-5 pt-8 pb-10 rounded-b-[36px] shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 text-[10px] font-black text-[#2D5A1E] tracking-wider uppercase mb-1">
              <span>✓ Trusted</span>
              <span>• Community</span>
            </div>
            <p className="text-xs font-black tracking-widest text-[#2D5A1E]/70 uppercase">LANGAR FINDER</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tighter text-[#2D5A1E] leading-none uppercase">
              {getGreeting()},<br />{displayName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-[#2D5A1E] border border-[#2D5A1E]/10 shadow-sm" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Link>
            <Link href={user ? '/dashboard' : '/signin'} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2D5A1E] text-[#FFDE4E] font-bold shadow-sm overflow-hidden" aria-label="Profile">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                initials(displayName)
              )}
            </Link>
          </div>
        </div>

        <p className="mt-3 text-sm text-[#2D5A1E]/80 font-medium">
          Find verified Gurudwaras & free meals near you.
        </p>

        <form onSubmit={handleSearch} className="relative mt-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2D5A1E]/40" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search city, Gurudwara, dish..."
            className="h-13 rounded-2xl border-0 bg-white pl-11 pr-4 text-sm font-semibold shadow-lg text-[#2D5A1E] placeholder:text-[#2D5A1E]/40"
          />
        </form>
      </div>

      <div className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold tracking-widest text-[#2D5A1E]/60 uppercase">FEATURED LANGAR</p>
          <Link href="/search?filter=today" className="text-xs font-bold text-[#2D5A1E] hover:underline">View all</Link>
        </div>

        {loading ? (
          <div className="mt-3 h-28 animate-pulse rounded-3xl bg-[#F7FAF0]" />
        ) : featured ? (
          <Link href={`/langar/${featured.id}`} className="mt-3 flex items-center gap-3.5 p-4 rounded-3xl bg-[#F7FAF0] border border-[#E2E8D4] shadow-sm active:scale-95 transition-transform">
            <div className="flex flex-col items-center justify-center min-w-[56px] h-16 rounded-2xl bg-[#2D5A1E] text-[#FFDE4E] shrink-0">
              <span className="text-[10px] font-extrabold tracking-wider">{featured.is_recurring ? 'DAILY' : 'OPEN'}</span>
              <strong className="text-xl font-black leading-none mt-0.5">{featured.is_recurring ? 'NOW' : 'ALL'}</strong>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-extrabold text-[#2D5A1E] truncate">{featured.name}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-500 truncate">{featured.city || featured.address}</p>
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-slate-600">
                <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                {getLangarTimingText(featured) || 'Timing available on details'}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
          </Link>
        ) : (
          <div className="mt-3 rounded-3xl bg-[#F7FAF0] p-5 text-sm font-medium text-slate-500">No langars found yet.</div>
        )}

        <div className="mt-9 flex items-center justify-between">
          <p className="mobile-section-label">NEARBY LANGARS</p>
          <Link href="/map" className="mobile-see-all">All</Link>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {loading ? (
            [1, 2, 3, 4].map((item) => <div key={item} className="h-[136px] animate-pulse rounded-[24px] bg-white/70" />)
          ) : nearby.map((langar, index) => (
            <Link key={langar.id} href={`/langar/${langar.id}`} className="mobile-nearby-card">
              <div className={cn('mobile-person-bubble', index % 4 === 0 && 'mobile-person-bubble--gold', index % 4 === 1 && 'mobile-person-bubble--blue', index % 4 === 2 && 'mobile-person-bubble--lavender')}>
                {langar.venue_type === 'gurudwara' ? <Utensils className="h-5 w-5" strokeWidth={1.8} /> : <MapPin className="h-5 w-5" strokeWidth={1.8} />}
              </div>
              <div className="min-w-0">
                <p className="mt-3 truncate text-[15px] font-semibold tracking-[-0.02em] text-slate-950">{langar.name}</p>
                <p className="mt-1 truncate text-[13px] text-slate-500">{langar.city || 'Nearby'}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-2.5">
                <span className="truncate text-[12px] text-slate-500">{langar.is_verified ? 'Verified' : 'Community'}</span>
                <span className="text-[12px] font-semibold text-slate-800">{langar.food_items.length} items</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-9 flex items-center justify-between">
          <p className="mobile-section-label">RECENTLY SAVED</p>
          <Link href="/dashboard" className="mobile-see-all">See all</Link>
        </div>

        <div className="mobile-saved-card mt-3">
          {loading ? (
            <div className="space-y-3 p-4"><div className="h-12 animate-pulse rounded-2xl bg-slate-100" /><div className="h-12 animate-pulse rounded-2xl bg-slate-100" /></div>
          ) : saved.length > 0 ? saved.map((langar, index) => (
            <Link href={`/langar/${langar.id}`} key={langar.id} className="mobile-saved-row">
              <div className="mobile-saved-thumb">
                {langar.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={langar.photo_url} alt="" className="h-full w-full object-cover" />
                ) : index === 1 ? <Map className="h-5 w-5 text-slate-500" strokeWidth={1.8} /> : <Bookmark className="h-5 w-5 text-slate-500" strokeWidth={1.8} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-slate-950">{langar.name}</p>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-slate-500">
                  <span className="mobile-type-pill">{langar.venue_type === 'gurudwara' ? 'GURUDWARA' : 'COMMUNITY'}</span>
                  <span className="truncate">{langar.city || 'Saved langar'}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.8} />
            </Link>
          )) : <p className="p-5 text-sm text-slate-500">Save a langar to see it here.</p>}
        </div>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <Link href="/" className="mobile-bottom-link mobile-bottom-link--active"><span><MapPin className="h-[19px] w-[19px]" strokeWidth={2} /></span><small>Home</small></Link>
        <Link href="/map" className="mobile-bottom-link"><span><Map className="h-[19px] w-[19px]" strokeWidth={1.8} /></span><small>Map</small></Link>
        <Link href="/dashboard" className="mobile-bottom-link"><span><Heart className="h-[19px] w-[19px]" strokeWidth={1.8} /></span><small>Saved</small></Link>
        <Link href="/add" className="mobile-add-button" aria-label="Add a langar"><Plus className="h-6 w-6" strokeWidth={1.8} /></Link>
      </nav>
    </div>
  );
}
