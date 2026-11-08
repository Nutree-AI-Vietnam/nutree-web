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

test('English policy and FAQ routes serve English HTML and keep Vietnamese routes', http, async () => {
  const paths = ['/terms', '/payment', '/cancellation', '/pricing', '/usage', '/complaints', '/faq'] as const;
  for (const path of paths) {
    const english = await fetch(`${base}/en${path}`, { headers: { 'Accept-Language': 'vi-VN' } });
    const html = await english.text();
    assert.equal(english.status, 200, path);
    assert.match(html, /<html[^>]*lang="en"/);
    assert.match(html, new RegExp(`rel="canonical"[^>]*href="https://nutreeai.com/en${path}"`));
    assert.match(html, new RegExp(`hrefLang="en"[^>]*href="https://nutreeai.com/en${path}"|hreflang="en"[^>]*href="https://nutreeai.com/en${path}"`));
    const vietnamese = await fetch(`${base}${path}`, { headers: { 'Accept-Language': 'en-US', Cookie: 'nutree-locale=vi' } });
    assert.equal(vietnamese.status, 200, path);
  }
  const unknown = await fetch(`${base}/en/not-a-real-policy`);
  assert.equal(unknown.status, 404);
});
