import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { LanguageProvider } from '@/lib/language-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import { SEO } from '@/lib/seo-config';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',      // font-display: swap for Core Web Vitals
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),

  // ── Default title & description ──────────────────────────────────────────
  title: {
    default: SEO.title,
    template: `%s | ${SEO.siteName}`,
  },
  description: SEO.description,

  // ── Canonical & alternates ───────────────────────────────────────────────
  alternates: { canonical: SEO.siteUrl },

  // ── Robots ───────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  // ── Open Graph ───────────────────────────────────────────────────────────
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    url: SEO.siteUrl,
    siteName: SEO.siteName,
    locale: SEO.locale,
    type: 'website',
    images: [
      {
        url: `${SEO.siteUrl}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'Langar Finder — Discover Verified Gurudwaras & Free Langar Near You',
      },
    ],
  },

  // ── Twitter Card ─────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: SEO.title,
    description: SEO.description,
    images: [`${SEO.siteUrl}/og-default.jpg`],
    creator: SEO.twitterHandle,
    site: SEO.twitterHandle,
  },

  // ── Icons & Manifest ─────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',

  // ── Webmaster verification (replace values after verifying in GSC/Bing) ──
  verification: {
    google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
    other: {
      'msvalidate.01': 'REPLACE_WITH_BING_WEBMASTER_VERIFICATION_CODE',
    },
  },

  // ── Theme colour ─────────────────────────────────────────────────────────
  themeColor: SEO.themeColor,
};

// ── Sitewide JSON-LD structured data ─────────────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SEO.siteName,
  url: SEO.siteUrl,
  logo: `${SEO.siteUrl}/logo.jpg`,
  sameAs: SEO.socialProfiles,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: SEO.contact.email,
    availableLanguage: ['English', 'Punjabi', 'Hindi'],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SEO.siteName,
  url: SEO.siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SEO.siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={SEO.lang} suppressHydrationWarning>
      <head>
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Sitewide structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
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
