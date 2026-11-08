import { cookies, headers } from 'next/headers';
import { RootDocument } from '@/components/layout/RootDocument';
import { LOCALE_PREFERENCE_COOKIE, parseLocalePreference } from '@/lib/locale-preference';
import { rootViewport, vietnameseRootMetadata } from '@/lib/root-metadata';
import { getRouteLocale } from '@/lib/route-locale';
import '../globals.css';

export const metadata = vietnameseRootMetadata;
export const viewport = rootViewport;

export default async function VietnameseLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get('x-nutree-pathname');
  const saved = parseLocalePreference((await cookies()).get(LOCALE_PREFERENCE_COOKIE)?.value);
  const routeLocale = getRouteLocale(pathname);
  const stored = saved ?? 'vi';
  const lang = routeLocale ?? (saved === 'en' ? 'en' : 'vi');
  return <RootDocument lang={lang} initialLocale={routeLocale ?? stored}>{children}</RootDocument>;
}
