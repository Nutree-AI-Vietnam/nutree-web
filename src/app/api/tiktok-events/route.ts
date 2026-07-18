import { NextRequest, NextResponse } from 'next/server';

const TIKTOK_EVENTS_API_URL =
  'https://business-api.tiktok.com/open_api/v1.3/event/track/';

const ALLOWED_EVENTS = new Set(['ViewContent', 'Download']);

type TikTokEventProperties = Record<
  string,
  string | number | string[] | Array<Record<string, string | number>>
>;

type TikTokEventRequest = {
  event?: string;
  eventId?: string;
  url?: string;
  referrer?: string;
  ttclid?: string;
  ttp?: string;
  properties?: TikTokEventProperties;
};

export async function POST(request: NextRequest) {
  const accessToken = process.env.TIKTOK_EVENTS_ACCESS_TOKEN;
  const pixelId = process.env.TIKTOK_PIXEL_ID;

  if (!accessToken || !pixelId) {
    return NextResponse.json(
      { error: 'TikTok Events API is not configured' },
      { status: 503 },
    );
  }

  let body: TikTokEventRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.event || !ALLOWED_EVENTS.has(body.event) || !body.eventId || !body.url) {
    return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 });
  }

  const userAgent = request.headers.get('user-agent') ?? undefined;
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || undefined;

  const response = await fetch(TIKTOK_EVENTS_API_URL, {
    method: 'POST',
    headers: {
      'Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_source: 'web',
      event_source_id: pixelId,
      data: [
        {
          event: body.event,
          event_time: Math.floor(Date.now() / 1000),
          event_id: body.eventId,
          user: {
            ...(ip && { ip }),
            ...(userAgent && { user_agent: userAgent }),
            ...(body.ttclid && { ttclid: body.ttclid }),
            ...(body.ttp && { ttp: body.ttp }),
          },
          properties: body.properties ?? {},
          page: {
            url: body.url,
            ...(body.referrer && { referrer: body.referrer }),
          },
        },
      ],
    }),
    cache: 'no-store',
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.code !== 0) {
    console.error('TikTok Events API rejected an event', {
      status: response.status,
      code: result?.code,
      message: result?.message,
      requestId: result?.request_id,
    });

    return NextResponse.json({ error: 'TikTok rejected the event' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
