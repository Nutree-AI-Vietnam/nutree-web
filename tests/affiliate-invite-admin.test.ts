import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AffiliateInviteLink } from '../src/components/admin/AffiliateInviteLink';
import { AffiliateInviteTable } from '../src/components/admin/AffiliateInviteTable';
import type { AffiliateInvite } from '../src/types/affiliate-invite-admin';

// The admin client reads this when it loads, so set it before importing it.
process.env.NEXT_PUBLIC_MEALTRACK_ADMIN_USE_PROXY = 'true';

interface Call {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | undefined;
}

async function captureFetch(respond: unknown, run: () => Promise<unknown>): Promise<Call[]> {
  const calls: Call[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
    calls.push({
      url,
      method: init.method ?? 'GET',
      headers: init.headers as Record<string, string>,
      body: init.body as string | undefined,
    });
    return new Response(JSON.stringify(respond), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }) as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = realFetch;
  }
  return calls;
}

function invite(fields: Partial<AffiliateInvite> = {}): AffiliateInvite {
  return {
    id: 'invite-1',
    label: 'Lan',
    commission_percent: 30,
    created_at: '2026-11-11T09:00:00Z',
    expires_at: null,
    revoked_at: null,
    claimed_by_user_id: null,
    claimed_by_email: null,
    claimed_at: null,
    status: 'open',
    ...fields,
  };
}

test('the invite client calls the admin proxy with the signed-in token and target', async () => {
  const api = await import('../src/lib/affiliate-invite-admin-api');

  const calls = await captureFetch({ items: [], total: 0, limit: 50, offset: 0 }, async () => {
    await api.fetchAffiliateInvites({ limit: 50, offset: 100 }, 'id-token', 'prod');
    await api.createAffiliateInvite({ label: 'Lan', commission_percent: 30, expires_days: 14 }, 'id-token', 'prod');
    await api.revokeAffiliateInvite('invite/1', 'id-token', 'prod');
  });

  assert.deepEqual(
    calls.map(({ method, url }) => `${method} ${url}`),
    [
      'GET /api/mealtrack-admin/affiliate-invites?limit=50&offset=100',
      'POST /api/mealtrack-admin/affiliate-invites',
      'POST /api/mealtrack-admin/affiliate-invites/invite%2F1/revoke',
    ]
  );
  for (const call of calls) {
    assert.equal(call.headers.Authorization, 'Bearer id-token');
    assert.equal(call.headers['X-MealTrack-Environment'], 'prod');
  }
  assert.deepEqual(JSON.parse(calls[1].body ?? ''), { label: 'Lan', commission_percent: 30, expires_days: 14 });
  assert.equal(calls[2].body, undefined);
});

test('the table shows each state and offers revoke only until revoked', () => {
  const html = renderToStaticMarkup(
    createElement(AffiliateInviteTable, {
      items: [
        invite(),
        invite({
          id: 'invite-2',
          label: 'Minh',
          status: 'claimed',
          claimed_by_user_id: 'user-2',
          claimed_by_email: 'minh@example.com',
          claimed_at: '2026-11-11T10:00:00Z',
        }),
        invite({ id: 'invite-3', label: 'Hoa', status: 'revoked', revoked_at: '2026-11-11T11:00:00Z' }),
      ],
      busyIds: new Set(['invite-2']),
      onRevoke: () => undefined,
    })
  );

  assert.match(html, /Open/);
  assert.match(html, /Claimed/);
  assert.match(html, /minh@example\.com/);
  assert.match(html, /Revoked/);
  assert.match(html, /Never/);
  assert.equal((html.match(/>Revoke</g) ?? []).length, 1);
  assert.equal((html.match(/>Revoking\.\.\.</g) ?? []).length, 1);
});

test('the new link is shown once with a copy button', () => {
  const link = 'https://quiz.nutreeai.com/affiliate?invite=abc123';
  const html = renderToStaticMarkup(
    createElement(AffiliateInviteLink, { label: 'Lan', link, onDone: () => undefined })
  );

  assert.match(html, /Invite link for Lan/);
  assert.match(html, /value="https:\/\/quiz\.nutreeai\.com\/affiliate\?invite=abc123"/);
  assert.match(html, /Copy link/);
  assert.match(html, /shown only once/);
});
