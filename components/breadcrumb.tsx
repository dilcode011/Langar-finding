import Link from 'next/link';
import { SEO } from '@/lib/seo-config';

export type BreadcrumbItem = {
  label: string;
  href: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Visible breadcrumb + BreadcrumbList JSON-LD.
 *
 * Usage:
 *   <Breadcrumb items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Gurudwaras', href: '/gurudwaras' },
 *     { label: 'Golden Temple', href: '/langar/123' },
 *   ]} />
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SEO.siteUrl}${item.href}`,
    })),
  };

  return (
    <>
      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Visible breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {index > 0 && (
                  <span aria-hidden="true" className="text-muted-foreground/50">/</span>
                )}
                {isLast ? (
                  <span aria-current="page" className="font-semibold text-foreground">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:underline hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
