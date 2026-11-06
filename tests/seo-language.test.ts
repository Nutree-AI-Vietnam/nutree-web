import assert from 'node:assert/strict';
import { test } from 'node:test';
import { quizEntryUrl } from '../src/lib/constants';
import { applyQuizAttribution } from '../src/lib/quiz-attribution';
import { SITE_DESCRIPTION_EN, SITE_TITLE, SITE_TITLE_EN } from '../src/lib/seo';

const base = process.env.BASE_URL?.replace(/\/$/, '');
const http = { skip: base ? false : 'set BASE_URL to check rendered HTML' } as const;

function withoutScripts(html: string) {
  let output = '';
  let cursor = 0;
  const lower = html.toLowerCase();
  while (cursor < html.length) {
    const open = lower.indexOf('<script', cursor);
    if (open === -1) {
      output += html.slice(cursor);
      break;
    }
    output += html.slice(cursor, open);
    const end = lower.indexOf('</script>', open);
    if (end === -1) break;
    cursor = end + '</script>'.length;
  }
  return output;
}

async function load(path: string, headers?: Record<string, string>) {
  const response = await fetch(`${base}${path}`, { headers, redirect: 'manual' });
  const html = await response.text();
  return { response, html, visible: withoutScripts(html) };
}

function hasAlternate(html: string, lang: string, path: string) {
  const href = path === '/' ? 'https://nutreeai.com' : `https://nutreeai.com${path}`;
  return (html.match(/<link\b[^>]*>/gi) ?? []).some((tag) => {
    const normalized = tag.toLowerCase();
    const hrefMatch = tag.includes(`href="${href}"`) || tag.includes(`href="${href}/"`);
    return normalized.includes('rel="alternate"') && normalized.includes(`hreflang="${lang}"`) && hrefMatch;
  });
}

test('raw HTML language for /, /en, /privacy, and /en/privacy', http, async () => {
  const home = await load('/');
  assert.equal(home.response.status, 200);
  assert.match(home.html, /<html[^>]*lang="vi"/);
  assert.match(home.html, /<title>Nutree \| Trợ lý dinh dưỡng AI, đếm calo &amp; track macro<\/title>/);
  assert.match(home.visible, /Tạo kế hoạch cho tôi/);
  assert.equal(home.visible.includes('Build my plan'), false);
  assert.equal(hasAlternate(home.html, 'en', '/en'), true);
  assert.equal(hasAlternate(home.html, 'vi', '/'), true);
  assert.equal(hasAlternate(home.html, 'x-default', '/en'), true);
  assert.match(home.html, /rel="canonical"[^>]*href="https:\/\/nutreeai.com\/?"/);

  const english = await load('/en', { 'Accept-Language': 'vi-VN' });
  assert.equal(english.response.status, 200);
  assert.match(english.html, /<html[^>]*lang="en"/);
  assert.ok(english.html.includes('<title>Nutree | AI nutrition assistant, calorie counter &amp; macro tracker</title>'));
  assert.ok(english.html.includes(`content="${SITE_DESCRIPTION_EN}"`));
  assert.ok(english.html.includes('property="og:title" content="Nutree | AI nutrition assistant, calorie counter &amp; macro tracker"'));
  assert.ok(english.html.includes('property="og:description"'));
  assert.match(english.visible, /Build my plan/);
  assert.match(english.html, /href="https:\/\/quiz\.nutreeai\.com\/survey\/en"/);
  assert.match(english.html, /href="\/en"/);
  assert.equal(home.html.includes('https://quiz.nutreeai.com/survey/en'), false);
  assert.match(home.html, /href="https:\/\/quiz\.nutreeai\.com"/);
  assert.equal(english.visible.includes('Tạo kế hoạch cho tôi'), false);
  assert.equal(hasAlternate(english.html, 'vi', '/'), true);
  assert.equal(hasAlternate(english.html, 'x-default', '/en'), true);
  assert.match(english.html, /rel="canonical"[^>]*href="https:\/\/nutreeai.com\/en"/);

  const privacy = await load('/privacy');
  assert.equal(privacy.response.status, 200);
  assert.match(privacy.html, /<html[^>]*lang="vi"/);
  assert.match(privacy.visible, /<h1[^>]*>Chính sách bảo mật<\/h1>/);

  const englishPrivacy = await load('/en/privacy');
  assert.equal(englishPrivacy.response.status, 200);
  assert.match(englishPrivacy.html, /<html[^>]*lang="en"/);
  assert.match(englishPrivacy.html, /<title>Privacy Policy \| Nutree<\/title>/);
  assert.match(englishPrivacy.visible, /<h1[^>]*>Privacy Policy<\/h1>/);
  assert.match(englishPrivacy.html, /rel="canonical"[^>]*href="https:\/\/nutreeai.com\/en\/privacy"/);
});

