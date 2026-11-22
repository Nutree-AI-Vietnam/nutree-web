import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PremiumGrantForm } from '../src/components/admin/PremiumGrantForm';

process.env.NEXT_PUBLIC_MEALTRACK_ADMIN_USE_PROXY = 'true';

test('the grant client posts only the email to the admin proxy', async () => {
  const api = await import('../src/lib/premium-grant-admin-api');
  const calls: { url: string; method: string; body: string | undefined; authorization: string }[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
    const headers = init.headers as Record<string, string>;
    calls.push({
      url,
      method: init.method ?? 'GET',
      body: init.body as string | undefined,
      authorization: headers.Authorization,
    });
    return new Response(
      JSON.stringify({
        email: 'kol@example.com',
        firebase_uid: 'uid-1',
        firebase_user_created: true,
        already_entitled: false,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }) as typeof fetch;
  try {
    await api.grantPremiumByEmail('kol@example.com', 'id-token', 'prod');
  } finally {
    globalThis.fetch = realFetch;
  }

  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].url, '/api/mealtrack-admin/premium-grants');
  assert.equal(calls[0].authorization, 'Bearer id-token');
  assert.deepEqual(JSON.parse(calls[0].body ?? ''), { email: 'kol@example.com' });
});

test('lookup reads an email and revoke posts it', async () => {
  const api = await import('../src/lib/premium-grant-admin-api');
  const calls: { url: string; method: string; body: string | undefined }[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
    calls.push({ url, method: init.method ?? 'GET', body: init.body as string | undefined });
    return new Response(
      JSON.stringify({
        email: 'kol@example.com',
        account_exists: true,
        account_disabled: false,
        firebase_uid: 'uid-1',
        entitlement: 'entitled',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }) as typeof fetch;
  try {
    await api.lookupPremiumByEmail('kol@example.com', 'id-token', 'sit');
    await api.revokePremiumByEmail('kol@example.com', 'id-token', 'sit');
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url, '/api/mealtrack-admin/premium-grants?email=kol%40example.com');
  assert.equal(calls[1].method, 'POST');
  assert.equal(calls[1].url, '/api/mealtrack-admin/premium-grants/revoke');
  assert.deepEqual(JSON.parse(calls[1].body ?? ''), { email: 'kol@example.com' });
});

test('the form asks only for an email', () => {
  const html = renderToStaticMarkup(
    createElement(PremiumGrantForm, { isBusy: false, isDisabled: false, onGrant: async () => true })
  );
  assert.match(html, /type="email"/);
  assert.match(html, /Cấp Premium/);
  assert.match(html, /Chưa cần đăng nhập/);
});
