import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/Gjet1eEmideEbH5wxWVzwx';

export function Footer() {
  return (
    <footer className="bg-[#2D5A1E] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="/logo.jpg"
                  alt="Langar Finder Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xl font-extrabold text-[#A1CB35] tracking-tight">Langar Finder</span>
            </div>
            <p className="text-sm text-white/70 max-w-md leading-relaxed font-medium">
              A community-driven website to discover, verify, and share Gurudwara and langar locations across Punjab, Delhi, and beyond. Built with love for the Sikh community and open to all.
            </p>
            <p className="text-sm text-[#FFDE4E] font-bold">
              ਲੰਗਰ ਸਭ ਦਾ, ਸੇਵਾ ਸਬ ਲਈ (Langar for All, Service for All)
            </p>
          </div>

          <div>
            <h3 className="font-extrabold mb-4 text-xs uppercase tracking-widest text-[#A1CB35]">Explore</h3>
            <ul className="space-y-3 text-sm text-white/70 font-medium">
              <li><Link href="/gurudwaras" className="hover:text-[#FFDE4E] transition-colors">Gurudwaras</Link></li>
              <li><Link href="/search?filter=verified" className="hover:text-[#FFDE4E] transition-colors">Verified Gurudwaras</Link></li>
              <li><Link href="/search?filter=regular-feeder" className="hover:text-[#FFDE4E] transition-colors">Regular Feeders</Link></li>
              <li><Link href="/search?filter=historical" className="hover:text-[#FFDE4E] transition-colors">Historical Gurudwaras</Link></li>
              <li><Link href="/map" className="hover:text-[#FFDE4E] transition-colors">Map View</Link></li>
              <li><Link href="/add" className="hover:text-[#FFDE4E] transition-colors">Add a Listing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold mb-4 text-xs uppercase tracking-widest text-[#A1CB35]">Community</h3>
            <ul className="space-y-3 text-sm text-white/70 font-medium">
              <li><Link href="/dashboard" className="hover:text-[#FFDE4E] transition-colors">Dashboard</Link></li>
              <li><Link href="/about" className="hover:text-[#FFDE4E] transition-colors">About Us</Link></li>
              <li><Link href="/help" className="hover:text-[#FFDE4E] transition-colors">Help & Support</Link></li>
              <li>
                <a href={WHATSAPP_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFDE4E] transition-colors flex items-center gap-1.5 font-bold text-[#A1CB35]">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50 font-medium">
            &copy; {new Date().getFullYear()} Langar Finder. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
