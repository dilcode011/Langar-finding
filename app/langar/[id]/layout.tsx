import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

type Props = { params: { id: string } };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: langar } = await supabase
    .from('langars')
    .select('id, name, description, city, address, region, photo_url, updated_at')
    .eq('id', params.id)
    .eq('status', 'approved')
    .maybeSingle();

  if (!langar) {
    return {
      title: 'Langar Not Found — Langar Finder',
      robots: { index: false, follow: false },
    };
  }

  const title = `${langar.name} — Free Langar in ${langar.city || langar.address} | Langar Finder`;
  const description =
    langar.description
      ? `${langar.description.slice(0, 140)}...`
      : `Discover free langar at ${langar.name} in ${langar.city || langar.address}. Verified community meal timings, food menu, and directions on Langar Finder.`;

  return {
    title,
    description,
    alternates: { canonical: `https://langarfind.com/langar/${langar.id}` },
    openGraph: {
      title,
      description,
      url: `https://langarfind.com/langar/${langar.id}`,
      type: 'website',
      images: langar.photo_url
        ? [{ url: langar.photo_url, width: 1200, height: 630, alt: langar.name }]
        : [{ url: 'https://langarfind.com/og-default.jpg', width: 1200, height: 630, alt: title }],
    },
  };
}

export default function LangarDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
