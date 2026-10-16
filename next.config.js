/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ── Image optimisation ────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],   // Serve AVIF/WebP automatically
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bdwvqjsnixkeuyskzhkh.supabase.co',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── Force canonical host (redirect www → non-www, HTTP → HTTPS) ──────────
  // On Netlify/Vercel this is typically handled at the CDN level.
  // Use this redirect as a fallback for any Node.js server deployments.
  async redirects() {
    return [
      // Force non-www (adjust if you prefer www)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.langarfind.com' }],
        destination: 'https://langarfind.com/:path*',
        permanent: true,
      },
    ];
  },

  // ── Security & performance headers ───────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Performance
          { key: 'X-DNS-Prefetch-Control', value: 'on' },

          // Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },

      // ── Long-term cache for static assets (fonts, images, JS, CSS) ───────
      {
        source: '/(.*)\\.(woff|woff2|ttf|otf|eot|ico|jpg|jpeg|png|webp|avif|svg|gif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
