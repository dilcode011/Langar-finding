import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Langar Finder',
  description: 'The page you are looking for does not exist. Browse verified Gurudwaras and langar locations near you.',
  robots: { index: false, follow: true },
};

const keyLinks = [
  { href: '/',           label: 'Home' },
  { href: '/gurudwaras', label: 'Gurudwara Directory' },
  { href: '/search',     label: 'Search Langars' },
  { href: '/map',        label: 'Map View' },
  { href: '/add',        label: 'Add a Langar' },
  { href: '/about',      label: 'About Us' },
  { href: '/help',       label: 'Help & Support' },
];

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
      <div className="text-8xl font-extrabold text-[#A1CB35] mb-2">404</div>
      <h1 className="text-3xl font-extrabold text-[#2D5A1E] mb-4">
        Page Not Found
      </h1>
      <p className="text-[#2D5A1E]/70 font-medium mb-10 leading-relaxed">
        We couldn&apos;t find the page you&apos;re looking for. It may have been
        moved, deleted, or never existed. Try one of these links instead:
      </p>

      <nav aria-label="Helpful links">
        <ul className="flex flex-wrap justify-center gap-3 mb-10">
          {keyLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#F7FAF0] hover:bg-[#A1CB35] text-sm font-bold text-[#2D5A1E] transition-colors border border-[#E2E8D4]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#2D5A1E] text-white font-extrabold text-base hover:bg-[#234A17] transition-colors shadow-lg"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
