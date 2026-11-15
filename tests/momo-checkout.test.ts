import assert from 'node:assert/strict';
import { test } from 'node:test';
import { momoCreateRaw, momoSignature } from '../src/lib/payments/momo-direct';
import {
  isMomoAmount,
  isMomoEnabled,
  isMomoPayUrl,
  isSameOriginMutation,
  MOMO_PLAN,
  MOMO_YEARLY_WEEKS,
  momoCheckoutBody,
  momoOrderIdFrom,
  momoOrderStatusForResult,
  normalizeCheckoutEmail,
  readMomoOrderStatus,
  readStartedCheckout,
} from '../src/lib/payments/momo';

const ORDER_ID = 'a'.repeat(32);

test('MoMo stays off unless the flag is exactly true', () => {
  const previous = process.env.NEXT_PUBLIC_MOMO_ENABLED;
  process.env.NEXT_PUBLIC_MOMO_ENABLED = 'false';
  assert.equal(isMomoEnabled(), false);
  process.env.NEXT_PUBLIC_MOMO_ENABLED = 'TRUE';
  assert.equal(isMomoEnabled(), false);
  process.env.NEXT_PUBLIC_MOMO_ENABLED = 'true';
  assert.equal(isMomoEnabled(), true);
  if (previous === undefined) delete process.env.NEXT_PUBLIC_MOMO_ENABLED;
  else process.env.NEXT_PUBLIC_MOMO_ENABLED = previous;
});

test('a checkout names the yearly plan and never sends an amount or an email', () => {
  assert.deepEqual(momoCheckoutBody('wallet', 'vi'), {
    plan: MOMO_PLAN,
    method: 'wallet',
    lang: 'vi',
  });
  const body = momoCheckoutBody('atm', 'en');
  assert.equal('amount' in body, false);
  assert.equal('email' in body, false);
  assert.equal(MOMO_YEARLY_WEEKS, 52);
});

test('pay URLs stay on MoMo and order ids stay 32 hex characters', () => {
  assert.equal(isMomoPayUrl('https://payment.momo.vn/pay'), true);
  assert.equal(isMomoPayUrl('https://momo.vn/pay'), true);
  assert.equal(isMomoPayUrl('https://evil.momo.vn.example/pay'), false);
  assert.equal(isMomoPayUrl('http://payment.momo.vn/pay'), false);
  assert.equal(isMomoPayUrl('https://example.com'), false);
  assert.equal(momoOrderIdFrom(new URLSearchParams(`orderId=${ORDER_ID}`)), ORDER_ID);
  assert.equal(momoOrderIdFrom(new URLSearchParams('order_id=not-an-order')), null);
});

test('the started checkout is ignored unless MoMo returned a real pay URL and charge', () => {
  assert.deepEqual(
    readStartedCheckout({ pay_url: 'https://payment.momo.vn/v2/gateway', order_id: ORDER_ID, amount: 599_000 }),
    { payUrl: 'https://payment.momo.vn/v2/gateway', orderId: ORDER_ID, amount: 599_000 },
  );
  assert.equal(readStartedCheckout({ pay_url: 'https://example.com', order_id: ORDER_ID, amount: 599_000 }), null);
  assert.equal(readStartedCheckout({ pay_url: 'https://momo.vn/pay', order_id: ORDER_ID, amount: 0 }), null);
  assert.equal(isMomoAmount(599_000), true);
  assert.equal(isMomoAmount(599_000.5), false);
  assert.equal(readMomoOrderStatus({ status: 'paid' }), 'paid');
  assert.equal(readMomoOrderStatus({ status: 'unknown' }), null);
});

test('a buyer who declines on MoMo is not treated as paid', () => {
  assert.equal(momoOrderStatusForResult(0), 'paid');
  assert.equal(momoOrderStatusForResult(9000), 'paid');
  assert.equal(momoOrderStatusForResult(1006), 'failed');
  assert.equal(momoOrderStatusForResult(1005), 'expired');
  assert.equal(momoOrderStatusForResult(1000), 'pending');
});

test('the MoMo create signature uses the documented field order', () => {
  const raw = momoCreateRaw({
    accessKey: 'access',
    amount: '599000',
    extraData: '',
    ipnUrl: 'http://localhost/api/momo/ipn',
    orderId: 'a'.repeat(32),
    orderInfo: 'Nutree Premium 52 tuan',
    partnerCode: 'MOMO',
    redirectUrl: 'http://localhost/momo/return',
    requestId: 'a'.repeat(32),
    requestType: 'captureWallet',
  });
  assert.equal(raw.startsWith('accessKey=access&amount=599000&extraData=&ipnUrl='), true);
  assert.equal(raw.endsWith('&requestType=captureWallet'), true);
  assert.equal(momoSignature(raw, 'secret'), momoSignature(raw, 'secret'));
  assert.notEqual(momoSignature(raw, 'secret'), momoSignature(raw, 'other'));
});

test('checkout email is trimmed and rejected when it is not an address', () => {
  assert.equal(normalizeCheckoutEmail('  Person@Example.com '), 'person@example.com');
  assert.equal(normalizeCheckoutEmail('not-an-email'), null);
  assert.equal(normalizeCheckoutEmail(''), null);
  assert.equal(isSameOriginMutation(new Headers({ origin: 'https://nutreeai.com' }), 'https://nutreeai.com'), true);
  assert.equal(isSameOriginMutation(new Headers({ origin: 'https://evil.example' }), 'https://nutreeai.com'), false);
  assert.equal(isSameOriginMutation(new Headers(), 'https://nutreeai.com'), true);
});
