import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { AppChrome } from '@/components/layout/AppChrome';
import { AdAttribution } from '@/components/providers/AdAttribution';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { TikTokEvents } from '@/components/providers/TikTokEvents';
import { LocaleProvider } from '@/lib/locale-context';
import type { Locale } from '@/lib/translations';

const beVietnamPro = localFont({
  src: [
    { path: '../../app/fonts/BeVietnamPro-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../app/fonts/BeVietnamPro-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../app/fonts/BeVietnamPro-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../app/fonts/BeVietnamPro-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../app/fonts/BeVietnamPro-ExtraBold.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-be-vietnam',
  display: 'swap',
});

export function RootDocument({ lang, children }: { lang: Locale; children: ReactNode }) {
  return (
    <html
      lang={lang}
      className={`${beVietnamPro.variable} scroll-pt-16 md:scroll-pt-20 motion-safe:scroll-smooth`}
    >
      <body className="flex min-h-screen flex-col">
        <TikTokEvents />
        <AdAttribution />
        <PostHogProvider>
          <LocaleProvider>
            <AppChrome>{children}</AppChrome>
          </LocaleProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
