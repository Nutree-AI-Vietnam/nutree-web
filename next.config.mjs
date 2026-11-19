import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const withPostHog = require('@posthog/nextjs-config').withPostHogConfig;

const hasPostHogSourceMapConfig =
  process.env.POSTHOG_PERSONAL_API_KEY && process.env.POSTHOG_ENV_ID;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Blog picture sources are only read by the image scripts, so keep them out of the server bundles.
  outputFileTracingExcludes: {
    '*': ['content/blog/images/**'],
  },
  async headers() {
    return [
      {
        source: '/en/privacy',
        headers: [{ key: 'Content-Language', value: 'en' }],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy Vietnamese slugs → English legal paths
      { source: '/chinh-sach-gia', destination: '/pricing', permanent: true },
      { source: '/chinh-sach-thanh-toan', destination: '/payment', permanent: true },
      { source: '/chinh-sach-su-dung', destination: '/usage', permanent: true },
      { source: '/hoan-tien', destination: '/cancellation', permanent: true },
      { source: '/khieu-nai', destination: '/complaints', permanent: true },
      // /pay was the old checkout; it now leads to the purchase page (the query string is kept).
      { source: '/pay', destination: '/mua-goi', permanent: false },
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
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // Public values pulled from the Vercel project. A build without those env vars
  // still points the admin proxy at the same hosts. Secrets stay out of this file.
  env: {
    MEALTRACK_PROD_API_URL: process.env.MEALTRACK_PROD_API_URL || 'https://api.nutreeai.com/',
    MEALTRACK_SIT_API_URL: process.env.MEALTRACK_SIT_API_URL || 'https://mealtrack-backend-main.onrender.com',
    NEXT_PUBLIC_MEALTRACK_API_URL:
      process.env.NEXT_PUBLIC_MEALTRACK_API_URL || 'https://mealtrack-backend-main.onrender.com',
    NEXT_PUBLIC_MEALTRACK_ADMIN_USE_PROXY: process.env.NEXT_PUBLIC_MEALTRACK_ADMIN_USE_PROXY || 'true',
  },
};

export default hasPostHogSourceMapConfig
  ? withPostHog(nextConfig, {
      personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
      envId: process.env.POSTHOG_ENV_ID,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })
  : nextConfig;
