import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/Gjet1eEmideEbH5wxWVzwx';

export function Footer() {
  return (
    <footer className="bg-[#2D5A1E] text-white" aria-label="Site footer">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
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
              A community-driven website to discover, verify, and share Gurudwara and langar locations
              across Punjab, Delhi, and beyond. Built with love for the Sikh community and open to all.
            </p>
            <p className="text-sm text-[#FFDE4E] font-bold">
              ਲੰਗਰ ਸਭ ਦਾ, ਸੇਵਾ ਸਭ ਲਈ (Langar for All, Service for All)
            </p>

            {/* Social links — PLACEHOLDER URLs, update with real profiles */}
            <div className="flex gap-3 pt-1" aria-label="Social media links">
              <a
                href="https://www.instagram.com/langarfinder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Langar Finder on Instagram"
                className="text-white/50 hover:text-[#FFDE4E] transition-colors text-xs font-bold"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/langarfinder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Langar Finder on Facebook"
                className="text-white/50 hover:text-[#FFDE4E] transition-colors text-xs font-bold"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com/langarfinder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Langar Finder on X (Twitter)"
                className="text-white/50 hover:text-[#FFDE4E] transition-colors text-xs font-bold"
              >
                X / Twitter
              </a>
            </div>
          </div>

          {/* Explore */}
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

          {/* Company + Legal */}
          <div>
            <h3 className="font-extrabold mb-4 text-xs uppercase tracking-widest text-[#A1CB35]">Company</h3>
            <ul className="space-y-3 text-sm text-white/70 font-medium">
              <li><Link href="/about" className="hover:text-[#FFDE4E] transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-[#FFDE4E] transition-colors">FAQ</Link></li>
              <li><Link href="/help" className="hover:text-[#FFDE4E] transition-colors">Help & Support</Link></li>
              <li><Link href="/contact" className="hover:text-[#FFDE4E] transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-[#FFDE4E] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#FFDE4E] transition-colors">Terms of Use</Link></li>
              <li>
                <a
                  href={WHATSAPP_COMMUNITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFDE4E] transition-colors flex items-center gap-1.5 font-bold text-[#A1CB35]"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Popular Cities — internal linking for SEO */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-xs font-extrabold text-[#A1CB35] uppercase tracking-widest mb-4">
            Popular Cities
          </h3>
          <nav aria-label="Browse langars by city">
            <ul className="flex flex-wrap gap-2">
              {[
                { label: 'Amritsar', slug: 'amritsar' },
                { label: 'Delhi', slug: 'delhi' },
                { label: 'Jalandhar', slug: 'jalandhar' },
                { label: 'Ludhiana', slug: 'ludhiana' },
                { label: 'Phagwara', slug: 'phagwara' },
                { label: 'Anandpur Sahib', slug: 'anandpur-sahib' },
                { label: 'Patiala', slug: 'patiala' },
                { label: 'Bathinda', slug: 'bathinda' },
                { label: 'Chandigarh', slug: 'chandigarh' },
                { label: 'Mohali', slug: 'mohali' },
              ].map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/city/${city.slug}`}
                    className="inline-block px-3 py-1 rounded-full bg-white/10 hover:bg-[#A1CB35]/30 text-xs font-medium text-white/70 hover:text-white transition-colors"
                  >
                    {city.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50 font-medium">
            &copy; {new Date().getFullYear()} Langar Finder. All rights reserved.
          </p>
          <p className="text-xs text-white/40 font-medium">
            Made with ❤️ for the Sikh community & beyond
          </p>
        </div>
      </div>
    </footer>
  );
}
