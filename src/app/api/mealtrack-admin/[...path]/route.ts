import { NextRequest, NextResponse } from 'next/server';

const MEALTRACK_API_URL = (
  process.env.MEALTRACK_API_URL ||
  process.env.NEXT_PUBLIC_MEALTRACK_API_URL ||
  ''
).replace(/\/$/, '');

interface RouteContext {
  params: {
    path: string[];
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyMealTrackRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyMealTrackRequest(request, context);
}

async function proxyMealTrackRequest(request: NextRequest, context: RouteContext) {
  if (!MEALTRACK_API_URL) {
    return NextResponse.json(
      { detail: 'MEALTRACK_API_URL is not configured for admin proxy.' },
      { status: 500 }
    );
  }

  const path = context.params.path.join('/');
  const target = new URL(`/v1/admin/${path}`, MEALTRACK_API_URL);
  request.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value));

  const headers = new Headers();
  headers.set('Accept', 'application/json');

  const authorization = request.headers.get('authorization');
  if (authorization) {
    headers.set('Authorization', authorization);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }
  }

  try {
    const response = await fetch(target, init);
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'MealTrack proxy request failed.';
    return NextResponse.json({ detail: message }, { status: 502 });
  }
}
