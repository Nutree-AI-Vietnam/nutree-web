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
  if (
    pathname === '/en/terms' ||
    pathname === '/en/payment' ||
    pathname === '/en/cancellation' ||
    pathname === '/en/pricing' ||
    pathname === '/en/usage' ||
    pathname === '/en/complaints' ||
    pathname === '/en/faq'
  ) {
    return 'en';
  }
  if (pathname === '/en/blog' || pathname.startsWith('/en/blog/')) return 'en';
  if (pathname === '/en/delete-account') return 'en';
  if (pathname === HOME_PATH.vi) return 'vi';
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return 'vi';
  if (pathname === '/delete-account') return 'vi';
  return undefined;
}

/** Pages that have a twin URL in the other language. Cookie-only pages are absent. */
const LANGUAGE_PAIRS: Array<readonly [string, string]> = [
  ['/', '/en'],
  ['/privacy', '/en/privacy'],
  ['/terms', '/en/terms'],
  ['/usage', '/en/usage'],
  ['/pricing', '/en/pricing'],
  ['/payment', '/en/payment'],
  ['/cancellation', '/en/cancellation'],
  ['/complaints', '/en/complaints'],
  ['/faq', '/en/faq'],
  ['/blog', '/en/blog'],
  ['/delete-account', '/en/delete-account'],
];

function withoutTrailingSlash(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

/**
 * Where the language control should go. Blog posts without a twin fall back to that language's
 * blog home. Pages with no English URL, such as /why, stay put so a reload can follow the cookie.
 */
export function languageSwitchHref(pathname: string, target: Locale): string {
  const path = withoutTrailingSlash(pathname.split('?')[0].split('#')[0] || '/');
  for (const [vi, en] of LANGUAGE_PAIRS) {
    if (path === vi || path === en) return target === 'en' ? en : vi;
  }
  if (path.startsWith('/en/blog/')) return target === 'vi' ? '/blog' : path;
  if (path.startsWith('/blog/')) return target === 'en' ? '/en/blog' : path;
  if (path === '/en' || path.startsWith('/en/')) return target === 'vi' ? path.slice(3) || '/' : path;
  return path;
}

/** Unlocked pages follow the saved language, so their HTML must not be shared across cookies. */
export function pageLanguageDependsOnCookie(pathname: string): boolean {
  return getRouteLocale(pathname) === undefined;
}
