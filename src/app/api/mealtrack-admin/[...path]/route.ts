import { NextRequest, NextResponse } from 'next/server';

const LEGACY_MEALTRACK_API_URL = (
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
  const backendUrl = getBackendUrl(request);
  if (!backendUrl) {
    return NextResponse.json(
      { detail: 'Selected MealTrack environment is not configured for the admin proxy.' },
      { status: 503 }
    );
  }

  const path = context.params.path.join('/');
  const target = new URL(`/v1/admin/${path}`, backendUrl);
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

function getBackendUrl(request: NextRequest): string | null {
  const environment = request.headers.get('x-mealtrack-environment');
  if (environment === 'sit') return normalizeUrl(process.env.MEALTRACK_SIT_API_URL);
  if (environment === 'prod') return normalizeUrl(process.env.MEALTRACK_PROD_API_URL);
  if (environment) return null;
  return LEGACY_MEALTRACK_API_URL || null;
}

function normalizeUrl(value: string | undefined): string | null {
  return value?.replace(/\/$/, '') || null;
}
