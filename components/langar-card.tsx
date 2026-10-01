'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, BadgeCheck, Utensils, Calendar, HeartHandshake, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Langar } from '@/lib/supabase';
import { formatDistance, getLangarTimingText, getVenueTypeLabel, getRegionLabel } from '@/lib/langar-utils';
import { cn } from '@/lib/utils';

type LangarCardProps = {
  langar: Langar;
  distance?: number | null;
  className?: string;
  variant?: 'default' | 'compact' | 'horizontal';
};

export function LangarCard({ langar, distance, className, variant = 'default' }: LangarCardProps) {
  const timingText = getLangarTimingText(langar);

  if (variant === 'horizontal') {
    return (
      <Link href={`/langar/${langar.id}`} className="block group">
        <Card className={cn(
          'overflow-hidden rounded-3xl border border-[#E2E8D4] bg-white hover:border-[#A1CB35] hover:shadow-lg transition-all duration-200',
          'min-w-[280px] max-w-[320px]',
          className
        )}>
          <div className="relative h-36 bg-[#2D5A1E] overflow-hidden">
            {langar.photo_url ? (
              <Image src={langar.photo_url} alt={langar.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            ) : (
              <div className="flex items-center justify-center h-full bg-[#2D5A1E]">
                <Utensils className="h-10 w-10 text-[#A1CB35]/40" />
              </div>
            )}
            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
              {langar.is_verified ? (
                <Badge className="bg-white text-[#2D5A1E] font-extrabold gap-1 shadow-sm text-[11px] rounded-full">
                  <BadgeCheck className="h-3 w-3 text-[#769826]" /> Verified
                </Badge>
              ) : (
                <Badge className="bg-white/90 text-slate-600 font-bold gap-1 text-[11px] rounded-full">
                  Community
                </Badge>
              )}
              {langar.is_regular_feeder && (
                <Badge className="bg-[#FFDE4E] text-[#2D5A1E] font-extrabold gap-1 text-[11px] rounded-full">
                  <HeartHandshake className="h-3 w-3" /> Regular Feeder
                </Badge>
              )}
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-extrabold text-base text-[#2D5A1E] line-clamp-1 group-hover:text-[#769826] transition-colors">{langar.name}</h3>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#769826]" />
              <span className="line-clamp-1">{langar.city || langar.address}</span>
              {distance != null && (
                <span className="text-[#2D5A1E] font-bold shrink-0">· {formatDistance(distance)}</span>
              )}
            </div>
            {timingText && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="line-clamp-1">{timingText}</span>
              </div>
            )}
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/langar/${langar.id}`} className="block group">
      <Card className={cn(
        'overflow-hidden rounded-3xl border border-[#E2E8D4] bg-white hover:border-[#A1CB35] hover:shadow-xl transition-all duration-200',
        className
      )}>
        <div className="relative h-44 bg-[#2D5A1E] overflow-hidden">
          {langar.photo_url ? (
            <Image src={langar.photo_url} alt={langar.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <div className="flex items-center justify-center h-full bg-[#2D5A1E]">
              <Utensils className="h-12 w-12 text-[#A1CB35]/40" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <Badge className="bg-white/95 text-[#2D5A1E] font-extrabold rounded-full text-xs shadow-sm">
              {getVenueTypeLabel(langar.venue_type)}
            </Badge>
            {langar.is_historical && (
              <Badge className="bg-[#2D5A1E] text-[#FFDE4E] font-extrabold rounded-full text-xs shadow-sm gap-1">
                <History className="h-3 w-3" /> Historical
              </Badge>
            )}
            {langar.is_special_occasion && (
              <Badge className="bg-[#FF9D4D] text-[#2D5A1E] font-extrabold rounded-full text-xs shadow-sm gap-1">
                <Calendar className="h-3 w-3" /> Special
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
            {langar.is_verified ? (
              <Badge className="bg-white text-[#2D5A1E] font-extrabold rounded-full text-xs shadow-sm gap-1">
                <BadgeCheck className="h-3 w-3 text-[#769826]" /> Verified
              </Badge>
            ) : (
              <Badge className="bg-white/90 text-slate-600 font-bold rounded-full text-xs shadow-sm">
                Unverified
              </Badge>
            )}
            {langar.is_regular_feeder && (
              <Badge className="bg-[#FFDE4E] text-[#2D5A1E] font-extrabold rounded-full text-xs shadow-sm gap-1">
                <HeartHandshake className="h-3 w-3" /> Regular Feeder
              </Badge>
            )}
          </div>
        </div>
        <div className="p-5 space-y-2.5">
          <h3 className="font-extrabold text-lg text-[#2D5A1E] line-clamp-1 group-hover:text-[#769826] transition-colors">{langar.name}</h3>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#769826]" />
            <span className="line-clamp-1">{langar.address}</span>
            {distance != null && (
              <span className="text-[#2D5A1E] font-bold shrink-0">· {formatDistance(distance)}</span>
            )}
          </div>
          {langar.region && (
            <div className="flex items-center gap-1.5 text-xs text-[#769826] font-bold">
              <MapPin className="h-3 w-3 shrink-0" />
              {getRegionLabel(langar.region)}
            </div>
          )}
          {timingText && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="line-clamp-1">{timingText}</span>
            </div>
          )}
          {langar.food_items.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {langar.food_items.slice(0, 4).map((item) => (
                <Badge key={item} variant="secondary" className="text-xs font-bold bg-[#F7FAF0] text-[#2D5A1E] border border-[#E2E8D4] rounded-full px-2.5 py-0.5">
                  {item}
                </Badge>
              ))}
              {langar.food_items.length > 4 && (
                <Badge variant="outline" className="text-xs font-bold rounded-full border-[#E2E8D4]">
                  +{langar.food_items.length - 4}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
