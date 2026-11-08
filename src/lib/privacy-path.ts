import type { Locale } from './translations';

/** Stable privacy URLs. Vietnamese keeps /privacy; English is /en/privacy. */
export const PRIVACY_PATH = {
  vi: '/privacy',
  en: '/en/privacy',
} as const satisfies Record<Locale, string>;

export function privacyPath(locale: Locale): string {
  return locale === 'en' ? PRIVACY_PATH.en : PRIVACY_PATH.vi;
}

/** Privacy targets, and the other paired public pages, follow the language URL. */
const PAIRED_PUBLIC_PATHS = [
  '/privacy',
  '/terms',
  '/usage',
  '/pricing',
  '/payment',
  '/cancellation',
  '/complaints',
  '/faq',
] as const;

export function languageAlternatesFor(viPath: (typeof PAIRED_PUBLIC_PATHS)[number]): Record<string, string> {
  return {
    vi: viPath,
    en: `/en${viPath}`,
    'x-default': viPath,
  };
}

const ENGLISH_PATHS: Record<string, string> = {
  '/': '/en',
  '/privacy': '/en/privacy',
  '/terms': '/en/terms',
  '/usage': '/en/usage',
  '/pricing': '/en/pricing',
  '/payment': '/en/payment',
  '/cancellation': '/en/cancellation',
  '/complaints': '/en/complaints',
  '/faq': '/en/faq',
  '/blog': '/en/blog',
  '/delete-account': '/en/delete-account',
};

/** Paths that must not gain an /en prefix. */
function isUnprefixedPath(path: string): boolean {
  return (
    path.startsWith('/api/') ||
    path === '/api' ||
    path.startsWith('/_next/') ||
    path.startsWith('/admin') ||
    path === '/download' ||
    path.startsWith('/download/') ||
    /\.[a-z0-9]{1,8}$/i.test(path)
  );
}

/**
 * English internal links use an existing English route and keep the query and fragment.
 * Vietnamese, external, mailto, asset, API, and pages without an English route stay as written.
 */
export function localizedPublicHref(href: string, locale: Locale): string {
  if (locale !== 'en' || href.length === 0) return href;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;

  let url: URL;
  try {
    url = new URL(href, 'https://nutreeai.com');
  } catch {
    return href;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return href;
  if (url.hostname !== 'nutreeai.com') return href;

  const path = url.pathname.length > 1 && url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
  if (path === '/en' || path.startsWith('/en/') || isUnprefixedPath(path)) {
    return href.startsWith('http://') || href.startsWith('https://') ? url.toString() : `${path}${url.search}${url.hash}`;
  }

  const mapped = ENGLISH_PATHS[path];
  if (!mapped) return href;
  url.pathname = mapped;
  return href.startsWith('http://') || href.startsWith('https://') ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
}

export function privacyAwareHref(href: string, locale: Locale): string {
  return localizedPublicHref(href, locale);
}

/**
 * hreflang pair for the privacy policy. x-default stays on Vietnamese, matching the blog.
 * Values are existing URLs, not a second copy of the policy.
 */
export const PRIVACY_LANGUAGE_ALTERNATES: Record<string, string> = {
  vi: PRIVACY_PATH.vi,
  en: PRIVACY_PATH.en,
  'x-default': PRIVACY_PATH.vi,
};
