'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, BadgeCheck, XCircle, Clock4, AlertTriangle, Loader2, MapPin,
  Check, X, Eye, Navigation, Bookmark, Utensils, HeartHandshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase, Langar, Profile } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { getLangarTimingText } from '@/lib/langar-utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [unverifiedLangars, setUnverifiedLangars] = useState<Langar[]>([]);
  const [verifiedLangars, setVerifiedLangars] = useState<Langar[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      router.push('/');
    }
  }, [authLoading, user, profile, router]);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchAll();
    }
  }, [user, profile]);

  const fetchAll = async () => {
    setLoading(true);
    const [pendingRes, verifiedRes, reportsRes] = await Promise.all([
      supabase.from('langars').select('*').eq('status', 'approved').eq('is_verified', false).order('created_at', { ascending: false }),
      supabase.from('langars').select('*').eq('status', 'approved').eq('is_verified', true).order('created_at', { ascending: false }),
      supabase.from('langar_reports').select('*, langar:langars(*)').eq('status', 'open').order('created_at', { ascending: false }),
    ]);
    setUnverifiedLangars((pendingRes.data || []) as Langar[]);
    setVerifiedLangars((verifiedRes.data || []) as Langar[]);
    setReports((reportsRes.data || []) as any[]);
    setLoading(false);
  };

  const verifyLangar = async (id: string) => {
    const { error } = await supabase.from('langars').update({ is_verified: true }).eq('id', id);
    if (error) {
      toast.error('Failed to verify');
    } else {
      toast.success('Langar verified with blue check badge');
      setUnverifiedLangars(prev => prev.filter(l => l.id !== id));
    }
  };

  const toggleRegularFeeder = async (id: string, current: boolean) => {
    const { error } = await supabase.from('langars').update({ is_regular_feeder: !current }).eq('id', id);
    if (error) {
      toast.error('Failed to update regular feeder status');
    } else {
      toast.success(!current ? 'Marked as Verified Regular Feeder' : 'Removed Regular Feeder status');
      setVerifiedLangars(prev => prev.map(l => l.id === id ? { ...l, is_regular_feeder: !current } : l));
    }
  };

  const resolveReport = async (id: string) => {
    const { error } = await supabase.from('langar_reports').update({ status: 'resolved' }).eq('id', id);
    if (error) {
      toast.error('Failed to resolve');
    } else {
      toast.success('Report resolved');
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  if (authLoading || !user || profile?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Verify listings and manage reports</p>
        </div>
      </div>

      <Tabs defaultValue="unverified" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="unverified" className="gap-1.5">
            <Clock4 className="h-3.5 w-3.5" />
            Unverified ({unverifiedLangars.length})
          </TabsTrigger>
          <TabsTrigger value="feeders" className="gap-1.5">
            <HeartHandshake className="h-3.5 w-3.5" />
            Regular Feeders ({verifiedLangars.length})
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            {t('admin.reports')} ({reports.length})
          </TabsTrigger>
        </TabsList>

        {/* Unverified Listings */}
        <TabsContent value="unverified" className="space-y-3">
          {loading ? (
            <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto" /></div>
          ) : unverifiedLangars.length > 0 ? (
            unverifiedLangars.map(langar => (
              <Card key={langar.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                      {langar.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={langar.photo_url} alt={langar.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><Utensils className="h-6 w-6 text-muted-foreground/30" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{langar.name}</h3>
                        <Badge variant="outline" className="capitalize">{langar.venue_type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <MapPin className="h-3 w-3" /> {langar.address}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <Clock4 className="h-3 w-3" /> {getLangarTimingText(langar) || 'Time not set'}
                      </p>
                      {langar.food_items.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {langar.food_items.slice(0, 5).map(item => (
                            <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button size="sm" className="gap-1" onClick={() => verifyLangar(langar.id)}>
                        <BadgeCheck className="h-3.5 w-3.5" /> Verify
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <a href={`/langar/${langar.id}`}>View</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <BadgeCheck className="h-12 w-12 text-success/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No unverified listings. All langars are verified!</p>
            </div>
          )}
        </TabsContent>

        {/* Verified & Regular Feeders */}
        <TabsContent value="feeders" className="space-y-3">
          {loading ? (
            <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto" /></div>
          ) : verifiedLangars.length > 0 ? (
            verifiedLangars.map(langar => (
              <Card key={langar.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                      {langar.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={langar.photo_url} alt={langar.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><Utensils className="h-6 w-6 text-muted-foreground/30" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{langar.name}</h3>
                        <Badge className="gap-1 bg-primary-500 text-white"><BadgeCheck className="h-3 w-3" /> Verified</Badge>
                        {langar.is_regular_feeder && (
                          <Badge className="gap-1 bg-accent-500 text-white"><HeartHandshake className="h-3 w-3" /> Regular Feeder</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <MapPin className="h-3 w-3" /> {langar.city || langar.address}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant={langar.is_regular_feeder ? 'default' : 'outline'}
                        className="gap-1"
                        onClick={() => toggleRegularFeeder(langar.id, langar.is_regular_feeder)}
                      >
                        <HeartHandshake className="h-3.5 w-3.5" />
                        {langar.is_regular_feeder ? 'Remove Feeder' : 'Mark as Feeder'}
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <a href={`/langar/${langar.id}`}>View</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <BadgeCheck className="h-12 w-12 text-success/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No verified listings yet.</p>
            </div>
          )}
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-3">
          {loading ? (
            <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto" /></div>
          ) : reports.length > 0 ? (
            reports.map(report => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 shrink-0">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{report.langar?.name || 'Unknown langar'}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Reported on {new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => resolveReport(report.id)}>
                        Resolve
                      </Button>
                      {report.langar && (
                        <Button asChild size="sm" variant="ghost">
                          <a href={`/langar/${report.langar.id}`}>View</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <BadgeCheck className="h-12 w-12 text-success/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No open reports. All clear!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function t(key: string): string {
  const translations: Record<string, string> = {
    'admin.pending': 'Pending Verifications',
    'admin.reports': 'Reports',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',
  };
  return translations[key] || key;
}
