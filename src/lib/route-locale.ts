import { HOME_PATH } from './home-language';
import { PRIVACY_PATH } from './privacy-path';
import type { Locale } from './translations';

/**
 * Locale implied by the URL.
 * `/` is Vietnamese and `/en` is English. Blog and privacy follow the same split.
 * `/privacy` is intentionally not listed: it keeps the stored language choice.
 */
export function getRouteLocale(pathname: string | null): Locale | undefined {
  if (!pathname) return undefined;
  if (pathname === HOME_PATH.en) return 'en';
  if (pathname === PRIVACY_PATH.en || pathname.startsWith(`${PRIVACY_PATH.en}/`)) return 'en';
  if (pathname === '/en/blog' || pathname.startsWith('/en/blog/')) return 'en';
  if (pathname === HOME_PATH.vi) return 'vi';
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return 'vi';
  return undefined;
}
