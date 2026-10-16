import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Gurudwaras & Langars Near You — Langar Finder',
  description:
    'Search and filter verified Gurudwaras, regular feeders, and historical Gurudwaras across Punjab, Delhi, and Bengal. Find free langar near you right now.',
  alternates: { canonical: 'https://langarfind.com/search' },
  // Filter-parameter URLs are canonical'd to /search via robots.txt disallow
  robots: { index: true, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
