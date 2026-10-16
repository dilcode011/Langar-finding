import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In / Sign Up — Langar Finder',
  description: 'Sign in or create a free Langar Finder account to submit and manage Gurudwara listings.',
  robots: { index: false, follow: true },
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
