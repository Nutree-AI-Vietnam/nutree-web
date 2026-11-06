import assert from 'node:assert/strict';
import { test } from 'node:test';
import { preferredHomeLanguage, rootLanguageDecision } from '../src/lib/home-language';
import { readLocaleCookie } from '../src/lib/locale-preference';

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
