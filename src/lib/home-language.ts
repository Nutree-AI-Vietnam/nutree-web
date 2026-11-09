import { readLocaleCookie } from './locale-preference';

/**
 * Homepage language negotiation.
 *
 * Accept-Language is the browser's language preference, not the visitor's country.
 * A person in Vietnam often sends en-US. With no saved choice, country VN keeps `/`
 * on the Vietnamese homepage. An explicit nutree-locale cookie still wins, so the
 * language switch keeps working inside Vietnam.
 * Outside Vietnam, any parsed preference whose strongest tag is not Vietnamese uses
 * the English homepage. Missing or unusable headers do not redirect.
 * Known crawlers skip this redirect so `/` and `/en` stay stable URLs. The HTML of each
 * URL is the same for people and crawlers.
 */

export const HOME_PATH = { vi: '/', en: '/en' } as const;

/** Home link for the active language. English must not navigate to `/`, which would record Vietnamese. */
export function homePath(locale: 'vi' | 'en'): string {
  return locale === 'en' ? HOME_PATH.en : HOME_PATH.vi;
}

/** Homepage pair. x-default is the English URL, as an international fallback hint, not a redirect. */
export const HOME_LANGUAGE_ALTERNATES: Record<string, string> = {
  vi: HOME_PATH.vi,
  en: HOME_PATH.en,
  'x-default': HOME_PATH.en,
};

const KNOWN_CRAWLERS = [
  'googlebot',
  'google-inspectiontool',
  'adsbot-google',
  'mediapartners-google',
  'storebot-google',
  'bingbot',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'applebot',
  'facebookexternalhit',
  'twitterbot',
  'slackbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'discordbot',
  'gptbot',
  'chatgpt-user',
  'claudebot',
  'perplexitybot',
  'ahrefsbot',
  'semrushbot',
  'bytespider',
] as const;

export function isKnownCrawler(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  const haystack = userAgent.toLowerCase();
  return KNOWN_CRAWLERS.some((name) => haystack.includes(name));
}

type RankedTag = { primary: string; q: number; index: number; wildcard: boolean };

/** Strongest usable language. `unknown` means do not redirect away from `/`. */
export function preferredHomeLanguage(header: string | null | undefined): 'vi' | 'en' | 'unknown' {
  if (header == null) return 'unknown';
  const trimmed = header.trim();
  if (!trimmed) return 'unknown';

  const tags: RankedTag[] = [];
  trimmed.split(',').forEach((part, index) => {
    const [rangeRaw, ...params] = part.split(';');
    const range = rangeRaw.trim().toLowerCase();
    if (!range || !/^(?:\*|[a-z]{1,8}(?:-[a-z0-9]{1,8})*)$/i.test(range)) return;

    let q = 1;
    for (const param of params) {
      const [keyRaw, valueRaw] = param.split('=');
      const key = keyRaw?.trim().toLowerCase();
      if (key !== 'q') continue;
      const value = valueRaw?.trim();
      if (value == null || !/^(?:0|1|0?\.\d+)$/.test(value)) return;
      q = Number(value);
      if (q < 0 || q > 1) return;
    }
    if (q === 0) return;
    tags.push({ primary: range.split('-')[0], q, index, wildcard: range === '*' });
  });

  if (tags.length === 0) return 'unknown';
  tags.sort((a, b) => b.q - a.q || a.index - b.index);
  for (const tag of tags) {
    if (tag.wildcard) continue;
    return tag.primary === 'vi' ? 'vi' : 'en';
  }
  return 'unknown';
}

/** ISO country from the edge. `XX` is Cloudflare's unknown code. */
function usableCountry(value: string | null | undefined): string | null {
  const code = value?.trim().toUpperCase() ?? '';
  if (!/^[A-Z]{2}$/.test(code) || code === 'XX') return null;
  return code;
}

/**
 * Visitor country. Cloudflare is in front of Vercel, so `cf-ipcountry` is the visitor
 * and `x-vercel-ip-country` is often the Cloudflare edge. Use Vercel only when Cloudflare
 * did not send a country.
 */
export function visitorCountry(headers: { get(name: string): string | null } | null | undefined): string | null {
  if (!headers) return null;
  return usableCountry(headers.get('cf-ipcountry')) ?? usableCountry(headers.get('x-vercel-ip-country'));
}

/** Prefetch and other speculative fetches are not a language choice. */
export function isSpeculativeRequest(header: { get(name: string): string | null } | null | undefined): boolean {
  if (!header) return false;
  const purpose = `${header.get('purpose') ?? ''} ${header.get('sec-purpose') ?? ''}`.toLowerCase();
  if (purpose.includes('prefetch')) return true;
  if (header.get('next-router-prefetch') === '1') return true;
  if (header.get('next-router-segment-prefetch') === '1') return true;
  if (header.get('x-middleware-prefetch') === '1') return true;
  const dest = (header.get('sec-fetch-dest') ?? '').toLowerCase();
  // Browser prefetch and speculative RSC fetches are not document navigations.
  // A user-activated request sets sec-fetch-user. Clients that send no sec-fetch metadata stay real visits.
  if (dest && dest !== 'document' && header.get('sec-fetch-user') !== '?1') return true;
  return false;
}

/**
 * A real visit to an English URL stores the preference.
 * Crawlers and prefetches do not, so a saved Vietnamese choice survives a speculative /en fetch.
 */
export function explicitEnglishEntrySetsPreference(
  pathname: string,
  userAgent: string | null | undefined,
  header?: { get(name: string): string | null } | null,
): boolean {
  if (isKnownCrawler(userAgent)) return false;
  if (isSpeculativeRequest(header)) return false;
  return pathname === HOME_PATH.en || pathname.startsWith(`${HOME_PATH.en}/`);
}

/** A response that sets the preference cookie must not enter a shared cache. */
export const ENGLISH_ENTRY_PRIVATE_CACHE = {
  'cache-control': 'private, no-store',
  vary: 'Cookie',
} as const;

export function rootLanguageDecision(input: {
  cookieHeader: string | null;
  acceptLanguage: string | null;
  userAgent: string | null;
  country?: string | null;
}): { action: 'stay' | 'redirect'; reason: string } {
  if (isKnownCrawler(input.userAgent)) return { action: 'stay', reason: 'crawler' };

  const saved = readLocaleCookie(input.cookieHeader);
  if (saved === 'vi') return { action: 'stay', reason: 'cookie-vi' };
  if (saved === 'en') return { action: 'redirect', reason: 'cookie-en' };

  if (usableCountry(input.country) === 'VN') return { action: 'stay', reason: 'country-vn' };

  const preferred = preferredHomeLanguage(input.acceptLanguage);
  if (preferred === 'en') return { action: 'redirect', reason: 'accept-language' };
  if (preferred === 'vi') return { action: 'stay', reason: 'accept-language-vi' };
  return { action: 'stay', reason: 'fallback-vi' };
}
