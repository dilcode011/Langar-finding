'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, BadgeCheck, HeartHandshake, History, Utensils, ChevronRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LangarCard } from '@/components/langar-card';
import { supabase, Langar } from '@/lib/supabase';
import { getRegionLabel } from '@/lib/langar-utils';
import { cn } from '@/lib/utils';

type RegionFilter = 'all' | 'punjab' | 'delhi' | 'bengal';
type CategoryFilter = 'all' | 'verified' | 'regular-feeder' | 'historical';

export default function GurudwarasPage() {
  const [langars, setLangars] = useState<Langar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  useEffect(() => {
    fetchGurudwaras();
  }, [regionFilter, categoryFilter]);

  const fetchGurudwaras = async () => {
    setLoading(true);
    let query = supabase.from('langars').select('*').eq('status', 'approved').eq('venue_type', 'gurudwara');

    if (categoryFilter === 'verified') query = query.eq('is_verified', true);
    if (categoryFilter === 'regular-feeder') query = query.eq('is_regular_feeder', true);
    if (categoryFilter === 'historical') query = query.eq('is_historical', true);
    if (regionFilter !== 'all') query = query.eq('region', regionFilter);

    query = query.order('is_verified', { ascending: false }).order('is_regular_feeder', { ascending: false }).order('name', { ascending: true });

    const { data, error } = await query.limit(100);
    if (error) {
      console.error('Error:', error);
    } else {
      setLangars(data as Langar[]);
    }
    setLoading(false);
  };

  const filtered = searchQuery.trim()
    ? langars.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : langars;

  const regionChips: { key: RegionFilter; label: string }[] = [
    { key: 'all', label: 'All Regions' },
    { key: 'punjab', label: 'Punjab' },
    { key: 'delhi', label: 'Delhi' },
    { key: 'bengal', label: 'Bengal' },
  ];

  const categoryChips: { key: CategoryFilter; label: string; icon: any }[] = [
    { key: 'all', label: 'All', icon: null },
    { key: 'verified', label: 'Verified', icon: BadgeCheck },
    { key: 'regular-feeder', label: 'Regular Feeders', icon: HeartHandshake },
    { key: 'historical', label: 'Historical', icon: History },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Gurudwaras</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Discover Gurudwaras across Punjab, Delhi, and Bengal. Verified listings are confirmed by our admin team.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search Gurudwaras by name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Region chips */}
      <div className="flex flex-wrap gap-2 mb-3">
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

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categoryChips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setCategoryFilter(chip.key)}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              categoryFilter === chip.key
                ? 'bg-accent-500 text-white'
                : 'bg-secondary text-foreground/70 hover:bg-accent-50 hover:text-accent-600'
            )}
          >
            {chip.icon && <chip.icon className="h-3.5 w-3.5" />}
            {chip.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {loading ? 'Loading...' : `${filtered.length} Gurudwara${filtered.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((langar) => (
            <LangarCard key={langar.id} langar={langar} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Utensils className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No Gurudwaras found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different region or category</p>
        </div>
      )}
    </div>
  );
}
