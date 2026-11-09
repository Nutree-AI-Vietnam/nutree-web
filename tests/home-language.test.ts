import assert from 'node:assert/strict';
import { test } from 'node:test';
import { homePath, preferredHomeLanguage, rootLanguageDecision, visitorCountry } from '../src/lib/home-language';
import { localePreferenceCookie, readLocaleCookie } from '../src/lib/locale-preference';

test('Accept-Language weights and malformed values are deterministic', () => {
  assert.equal(preferredHomeLanguage(null), 'unknown');
  assert.equal(preferredHomeLanguage(''), 'unknown');
  assert.equal(preferredHomeLanguage('%%%'), 'unknown');
  assert.equal(preferredHomeLanguage('vi-VN'), 'vi');
  assert.equal(preferredHomeLanguage('en-US'), 'en');
  assert.equal(preferredHomeLanguage('fr-FR;q=0.9, vi-VN;q=0.8, en-US;q=0.7'), 'en');
  assert.equal(preferredHomeLanguage('en-US;q=0.4, vi-VN;q=0.9'), 'vi');
  assert.equal(preferredHomeLanguage('vi;q=0.9, en;q=0.9'), 'vi');
  assert.equal(preferredHomeLanguage('en;q=0.9, vi;q=0.9'), 'en');
  assert.equal(preferredHomeLanguage('en;q=0, vi;q=0.2'), 'vi');
  assert.equal(preferredHomeLanguage('*;q=0.1, en;q=0.5'), 'en');
  assert.equal(preferredHomeLanguage('*'), 'unknown');
  assert.equal(preferredHomeLanguage('en;q=abc, vi'), 'vi');
});

test('home links and the locale cookie stay explicit', () => {
  assert.equal(homePath('en'), '/en');
  assert.equal(homePath('vi'), '/');
  assert.match(localePreferenceCookie('en', true), /; Secure$/);
  assert.equal(localePreferenceCookie('en', false).includes('Secure'), false);
  assert.match(localePreferenceCookie('vi', true), /SameSite=Lax; Secure$/);
});

test('cookie wins over Accept-Language, crawlers and invalid cookies do not', () => {
  assert.equal(readLocaleCookie('nutree-locale=nope'), null);
  assert.equal(readLocaleCookie('other=en; nutree-locale=vi'), 'vi');

  assert.deepEqual(
    rootLanguageDecision({ cookieHeader: 'nutree-locale=vi', acceptLanguage: 'en-US', userAgent: 'Mozilla/5.0' }),
    { action: 'stay', reason: 'cookie-vi' }
  );
  assert.deepEqual(
    rootLanguageDecision({ cookieHeader: 'nutree-locale=en', acceptLanguage: 'vi-VN', userAgent: 'Mozilla/5.0' }),
    { action: 'redirect', reason: 'cookie-en' }
  );
  assert.deepEqual(
    rootLanguageDecision({ cookieHeader: 'nutree-locale=fr', acceptLanguage: 'vi-VN', userAgent: 'Mozilla/5.0' }),
    { action: 'stay', reason: 'accept-language-vi' }
  );
  assert.deepEqual(
    rootLanguageDecision({
      cookieHeader: null,
      acceptLanguage: 'en-US',
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    }),
    { action: 'stay', reason: 'crawler' }
  );
  assert.deepEqual(
    rootLanguageDecision({ cookieHeader: null, acceptLanguage: null, userAgent: 'Mozilla/5.0' }),
    { action: 'stay', reason: 'fallback-vi' }
  );
});

test('Vietnam keeps the Vietnamese homepage unless the visitor already chose English', () => {
  const headers = (values: Record<string, string>) => ({
    get: (name: string) => values[name.toLowerCase()] ?? null,
  });

  assert.equal(visitorCountry(headers({ 'cf-ipcountry': 'vn' })), 'VN');
  assert.equal(visitorCountry(headers({ 'cf-ipcountry': 'XX', 'x-vercel-ip-country': 'VN' })), 'VN');
  assert.equal(visitorCountry(headers({ 'cf-ipcountry': 'HK', 'x-vercel-ip-country': 'VN' })), 'HK');
  assert.equal(visitorCountry(headers({ 'x-vercel-ip-country': 'us' })), 'US');
  assert.equal(visitorCountry(headers({ 'cf-ipcountry': 'T1' })), null);
  assert.equal(visitorCountry(null), null);

  assert.deepEqual(
    rootLanguageDecision({
      cookieHeader: null,
      acceptLanguage: 'en-US,en;q=0.9,vi-VN;q=0.8',
      userAgent: 'Mozilla/5.0',
      country: 'VN',
    }),
    { action: 'stay', reason: 'country-vn' }
  );
  assert.deepEqual(
    rootLanguageDecision({
      cookieHeader: 'nutree-locale=en',
      acceptLanguage: 'en-US',
      userAgent: 'Mozilla/5.0',
      country: 'vn',
    }),
    { action: 'redirect', reason: 'cookie-en' }
  );
  assert.deepEqual(
    rootLanguageDecision({
      cookieHeader: null,
      acceptLanguage: 'en-US',
      userAgent: 'Mozilla/5.0',
      country: 'US',
    }),
    { action: 'redirect', reason: 'accept-language' }
  );
  assert.deepEqual(
    rootLanguageDecision({
      cookieHeader: null,
      acceptLanguage: 'vi-VN',
      userAgent: 'Mozilla/5.0',
      country: 'US',
    }),
    { action: 'stay', reason: 'accept-language-vi' }
  );
});
