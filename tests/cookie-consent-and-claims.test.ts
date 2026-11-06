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
  const layout = fs.readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');
  assert.equal(layout.includes('analytics.tiktok.com'), false);
  assert.equal(layout.includes('ttq.load'), false);
  assert.equal(layout.includes('ttq.page'), false);
  assert.equal(layout.includes('beforeInteractive'), false);
  const loader = fs.readFileSync(new URL('../src/lib/tiktok-pixel.ts', import.meta.url), 'utf8');
  const holdAt = loader.indexOf('holdConsent');
  const loadAt = loader.indexOf('ttq.load');
  const pageAt = loader.lastIndexOf('page?.()');
  assert.ok(holdAt > 0 && loadAt > holdAt);
  assert.ok(pageAt > loadAt);
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

test('raw HTML leaves TikTok unloaded and publishes deletion guidance', http, async () => {
  const home = await fetch(`${base}/`);
  const homeHtml = stripScripts(await home.text());
  assert.equal(home.status, 200);
  assert.equal(homeHtml.includes('analytics.tiktok.com'), false);
  assert.equal(homeHtml.includes('ttq.load'), false);
  assert.equal(homeHtml.includes('ttq.page'), false);
  assert.equal(homeHtml.includes('#1 Health'), false);
  assert.equal(homeHtml.includes('95%'), false);

  const deletion = await fetch(`${base}/delete-account`);
  const deletionHtml = stripScripts(await deletion.text());
  assert.equal(deletion.status, 200);
  assert.ok(deletionHtml.includes(deleteAccountContent.limitation));
  assert.ok(deletionHtml.includes('Trong ứng dụng Nutree'));
  assert.ok(deletionHtml.includes('does not cancel a subscription'));
});
