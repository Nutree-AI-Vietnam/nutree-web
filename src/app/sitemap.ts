import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

type SitemapEntry = MetadataRoute.Sitemap[number];

const ROUTES: Array<Pick<SitemapEntry, 'changeFrequency' | 'priority'> & { path: string }> = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/why', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/research', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
  // Checkout step: worth indexing for plan and price searches, but not a landing page.
  { path: '/pay', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/usage', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/pricing', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/payment', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cancellation', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/complaints', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_CONFIG.url}${path}`,
    changeFrequency,
    priority,
  }));
}
