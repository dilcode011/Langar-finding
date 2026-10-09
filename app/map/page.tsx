'use client';

import { useEffect, useState } from 'react';
import { MapPin, Navigation, List, Map as MapIcon, BadgeCheck, Clock, Search, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/map-view'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-secondary/50 animate-pulse rounded-2xl flex items-center justify-center text-muted-foreground">
      Loading map...
    </div>
  ),
});
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LangarCard } from '@/components/langar-card';
import { supabase, Langar } from '@/lib/supabase';
import { calculateDistance, formatDistance, getLangarTimingText, getVenueTypeLabel } from '@/lib/langar-utils';
import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/utils';

type ViewMode = 'map' | 'list';

export default function MapPage() {
  const { t } = useLanguage();
  const [langars, setLangars] = useState<Langar[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLangar, setSelectedLangar] = useState<Langar | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapBounds, setMapBounds] = useState({ minLat: 30.5, maxLat: 32.0, minLng: 74.5, maxLng: 76.5 });

  // Map Legend Filters
  const [showVerified, setShowVerified] = useState(true);
  const [showUnverified, setShowUnverified] = useState(true);

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
      .limit(5000);

    if (error) {
      console.error('Error:', error);
    } else if (data) {
      setLangars(data as Langar[]);
    }
    setLoading(false);
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setMapBounds({
          minLat: loc.lat - 0.5,
          maxLat: loc.lat + 0.5,
          minLng: loc.lng - 0.5,
          maxLng: loc.lng + 0.5,
        });
      },
      (err) => console.error(err)
    );
  };

  const filteredLangars = langars.filter(l => {
    // Text search filter
    if (searchQuery.trim() && !(
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.city && l.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        l.address.toLowerCase().includes(searchQuery.toLowerCase())
    )) {
      return false;
    }

    // Must have valid coordinates within bounds
    if (
      l.latitude == null || l.longitude == null ||
      l.latitude < -90 || l.latitude > 90 ||
      l.longitude < -180 || l.longitude > 180
    ) {
      return false;
    }

    // Legend toggles filter
    if (l.is_verified && !showVerified) return false;
    if (!l.is_verified && !showUnverified) return false;

    return true;
  });

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search langars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={detectLocation} className="gap-2 shrink-0">
          <Navigation className="h-4 w-4" />
          <span className="hidden sm:inline">My Location</span>
        </Button>
        <div className="flex rounded-lg border border-border overflow-hidden shrink-0">
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            onClick={() => setViewMode('map')}
            className="rounded-none gap-2"
          >
            <MapIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.map')}</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
            className="rounded-none gap-2 border-l border-border"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.list')}</span>
          </Button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="relative">
          {/* Map Container */}
          <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-border">
            <MapView
              langars={filteredLangars}
              userLocation={userLocation}
              selectedLangar={selectedLangar}
              setSelectedLangar={setSelectedLangar}
              center={userLocation ? [userLocation.lat, userLocation.lng] : [31.1471, 75.3412]}
              zoom={8}
            />

            {/* Map info overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-xs text-muted-foreground shadow-sm z-[1000] pointer-events-none">
              {loading ? 'Loading...' : `${filteredLangars.length} langars found`}
            </div>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-2 shadow-sm flex flex-col gap-1 z-[1000]">
              <button 
                onClick={() => setShowVerified(!showVerified)}
                className={cn("flex items-center gap-2 text-xs px-2 py-1.5 rounded-md transition-colors hover:bg-slate-100", !showVerified && "opacity-40")}
              >
                <div className="h-3 w-3 rounded-full bg-primary-500" />
                <span>Verified</span>
              </button>
              <button 
                onClick={() => setShowUnverified(!showUnverified)}
                className={cn("flex items-center gap-2 text-xs px-2 py-1.5 rounded-md transition-colors hover:bg-slate-100", !showUnverified && "opacity-40")}
              >
                <div className="h-3 w-3 rounded-full bg-accent-400" />
                <span>Unverified</span>
              </button>
            </div>
          </div>

          {/* Quick info below map */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLangars.slice(0, 3).map((langar) => (
              <LangarCard
                key={langar.id}
                langar={langar}
                variant="horizontal"
                distance={userLocation ? calculateDistance(userLocation.lat, userLocation.lng, langar.latitude, langar.longitude) : undefined}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-xl bg-secondary animate-pulse" />
            ))
          ) : filteredLangars.length > 0 ? (
            filteredLangars.map((langar) => (
              <LangarCard
                key={langar.id}
                langar={langar}
                distance={userLocation ? calculateDistance(userLocation.lat, userLocation.lng, langar.latitude, langar.longitude) : undefined}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p>{t('common.noResults')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
