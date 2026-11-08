import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LegalPageView } from '../src/components/legal/LegalPageView';
import { ENGLISH_ENTRY_PRIVATE_CACHE, explicitEnglishEntrySetsPreference, rootLanguageDecision } from '../src/lib/home-language';
import { localizedPublicHref } from '../src/lib/privacy-path';
import { getNavHref } from '../src/lib/translations';
import { usagePolicyContent } from '../src/lib/usage-policy-content';

test('English internal links use existing English routes and keep the query and fragment', () => {
  assert.equal(localizedPublicHref('/payment?utm_source=tiktok&utm_campaign=en#renewal', 'en'), '/en/payment?utm_source=tiktok&utm_campaign=en#renewal');
  assert.equal(localizedPublicHref('/terms#section-1', 'en'), '/en/terms#section-1');
  assert.equal(localizedPublicHref('/en/terms?x=1', 'en'), '/en/terms?x=1');
  assert.equal(localizedPublicHref('/#how-it-works', 'en'), '/en#how-it-works');
  assert.equal(getNavHref('/#download', 'en'), '/en#download');
  assert.equal(getNavHref('/blog', 'en'), '/en/blog');
  assert.equal(localizedPublicHref('/blog', 'en'), '/en/blog');
  assert.equal(localizedPublicHref('/delete-account', 'en'), '/en/delete-account');
  assert.equal(localizedPublicHref('/why', 'en'), '/why');
  assert.equal(localizedPublicHref('/mua-goi', 'en'), '/mua-goi');
  assert.equal(localizedPublicHref('/api/tiktok-events', 'en'), '/api/tiktok-events');
  assert.equal(localizedPublicHref('/_next/static/chunk.js', 'en'), '/_next/static/chunk.js');
  assert.equal(localizedPublicHref('/images/logo.png', 'en'), '/images/logo.png');
  assert.equal(localizedPublicHref('mailto:nutreeaidev@gmail.com', 'en'), 'mailto:nutreeaidev@gmail.com');
  assert.equal(
    localizedPublicHref('https://quiz.nutreeai.com/survey/en?utm_source=tiktok', 'en'),
    'https://quiz.nutreeai.com/survey/en?utm_source=tiktok',
  );
  assert.equal(localizedPublicHref('https://www.paddle.com/legal/buyer-terms', 'en'), 'https://www.paddle.com/legal/buyer-terms');
  assert.equal(localizedPublicHref('/payment?utm_source=tiktok', 'vi'), '/payment?utm_source=tiktok');
  assert.equal(getNavHref('/#how-it-works', 'vi'), '/#how-it-works');
});

test('explicit English documents set the preference and crawlers do not', () => {
  assert.equal(explicitEnglishEntrySetsPreference('/en/terms', 'Mozilla/5.0'), true);
  assert.equal(explicitEnglishEntrySetsPreference('/en', 'Mozilla/5.0'), true);
  assert.equal(explicitEnglishEntrySetsPreference('/terms', 'Mozilla/5.0'), false);
  assert.equal(explicitEnglishEntrySetsPreference('/en/privacy', 'Googlebot'), false);
  assert.equal(
    explicitEnglishEntrySetsPreference('/en/terms', 'Mozilla/5.0', { get: (name) => (name === 'next-router-prefetch' ? '1' : null) }),
    false,
  );
  assert.equal(
    explicitEnglishEntrySetsPreference('/en/terms', 'Mozilla/5.0', { get: (name) => (name === 'purpose' ? 'prefetch' : null) }),
    false,
  );
  assert.equal(
    explicitEnglishEntrySetsPreference('/en/terms', 'Mozilla/5.0', { get: (name) => (name === 'sec-fetch-dest' ? 'empty' : null) }),
    false,
  );
  assert.equal(
    explicitEnglishEntrySetsPreference('/en/terms', 'Mozilla/5.0', {
      get: (name) => (name === 'sec-fetch-dest' ? 'empty' : name === 'sec-fetch-user' ? '?1' : null),
    }),
    true,
  );
  assert.equal(localizedPublicHref('https://nutreeai.com/payment?utm_source=tiktok#fee', 'en'), 'https://nutreeai.com/en/payment?utm_source=tiktok#fee');
  assert.deepEqual(
    rootLanguageDecision({ cookieHeader: 'nutree-locale=en', acceptLanguage: 'vi-VN', userAgent: 'Mozilla/5.0' }),
    { action: 'redirect', reason: 'cookie-en' },
  );
  assert.deepEqual(
    rootLanguageDecision({ cookieHeader: 'nutree-locale=vi', acceptLanguage: 'en-US', userAgent: 'Mozilla/5.0' }),
    { action: 'stay', reason: 'cookie-vi' },
  );
  assert.equal(ENGLISH_ENTRY_PRIVATE_CACHE['cache-control'], 'private, no-store');
  assert.equal(ENGLISH_ENTRY_PRIVATE_CACHE.vary, 'Cookie');
});

test('English policy body links localize and Vietnamese body links do not', () => {
  const english = renderToStaticMarkup(
    createElement(LegalPageView, {
      page: usagePolicyContent.en,
      locale: 'en',
      siblingHref: '/terms',
      siblingKey: 'terms',
    }),
  );
  assert.ok(english.includes('href="/en/payment"'));
  assert.equal(english.includes('href="/payment"'), false);
  const vietnamese = renderToStaticMarkup(
    createElement(LegalPageView, {
      page: usagePolicyContent.vi,
      locale: 'vi',
      siblingHref: '/terms',
      siblingKey: 'terms',
    }),
  );
  assert.ok(vietnamese.includes('href="/payment"'));
  assert.equal(vietnamese.includes('href="/en/payment"'), false);
});
