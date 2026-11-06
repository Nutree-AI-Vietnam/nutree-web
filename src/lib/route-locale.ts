import { PRIVACY_PATH } from './privacy-path';
import type { Locale } from './translations';

/**
 * Locale implied by the URL.
 * /blog is Vietnamese and /en/blog is English. /en/privacy is the stable English privacy URL.
 * /privacy is intentionally not listed: it keeps the stored language choice, like the rest of the site.
 */
export function getRouteLocale(pathname: string | null): Locale | undefined {
  if (!pathname) return undefined;
  if (pathname === PRIVACY_PATH.en || pathname.startsWith(`${PRIVACY_PATH.en}/`)) return 'en';
  if (pathname === '/en/blog' || pathname.startsWith('/en/blog/')) return 'en';
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return 'vi';
  return undefined;
}
