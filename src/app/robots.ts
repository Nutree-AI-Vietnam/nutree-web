import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin stays crawlable on purpose: its page sets noindex, and a crawler blocked here
    // would never fetch the page to see that.
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
