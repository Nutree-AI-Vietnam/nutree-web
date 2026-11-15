import { MOMO_UNAVAILABLE } from '@/lib/payments/momo';

export type MomoApiResult =
  | { status: number; payload: unknown }
  | { error: 'unconfigured' | 'unreachable' };

/**
 * Forward a MoMo call to MealTrack with the server-held BFF token and this
 * browser's access key. MoMo keys never reach the website. No Origin is sent,
 * so an origin pin on the quiz host does not reject nutreeai.com.
 */
export async function momoApi(
  path: string,
  accessKey: string,
  init: { method?: 'GET' | 'POST'; body?: string; requestId?: string } = {},
): Promise<MomoApiResult> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  const bffToken = process.env.WEB_FUNNEL_BFF_SHARED_SECRET;
  if (!base || !bffToken) return { error: 'unconfigured' };
  try {
    const upstream = await fetch(`${base}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        'X-Lead-Access-Key': accessKey,
        'X-Web-Funnel-BFF-Token': bffToken,
        ...(init.requestId ? { 'X-Request-ID': init.requestId } : {}),
      },
      body: init.body,
      cache: 'no-store',
    });
    return { status: upstream.status, payload: await upstream.json().catch(() => null) };
  } catch (error) {
    console.warn(MOMO_UNAVAILABLE, error);
    return { error: 'unreachable' };
  }
}
