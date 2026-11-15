import { NextRequest, NextResponse } from 'next/server';
import { momoApi } from '@/lib/payments/momo-api';
import { hasMomoDirectConfig, queryMomoOrder } from '@/lib/payments/momo-direct';
import { isMomoAmount, MOMO_ACCESS_COOKIE, MOMO_ORDER_ID, MOMO_PLAN, readMomoOrderStatus } from '@/lib/payments/momo';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

export async function GET(request: NextRequest, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;
  if (!MOMO_ORDER_ID.test(orderId)) return NextResponse.json({ detail: 'Not found.' }, { status: 404, headers: NO_STORE });
  if (hasMomoDirectConfig()) {
    const order = await queryMomoOrder(orderId);
    if (!order) return NextResponse.json({ detail: 'Could not load MoMo order status.' }, { status: 502, headers: NO_STORE });
    return NextResponse.json(
      { order_id: orderId, status: order.status, plan: MOMO_PLAN, amount: order.amount },
      { headers: NO_STORE },
    );
  }
  const accessKey = request.cookies.get(MOMO_ACCESS_COOKIE)?.value;
  if (!accessKey) return NextResponse.json({ detail: 'Not found.' }, { status: 401, headers: NO_STORE });

  const result = await momoApi(`/v1/web-funnel/momo/orders/${orderId}/status`, accessKey);
  if ('error' in result) {
    const status = result.error === 'unconfigured' ? 503 : 502;
    return NextResponse.json({ detail: 'Could not load MoMo order status.' }, { status, headers: NO_STORE });
  }
  if (result.status !== 200) {
    return NextResponse.json({ detail: 'Could not load MoMo order status.' }, { status: result.status, headers: NO_STORE });
  }
  const payload = result.payload as { plan?: unknown; amount?: unknown } | null;
  return NextResponse.json(
    {
      order_id: orderId,
      status: readMomoOrderStatus(payload) ?? 'pending',
      plan: payload?.plan === MOMO_PLAN ? MOMO_PLAN : null,
      amount: isMomoAmount(payload?.amount) ? payload.amount : null,
    },
    { headers: NO_STORE },
  );
}
