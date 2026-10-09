'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, MapPin, Plus, Search, User, LogOut, Globe, Shield, BadgeCheck, Utensils, History, HeartHandshake, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/Gjet1eEmideEbH5wxWVzwx';

export function Header() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { href: '/', label: t('nav.home'), icon: null },
    { href: '/map', label: t('nav.map'), icon: MapPin },
    { href: '/add', label: t('nav.add') || 'Add Langar', icon: Plus },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    const base = href.split('?')[0];
    return pathname.startsWith(base);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#A1CB35] border-b border-[#769826]/50 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left section: Logo + Nav */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="Langar Finder Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#2D5A1E] tracking-tighter leading-tight">
                Langar<span className="font-medium text-[#2D5A1E]/80 ml-1">Finder</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const base = link.href.split('?')[0];
              const active = base === '/' ? pathname === '/' : pathname.startsWith(base);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 text-sm font-bold rounded-full transition-all',
                    active
                      ? 'text-[#2D5A1E] bg-white/40 shadow-sm'
                      : 'text-[#2D5A1E]/80 hover:text-[#2D5A1E] hover:bg-white/20'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: Join Community + Help + Login + Sign Up Pill */}
        <div className="flex items-center gap-3">
          {/* Join Community Button */}
          <a
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2D5A1E] hover:bg-[#234A17] text-xs font-bold text-white transition-colors shadow-sm"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#FFDE4E]" />
            Join Community
          </a>

          <Link href="/help" className="hidden sm:inline-block text-sm font-bold text-[#2D5A1E]/80 hover:text-[#2D5A1E] px-2 py-1 transition-colors">
            Help
          </Link>


          {/* User Auth or Sign Up */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 rounded-full bg-[#2D5A1E] text-white hover:bg-[#234A17] px-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFDE4E] text-[#2D5A1E] text-xs font-bold">
                    {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold">{profile?.name?.split(' ')[0] || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer font-medium">
                    <User className="h-4 w-4" /> {t('nav.dashboard')}
                  </Link>
                </DropdownMenuItem>
                {profile?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={WHATSAPP_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer font-medium">
                    <MessageCircle className="h-4 w-4 text-[#769826]" /> WhatsApp Group
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 cursor-pointer text-destructive font-medium">
                  <LogOut className="h-4 w-4" /> {t('nav.signout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/signin" className="text-sm font-bold text-[#2D5A1E] hover:opacity-80 px-3 py-2 transition-opacity">
                Log in
              </Link>
              <Button asChild size="sm" className="bg-[#2D5A1E] hover:bg-[#234A17] text-white font-bold rounded-full px-5 py-2 text-sm shadow-md transition-transform active:scale-95 border-0">
                <Link href="/signin">Sign up</Link>
              </Button>
            </div>
          )}

          <a
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:hidden flex items-center justify-center h-10 w-10 text-[#2D5A1E] hover:bg-white/20 rounded-full"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
