/**
 * MoMo one-time pass for the website yearly plan.
 *
 * The browser never sees MoMo keys and never chooses the charge. It names the
 * yearly plan and the buyer's sign-in email. MealTrack prices the order and
 * returns a pay URL. A pass does not renew.
 *
 * Off unless NEXT_PUBLIC_MOMO_ENABLED is "true", so the purchase page can ship
 * before that environment's API sells passes.
 */

export const MOMO_PLAN = 'yearly';
/** Weeks the API's yearly pass lasts. A month in this catalog is 4 weeks, a year 52. */
export const MOMO_YEARLY_WEEKS = 52;
export const MOMO_ACCESS_COOKIE = 'nutree_momo_access';
export const MOMO_ORDER_STORAGE_KEY = 'nutree.momo.order.v1';
export const MOMO_EMAIL_STORAGE_KEY = 'nutree.momo.email.v1';

/** Shown to shoppers whenever MoMo checkout fails for a reason they cannot fix. */
export const MOMO_UNAVAILABLE = 'MoMo is temporarily unavailable. Please try again later.';

export type MomoPayMethod = 'wallet' | 'atm';
export type MomoOrderStatus = 'pending' | 'paid' | 'failed' | 'expired';

export const MOMO_ORDER_ID = /^[0-9a-f]{32}$/;

const CHECKOUT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isMomoEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MOMO_ENABLED === 'true';
}

export function isMomoPayUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value.startsWith('https://')) return false;
  try {
    const host = new URL(value).hostname.toLowerCase();
    return host === 'momo.vn' || host.endsWith('.momo.vn');
  } catch {
    return false;
  }
}

/** A VND charge: a whole number of dong above zero. */
export function isMomoAmount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

export function normalizeCheckoutEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > 255 || !CHECKOUT_EMAIL.test(email)) return null;
  return email;
}

/** MoMo returns `orderId`; older links used `order_id`. */
export function momoOrderIdFrom(params: { get(name: string): string | null }): string | null {
  const value = params.get('orderId') ?? params.get('order_id');
  return value && MOMO_ORDER_ID.test(value) ? value : null;
}

export function isSameOriginMutation(headers: Headers, origin: string): boolean {
  const requestOrigin = headers.get('origin');
  return !requestOrigin || requestOrigin === origin;
}

/** Body the website BFF sends. The API prices `yearly`; the browser does not send an amount or an email. */
export function momoCheckoutBody(method: MomoPayMethod, lang: 'vi' | 'en') {
  return { plan: MOMO_PLAN, method, lang };
}

export interface MomoCheckoutStart {
  payUrl: string;
  orderId: string;
  amount: number;
}

export function readStartedCheckout(payload: unknown): MomoCheckoutStart | null {
  if (!payload || typeof payload !== 'object') return null;
  const body = payload as { pay_url?: unknown; order_id?: unknown; amount?: unknown };
  if (!isMomoPayUrl(body.pay_url) || typeof body.order_id !== 'string' || !MOMO_ORDER_ID.test(body.order_id)) return null;
  if (!isMomoAmount(body.amount)) return null;
  return { payUrl: body.pay_url, orderId: body.order_id, amount: body.amount };
}

/**
 * MoMo resultCode on the return URL and the query API.
 * 0 and 9000 are paid. 1000, 7000 and 7002 are still waiting. 1005 expired.
 * 1006 is the buyer declining the payment.
 */
export function momoOrderStatusForResult(code: number): MomoOrderStatus {
  if (code === 0 || code === 9000) return 'paid';
  if (code === 1000 || code === 7000 || code === 7002) return 'pending';
  if (code === 1005) return 'expired';
  return 'failed';
}

export function readMomoOrderStatus(payload: unknown): MomoOrderStatus | null {
  if (!payload || typeof payload !== 'object') return null;
  const status = (payload as { status?: unknown }).status;
  return status === 'pending' || status === 'paid' || status === 'failed' || status === 'expired' ? status : null;
}

export async function startMomoCheckout(
  method: MomoPayMethod,
  lang: 'vi' | 'en',
): Promise<MomoCheckoutStart> {
  const response = await fetch('/api/momo/checkouts', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, lang }),
  });
  const payload = (await response.json().catch(() => null)) as unknown;
  const started = readStartedCheckout(payload);
  if (!response.ok || !started) throw new Error(MOMO_UNAVAILABLE);
  return started;
}

export async function fetchMomoOrderStatus(orderId: string): Promise<{ status: MomoOrderStatus | null; httpStatus: number }> {
  const response = await fetch(`/api/momo/orders/${encodeURIComponent(orderId)}/status`, {
    cache: 'no-store',
    credentials: 'same-origin',
  });
  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) return { status: null, httpStatus: response.status };
  return { status: readMomoOrderStatus(payload), httpStatus: response.status };
}

export function rememberMomoCheckout(orderId: string) {
  try {
    window.sessionStorage.setItem(MOMO_ORDER_STORAGE_KEY, orderId);
  } catch {
    // The return URL still carries the order id when this browser keeps it.
  }
}

export function readRememberedMomoOrderId(): string | null {
  try {
    const value = window.sessionStorage.getItem(MOMO_ORDER_STORAGE_KEY);
    return value && MOMO_ORDER_ID.test(value) ? value : null;
  } catch {
    return null;
  }
}

export function readRememberedMomoEmail(): string | null {
  try {
    return normalizeCheckoutEmail(window.sessionStorage.getItem(MOMO_EMAIL_STORAGE_KEY));
  } catch {
    return null;
  }
}
