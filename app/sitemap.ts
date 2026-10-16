import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://langarfind.com';

// Use service role or anon key — anon is fine for approved public rows
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,           lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/gurudwaras`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/search`,     lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.8 },
    { url: `${SITE_URL}/map`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
    { url: `${SITE_URL}/add`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/about`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/help`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/faq`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/privacy`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/terms`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  // ── City pages ────────────────────────────────────────────────────────────
  const cities = [
    'amritsar', 'delhi', 'jalandhar', 'ludhiana', 'phagwara',
    'anandpur-sahib', 'patiala', 'bathinda', 'chandigarh', 'mohali',
  ];
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${SITE_URL}/city/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // ── Dynamic langar/gurudwara detail pages ─────────────────────────────────
  let langarPages: MetadataRoute.Sitemap = [];
  try {
    const { data } = await supabase
      .from('langars')
      .select('id, updated_at')
      .eq('status', 'approved')
      .limit(5000);

    if (data) {
      langarPages = data.map((row) => ({
        url: `${SITE_URL}/langar/${row.id}`,
        lastModified: new Date(row.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (e) {
    console.error('Sitemap: failed to fetch langars', e);
  }

  return [...staticPages, ...cityPages, ...langarPages];
}
