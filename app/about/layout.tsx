import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Langar Finder — Our Mission to Connect Communities',
  description:
    'Learn about Langar Finder — a community-driven platform to discover verified Gurudwaras and free langar (community meals) across India, built on the Sikh tradition of Seva.',
  alternates: { canonical: 'https://langarfind.com/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
