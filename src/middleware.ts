import { NextRequest, NextResponse } from 'next/server';
import { explicitEnglishEntrySetsPreference, HOME_PATH, rootLanguageDecision } from '@/lib/home-language';
import { localePreferenceCookie, readLocaleCookie } from '@/lib/locale-preference';

const ADMIN_HOST = 'admin.nutreeai.com';
const ADMIN_HOME_PATH = '/admin/meal-catalog';

function hostnameFromRequest(request: NextRequest) {
  return request.headers.get('host')?.split(':')[0].toLowerCase();
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (hostnameFromRequest(request) === ADMIN_HOST) {
    if (pathname === HOME_PATH.vi) return NextResponse.rewrite(new URL(ADMIN_HOME_PATH, request.url));
    return NextResponse.next();
  }

  if (explicitEnglishEntrySetsPreference(pathname, request.headers.get('user-agent'))) {
    if (readLocaleCookie(request.headers.get('cookie')) === 'en') return NextResponse.next();
    const response = NextResponse.next();
    response.headers.append('Set-Cookie', localePreferenceCookie('en', request.nextUrl.protocol === 'https:'));
    return response;
  }

  if (pathname !== HOME_PATH.vi) return NextResponse.next();

  const decision = rootLanguageDecision({
    cookieHeader: request.headers.get('cookie'),
    acceptLanguage: request.headers.get('accept-language'),
    userAgent: request.headers.get('user-agent'),
  });
  if (decision.action === 'stay') return NextResponse.next();

  const destination = request.nextUrl.clone();
  destination.pathname = HOME_PATH.en;
  const response = NextResponse.redirect(destination, 302);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Vary', 'Cookie, Accept-Language');
  return response;
}

export const config = {
  matcher: ['/', '/en', '/en/:path*'],
};
