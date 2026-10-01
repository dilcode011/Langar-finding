'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, MapPin, Navigation, X, BadgeCheck, HeartHandshake, History, Utensils } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LangarCard } from '@/components/langar-card';
import { supabase, Langar } from '@/lib/supabase';
import { calculateDistance, formatDistance, isToday, isTomorrow, isThisWeek, getRegionLabel } from '@/lib/langar-utils';
import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/utils';

type RegionFilter = 'all' | 'punjab' | 'delhi' | 'bengal';
type FeatureFilter = 'all' | 'verified' | 'nearme' | 'regular-feeder' | 'historical';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [langars, setLangars] = useState<Langar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [dateFilter, setDateFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [featureFilter, setFeatureFilter] = useState<FeatureFilter>('all');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [sortBy, setSortBy] = useState<string>('latest');

  useEffect(() => {
    const q = searchParams.get('q');
    const filter = searchParams.get('filter');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const region = searchParams.get('region') as RegionFilter | null;

    if (q) setSearchQuery(q);
    if (filter === 'today') setDateFilter('today');
    if (filter === 'tomorrow') setDateFilter('tomorrow');
    if (filter === 'verified') setFeatureFilter('verified');
    if (filter === 'regular-feeder') setFeatureFilter('regular-feeder');
    if (filter === 'historical') setFeatureFilter('historical');
    if (filter === 'nearby' && lat && lng) {
      setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setFeatureFilter('nearme');
    }
    if (region && ['punjab', 'delhi', 'bengal'].includes(region)) {
      setRegionFilter(region);
    }
  }, [searchParams]);

  const fetchLangars = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('langars').select('*').eq('status', 'approved');

    if (searchQuery.trim()) {
      query = query.or(`name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,area.ilike.%${searchQuery}%`);
    }
    if (typeFilter !== 'all') {
      query = query.eq('venue_type', typeFilter);
    }
    if (featureFilter === 'verified') {
      query = query.eq('is_verified', true);
    }
    if (featureFilter === 'regular-feeder') {
      query = query.eq('is_regular_feeder', true);
    }
    if (featureFilter === 'historical') {
      query = query.eq('is_historical', true);
    }
    if (regionFilter !== 'all') {
      query = query.eq('region', regionFilter);
    }

    if (sortBy === 'latest') {
      query = query.order('is_verified', { ascending: false }).order('created_at', { ascending: false });
    } else {
      query = query.order('is_verified', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data, error } = await query.limit(100);
    if (error) {
      console.error('Error:', error);
    } else if (data) {
      let filtered = data as Langar[];

      if (dateFilter === 'today') {
        filtered = filtered.filter(l => l.is_recurring || isToday(l.date));
      } else if (dateFilter === 'tomorrow') {
        filtered = filtered.filter(l => l.is_recurring || isTomorrow(l.date));
      } else if (dateFilter === 'week') {
        filtered = filtered.filter(l => l.is_recurring || isThisWeek(l.date));
      }

      if (featureFilter === 'nearme' && userLocation) {
        filtered = filtered.map(l => ({
          ...l,
          _distance: calculateDistance(userLocation.lat, userLocation.lng, l.latitude, l.longitude)
        })) as any;
        filtered = filtered.filter(l => (l as any)._distance <= 20);
      }

      if (sortBy === 'nearest' && userLocation) {
        filtered.sort((a, b) => {
          const da = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
          const db = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
          return da - db;
        });
      }

      setLangars(filtered);
    }
    setLoading(false);
  }, [searchQuery, dateFilter, typeFilter, featureFilter, regionFilter, sortBy, userLocation]);

  useEffect(() => {
    fetchLangars();
  }, [fetchLangars]);

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setFeatureFilter('nearme');
        setSortBy('nearest');
      },
      (err) => console.error(err)
    );
  };

  const clearFilters = () => {
    setDateFilter('all');
    setTypeFilter('all');
    setFeatureFilter('all');
    setRegionFilter('all');
    setSortBy('latest');
    setSearchQuery('');
  };

  const hasActiveFilters = dateFilter !== 'all' || typeFilter !== 'all' || featureFilter !== 'all' || regionFilter !== 'all' || sortBy !== 'latest' || searchQuery;

  const regionChips: { key: RegionFilter; label: string }[] = [
    { key: 'all', label: 'All Regions' },
    { key: 'punjab', label: 'Punjab' },
    { key: 'delhi', label: 'Delhi' },
    { key: 'bengal', label: 'Bengal' },
  ];

  const featureChips: { key: FeatureFilter; label: string; icon: any }[] = [
    { key: 'all', label: 'All', icon: null },
    { key: 'verified', label: 'Verified', icon: BadgeCheck },
    { key: 'regular-feeder', label: 'Regular Feeders', icon: HeartHandshake },
    { key: 'historical', label: 'Historical', icon: History },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold">Search Gurudwaras & Langars</h1>

        {/* Search bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, city, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <Button variant="outline" onClick={detectLocation} className="gap-2">
            <Navigation className="h-4 w-4" />
            <span className="hidden sm:inline">Near me</span>
          </Button>
        </div>

        {/* Region filter chips */}
        <div className="flex flex-wrap gap-2">
          {regionChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => setRegionFilter(chip.key)}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                regionFilter === chip.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary text-foreground/70 hover:bg-primary-50 hover:text-primary-600'
              )}
            >
              <MapPin className="h-3.5 w-3.5" />
              {chip.label}
            </button>
          ))}
        </div>

        {/* Feature filter chips */}
        <div className="flex flex-wrap gap-2">
          {featureChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => setFeatureFilter(chip.key)}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                featureFilter === chip.key
                  ? 'bg-accent-500 text-white'
                  : 'bg-secondary text-foreground/70 hover:bg-accent-50 hover:text-accent-600'
              )}
            >
              {chip.icon && <chip.icon className="h-3.5 w-3.5" />}
              {chip.label}
            </button>
          ))}
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filter & Sort</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-primary-500 hover:underline flex items-center gap-1">
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Date</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filter.all')}</SelectItem>
                    <SelectItem value="today">{t('filter.today')}</SelectItem>
                    <SelectItem value="tomorrow">{t('filter.tomorrow')}</SelectItem>
                    <SelectItem value="week">{t('filter.thisWeek')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filter.all')}</SelectItem>
                    <SelectItem value="gurudwara">{t('filter.gurudwara')}</SelectItem>
                    <SelectItem value="community">{t('filter.community')}</SelectItem>
                    <SelectItem value="special_occasion">{t('filter.specialOccasion')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">{t('sort.latest')}</SelectItem>
                    <SelectItem value="nearest">{t('sort.nearest')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {(dateFilter !== 'all' || typeFilter !== 'all' || sortBy !== 'latest') && !showFilters && (
          <div className="flex flex-wrap gap-2">
            {dateFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 pr-1.5 cursor-pointer hover:bg-secondary/80" onClick={() => setDateFilter('all')}>
                {t(`filter.${dateFilter === 'week' ? 'thisWeek' : dateFilter}`)} <X className="h-3 w-3 ml-0.5" />
              </Badge>
            )}
            {typeFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 pr-1.5 cursor-pointer hover:bg-secondary/80" onClick={() => setTypeFilter('all')}>
                {t(`filter.${typeFilter === 'special_occasion' ? 'specialOccasion' : typeFilter}`)} <X className="h-3 w-3 ml-0.5" />
              </Badge>
            )}
            {sortBy !== 'latest' && (
              <Badge variant="secondary" className="gap-1 pr-1.5 cursor-pointer hover:bg-secondary/80" onClick={() => setSortBy('latest')}>
                {t('sort.nearest')} <X className="h-3 w-3 ml-0.5" />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Searching...' : `${langars.length} result${langars.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : langars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {langars.map((langar) => (
            <LangarCard
              key={langar.id}
              langar={langar}
              distance={userLocation ? calculateDistance(userLocation.lat, userLocation.lng, langar.latitude, langar.longitude) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">{t('common.noResults')}</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query</p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