test('root negotiation, crawlers, cookies, and purchase HTML', http, async () => {
  const vi = await load('/', { 'Accept-Language': 'vi-VN,en-US;q=0.8' });
  assert.equal(vi.response.status, 200);

  const en = await load('/', { 'Accept-Language': 'en-US,vi;q=0.5' });
  assert.equal(en.response.status, 302);
  assert.match(en.response.headers.get('location') ?? '', /\/en$/);
  assert.match(en.response.headers.get('cache-control') ?? '', /private/);
  assert.match(en.response.headers.get('cache-control') ?? '', /no-store/);
  assert.match(en.response.headers.get('vary') ?? '', /Accept-Language/);
  assert.match(en.response.headers.get('vary') ?? '', /Cookie/);

  const weighted = await load('/', { 'Accept-Language': 'fr-FR;q=0.9, vi-VN;q=0.8' });
  assert.equal(weighted.response.status, 302);

  const missing = await load('/');
  assert.equal(missing.response.status, 200);

  const cookieWins = await load('/', {
    'Accept-Language': 'en-US',
    Cookie: 'nutree-locale=vi',
  });
  assert.equal(cookieWins.response.status, 200);

  const englishCookie = await load('/', {
    'Accept-Language': 'vi-VN',
    Cookie: 'nutree-locale=en',
  });
  assert.equal(englishCookie.response.status, 302);

  const invalidCookie = await load('/', {
    'Accept-Language': 'vi-VN',
    Cookie: 'nutree-locale=fr',
  });
  assert.equal(invalidCookie.response.status, 200);

  const bot = await load('/', {
    'Accept-Language': 'en-US',
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  });
  assert.equal(bot.response.status, 200);
  assert.match(bot.html, /<html[^>]*lang="vi"/);

  const directEnglish = await load('/en', { 'Accept-Language': 'en-US' });
  assert.equal(directEnglish.response.status, 200);

  const withQuery = await load('/?utm_source=test', { 'Accept-Language': 'en-US' });
  assert.equal(withQuery.response.status, 302);
  assert.match(withQuery.response.headers.get('location') ?? '', /\/en\?utm_source=test$/);

  const purchase = await load('/mua-goi');
  assert.match(purchase.visible, /Thanh toán qua VietQR/);
  assert.match(purchase.visible, /mã VietQR/);

  const englishPurchase = await load('/mua-goi', { Cookie: 'nutree-locale=en' });
  assert.equal(englishPurchase.visible.includes('mbbank-vietqr.png'), false);
  assert.equal(englishPurchase.visible.includes('Thanh toán qua VietQR'), false);
  assert.equal(englishPurchase.visible.includes('Pay with VietQR'), false);
  assert.match(englishPurchase.html, /href="https:\/\/quiz\.nutreeai\.com\/survey\/en"/);
  assert.match(englishPurchase.html, /href="https:\/\/apps\.apple\.com\/app\/id6751159552"/);
  assert.match(englishPurchase.html, /<title>Purchase \| Nutree<\/title>/);
  assert.equal(englishPurchase.html.includes('thanh toán bằng mã QR'), false);
  assert.match(englishPurchase.visible, /Download Nutree on the App Store/);
  assert.equal(purchase.html.includes('https://quiz.nutreeai.com/survey/en'), false);
  assert.match(englishPurchase.visible, /Get Nutree on Google Play/);

  const unknown = await load('/not-a-real-page-xyz');
  assert.equal(unknown.response.status, 404);
  const unknownEnglish = await load('/en/not-a-real-page-xyz');
  assert.equal(unknownEnglish.response.status, 404);

  const sitemap = await load('/sitemap.xml');
  assert.match(sitemap.html, /https:\/\/nutreeai\.com\/en</);
  assert.match(sitemap.html, /https:\/\/nutreeai\.com\/en\/privacy/);
  assert.match(sitemap.html, /hreflang="x-default"[^>]*href="https:\/\/nutreeai\.com\/en"/);
});

test('titles used above are the shipped constants', () => {
  assert.equal(SITE_TITLE.includes('Trợ lý dinh dưỡng AI'), true);
  assert.equal(SITE_DESCRIPTION_EN.startsWith('Not another calorie counter'), true);
  assert.equal(SITE_TITLE_EN.includes('95%'), false);
  assert.equal(quizEntryUrl('vi'), 'https://quiz.nutreeai.com');
  assert.equal(quizEntryUrl('en'), 'https://quiz.nutreeai.com/survey/en');
  const tagged = new URL(applyQuizAttribution(quizEntryUrl('en'), {
    utm_source: 'tiktok',
    utm_campaign: 'en-home',
    gclid: 'abc',
  }));
  assert.equal(tagged.origin + tagged.pathname, 'https://quiz.nutreeai.com/survey/en');
  assert.equal(tagged.searchParams.get('utm_source'), 'tiktok');
  assert.equal(tagged.searchParams.get('utm_campaign'), 'en-home');
  assert.equal(tagged.searchParams.get('gclid'), 'abc');
  const kept = applyQuizAttribution('https://quiz.nutreeai.com/survey/en?utm_source=existing', {
    utm_source: 'replaced',
  });
  assert.equal(kept, 'https://quiz.nutreeai.com/survey/en?utm_source=existing');
});
