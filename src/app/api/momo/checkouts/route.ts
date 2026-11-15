import { randomBytes, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { momoApi } from '@/lib/payments/momo-api';
import { createMomoPayment, hasMomoDirectConfig } from '@/lib/payments/momo-direct';
import {
  isMomoEnabled,
  isSameOriginMutation,
  MOMO_ACCESS_COOKIE,
  MOMO_UNAVAILABLE,
  momoCheckoutBody,
  readStartedCheckout,
  type MomoPayMethod,
} from '@/lib/payments/momo';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

function payMethod(value: unknown): MomoPayMethod | null {
  return value === 'atm' || value === 'wallet' ? value : null;
}

/**
 * A MoMo pass for the website yearly plan. The browser only says Ví MoMo or
 * Thẻ ATM Nội Địa. MealTrack prices the yearly plan and signs the MoMo request.
 */
export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request.headers, request.nextUrl.origin)) {
    return NextResponse.json({ detail: 'Cross-site mutation rejected.' }, { status: 403, headers: NO_STORE });
  }
  if (!isMomoEnabled()) return NextResponse.json({ detail: MOMO_UNAVAILABLE }, { status: 404, headers: NO_STORE });

  const body = (await request.json().catch(() => null)) as { method?: unknown; lang?: unknown } | null;
  const method = payMethod(body?.method);
  const lang = body?.lang === 'en' ? 'en' : 'vi';
  if (!method) return NextResponse.json({ detail: MOMO_UNAVAILABLE }, { status: 400, headers: NO_STORE });

  const existingKey = request.cookies.get(MOMO_ACCESS_COOKIE)?.value;
  const accessKey = existingKey && existingKey.length >= 32 ? existingKey : randomBytes(32).toString('base64url');
  if (hasMomoDirectConfig()) {
    try {
      const started = await createMomoPayment({
        method,
        redirectUrl: `${request.nextUrl.origin}/momo/return`,
        ipnUrl: process.env.MOMO_IPN_URL || `${request.nextUrl.origin}/api/momo/ipn`,
      });
      const response = NextResponse.json(
        { pay_url: started.payUrl, order_id: started.orderId, amount: started.amount },
        { status: 201, headers: NO_STORE },
      );
      if (!existingKey) {
        response.cookies.set({
          name: MOMO_ACCESS_COOKIE,
          value: accessKey,
          httpOnly: true,
          secure: request.nextUrl.protocol === 'https:',
          sameSite: 'lax',
          path: '/api/momo',
          maxAge: 60 * 60 * 24,
        });
      }
      return response;
    } catch {
      return NextResponse.json({ detail: MOMO_UNAVAILABLE }, { status: 502, headers: NO_STORE });
    }
  }

  const result = await momoApi('/v1/web-funnel/momo/checkouts', accessKey, {
    method: 'POST',
    body: JSON.stringify(momoCheckoutBody(method, lang)),
    requestId: randomUUID(),
  });
  if ('error' in result) {
    const status = result.error === 'unconfigured' ? 503 : 502;
    return NextResponse.json({ detail: MOMO_UNAVAILABLE }, { status, headers: NO_STORE });
  }
  const started = result.status === 201 ? readStartedCheckout(result.payload) : null;
  if (!started) {
    console.warn('MoMo checkout was not created.', result.status);
    return NextResponse.json({ detail: MOMO_UNAVAILABLE }, { status: result.status >= 400 ? result.status : 502, headers: NO_STORE });
  }

  const response = NextResponse.json(
    { pay_url: started.payUrl, order_id: started.orderId, amount: started.amount },
    { status: 201, headers: NO_STORE },
  );
  if (!existingKey) {
    response.cookies.set({
      name: MOMO_ACCESS_COOKIE,
      value: accessKey,
      httpOnly: true,
      secure: request.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/api/momo',
      maxAge: 60 * 60 * 24,
    });
  }
  return response;
}
