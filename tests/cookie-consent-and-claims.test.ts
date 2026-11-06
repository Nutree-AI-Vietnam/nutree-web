import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import {
  consentCookie,
  consentValue,
  parseCookieConsent,
  readConsentCookie,
  resolveStoredConsent,
  tikTokDispatch,
  tiktokEventsAllowed,
} from '../src/lib/cookie-consent';
import { deleteAccountContent } from '../src/lib/delete-account-content';
import { translations } from '../src/lib/translations';

const base = process.env.BASE_URL?.replace(/\/$/, '');
const http = { skip: base ? false : 'set BASE_URL to check rendered HTML' } as const;

function stripScripts(html: string) {
  let output = '';
  let cursor = 0;
  const closer = '</script>';
  while (cursor < html.length) {
    const start = html.indexOf('<script', cursor);
    if (start < 0) {
      output += html.slice(cursor);
      break;
    }
    output += html.slice(cursor, start);
    const end = html.indexOf(closer, start);
    if (end < 0) break;
    cursor = end + closer.length;
  }
  return output;
}

test('optional TikTok consent defaults to deny and ignores an old accept', () => {
  assert.equal(parseCookieConsent(null), null);
  assert.equal(parseCookieConsent(''), null);
  assert.equal(parseCookieConsent('0.accepted'), null);
  assert.equal(parseCookieConsent('accepted'), null);
  assert.equal(parseCookieConsent(consentValue('accepted')), 'accepted');
  assert.equal(parseCookieConsent(consentValue('denied')), 'denied');
  assert.equal(readConsentCookie('nutree-locale=en; nutree-cookie-consent=0.accepted'), null);
  assert.equal(readConsentCookie(`nutree-cookie-consent=${consentValue('denied')}`), 'denied');
  assert.equal(resolveStoredConsent(null, consentValue('accepted')), 'accepted');
  assert.equal(
    resolveStoredConsent(`nutree-cookie-consent=${consentValue('denied')}`, consentValue('accepted')),
    'denied'
  );
  assert.equal(tiktokEventsAllowed(null), false);
  assert.equal(tiktokEventsAllowed(`nutree-cookie-consent=${consentValue('denied')}`), false);
  assert.equal(tiktokEventsAllowed('nutree-cookie-consent=0.accepted'), false);
  assert.equal(tiktokEventsAllowed(`nutree-cookie-consent=${consentValue('accepted')}`), true);
  assert.equal(tikTokDispatch(null, true), 'drop');
  assert.equal(tikTokDispatch('denied', true), 'drop');
  assert.equal(tikTokDispatch('accepted', false), 'drop');
  assert.equal(tikTokDispatch('accepted', true), 'send');
  assert.equal(consentCookie('accepted').includes('Secure'), false);
  assert.match(consentCookie('accepted', true), /Secure/);
});

test('the first HTML does not install or queue the TikTok pixel', () => {
  for (const relativePath of ['../src/app/(en)/layout.tsx', '../src/app/(vi)/layout.tsx']) {
    const layout = fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8');
    assert.equal(layout.includes('TIKTOK_PIXEL_SCRIPT'), false);
    assert.equal(layout.includes('beforeInteractive'), false);
  }
  assert.equal(fs.existsSync(new URL('../src/app/layout.tsx', import.meta.url)), false);
  const root = fs.readFileSync(new URL('../src/components/layout/RootDocument.tsx', import.meta.url), 'utf8');
  assert.ok(root.includes('CookieConsent'));
  const loader = fs.readFileSync(new URL('../src/lib/tiktok-pixel.ts', import.meta.url), 'utf8');
  const holdAt = loader.indexOf('holdConsent');
  const loadAt = loader.indexOf('ttq.load');
  const pageAt = loader.lastIndexOf('page?.()');
  assert.ok(holdAt > 0 && loadAt > holdAt);
  assert.ok(pageAt > loadAt);
  assert.equal(loader.includes('TIKTOK_PIXEL_SCRIPT'), false);
});

test('unsupported ranking and accuracy claims are gone, and weight notes stay unverified', () => {
  const blob = JSON.stringify(translations);
  assert.equal(blob.includes('#1'), false);
  assert.equal(blob.includes('95%'), false);
  assert.equal(blob.includes('3000+'), false);
  for (const locale of ['en', 'vi'] as const) {
    const note = translations[locale].testimonials.disclaimer;
    assert.match(note, /estimate|ước tính/i);
    assert.match(note, /not medical advice|không phải tư vấn y khoa/);
    assert.match(note, /does not verify|không chứng minh/);
    const answers = translations[locale].faq.sections.flatMap((section) => section.items.map((item) => item.answer));
    assert.equal(answers.some((answer) => answer.includes('permanently removed')), false);
    assert.equal(answers.some((answer) => answer.includes('xóa vĩnh viễn')), false);
    assert.ok(answers.some((answer) => answer.includes('nutreeai.com/delete-account')));
  }
});

test('account deletion guidance does not pretend to erase the account', () => {
  const blob = JSON.stringify(deleteAccountContent);
  assert.match(deleteAccountContent.limitation, /does not send a deletion request/);
  assert.match(deleteAccountContent.limitation, /does not meet a store rule/);
  assert.match(blob, /does not cancel a subscription/);
  assert.match(blob, /không hủy gói/);
  assert.equal(blob.includes('/api/delete'), false);
  assert.equal(blob.includes('within 30'), false);
  assert.equal(deleteAccountContent.supportEmail, 'support@nutreeai.com');
  assert.equal(deleteAccountContent.messengerUrl, 'https://m.me/1019820571221637');
});

function resourceHosts(html: string): string[] {
  const hosts: string[] = [];
  for (const marker of ['src="', 'href="']) {
    let cursor = 0;
    while (cursor < html.length) {
      const start = html.indexOf(marker, cursor);
      if (start < 0) break;
      const valueStart = start + marker.length;
      const valueEnd = html.indexOf('"', valueStart);
      if (valueEnd < 0) break;
      try {
        hosts.push(new URL(html.slice(valueStart, valueEnd), 'https://nutreeai.com').hostname);
      } catch {
        // Ignore values that are not URLs.
      }
      cursor = valueEnd + 1;
    }
  }
  return hosts;
}

function hostAbsent(hosts: string[], hostname: string) {
  return hosts.every((host) => host !== hostname);
}

test('raw HTML leaves TikTok unloaded and publishes deletion guidance', http, async () => {
  for (const path of ['/', '/en']) {
    const page = await fetch(`${base}${path}`);
    const html = stripScripts(await page.text());
    const hosts = resourceHosts(html);
    assert.equal(page.status, 200);
    assert.equal(hostAbsent(hosts, 'analytics.tiktok.com'), true);
    assert.equal(hostAbsent(hosts, 'www.googletagmanager.com'), true);
    assert.equal(html.includes('#1 Health'), false);
    assert.equal(html.includes('#1 Sức khỏe'), false);
    assert.equal(html.includes('95%'), false);
  }

  for (const path of ['/delete-account', '/en/delete-account']) {
    const deletion = await fetch(`${base}${path}`);
    const deletionHtml = stripScripts(await deletion.text());
    assert.equal(deletion.status, 200);
    assert.ok(deletionHtml.includes(deleteAccountContent.limitation));
    assert.ok(deletionHtml.includes('Trong ứng dụng Nutree'));
    assert.ok(deletionHtml.includes('does not cancel a subscription'));
  }

  const denied = await fetch(`${base}/api/tiktok-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'ViewContent', eventId: 'test', url: 'https://nutreeai.com/' }),
  });
  assert.equal(denied.status, 403);
});
