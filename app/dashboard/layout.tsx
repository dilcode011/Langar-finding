import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Langar Finder',
  description: 'Manage your Langar Finder submissions and saved langars.',
  robots: { index: false, follow: true },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
