import { NextRequest, NextResponse } from 'next/server';
import {
  ENGLISH_ENTRY_PRIVATE_CACHE,
  explicitEnglishEntrySetsPreference,
  HOME_PATH,
  isSpeculativeRequest,
  rootLanguageDecision,
} from '@/lib/home-language';
import { localePreferenceCookie, readLocaleCookie } from '@/lib/locale-preference';
import { pageLanguageDependsOnCookie } from '@/lib/route-locale';

const ADMIN_HOST = 'admin.nutreeai.com';
const ADMIN_HOME_PATH = '/admin/meal-catalog';
const PATHNAME_HEADER = 'x-nutree-pathname';

function hostnameFromRequest(request: NextRequest) {
  return request.headers.get('host')?.split(':')[0].toLowerCase();
}

function nextWithPath(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PATHNAME_HEADER, request.nextUrl.pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (pageLanguageDependsOnCookie(request.nextUrl.pathname)) {
    response.headers.append('Vary', 'Cookie');
  }
  return response;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (hostnameFromRequest(request) === ADMIN_HOST) {
    if (pathname === HOME_PATH.vi) return NextResponse.rewrite(new URL(ADMIN_HOME_PATH, request.url));
    return NextResponse.next();
  }

  if (explicitEnglishEntrySetsPreference(pathname, request.headers.get('user-agent'), request.headers)) {
    if (readLocaleCookie(request.headers.get('cookie')) !== 'en') {
      const response = nextWithPath(request);
      response.headers.append('Set-Cookie', localePreferenceCookie('en', request.nextUrl.protocol === 'https:'));
      response.headers.set('Cache-Control', ENGLISH_ENTRY_PRIVATE_CACHE['cache-control']);
      response.headers.set('Vary', ENGLISH_ENTRY_PRIVATE_CACHE.vary);
      return response;
    }
  }

  if (pathname !== HOME_PATH.vi) return nextWithPath(request);

  // A prefetch of `/` while the cookie is English used to answer with a redirect. The client
  // then reused that redirect after the visitor chose Vietnamese, so the switch appeared broken.
  if (isSpeculativeRequest(request.headers)) return nextWithPath(request);

  const decision = rootLanguageDecision({
    cookieHeader: request.headers.get('cookie'),
    acceptLanguage: request.headers.get('accept-language'),
    userAgent: request.headers.get('user-agent'),
  });
  if (decision.action === 'stay') return nextWithPath(request);

  const destination = request.nextUrl.clone();
  destination.pathname = HOME_PATH.en;
  const response = NextResponse.redirect(destination, 302);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Vary', 'Cookie, Accept-Language');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
