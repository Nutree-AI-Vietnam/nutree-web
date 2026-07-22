import { NextRequest, NextResponse } from 'next/server';

const ADMIN_HOST = 'admin.nutreeai.com';
const ADMIN_HOME_PATH = '/admin/meal-catalog';

function hostnameFromRequest(request: NextRequest) {
  return request.headers.get('host')?.split(':')[0].toLowerCase();
}

export function middleware(request: NextRequest) {
  if (hostnameFromRequest(request) === ADMIN_HOST) {
    return NextResponse.rewrite(new URL(ADMIN_HOME_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
