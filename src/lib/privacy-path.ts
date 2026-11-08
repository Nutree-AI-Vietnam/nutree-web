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

export function privacyAwareHref(href: string, locale: Locale): string {
  if (locale !== 'en') return href;
  if ((PAIRED_PUBLIC_PATHS as readonly string[]).includes(href)) return `/en${href}`;
  return href;
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
