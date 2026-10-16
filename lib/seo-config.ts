/**
 * Central SEO configuration for Langar Finder.
 * Edit this file to update defaults across every page.
 */

export const SEO = {
  /** Canonical domain — no trailing slash */
  siteUrl: 'https://langarfind.com',

  /** Human-readable brand name */
  siteName: 'Langar Finder',

  /** Default locale */
  locale: 'en_IN',

  /** lang attribute for <html> */
  lang: 'en',

  /** Default title (50-60 chars) */
  title: 'Langar Finder — Gurudwaras & Free Meals Near You',

  /** Append brand separator + name on inner pages: "Page Title | Langar Finder" */
  titleTemplate: (pageTitle: string) => `${pageTitle} | Langar Finder`,

  /** Default meta description (140-160 chars) */
  description:
    'Discover verified Gurudwaras, regular feeders, and free langar (community meals) across Punjab, Delhi, and Bengal. Find free food near you — updated daily.',

  /** Default OG image (must be 1200×630, absolute URL) */
  ogImage: 'https://langarfind.com/og-default.jpg',

  /** Twitter handle */
  twitterHandle: '@LangarFinder',

  /** Theme colour (matches brand) */
  themeColor: '#A1CB35',

  /** Social profiles — update with real URLs */
  socialProfiles: [
    'https://www.instagram.com/langarfinder',   // PLACEHOLDER — add real URL
    'https://www.facebook.com/langarfinder',    // PLACEHOLDER — add real URL
    'https://www.linkedin.com/company/langarfinder', // PLACEHOLDER — add real URL
    'https://twitter.com/langarfinder',          // PLACEHOLDER — add real URL
    'https://www.youtube.com/@langarfinder',     // PLACEHOLDER — add real URL
  ],

  /** Contact — update with real values */
  contact: {
    email: 'hello@langarfind.com',              // PLACEHOLDER
    whatsapp: 'https://chat.whatsapp.com/Gjet1eEmideEbH5wxWVzwx',
  },

  /** Key pages for sitelinks & footer */
  keyPages: [
    { label: 'Home', href: '/' },
    { label: 'Gurudwaras', href: '/gurudwaras' },
    { label: 'Search', href: '/search' },
    { label: 'Map', href: '/map' },
    { label: 'Add a Langar', href: '/add' },
    { label: 'About', href: '/about' },
    { label: 'Help', href: '/help' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],

  /** Popular cities for internal linking */
  popularCities: [
    'amritsar', 'delhi', 'jalandhar', 'ludhiana', 'phagwara',
    'anandpur-sahib', 'patiala', 'bathinda', 'chandigarh', 'mohali',
  ],
} as const;

/** Build a canonical URL for a given path */
export function canonicalUrl(path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return `${SEO.siteUrl}${clean}`;
}

/** Build Next.js Metadata object for a page */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  ogType = 'website',
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
}) {
  const url = canonicalUrl(path);
  const image = ogImage ?? SEO.ogImage;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SEO.siteName,
      locale: SEO.locale,
      type: ogType,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [image],
      creator: SEO.twitterHandle,
      site: SEO.twitterHandle,
    },
  };
}
