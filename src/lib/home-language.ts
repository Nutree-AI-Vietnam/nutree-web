import { readLocaleCookie } from './locale-preference';

/**
 * Homepage language negotiation.
 *
 * Accept-Language is the browser's language preference, not the visitor's country.
 * A person in Vietnam can send en-US, and a person abroad can send vi-VN.
 * Missing or unusable headers do not redirect: `/` stays the Vietnamese homepage.
 * Any parsed preference whose strongest tag is not Vietnamese uses the English homepage.
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

export function rootLanguageDecision(input: {
  cookieHeader: string | null;
  acceptLanguage: string | null;
  userAgent: string | null;
}): { action: 'stay' | 'redirect'; reason: string } {
  if (isKnownCrawler(input.userAgent)) return { action: 'stay', reason: 'crawler' };

  const saved = readLocaleCookie(input.cookieHeader);
  if (saved === 'vi') return { action: 'stay', reason: 'cookie-vi' };
  if (saved === 'en') return { action: 'redirect', reason: 'cookie-en' };

  const preferred = preferredHomeLanguage(input.acceptLanguage);
  if (preferred === 'en') return { action: 'redirect', reason: 'accept-language' };
  if (preferred === 'vi') return { action: 'stay', reason: 'accept-language-vi' };
  return { action: 'stay', reason: 'fallback-vi' };
}
