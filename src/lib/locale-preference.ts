import type { Locale } from './translations';

/** Explicit language choice. Middleware reads this before Accept-Language. */
export const LOCALE_PREFERENCE_COOKIE = 'nutree-locale';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function parseLocalePreference(value: string | null | undefined): Locale | null {
  if (value === 'vi' || value === 'en') return value;
  return null;
}

/** First nutree-locale cookie wins. An invalid value is ignored so the header can still apply. */
export function readLocaleCookie(cookieHeader: string | null | undefined): Locale | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (trimmed.slice(0, eq).trim() !== LOCALE_PREFERENCE_COOKIE) continue;
    return parseLocalePreference(decodeURIComponent(trimmed.slice(eq + 1).trim()));
  }
  return null;
}

export function localePreferenceCookie(locale: Locale): string {
  return `${LOCALE_PREFERENCE_COOKIE}=${locale}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
}
