'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Utensils, Bookmark, Bell, Settings, HelpCircle, Info, Plus, Eye,
  Navigation, Clock, MapPin, Trash2, Edit, BadgeCheck, XCircle, Clock4, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase, Langar, Profile, Notification } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { getLangarTimingText } from '@/lib/langar-utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [myLangars, setMyLangars] = useState<Langar[]>([]);
  const [savedLangars, setSavedLangars] = useState<Langar[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [user]);

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);

    const [myRes, savedRes, notifRes] = await Promise.all([
      supabase.from('langars').select('*').eq('created_by', user.id).order('created_at', { ascending: false }),
      supabase.from('saved_langars').select('langar_id').eq('user_id', user.id),
      supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    ]);

    setMyLangars((myRes.data || []) as Langar[]);
    setNotifications((notifRes.data || []) as Notification[]);

    if (savedRes.data && savedRes.data.length > 0) {
      const langarIds = savedRes.data.map(s => s.langar_id);
      const { data: savedLangarData } = await supabase
        .from('langars')
        .select('*')
        .in('id', langarIds)
        .eq('status', 'approved');
      setSavedLangars((savedLangarData || []) as Langar[]);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this langar listing?')) return;
    const { error } = await supabase.from('langars').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Listing deleted');
      setMyLangars(prev => prev.filter(l => l.id !== id));
    }
  };

  const markNotificationRead = async (notifId: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', notifId);
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) {
      toast.error('Failed to update settings');
    } else {
      toast.success('Settings updated');
      refreshProfile();
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="gap-1 bg-success text-white"><BadgeCheck className="h-3 w-3" /> Approved</Badge>;
      case 'pending':
        return <Badge className="gap-1 bg-accent-400 text-white"><Clock4 className="h-3 w-3" /> Unverified</Badge>;
      case 'rejected':
        return <Badge className="gap-1 bg-destructive text-white"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {profile?.name || user.email}</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/add"><Plus className="h-4 w-4" /> {t('nav.add')}</Link>
        </Button>
      </div>

      <Tabs defaultValue="my-langars" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
          <TabsTrigger value="my-langars" className="gap-1.5">
            <Utensils className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('dashboard.myLangars')}</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-1.5">
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('dashboard.savedLangars')}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('dashboard.notifications')}</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5">
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('dashboard.settings')}</span>
          </TabsTrigger>
        </TabsList>

        {/* My Langars */}
        <TabsContent value="my-langars" className="space-y-3">
          {loading ? (
            <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto" /></div>
          ) : myLangars.length > 0 ? (
            myLangars.map(langar => (
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
                        {statusBadge(langar.status)}
                        {langar.is_verified && langar.status === 'approved' && (
                          <BadgeCheck className="h-4 w-4 text-primary-500" />
                        )}
                        {!langar.is_verified && langar.status === 'approved' && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">Unverified</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <MapPin className="h-3 w-3" /> {langar.address}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {getLangarTimingText(langar) || 'Time not set'}
                      </p>
                      {langar.status === 'approved' && (
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {langar.views_count}</span>
                          <span className="flex items-center gap-1"><Bookmark className="h-3 w-3" /> {langar.saves_count}</span>
                          <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> {langar.directions_count}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/langar/${langar.id}`}>View</Link>
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(langar.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <Utensils className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">You haven't added any langars yet</p>
              <Button asChild><Link href="/add"><Plus className="h-4 w-4 mr-1" /> Add Your First Langar</Link></Button>
            </div>
          )}
        </TabsContent>

        {/* Saved Langars */}
        <TabsContent value="saved" className="space-y-3">
          {loading ? (
            <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto" /></div>
          ) : savedLangars.length > 0 ? (
            savedLangars.map(langar => (
              <Card key={langar.id}>
                <CardContent className="p-4">
                  <Link href={`/langar/${langar.id}`} className="flex items-start gap-4 group">
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
                        <h3 className="font-semibold text-sm truncate group-hover:text-primary-500 transition-colors">{langar.name}</h3>
                        {langar.is_verified && <BadgeCheck className="h-4 w-4 text-primary-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <MapPin className="h-3 w-3" /> {langar.address}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {getLangarTimingText(langar) || 'Time not set'}
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No saved langars yet. Browse and bookmark langars you want to visit.</p>
            </div>
          )}
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <Card key={notif.id} className={cn(!notif.read && 'border-primary-300 bg-primary-50/30')}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full shrink-0',
                    notif.read ? 'bg-secondary' : 'bg-primary-500 text-white'
                  )}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  {!notif.read && (
                    <Button size="sm" variant="ghost" onClick={() => markNotificationRead(notif.id)}>
                      Mark read
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white font-semibold">
                  {profile?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium">{profile?.name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1 capitalize">{profile?.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Language</CardTitle></CardHeader>
            <CardContent>
              <Select value={lang} onValueChange={(v) => { setLang(v as any); updateProfile({ language: v as any }); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pa">ਪੰਜਾਬੀ (Gurmukhi)</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="cursor-pointer">Email & push notifications</Label>
                  <p className="text-xs text-muted-foreground">Get notified about new langars near you</p>
                </div>
                <Switch
                  checked={profile?.notifications_enabled ?? true}
                  onCheckedChange={(checked) => updateProfile({ notifications_enabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/help"><HelpCircle className="h-4 w-4" /> {t('dashboard.help')}</Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/about"><Info className="h-4 w-4" /> {t('dashboard.about')}</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
