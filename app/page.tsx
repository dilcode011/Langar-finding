'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Navigation, BadgeCheck, Clock, Utensils, ChevronRight, Users, Heart, Plus, MessageCircle, HeartHandshake, History, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { LangarCard } from '@/components/langar-card';
import { MobileHome } from '@/components/mobile-home';
import { supabase, Langar } from '@/lib/supabase';
import { useLanguage } from '@/lib/language-context';
import { calculateDistance } from '@/lib/langar-utils';
import { cn } from '@/lib/utils';

const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/Gjet1eEmideEbH5wxWVzwx';

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [langars, setLangars] = useState<Langar[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLangars();
  }, []);

  const fetchLangars = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('langars')
      .select('*')
      .eq('status', 'approved')
      .order('is_verified', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching langars:', error);
    } else if (data) {
      setLangars(data as Langar[]);
    }
    setLoading(false);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        router.push(`/search?lat=${loc.lat}&lng=${loc.lng}&filter=nearby`);
      },
      (err) => { console.error('Geolocation error:', err); }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
  };

  const filterChips = [
    { key: 'nearby', label: t('filter.nearby'), icon: Navigation, action: detectLocation },
    { key: 'today', label: t('filter.today'), icon: Clock, action: () => router.push('/search?filter=today') },
    { key: 'verified', label: t('nav.verified'), icon: BadgeCheck, action: () => router.push('/search?filter=verified') },
    { key: 'regular-feeder', label: t('nav.regularFeeders'), icon: HeartHandshake, action: () => router.push('/search?filter=regular-feeder') },
  ];

  const regionChips = [
    { key: 'punjab', label: 'Punjab' },
    { key: 'delhi', label: 'Delhi' },
    { key: 'bengal', label: 'Bengal' },
  ];

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="md:hidden">
        <MobileHome
          langars={langars}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>
      <div className="hidden md:block bg-white text-[#2D5A1E]">
        <div className="flex flex-col">

      {/* ==========================================
          HERO SECTION — Langar Finder Green Aesthetic
          ========================================== */}
      <section className="bg-[#A1CB35] pt-12 pb-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl text-center flex flex-col items-center">
          
          {/* Logo Display */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white/40">
              <Image
                src="/logo.jpg"
                alt="Langar Finder Logo"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm text-xs font-extrabold text-[#2D5A1E] shadow-sm">
              <span className="flex items-center justify-center h-4 w-4 rounded-full bg-[#769826] text-white text-[10px] font-bold">✓</span>
              <span>Trusted by thousands</span>
              <span className="opacity-60 font-semibold">across India</span>
            </div>
          </div>

          {/* Giant Bold Typography */}
          <h1 className="text-5xl md:text-7xl lg:text-[88px] font-extrabold text-[#2D5A1E] tracking-tighter uppercase leading-[0.92] max-w-5xl text-center mb-6">
            FIND AND SHARE<br />
            LANGAR WORLDWIDE
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#2D5A1E]/80 max-w-2xl text-center font-medium leading-relaxed mb-8">
            Save time and discover verified Gurudwaras, live community meal timings, and free food distribution across India and abroad.
          </p>

          {/* Search & Location Box */}
          <div className="w-full max-w-2xl bg-white p-2.5 rounded-3xl shadow-2xl border border-[#2D5A1E]/10 flex flex-col sm:flex-row gap-2 mb-6">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-[#2D5A1E]/40 pointer-events-none" />
              <Input
                type="text"
                placeholder={t('hero.searchPlaceholder') || "Search city, Gurudwara, or dish..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-transparent text-[#2D5A1E] border-0 focus-visible:ring-0 text-base font-semibold placeholder:text-[#2D5A1E]/40"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              className="h-14 bg-[#2D5A1E] hover:bg-[#234A17] text-white font-extrabold text-base px-8 rounded-2xl shadow-md transition-transform active:scale-95"
            >
              {t('common.search') || "Search"}
            </Button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={detectLocation}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D5A1E] text-white text-sm font-extrabold hover:bg-[#234A17] transition-all shadow-md active:scale-95"
            >
              <Navigation className="h-4 w-4 text-[#FFDE4E]" />
              {t('hero.detectLocation') || "Search Near Me (GPS)"}
            </button>
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#2D5A1E] text-sm font-extrabold hover:bg-white/90 transition-all shadow-md"
            >
              Sign up in minutes
            </Link>
          </div>

          {/* Quick Filter Chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-3xl">
            {filterChips.map((chip) => (
              <button
                key={chip.key}
                onClick={chip.action}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 hover:bg-white/70 text-xs font-bold text-[#2D5A1E] transition-colors border border-[#2D5A1E]/10"
              >
                <chip.icon className="h-3.5 w-3.5" />
                {chip.label}
              </button>
            ))}
            {regionChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => router.push(`/search?region=${chip.key}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D5A1E]/10 hover:bg-[#2D5A1E]/20 text-xs font-bold text-[#2D5A1E] transition-colors"
              >
                <MapPin className="h-3.5 w-3.5" />
                {chip.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          APP SHOWCASE & MOCKUP SECTION
          ========================================== */}
      <section className="bg-[#A1CB35] pb-16 px-4 lg:px-8 border-b border-[#769826]/50">
        <div className="container mx-auto max-w-6xl">
          <div className="relative rounded-3xl bg-[#2D5A1E]/20 backdrop-blur-md p-6 lg:p-12 overflow-hidden border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Text info */}
              <div className="lg:col-span-5 text-[#2D5A1E] space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#2D5A1E] text-[#FFDE4E] text-xs font-extrabold uppercase tracking-wider">
                  LIVE PREVIEW
                </span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2D5A1E] tracking-tight leading-tight">
                  Real-time Gurudwara Navigation & Meal Schedules
                </h2>
                <p className="text-[#2D5A1E]/80 font-medium text-sm leading-relaxed">
                  Track 500+ verified Gurudwaras, live food menus, dish counts, distances, and community updates in one smooth, instant website experience.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <div className="bg-[#2D5A1E] text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-[#FFDE4E]" /> Verified 24/7
                  </div>
                  <div className="bg-white text-[#2D5A1E] px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm">
                    <HeartHandshake className="h-4 w-4 text-[#FF9D4D]" /> Free Meals
                  </div>
                </div>
              </div>

              {/* Right Phone & Card Mockup Graphic */}
              <div className="lg:col-span-7 relative flex justify-center items-center py-4">
                {/* Phone Frame */}
                <div className="w-[300px] sm:w-[340px] bg-[#2D5A1E] rounded-[44px] p-3 shadow-2xl border-4 border-white/40 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-slate-900 rounded-[36px] overflow-hidden text-white p-4 space-y-4 relative">
                    
                    {/* Mockup Status Header */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 pt-1">
                      <span>9:41</span>
                      <div className="flex items-center gap-1.5 text-[#A1CB35]">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#A1CB35] animate-pulse" />
                        <span>LIVE 24/7</span>
                      </div>
                    </div>

                    {/* Mockup Top Card */}
                    <div className="bg-slate-800/90 rounded-2xl p-3 border border-white/10 space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Langar Near You</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-extrabold text-white">80,000.00</span>
                        <span className="px-2 py-0.5 rounded bg-[#FFDE4E] text-[#2D5A1E] text-[10px] font-black">MEALS SERVED</span>
                      </div>
                      <p className="text-xs text-[#A1CB35] font-bold">Golden Temple (Harmandir Sahib)</p>
                    </div>

                    {/* Mockup Keypad graphic */}
                    <div className="bg-slate-800/60 rounded-2xl p-3 space-y-2">
                      <div className="flex justify-between text-xs text-slate-300 font-semibold">
                        <span>Nearest langar</span>
                        <span className="text-[#FFDE4E] font-bold">0.5 km away</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-bold text-slate-200">
                        <div className="bg-slate-700/60 py-2 rounded-lg">🍛</div>
                        <div className="bg-slate-700/60 py-2 rounded-lg">🫓</div>
                        <div className="bg-slate-700/60 py-2 rounded-lg">🥘</div>
                        <div className="bg-slate-700/60 py-2 rounded-lg">🍚</div>
                        <div className="bg-slate-700/60 py-2 rounded-lg">☕</div>
                        <div className="bg-[#FF9D4D] text-[#2D5A1E] py-2 rounded-lg font-extrabold">View</div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Floating Card */}
                <div className="absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-[#FFDE4E] text-[#2D5A1E] p-4 rounded-2xl shadow-2xl border-2 border-white transform -rotate-12 w-[180px] sm:w-[220px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-6 rounded overflow-hidden">
                      <Image src="/logo.jpg" alt="Logo" width={24} height={24} className="h-full w-full object-cover" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-[#2D5A1E] text-[#FFDE4E] px-2 py-0.5 rounded">LANGAR PASS</span>
                  </div>
                  <p className="text-xs font-extrabold leading-tight">Langar Finder Pass</p>
                  <p className="text-[10px] opacity-75 font-semibold mt-1">Verified Member #4829</p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TAKE CONTROL OF YOUR LANGAR DISCOVERY
          ========================================== */}
      <section className="bg-white py-20 px-4 lg:px-8 border-b border-slate-100">
        <div className="container mx-auto max-w-6xl">
          
          <h2 className="text-4xl md:text-6xl font-extrabold text-[#2D5A1E] tracking-tighter uppercase text-center mb-16">
            TAKE CONTROL OF YOUR<br />LANGAR DISCOVERY
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Feature Badge 1 */}
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FFDE4E] text-[#2D5A1E] shadow-sm">
                <Sparkles className="h-8 w-8 text-[#2D5A1E]" />
              </div>
              <div className="pt-2">
                <h3 className="text-lg font-bold text-[#2D5A1E] leading-snug">
                  Winner of{' '}
                  <span className="underline decoration-2 underline-offset-4 decoration-[#FF9D4D] cursor-pointer hover:opacity-80">
                    Best Community Service Website 2025
                  </span>
                </h3>
              </div>
            </div>

            {/* Feature Badge 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FFDE4E] text-[#2D5A1E] shadow-sm">
                <BadgeCheck className="h-8 w-8 text-[#2D5A1E]" />
              </div>
              <div className="pt-2">
                <h3 className="text-lg font-bold text-[#2D5A1E] leading-snug">
                  Regulated & Verified by{' '}
                  <span className="underline decoration-2 underline-offset-4 decoration-[#FF9D4D] cursor-pointer hover:opacity-80">
                    Regional Gurudwara Committees
                  </span>
                </h3>
              </div>
            </div>

            {/* Feature Badge 3 */}
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FFDE4E] text-[#2D5A1E] shadow-sm">
                <Users className="h-8 w-8 text-[#2D5A1E]" />
              </div>
              <div className="pt-2">
                <h3 className="text-lg font-bold text-[#2D5A1E] leading-snug">
                  24/7 Live Community Support & Volunteer Network
                </h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          SAVE ON YOUR TRAVELS & PILGRIMAGE SECTION
          ========================================== */}
      <section className="bg-[#F7FAF0] py-20 px-4 lg:px-8 border-b border-[#E2E8D4]">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D5A1E] tracking-tighter uppercase mb-3">
              SAVE TIME ON YOUR PILGRIMAGE & TRAVELS
            </h2>
            <p className="text-base text-[#2D5A1E]/70 font-medium max-w-2xl">
              Whether traveling across Punjab, visiting Delhi shrines, or seeking community meals anywhere, Langar Finder keeps you connected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 border border-[#E2E8D4] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#A1CB35] text-[#2D5A1E] text-xs font-black uppercase tracking-wider mb-4">
                  VERIFIED LANGARS
                </span>
                <h3 className="text-2xl font-extrabold text-[#2D5A1E] mb-3">Authentic & Verified Langars</h3>
                <p className="text-sm text-[#2D5A1E]/70 font-medium leading-relaxed mb-6">
                  Explore verified langar locations with confirmed timing schedules, live menus, and continuous free community meals near you and across the world.
                </p>
              </div>
              <Link href="/search?filter=verified" className="inline-flex items-center gap-2 font-bold text-sm text-[#2D5A1E] hover:underline">
                Explore Verified Langars <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 border border-[#E2E8D4] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#FFDE4E] text-[#2D5A1E] text-xs font-black uppercase tracking-wider mb-4">
                  REGULAR FEEDERS
                </span>
                <h3 className="text-2xl font-extrabold text-[#2D5A1E] mb-3">Daily Free Food Distributions</h3>
                <p className="text-sm text-[#2D5A1E]/70 font-medium leading-relaxed mb-6">
                  Find selfless community organizations, local volunteers, and regular feeders providing nutritious, free meals and water stations daily.
                </p>
              </div>
              <Link href="/search?filter=regular-feeder" className="inline-flex items-center gap-2 font-bold text-sm text-[#2D5A1E] hover:underline">
                View Regular Feeders <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          TODAY'S LANGAR CAROUSEL SECTION
          ========================================== */}
      <section className="bg-white py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-[#2D5A1E] tracking-tight">Today's Langar</h2>
              <p className="text-sm text-[#2D5A1E]/60 font-medium mt-1">Free community meals available now near you</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => scrollCarousel('left')} className="rounded-full border-[#E2E8D4]">
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => scrollCarousel('right')} className="rounded-full border-[#E2E8D4]">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="min-w-[300px] h-56 rounded-3xl bg-[#F7FAF0] animate-pulse" />
              ))}
            </div>
          ) : langars.length > 0 ? (
            <div ref={carouselRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
              {langars.map((langar) => (
                <LangarCard
                  key={langar.id}
                  langar={langar}
                  variant="horizontal"
                  distance={userLocation ? calculateDistance(userLocation.lat, userLocation.lng, langar.latitude, langar.longitude) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#2D5A1E]/50 font-medium">
              <p>{t('common.noResults')}</p>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          WHATSAPP COMMUNITY CTA
          ========================================== */}
      <section className="bg-[#A1CB35] py-16 px-4 lg:px-8 border-t border-b border-[#769826]/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D5A1E] text-[#FFDE4E] mb-6 shadow-md">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D5A1E] tracking-tighter uppercase mb-4">
            JOIN OUR WHATSAPP COMMUNITY
          </h2>
          <p className="text-[#2D5A1E]/80 font-medium text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with volunteers, submit langar locations, coordinate food drives, and get real-time updates directly on your phone.
          </p>
          <Button asChild size="lg" className="bg-[#2D5A1E] text-white hover:bg-[#234A17] font-extrabold text-base px-8 py-4 rounded-full shadow-xl">
            <a href={WHATSAPP_COMMUNITY_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2 text-[#FFDE4E]" />
              Join WhatsApp Community
            </a>
          </Button>
        </div>
      </section>

      {/* ==========================================
          BROWSE BY CITY FOOTER LINKS
          ========================================== */}
      <section className="bg-white py-12 px-4 lg:px-8 border-t border-slate-100">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-sm font-extrabold text-[#2D5A1E] uppercase tracking-wider mb-4">Popular Cities</h3>
          <div className="flex flex-wrap gap-2">
            {['Amritsar', 'Delhi', 'Jalandhar', 'Ludhiana', 'Phagwara', 'Anandpur Sahib', 'Patiala', 'Bathinda', 'Chandigarh', 'Mohali'].map((city) => (
              <Link
                key={city}
                href={`/city/${city.toLowerCase()}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F7FAF0] hover:bg-[#A1CB35] text-xs font-bold text-[#2D5A1E] transition-colors border border-[#E2E8D4]"
              >
                <MapPin className="h-3.5 w-3.5 text-[#769826]" />
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

        </div>
      </div>
    </>
  );
}
