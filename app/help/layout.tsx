import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & Support — Langar Finder',
  description:
    'Get help with Langar Finder — learn how to submit Gurudwaras, verify listings, use the search, and more. Contact our community team for support.',
  alternates: { canonical: 'https://langarfind.com/help' },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
