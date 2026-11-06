import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { metadata as englishPrivacyMetadata } from '../src/app/en/privacy/page';
import { metadata as vietnamesePrivacyMetadata } from '../src/app/privacy/page';
import { FaqAccordion } from '../src/components/sections/FaqAccordion';
import { privacyContent } from '../src/lib/legal-content';
import { PRIVACY_LANGUAGE_ALTERNATES, PRIVACY_PATH, privacyPath } from '../src/lib/privacy-path';
import { getRouteLocale } from '../src/lib/route-locale';
import { translations, type Locale } from '../src/lib/translations';

const englishIntro = privacyContent.en.sections[0]?.body?.[0] ?? '';
const vietnameseIntro = privacyContent.vi.sections[0]?.body?.[0] ?? '';

function faqItems(locale: Locale) {
  return translations[locale].faq.sections.flatMap((section) => section.items);
}

function renderFaq(locale: Locale) {
  return renderToStaticMarkup(
    createElement(FaqAccordion, { sections: translations[locale].faq.sections })
  );
}

/** React escapes quotes in static markup; compare the text a reader gets. */
function decodeHtml(html: string) {
  return html
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

test('privacy URLs stay paired without a second policy document', () => {
  assert.equal(privacyPath('vi'), '/privacy');
  assert.equal(privacyPath('en'), '/en/privacy');
  assert.equal(PRIVACY_LANGUAGE_ALTERNATES.vi, PRIVACY_PATH.vi);
  assert.equal(PRIVACY_LANGUAGE_ALTERNATES.en, PRIVACY_PATH.en);
  assert.equal(PRIVACY_LANGUAGE_ALTERNATES['x-default'], PRIVACY_PATH.vi);
  assert.equal(englishPrivacyMetadata.title, `${privacyContent.en.title} | Nutree`);
  assert.equal(englishPrivacyMetadata.description, privacyContent.en.description);
  assert.equal(englishPrivacyMetadata.alternates?.canonical, PRIVACY_PATH.en);
  assert.deepEqual(englishPrivacyMetadata.alternates?.languages, PRIVACY_LANGUAGE_ALTERNATES);
  assert.equal(vietnamesePrivacyMetadata.title, 'Chính sách bảo mật | Nutree');
  assert.equal(
    vietnamesePrivacyMetadata.description,
    'Chính sách bảo mật của Nutree - cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu.'
  );
  assert.equal(vietnamesePrivacyMetadata.alternates?.canonical, PRIVACY_PATH.vi);
  assert.deepEqual(vietnamesePrivacyMetadata.alternates?.languages, PRIVACY_LANGUAGE_ALTERNATES);
  assert.ok(englishIntro.startsWith('This Policy explains how'));
  assert.ok(vietnameseIntro.startsWith('Chính sách này giải thích'));
});

test('route locale locks only URL-backed pages', () => {
  assert.equal(getRouteLocale('/en/privacy'), 'en');
  assert.equal(getRouteLocale('/en/privacy/'), 'en');
  assert.equal(getRouteLocale('/en/blog'), 'en');
  assert.equal(getRouteLocale('/en/blog/some-post'), 'en');
  assert.equal(getRouteLocale('/blog'), 'vi');
  assert.equal(getRouteLocale('/blog/some-post'), 'vi');
  assert.equal(getRouteLocale('/privacy'), undefined);
  assert.equal(getRouteLocale('/en/privacy-policy'), undefined);
  assert.equal(getRouteLocale('/en/terms'), undefined);
  assert.equal(getRouteLocale('/'), undefined);
  assert.equal(getRouteLocale(null), undefined);
});

test('FAQ answers are in the initial markup and the control stays a disclosure', () => {
  for (const locale of ['vi', 'en'] as const) {
    const html = renderFaq(locale);
    const items = faqItems(locale);
    const details = html.split('<details').slice(1);
    assert.equal(details.length, items.length);
    assert.equal(html.match(/<summary/g)?.length, items.length);

    for (const [index, item] of items.entries()) {
      const chunk = decodeHtml(details[index] ?? '');
      assert.match(chunk, /name="nutree-faq"/);
      assert.ok(chunk.includes(item.question));
      assert.ok(chunk.includes(item.answer));
      assert.match(chunk, /<summary[\s\S]*<\/summary>[\s\S]*<p[\s\S]*<\/p>/);
    }
  }

  const vietnamese = renderFaq('vi');
  assert.ok(vietnamese.includes('Làm sao để xóa tài khoản?'));
  assert.ok(
    vietnamese.includes(
      'Vào Cài đặt → Quản lý tài khoản → Xóa tài khoản. Toàn bộ dữ liệu của bạn sẽ bị xóa vĩnh viễn.'
    )
  );
  assert.match(vietnamese, /aria-hidden="true"/);
});
