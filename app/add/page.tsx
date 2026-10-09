'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Calendar, Clock, Phone, Camera, Loader2, Repeat, Sparkles,
  Utensils, Check, ChevronLeft, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Khanda } from '@/components/khanda';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const FOOD_PRESETS = ['Roti', 'Sabzi', 'Daal', 'Rice', 'Kheer', 'Chaa', 'Lassi', 'Halwa', 'Prasad', 'Salad', 'Pani'];

export default function AddLangarPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [foodItems, setFoodItems] = useState<string[]>([]);
  const [customFood, setCustomFood] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState('daily');
  const [recurringDay, setRecurringDay] = useState('Sunday');
  const [isSpecialOccasion, setIsSpecialOccasion] = useState(false);
  const [specialOccasionName, setSpecialOccasionName] = useState('');
  const [venueType, setVenueType] = useState('gurudwara');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [authLoading, user, router]);

  const toggleFoodItem = (item: string) => {
    setFoodItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const addCustomFood = () => {
    if (customFood.trim() && !foodItems.includes(customFood.trim())) {
      setFoodItems([...foodItems, customFood.trim()]);
      setCustomFood('');
    }
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        toast.success('Location detected! You can adjust the address below.');
      },
      () => toast.error('Could not detect your location')
    );
  };

  const geocodeAddress = async () => {
    if (!address.trim() || (latitude !== null && longitude !== null)) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setLatitude(parseFloat(data[0].lat));
        setLongitude(parseFloat(data[0].lon));
        toast.success('Coordinates automatically detected from address!');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      toast.error('Image must be under 500KB to save properly');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPhotoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!name.trim() || !address.trim() || latitude == null || longitude == null) {
      toast.error('Please fill in name, address, and location');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('langars').insert({
      name,
      description: description || null,
      food_items: foodItems,
      address,
      city: city || null,
      area: area || null,
      latitude,
      longitude,
      date: isRecurring ? null : (date || null),
      start_time: startTime || null,
      end_time: endTime || null,
      is_recurring: isRecurring,
      recurring_type: isRecurring ? recurringType : null,
      recurring_day: isRecurring && recurringType === 'weekly' ? recurringDay : null,
      is_special_occasion: isSpecialOccasion,
      special_occasion_name: isSpecialOccasion ? specialOccasionName : null,
      contact_number: contactNumber || null,
      photo_url: photoUrl || null,
      venue_type: venueType,
      is_verified: false,
      status: 'approved',
      created_by: user.id,
    });

    setSubmitting(false);
    if (error) {
      toast.error('Failed to submit: ' + error.message);
    } else {
      toast.success('Langar published! It is now visible to everyone. An admin can verify it later.'),
      router.push('/dashboard');
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 max-w-3xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden shadow-sm">
          <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t('add.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('add.subtitle')}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 mb-6">
        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Your listing goes live immediately</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your langar will be visible to everyone right away with an "Unverified" label. An admin can verify it later to add the blue check badge.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">{t('add.name')} *</Label>
              <Input
                id="name"
                placeholder="e.g. Gurudwara Sahib Phagwara"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Venue Type</Label>
              <Select value={venueType} onValueChange={setVenueType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gurudwara">Gurudwara</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="special_occasion">Special Occasion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">{t('add.details')}</Label>
              <Textarea
                id="description"
                placeholder="Describe the langar — who organizes it, what's special about it..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary-500" /> Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="address">Full Address *</Label>
              <Input
                id="address"
                placeholder="e.g. GT Road, Phagwara, Punjab 144401"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={geocodeAddress}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="e.g. Phagwara" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="area">Area</Label>
                <Input id="area" placeholder="e.g. GT Road" value={area} onChange={(e) => setArea(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Map Coordinates *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Latitude"
                  value={latitude ?? ''}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  type="number"
                  step="0.0001"
                  className="flex-1"
                />
                <Input
                  placeholder="Longitude"
                  value={longitude ?? ''}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  type="number"
                  step="0.0001"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={detectLocation} className="gap-2 shrink-0">
                  <MapPin className="h-4 w-4" /> Detect
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Click "Detect" to use your current location, or enter coordinates manually.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-500" /> Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recurring toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-primary-500" />
                <div>
                  <Label className="cursor-pointer">{t('add.recurring')}</Label>
                  <p className="text-xs text-muted-foreground">Daily or weekly langar</p>
                </div>
              </div>
              <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
            </div>

            {isRecurring ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Recurring Type</Label>
                  <Select value={recurringType} onValueChange={setRecurringType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {recurringType === 'weekly' && (
                  <div className="space-y-1.5">
                    <Label>Day of Week</Label>
                    <Select value={recurringDay} onValueChange={setRecurringDay}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="date">{t('add.date')}</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            {/* Special occasion toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-400" />
                <div>
                  <Label className="cursor-pointer">{t('add.specialOccasion')}</Label>
                  <p className="text-xs text-muted-foreground">e.g. Guru Nanak Jayanti</p>
                </div>
              </div>
              <Switch checked={isSpecialOccasion} onCheckedChange={setIsSpecialOccasion} />
            </div>
            {isSpecialOccasion && (
              <div className="space-y-1.5">
                <Label htmlFor="occasionName">Occasion Name</Label>
                <Input
                  id="occasionName"
                  placeholder="e.g. Guru Nanak Jayanti"
                  value={specialOccasionName}
                  onChange={(e) => setSpecialOccasionName(e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Food Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary-500" /> {t('langar.foodItems')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {FOOD_PRESETS.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleFoodItem(item)}
                  className={cn(
                    'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    foodItems.includes(item)
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  )}
                >
                  {foodItems.includes(item) && <Check className="h-3 w-3" />}
                  {item}
                </button>
              ))}
            </div>
            {foodItems.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                {foodItems.map(item => (
                  <Badge key={item} variant="secondary" className="gap-1">
                    {item}
                    <button type="button" onClick={() => toggleFoodItem(item)} className="ml-1 hover:text-destructive">x</button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom food item"
                value={customFood}
                onChange={(e) => setCustomFood(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomFood(); } }}
              />
              <Button type="button" variant="outline" onClick={addCustomFood}>Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="photo">{t('add.photo')}</Label>
              <div className="flex items-center gap-3">
                {photoUrl ? (
                  <div className="relative">
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoUrl} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center"
                    >x</button>
                  </div>
                ) : (
                  <label htmlFor="photo" className="cursor-pointer">
                    <div className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary-300 transition-colors">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
                <p className="text-xs text-muted-foreground">Upload a photo of the langar venue (max 5MB)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 pb-8">
          <Button type="submit" size="lg" className="flex-1 gap-2" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {t('add.submit')}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
