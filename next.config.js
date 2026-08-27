const withPostHog = require('@posthog/nextjs-config').withPostHogConfig;

const hasPostHogSourceMapConfig =
  process.env.POSTHOG_PERSONAL_API_KEY && process.env.POSTHOG_ENV_ID;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      // Legacy Vietnamese slugs → English legal paths
      { source: '/chinh-sach-gia', destination: '/pricing', permanent: true },
      { source: '/chinh-sach-thanh-toan', destination: '/payment', permanent: true },
      { source: '/chinh-sach-su-dung', destination: '/usage', permanent: true },
      { source: '/hoan-tien', destination: '/cancellation', permanent: true },
      { source: '/khieu-nai', destination: '/complaints', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'api.producthunt.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};

module.exports = hasPostHogSourceMapConfig
  ? withPostHog(nextConfig, {
      personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
      envId: process.env.POSTHOG_ENV_ID,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })
  : nextConfig;
