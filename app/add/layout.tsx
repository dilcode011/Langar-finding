import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add a Langar or Gurudwara — Langar Finder',
  description:
    'Submit a new Gurudwara, langar, or regular feeder to the Langar Finder community directory. Help others discover free meals near them.',
  alternates: { canonical: 'https://langarfind.com/add' },
  robots: { index: true, follow: true },
};

export default function AddLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
