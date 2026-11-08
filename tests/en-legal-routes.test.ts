import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LegalPageView } from '../src/components/legal/LegalPageView';
import { cancellationPolicyContent } from '../src/lib/cancellation-policy-content';
import { complaintsPolicyContent } from '../src/lib/complaints-policy-content';
import { paymentPolicyContent } from '../src/lib/payment-policy-content';
import { pricingPolicyContent } from '../src/lib/pricing-policy-content';
import { languageAlternatesFor, privacyAwareHref } from '../src/lib/privacy-path';
import { getRouteLocale } from '../src/lib/route-locale';
import { termsContent } from '../src/lib/terms-content';
import { usagePolicyContent } from '../src/lib/usage-policy-content';
import { translations } from '../src/lib/translations';

const englishPages = [
  ['/terms', termsContent.en, '/privacy', 'privacy'],
  ['/payment', paymentPolicyContent.en, '/terms', 'terms'],
  ['/cancellation', cancellationPolicyContent.en, '/terms', 'terms'],
  ['/pricing', pricingPolicyContent.en, '/privacy', 'privacy'],
  ['/usage', usagePolicyContent.en, '/terms', 'terms'],
  ['/complaints', complaintsPolicyContent.en, '/privacy', 'privacy'],
] as const;

test('English legal routes lock the locale and pair hreflang with the Vietnamese page', () => {
  for (const [viPath] of englishPages) {
    assert.equal(getRouteLocale(`/en${viPath}`), 'en');
    assert.equal(getRouteLocale(viPath), undefined);
    assert.deepEqual(languageAlternatesFor(viPath), {
      vi: viPath,
      en: `/en${viPath}`,
      'x-default': viPath,
    });
    assert.equal(privacyAwareHref(viPath, 'en'), `/en${viPath}`);
    assert.equal(privacyAwareHref(viPath, 'vi'), viPath);
  }
  assert.equal(getRouteLocale('/en/faq'), 'en');
  assert.equal(privacyAwareHref('/faq', 'en'), '/en/faq');
});

test('English legal views render the existing English copy on the server', () => {
  for (const [viPath, page, siblingHref, siblingKey] of englishPages) {
    const html = renderToStaticMarkup(
      createElement(LegalPageView, { page, locale: 'en', siblingHref, siblingKey })
    );
    assert.ok(html.includes(`<h1`));
    assert.ok(html.includes(page.title.replaceAll('&', '&amp;')), viPath);
    assert.ok(html.includes('lang="en"'), viPath);
    assert.ok(html.includes(`href="${privacyAwareHref(siblingHref, 'en')}"`), viPath);
    assert.equal(html.includes('<h1'), true);
  }
  assert.equal(translations.en.faq.pageTitle, 'Frequently Asked Questions');
});

const base = process.env.BASE_URL?.replace(/\/$/, '');
const http = { skip: base ? false : 'set BASE_URL to check rendered HTML' } as const;

function visibleHtml(html: string) {
  let rest = html;
  let visible = '';
  while (rest.length > 0) {
    const start = rest.indexOf('<script');
    if (start === -1) {
      visible += rest;
      break;
    }
    visible += rest.slice(0, start);
    const end = rest.indexOf('</script>', start);
    if (end === -1) break;
    rest = rest.slice(end + '</script>'.length);
  }
  return visible
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

function alternatePath(html: string, lang: string, path: string) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  return tags.some((tag) => {
    if (!tag.includes('rel="alternate"')) return false;
    if (!tag.includes(`hreflang="${lang}"`) && !tag.includes(`hrefLang="${lang}"`)) return false;
    const href = tag.match(/\bhref="([^"]+)"/);
    if (!href) return false;
    try {
      return new URL(href[1]).pathname === path;
    } catch {
      return false;
    }
  });
}

test('English policy and FAQ routes serve English HTML and keep Vietnamese routes', http, async () => {
  const paths = ['/terms', '/payment', '/cancellation', '/pricing', '/usage', '/complaints', '/faq'] as const;
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const path of paths) {
    const english = await fetch(`${base}/en${path}`, { headers: { 'Accept-Language': 'vi-VN' } });
    const html = await english.text();
    assert.equal(english.status, 200, path);
    assert.match(html, /<html[^>]*lang="en"/);
    const canonical = html.match(/<link[^>]*rel="canonical"[^>]*>/);
    assert.ok(canonical, path);
    assert.equal(new URL(canonical[0].match(/\bhref="([^"]+)"/)?.[1] ?? '').pathname, `/en${path}`);
    assert.equal(alternatePath(html, 'en', `/en${path}`), true, path);
    assert.equal(alternatePath(html, 'vi', path), true, path);
    assert.equal(alternatePath(html, 'x-default', path), true, path);
    const vietnameseResponse = await fetch(`${base}${path}`, { headers: { 'Accept-Language': 'en-US', Cookie: 'nutree-locale=vi' } });
    const vietnamese = await vietnameseResponse.text();
    assert.equal(vietnameseResponse.status, 200, path);
    assert.match(vietnamese, /<html[^>]*lang="vi"/);
    assert.equal(alternatePath(vietnamese, 'en', `/en${path}`), true, path);
    assert.equal(alternatePath(vietnamese, 'vi', path), true, path);
    assert.equal(alternatePath(vietnamese, 'x-default', path), true, path);
    assert.ok(sitemap.includes(`https://nutreeai.com${path}<`) || sitemap.includes(`https://nutreeai.com${path}</loc>`), path);
    assert.ok(sitemap.includes(`https://nutreeai.com/en${path}`), path);
  }
  const englishFaq = visibleHtml(await (await fetch(`${base}/en/faq`, { headers: { 'Accept-Language': 'vi-VN' } })).text());
  const englishDelete = translations.en.faq.sections.flatMap((section) => section.items).find((item) => item.question === 'How do I delete my account?');
  assert.ok(englishDelete);
  assert.ok(englishFaq.includes(englishDelete.question));
  assert.ok(englishFaq.includes(englishDelete.answer));
  assert.equal(englishFaq.includes('Làm sao để xóa tài khoản?'), false);
  const vietnameseFaq = visibleHtml(await (await fetch(`${base}/faq`)).text());
  assert.ok(vietnameseFaq.includes('Làm sao để xóa tài khoản?'));
  assert.equal(vietnameseFaq.includes('How do I delete my account?'), false);
  const unknown = await fetch(`${base}/en/not-a-real-policy`);
  assert.equal(unknown.status, 404);
});
