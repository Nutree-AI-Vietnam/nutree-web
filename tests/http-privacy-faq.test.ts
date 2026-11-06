import assert from 'node:assert/strict';
import { test } from 'node:test';
import { privacyContent } from '../src/lib/legal-content';
import { translations } from '../src/lib/translations';

const base = process.env.BASE_URL?.replace(/\/$/, '');
const http = { skip: base ? false : 'set BASE_URL to check rendered HTML' } as const;

function visibleHtml(html: string) {
  return decodeHtml(html.replace(/<script[\s\S]*?<\/script>/gi, ''));
}

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

function alternates(html: string, lang: string, path: string) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  return tags.some(
    (tag) =>
      tag.includes('rel="alternate"') &&
      (tag.includes(`hreflang="${lang}"`) || tag.includes(`hrefLang="${lang}"`)) &&
      tag.includes(`https://nutreeai.com${path}"`)
  );
}

async function get(path: string) {
  const response = await fetch(`${base}${path}`, { redirect: 'manual' });
  const html = await response.text();
  return { response, html, visible: visibleHtml(html) };
}

test('GET /en/privacy serves the existing English policy', http, async () => {
  const englishIntro = privacyContent.en.sections[0]?.body?.[0] ?? '';
  const vietnameseIntro = privacyContent.vi.sections[0]?.body?.[0] ?? '';
  const { response, html, visible } = await get('/en/privacy');

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-language'), 'en');
  assert.match(html, /<link[^>]*rel="canonical"[^>]*href="https:\/\/nutreeai.com\/en\/privacy"/);
  assert.equal(alternates(html, 'en', '/en/privacy'), true);
  assert.equal(alternates(html, 'vi', '/privacy'), true);
  assert.equal(alternates(html, 'x-default', '/privacy'), true);
  assert.match(html, /property="og:locale"[^>]*content="en_US"|content="en_US"[^>]*property="og:locale"/);
  assert.match(visible, /<header[^>]*lang="en"/);
  assert.match(visible, /<main[^>]*lang="en"/);
  assert.match(visible, /<footer[^>]*lang="en"/);
  assert.match(visible, /<h1[^>]*>Privacy Policy<\/h1>/);
  assert.match(visible, /href="\/en\/privacy"/);
  assert.ok(visible.includes(englishIntro));
  assert.equal(visible.includes(vietnameseIntro), false);
  assert.doesNotMatch(visible, /<title>[^<]*404/);
});

test('GET /privacy still serves the Vietnamese policy', http, async () => {
  const englishIntro = privacyContent.en.sections[0]?.body?.[0] ?? '';
  const vietnameseIntro = privacyContent.vi.sections[0]?.body?.[0] ?? '';
  const { response, html, visible } = await get('/privacy');

  assert.equal(response.status, 200);
  assert.match(html, /<link[^>]*rel="canonical"[^>]*href="https:\/\/nutreeai.com\/privacy"/);
  assert.equal(alternates(html, 'en', '/en/privacy'), true);
  assert.equal(alternates(html, 'vi', '/privacy'), true);
  assert.match(visible, /<header[^>]*lang="vi"/);
  assert.match(visible, /<main[^>]*lang="vi"/);
  assert.match(visible, /<footer[^>]*lang="vi"/);
  assert.match(visible, /<h1[^>]*>Chính sách bảo mật<\/h1>/);
  assert.ok(visible.includes(vietnameseIntro));
  assert.equal(visible.includes(englishIntro), false);
});

test('GET /faq includes every current answer in the document', http, async () => {
  const { response, visible } = await get('/faq');
  assert.equal(response.status, 200);
  assert.match(visible, /<main[^>]*lang="vi"/);

  const items = translations.vi.faq.sections.flatMap((section) => section.items);
  assert.ok(items.length > 0);
  for (const item of items) {
    assert.ok(visible.includes(item.question), item.question);
    assert.ok(visible.includes(item.answer), item.answer);
  }
  assert.equal(visible.match(/<details\b/g)?.length, items.length);
  assert.equal(visible.match(/<summary\b/g)?.length, items.length);
  assert.ok(visible.includes('Làm sao để xóa tài khoản?'));
  assert.ok(visible.includes('Vào Cài đặt → Quản lý tài khoản → Xóa tài khoản. Toàn bộ dữ liệu của bạn sẽ bị xóa vĩnh viễn.'));
});

test('GET /sitemap.xml lists both privacy URLs', http, async () => {
  const { response, html } = await get('/sitemap.xml');
  assert.equal(response.status, 200);
  assert.ok(html.includes('https://nutreeai.com/privacy'));
  assert.ok(html.includes('https://nutreeai.com/en/privacy'));
});
