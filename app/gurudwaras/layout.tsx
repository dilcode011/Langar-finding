import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gurudwara Directory — Browse Verified Gurudwaras | Langar Finder',
  description:
    'Browse 500+ verified Gurudwaras across Punjab, Delhi, and Bengal. Filter by region, history, and regular feeders. Find free langar timings and get directions.',
  alternates: { canonical: 'https://langarfind.com/gurudwaras' },
};

export default function GurudwarasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
