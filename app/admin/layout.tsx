import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel — Langar Finder',
  description: 'Admin panel for Langar Finder moderators.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
