import { createHmac, randomBytes } from 'node:crypto';
import { PAY_AMOUNTS } from '@/lib/pay-bank';
import { isMomoAmount, isMomoPayUrl, MOMO_ORDER_ID, momoOrderStatusForResult, type MomoOrderStatus, type MomoPayMethod } from '@/lib/payments/momo';

const CREATE_URL = 'https://test-payment.momo.vn/v2/gateway/api/create';
const QUERY_URL = 'https://test-payment.momo.vn/v2/gateway/api/query';

/**
 * Same signed create call as the MoMo class demo: the server builds the HMAC,
 * MoMo returns payUrl, and only that URL goes back to the browser.
 */
export function hasMomoDirectConfig(): boolean {
  return Boolean(process.env.MOMO_PARTNER_CODE && process.env.MOMO_ACCESS_KEY && process.env.MOMO_SECRET_KEY);
}

export function momoSignature(raw: string, secretKey: string): string {
  return createHmac('sha256', secretKey).update(raw).digest('hex');
}

/** Field order is the one MoMo's create API signs. Do not sort or omit a field. */
export function momoCreateRaw(fields: {
  accessKey: string;
  amount: string;
  extraData: string;
  ipnUrl: string;
  orderId: string;
  orderInfo: string;
  partnerCode: string;
  redirectUrl: string;
  requestId: string;
  requestType: string;
}): string {
  return [
    `accessKey=${fields.accessKey}`,
    `amount=${fields.amount}`,
    `extraData=${fields.extraData}`,
    `ipnUrl=${fields.ipnUrl}`,
    `orderId=${fields.orderId}`,
    `orderInfo=${fields.orderInfo}`,
    `partnerCode=${fields.partnerCode}`,
    `redirectUrl=${fields.redirectUrl}`,
    `requestId=${fields.requestId}`,
    `requestType=${fields.requestType}`,
  ].join('&');
}

export async function createMomoPayment(input: {
  method: MomoPayMethod;
  redirectUrl: string;
  ipnUrl: string;
}): Promise<{ payUrl: string; orderId: string; amount: number }> {
  const partnerCode = process.env.MOMO_PARTNER_CODE ?? '';
  const accessKey = process.env.MOMO_ACCESS_KEY ?? '';
  const secretKey = process.env.MOMO_SECRET_KEY ?? '';
  if (!partnerCode || !accessKey || !secretKey) throw new Error('MoMo is not configured.');

  const amount = PAY_AMOUNTS.yearly;
  const amountText = String(amount);
  const orderId = randomBytes(16).toString('hex');
  const requestType = input.method === 'atm' ? 'payWithATM' : 'captureWallet';
  const fields = {
    accessKey,
    amount: amountText,
    extraData: '',
    ipnUrl: input.ipnUrl,
    orderId,
    orderInfo: 'Nutree Premium 52 tuan',
    partnerCode,
    redirectUrl: input.redirectUrl,
    requestId: orderId,
    requestType,
  };
  const payload = {
    ...fields,
    signature: momoSignature(momoCreateRaw(fields), secretKey),
    lang: 'vi',
  };
  const response = await fetch(process.env.MOMO_ENDPOINT || CREATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const data = (await response.json().catch(() => null)) as { resultCode?: unknown; message?: unknown; payUrl?: unknown } | null;
  if (!response.ok || data?.resultCode !== 0 || !isMomoPayUrl(data.payUrl) || !MOMO_ORDER_ID.test(orderId) || !isMomoAmount(amount)) {
    console.warn('MoMo did not return a pay URL.', data?.resultCode, data?.message);
    throw new Error('MoMo did not return a pay URL.');
  }
  return { payUrl: data.payUrl, orderId, amount };
}

/** Ask MoMo whether the order was paid. 1006 means the buyer declined. */
export async function queryMomoOrder(orderId: string): Promise<{ status: MomoOrderStatus; amount: number | null } | null> {
  const partnerCode = process.env.MOMO_PARTNER_CODE ?? '';
  const accessKey = process.env.MOMO_ACCESS_KEY ?? '';
  const secretKey = process.env.MOMO_SECRET_KEY ?? '';
  if (!partnerCode || !accessKey || !secretKey || !MOMO_ORDER_ID.test(orderId)) return null;
  const requestId = randomBytes(16).toString('hex');
  const raw = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
  const response = await fetch(process.env.MOMO_QUERY_ENDPOINT || QUERY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ partnerCode, requestId, orderId, lang: 'vi', signature: momoSignature(raw, secretKey) }),
    cache: 'no-store',
  });
  const data = (await response.json().catch(() => null)) as { resultCode?: unknown; amount?: unknown } | null;
  if (!response.ok || typeof data?.resultCode !== 'number') return null;
  const amount = typeof data.amount === 'number' ? data.amount : Number(data.amount);
  return {
    status: momoOrderStatusForResult(data.resultCode),
    amount: isMomoAmount(amount) ? amount : null,
  };
}
