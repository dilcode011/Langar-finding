'use client';

import Link from 'next/link';
import { ChevronLeft, Heart, Users, Utensils, Shield, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Khanda } from '@/components/khanda';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 max-w-3xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden shadow-sm">
          <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">About Langar Finder</h1>
          <p className="text-sm text-muted-foreground">ਲੰਗਰ ਸਭ ਦਾ, ਸੇਵਾ ਸਭ ਲਈ</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-3">Our Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Langar Finder is a community-driven website built to connect people with free community meals (langar) at Gurudwaras and other venues. Rooted in the Sikh tradition of <strong>Seva</strong> (selfless service) and <strong>Sangat</strong> (community), langar represents the radical idea that food should be free, available to all, and shared in equality — regardless of caste, religion, gender, or status.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We built this website to make langar more discoverable. Whether you're traveling, new to a city, or simply looking for a warm meal and community, Langar Finder helps you find free meals near you.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-5 text-center">
            <Utensils className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Discover</h3>
            <p className="text-sm text-muted-foreground">Find langar at Gurudwaras and community venues near you</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Users className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Community</h3>
            <p className="text-sm text-muted-foreground">Add and share langar locations to help your community</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Shield className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Verified</h3>
            <p className="text-sm text-muted-foreground">All listings are verified by community moderators</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Heart className="h-8 w-8 text-accent-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Free for All</h3>
            <p className="text-sm text-muted-foreground">Langar is always free — this platform is too</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-primary-500 to-primary-400 text-white">
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Join Our Community</h2>
          <p className="text-sm text-white/70 mb-4">
            Help us build the most comprehensive directory of langar locations. Every listing you add helps someone find a free meal.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild className="bg-accent-400 text-primary-500 hover:bg-accent-300">
              <Link href="/add">Add a Langar</Link>
            </Button>
            <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/search">Browse Langars</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
