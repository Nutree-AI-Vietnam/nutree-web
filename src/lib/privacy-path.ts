import type { Locale } from './translations';

/** Stable privacy URLs. Vietnamese keeps /privacy; English is /en/privacy. */
export const PRIVACY_PATH = {
  vi: '/privacy',
  en: '/en/privacy',
} as const satisfies Record<Locale, string>;

export function privacyPath(locale: Locale): string {
  return locale === 'en' ? PRIVACY_PATH.en : PRIVACY_PATH.vi;
}

/** Privacy targets follow the language URL. Every other legal path stays as written. */
export function privacyAwareHref(href: string, locale: Locale): string {
  return href === PRIVACY_PATH.vi ? privacyPath(locale) : href;
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
