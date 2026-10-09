'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LangarCard } from '@/components/langar-card';
import { Khanda } from '@/components/khanda';

import { supabase, Langar } from '@/lib/supabase';

export default function CityPage() {
  const params = useParams();
  const citySlug = decodeURIComponent(params.city as string);
  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);
  const [langars, setLangars] = useState<Langar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLangars();
  }, [citySlug]);

  const fetchLangars = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('langars')
      .select('*')
      .eq('status', 'approved')
      .ilike('city', cityName)
      .order('is_verified', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error:', error);
    } else if (data) {
      setLangars(data as Langar[]);
    }
    setLoading(false);
  };

  const filtered = searchQuery.trim()
    ? langars.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.area?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : langars;

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-primary-500 py-12">
        <div className="absolute inset-0 opacity-10">
          <div className="flex justify-center pt-8">
            <Khanda className="h-32 w-32 text-white" />
          </div>
        </div>
        <div className="container relative mx-auto px-4 lg:px-6 text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm text-white/60 mb-3">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Langar in {cityName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Langar in {cityName}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Find free community meals at Gurudwaras and venues in {cityName}, Punjab. Langar is open to all — discover, share, and connect.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search langars in ${cityName}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {loading ? 'Loading...' : `${filtered.length} langar${filtered.length !== 1 ? 's' : ''} in ${cityName}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-xl bg-secondary animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(langar => (
              <LangarCard key={langar.id} langar={langar} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No langars found in {cityName}</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Know a langar spot? Add it to help your community.</p>
            <Button asChild><Link href="/add">Add a Langar in {cityName}</Link></Button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-lg font-bold mb-4">Browse other cities</h2>
          <div className="flex flex-wrap gap-2">
            {['Phagwara', 'Jalandhar', 'Ludhiana', 'Amritsar', 'Patiala', 'Bathinda', 'Chandigarh', 'Mohali']
              .filter(c => c.toLowerCase() !== citySlug.toLowerCase())
              .map(city => (
                <Link
                  key={city}
                  href={`/city/${city.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary hover:bg-primary-50 text-sm font-medium text-foreground hover:text-primary-500 transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Langar in {city}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
