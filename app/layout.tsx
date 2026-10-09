import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { LanguageProvider } from '@/lib/language-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://langarfind.com'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#A1CB35',
  title: 'Langar Finder — Discover Verified Gurudwaras & Langar Near You',
  description: 'Find verified Gurudwaras, regular feeders, and historical Gurudwaras across Punjab, Delhi, and Bengal. Community-driven platform for sharing and discovering langar locations.',
  openGraph: {
    title: 'Langar Finder — Discover Verified Gurudwaras & Langar Near You',
    description: 'Find verified Gurudwaras, regular feeders, and historical Gurudwaras across Punjab, Delhi, and Bengal.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Langar Finder',
    description: 'Find verified Gurudwaras and langar near you — community-driven platform for free community meals.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
