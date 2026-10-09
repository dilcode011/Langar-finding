'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Clock, Phone, Navigation, Bookmark, Share2, BadgeCheck, Calendar,
  Utensils, AlertTriangle, ArrowLeft, Eye, Heart, TrendingUp, Loader2, HeartHandshake, History, MessageCircle, ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase, Langar } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import BmcButton from '@/components/bmc-button';
import { calculateDistance, formatDistance, formatTime, getLangarTimingText, getVenueTypeLabel, getRegionLabel } from '@/lib/langar-utils';
import { toast } from 'sonner';

export default function LangarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [langar, setLangar] = useState<Langar | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportOpen, setReportOpen] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    if (!id) return;
    fetchLangar();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, [id]);

  useEffect(() => {
    if (user && langar) {
      checkSaved();
      checkLiked();
    }
  }, [user, langar]);

  const fetchLangar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('langars')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .maybeSingle();

    if (error || !data) {
      setLangar(null);
    } else {
      setLangar(data as Langar);
      await supabase.rpc('increment_langar_counter', { p_langar_id: id, p_counter: 'views' });
    }
    setLoading(false);
  };

  const checkSaved = async () => {
    if (!user || !langar) return;
    const { data } = await supabase
      .from('saved_langars')
      .select('id')
      .eq('user_id', user.id)
      .eq('langar_id', langar.id)
      .maybeSingle();
    setIsSaved(!!data);
  };

  const checkLiked = async () => {
    if (!user || !langar) return;
    const { data } = await supabase
      .from('langar_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('langar_id', langar.id)
      .maybeSingle();
    setIsLiked(!!data);
  };

  const toggleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save langars');
      router.push('/signin');
      return;
    }
    if (!langar) return;

    if (isSaved) {
      await supabase.from('saved_langars').delete().eq('user_id', user.id).eq('langar_id', langar.id);
      await supabase.rpc('decrement_saves_counter', { p_langar_id: langar.id });
      setIsSaved(false);
      toast.success('Removed from saved');
    } else {
      await supabase.from('saved_langars').insert({ user_id: user.id, langar_id: langar.id });
      await supabase.rpc('increment_langar_counter', { p_langar_id: langar.id, p_counter: 'saves' });
      setIsSaved(true);
      toast.success('Saved to your bookmarks');
    }
  };

  const toggleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like this langar');
      router.push('/signin');
      return;
    }
    if (!langar) return;

    const { data, error } = await supabase.rpc('toggle_langar_like', { p_langar_id: langar.id, p_user_id: user.id });
    
    if (error) {
      toast.error('Failed to like langar');
      return;
    }
    
    if (data) {
      setIsLiked(data.liked);
      setLangar({ ...langar, likes_count: data.likes_count, is_verified: data.likes_count >= 20 ? true : langar.is_verified });
      toast.success(data.liked ? 'Langar liked!' : 'Like removed');
    }
  };

  const handleDirections = async () => {
    if (!langar) return;
    await supabase.rpc('increment_langar_counter', { p_langar_id: langar.id, p_counter: 'directions' });
    const destinationQuery = encodeURIComponent(`${langar.name}, ${langar.address || langar.city}`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}`;
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    if (!langar) return;
    const shareUrl = `${window.location.origin}/langar/${langar.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: langar.name, text: `Check out this langar: ${langar.name}`, url: shareUrl });
      } catch {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    }
  };

  const handleReport = async () => {
    if (!user) {
      toast.error('Please sign in to report');
      router.push('/signin');
      return;
    }
    if (!langar || !reportReason.trim()) return;
    const { error } = await supabase.from('langar_reports').insert({
      langar_id: langar.id,
      reported_by: user.id,
      reason: reportReason,
    });
    if (error) {
      toast.error('Failed to submit report');
    } else {
      toast.success('Report submitted. Thank you for helping keep our community accurate.');
      setReportReason('');
      setReportOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!langar) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Langar not found or not yet approved.</p>
        <Button asChild className="mt-4"><Link href="/">Back to Home</Link></Button>
      </div>
    );
  }

  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, langar.latitude, langar.longitude)
    : null;

  const destinationQuery = encodeURIComponent(`${langar.name}, ${langar.address || langar.city}`);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}`;

  return (
    <div className="flex flex-col">
      {/* Cover photo */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary-500 to-primary-400 overflow-hidden">
        {langar.photo_url ? (
          <Image src={langar.photo_url} alt={langar.name} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Utensils className="h-16 w-16 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="absolute bottom-4 left-4 right-4 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {langar.is_verified ? (
                <Badge className="bg-white/90 text-primary-500 hover:bg-white/90 gap-1">
                  <BadgeCheck className="h-3 w-3" /> {t('langar.verified')}
                </Badge>
              ) : (
                <Badge className="bg-white/90 text-muted-foreground hover:bg-white/90 gap-1">
                  Unverified
                </Badge>
              )}
              {langar.is_regular_feeder && (
                <Badge className="bg-accent-500 text-white hover:bg-accent-500 gap-1">
                  <HeartHandshake className="h-3 w-3" /> Verified Regular Feeder
                </Badge>
              )}
              {langar.is_historical && (
                <Badge className="bg-primary-600 text-white hover:bg-primary-600 gap-1">
                  <History className="h-3 w-3" /> Historical
                </Badge>
              )}
              <Badge className="bg-accent-400 text-white hover:bg-accent-400">
                {getVenueTypeLabel(langar.venue_type)}
              </Badge>
              {langar.region && (
                <Badge className="bg-white/90 text-primary-500 hover:bg-white/90 gap-1">
                  <MapPin className="h-3 w-3" /> {getRegionLabel(langar.region)}
                </Badge>
              )}
              {langar.is_special_occasion && (
                <Badge className="bg-white/90 text-primary-500 hover:bg-white/90 gap-1">
                  <Calendar className="h-3 w-3" /> {langar.special_occasion_name || 'Special Occasion'}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{langar.name}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info card */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-sm">{langar.address}</p>
                    {langar.city && (
                      <Link href={`/city/${langar.city.toLowerCase()}`} className="text-xs text-primary-500 hover:underline mt-1 inline-block">
                        View all langars in {langar.city}
                      </Link>
                    )}
                  </div>
                  {distance != null && (
                    <Badge variant="secondary" className="shrink-0">{formatDistance(distance)} away</Badge>
                  )}
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Timing</p>
                    <p className="text-sm">{getLangarTimingText(langar) || 'Contact for timing details'}</p>
                  </div>
                </div>

                {langar.contact_number && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Contact</p>
                        <a href={`tel:${langar.contact_number}`} className="text-sm text-primary-500 hover:underline">
                          {langar.contact_number}
                        </a>
                      </div>
                    </div>
                  </>
                )}

                {langar.description && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">About</p>
                      <p className="text-sm leading-relaxed">{langar.description}</p>
                    </div>
                  </>
                )}

                {langar.is_historical && langar.historical_significance && (
                  <>
                    <Separator />
                    <div className="rounded-lg bg-primary-50 border border-primary-200/50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <History className="h-4 w-4 text-primary-500" />
                        <p className="text-sm font-semibold text-primary-600">Historical Significance</p>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80">{langar.historical_significance}</p>
                    </div>
                  </>
                )}

                {langar.food_items.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">{t('langar.foodItems')}</p>
                      <div className="flex flex-wrap gap-2">
                        {langar.food_items.map((item) => (
                          <Badge key={item} variant="secondary" className="gap-1">
                            <Utensils className="h-3 w-3" /> {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1.5 text-success border-success/30">
                    <Heart className="h-3 w-3" /> {t('langar.openForAll')}
                  </Badge>
                  {langar.is_recurring && (
                    <Badge variant="outline" className="gap-1.5">
                      <Calendar className="h-3 w-3" /> {langar.recurring_type === 'daily' ? t('langar.daily') : t('langar.weekly')}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analytics (only for owner or admin) */}
            {user && (user.id === langar.created_by || profile?.role === 'admin') && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary-500" /> {t('dashboard.analytics')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary mx-auto mb-2">
                      <Eye className="h-4 w-4 text-primary-500" />
                    </div>
                    <p className="text-xl font-bold">{langar.views_count}</p>
                    <p className="text-xs text-muted-foreground">{t('langar.views')}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary mx-auto mb-2">
                      <Bookmark className="h-4 w-4 text-primary-500" />
                    </div>
                    <p className="text-xl font-bold">{langar.saves_count}</p>
                    <p className="text-xs text-muted-foreground">{t('langar.saves')}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary mx-auto mb-2">
                      <Navigation className="h-4 w-4 text-primary-500" />
                    </div>
                    <p className="text-xl font-bold">{langar.directions_count}</p>
                    <p className="text-xs text-muted-foreground">{t('langar.directionsRequested')}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map preview */}
            <Card>
              <CardContent className="p-0 overflow-hidden">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center group">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `linear-gradient(to right, hsl(217 82% 20% / 0.1) 1px, transparent 1px), linear-gradient(to bottom, hsl(217 82% 20% / 0.1) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px',
                      }}
                    />
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-primary-500">View on Google Maps</p>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Action buttons */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button onClick={handleDirections} className="w-full gap-2" size="lg">
                  <Navigation className="h-4 w-4" /> {t('langar.directions')}
                </Button>
                <Button
                  variant={isLiked ? 'default' : 'outline'}
                  onClick={toggleLike}
                  className="w-full gap-2"
                  size="lg"
                >
                  <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'} ({langar.likes_count})
                </Button>
                <Button
                  variant={isSaved ? 'default' : 'outline'}
                  onClick={toggleSave}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? t('langar.saved') : t('langar.save')}
                </Button>
                <Button variant="outline" onClick={handleShare} className="w-full gap-2" size="lg">
                  <Share2 className="h-4 w-4" /> {t('langar.share')}
                </Button>
              </CardContent>
            </Card>

            {/* Report listing */}
            <Card>
              <CardContent className="p-4">
                <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full gap-2 text-destructive hover:text-destructive">
                      <AlertTriangle className="h-4 w-4" /> {t('langar.report')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report this listing</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="reason">What's wrong with this listing?</Label>
                        <Textarea
                          id="reason"
                          placeholder="e.g. Wrong address, incorrect timing, no longer active..."
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleReport} disabled={!reportReason.trim()}>
                        Submit Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* WhatsApp Community */}
            <Card className="bg-gradient-to-br from-[#25D366] to-[#1da851] text-white">
              <CardContent className="p-5 text-center">
                <MessageCircle className="h-8 w-8 text-white mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-1">Join Our WhatsApp Community</h3>
                <p className="text-sm text-white/80 mb-4">
                  Connect, coordinate, and stay updated on langar and Gurudwara events.
                </p>
                <Button asChild className="w-full bg-white text-[#1da851] hover:bg-white/90 font-semibold">
                  <a href="https://chat.whatsapp.com/Gjet1eEmideEbH5wxWVzwx" target="_blank" rel="noopener noreferrer">
                    Join Now
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Sponsor/Donate module */}
            <Card className="bg-gradient-to-br from-primary-500 to-primary-400 text-white">
              <CardContent className="p-5 text-center">
                <Heart className="h-8 w-8 text-accent-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-1">Sponsor this Langar</h3>
                <p className="text-sm text-white/70 mb-4">
                  Support free community meals by contributing to this langar.
                </p>
                <BmcButton />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
