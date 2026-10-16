import type { Metadata } from 'next';

type Props = { params: { city: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const citySlug = decodeURIComponent(params.city);
  const cityName = citySlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `Gurudwaras & Langar in ${cityName} — Langar Finder`,
    description: `Find verified Gurudwaras and free langar (community meals) in ${cityName}. Browse timings, food menus, and get directions to langars near you in ${cityName}.`,
    alternates: { canonical: `https://langarfind.com/city/${citySlug}` },
    openGraph: {
      title: `Gurudwaras & Langar in ${cityName}`,
      description: `Find verified Gurudwaras and free langar in ${cityName}. Browse timings, food menus, and get directions.`,
      url: `https://langarfind.com/city/${citySlug}`,
      type: 'website',
    },
  };
}

export default function CityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
