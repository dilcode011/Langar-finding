/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bdwvqjsnixkeuyskzhkh.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
