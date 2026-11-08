import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LegalPageView } from '../src/components/legal/LegalPageView';
import { ENGLISH_ENTRY_PRIVATE_CACHE, explicitEnglishEntrySetsPreference, rootLanguageDecision } from '../src/lib/home-language';
import { localizedPublicHref, sameSiteAppPath } from '../src/lib/privacy-path';
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
  assert.equal(sameSiteAppPath('https://nutreeai.com/payment?utm_source=tiktok#fee'), '/payment?utm_source=tiktok#fee');
  assert.equal(sameSiteAppPath('http://nutreeai.com/faq'), '/faq');
  assert.equal(sameSiteAppPath('https://nutreeai.com.evil/payment'), null);
  assert.equal(sameSiteAppPath('http://nutreeai.com.evil/payment'), null);
  assert.equal(sameSiteAppPath('https://evil.example/?next=https://nutreeai.com/payment'), null);
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

test('a lookalike host is not treated as an internal Nutree link', () => {
  const page = {
    ...usagePolicyContent.en,
    sections: [
      {
        title: 'Links',
        body: [
          'See [Pay](https://nutreeai.com/payment?utm_source=tiktok#fee) and [Bad](https://nutreeai.com.evil/payment).',
        ],
      },
    ],
  };
  const html = renderToStaticMarkup(
    createElement(LegalPageView, { page, locale: 'en', siblingHref: '/terms', siblingKey: 'terms' }),
  );
  assert.ok(html.includes('href="/en/payment?utm_source=tiktok#fee"'));
  assert.ok(html.includes('href="https://nutreeai.com.evil/payment"'));
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

function parsedHttpLinks(html: string): URL[] {
  const urls: URL[] = [];
  let from = 0;
  const marker = 'href="';
  while (from < html.length) {
    const start = html.indexOf(marker, from);
    if (start < 0) break;
    const end = html.indexOf('"', start + marker.length);
    if (end < 0) break;
    const value = html.slice(start + marker.length, end);
    from = end + 1;
    try {
      const url = new URL(value);
      if (url.protocol === 'http:' || url.protocol === 'https:') urls.push(url);
    } catch {
      // Relative and malformed hrefs are not absolute links.
    }
  }
  return urls;
}

function alternatePath(html: string, hreflang: string): string | null {
  let from = 0;
  while (from < html.length) {
    const start = html.indexOf('<link', from);
    if (start < 0) return null;
    const end = html.indexOf('>', start);
    if (end < 0) return null;
    const tag = html.slice(start, end);
    from = end + 1;
    if (!tag.includes(`hreflang="${hreflang}"`) && !tag.includes(`hrefLang="${hreflang}"`)) continue;
    const hrefAt = tag.indexOf('href="');
    if (hrefAt < 0) continue;
    const hrefEnd = tag.indexOf('"', hrefAt + 6);
    try {
      return new URL(tag.slice(hrefAt + 6, hrefEnd)).pathname;
    } catch {
      return null;
    }
  }
  return null;
}

const base = process.env.BASE_URL?.replace(/\/$/, '');
const http = { skip: base ? false : 'set BASE_URL to check rendered HTML' } as const;

test('shared page titles follow the saved language and keep their canonical path', http, async () => {
  async function titleFor(path: string, cookie?: string) {
    const response = await fetch(`${base}${path}`, {
      headers: { 'Accept-Language': 'vi-VN', ...(cookie ? { Cookie: cookie } : {}) },
    });
    const html = await response.text();
    const title = html.match(/<title>(.*?)<\/title>/)?.[1]?.replace(/&amp;/g, '&');
    const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
    const lang = html.match(/<html[^>]*lang="([^"]+)"/)?.[1];
    return { status: response.status, title, canonical, lang };
  }
  const researchEn = await titleFor('/research', 'nutree-locale=en');
  assert.equal(researchEn.status, 200);
  assert.equal(researchEn.lang, 'en');
  assert.match(researchEn.title ?? '', /Science & Sources/);
  assert.equal(researchEn.canonical, 'https://nutreeai.com/research');
  const researchVi = await titleFor('/research', 'nutree-locale=vi');
  assert.equal(researchVi.lang, 'vi');
  assert.match(researchVi.title ?? '', /Khoa học & nguồn/);
  assert.equal(researchVi.canonical, 'https://nutreeai.com/research');
  const whyEn = await titleFor('/why', 'nutree-locale=en');
  assert.match(whyEn.title ?? '', /Why Nutree Is the Best Solution/);
  assert.equal(whyEn.canonical, 'https://nutreeai.com/why');
  const contactEn = await titleFor('/contact', 'nutree-locale=en');
  assert.match(contactEn.title ?? '', /How can we help\?/);
  assert.equal(contactEn.canonical, 'https://nutreeai.com/contact');
  const englishHome = await titleFor('/en');
  assert.equal(englishHome.lang, 'en');
  assert.match(englishHome.title ?? '', /AI nutrition assistant/);
  assert.equal(englishHome.canonical, 'https://nutreeai.com/en');
  const englishHtml = await (await fetch(`${base}/en`, { headers: { 'Accept-Language': 'vi-VN' } })).text();
  assert.equal(alternatePath(englishHtml, 'en'), '/en');
  assert.equal(alternatePath(englishHtml, 'x-default'), '/en');
  const researchHtml = await (await fetch(`${base}/research`, { headers: { Cookie: 'nutree-locale=en' } })).text();
  assert.equal(
    parsedHttpLinks(researchHtml).some((url) => url.hostname === 'nutreeai.com' && url.pathname === '/en/research'),
    false,
  );
  const vietnameseHome = await titleFor('/', 'nutree-locale=vi');
  assert.equal(vietnameseHome.lang, 'vi');
  assert.match(vietnameseHome.title ?? '', /Trợ lý dinh dưỡng AI/);
  assert.equal(vietnameseHome.canonical, 'https://nutreeai.com');
});
