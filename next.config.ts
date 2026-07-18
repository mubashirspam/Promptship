import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Dev runs on lvh.me subdomains (app.lvh.me:3000 etc.) — allow them to load
  // /_next dev resources cross-origin
  allowedDevOrigins: ['lvh.me', '*.lvh.me'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      // Google OAuth profile photos (lh3/lh4/… subdomains)
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      // R2 public buckets (until a custom cdn domain is connected)
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
