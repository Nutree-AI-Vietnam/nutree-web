import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import Script from 'next/script';
import { AppChrome } from '@/components/layout/AppChrome';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { TikTokEvents } from '@/components/providers/TikTokEvents';
import { SITE_CONFIG } from '@/lib/constants';
import { LocaleProvider } from '@/lib/locale-context';
import { SITE_DESCRIPTION, SITE_TITLE, createPageMetadata } from '@/lib/seo';
import './globals.css';

const TIKTOK_PIXEL_ID = 'D9DG1BJC77UD5IE51T1G';

const TIKTOK_PIXEL_SCRIPT = `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script"),n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('${TIKTOK_PIXEL_ID}');
  ttq.page();
}(window, document, 'ttq');
`;

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// No canonical here: child segments inherit layout metadata, so a canonical set at the root
// would point every page (and the 404) at the home page. Each page sets its own.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  ...createPageMetadata({ title: SITE_TITLE, description: SITE_DESCRIPTION }),
  applicationName: SITE_CONFIG.name,
  keywords: ['trợ lý dinh dưỡng AI', 'theo dõi dinh dưỡng', 'gợi ý bữa ăn', 'track macro', 'đếm calo', 'ngân sách dinh dưỡng tuần', 'mục tiêu tự điều chỉnh', 'meal prep'],
  authors: [{ name: 'Nutree Team' }],
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} scroll-pt-16 md:scroll-pt-20 motion-safe:scroll-smooth`}
    >
      <head>
        <meta name="theme-color" content="#1A4739" />
        <meta name="facebook-domain-verification" content="f0wc0i12b96y1yc0susyi4y57rdc6v" />
      </head>
      <body className="flex min-h-screen flex-col">
        <Script id="tiktok-pixel" strategy="beforeInteractive">
          {TIKTOK_PIXEL_SCRIPT}
        </Script>
        <TikTokEvents />
        <PostHogProvider>
          <LocaleProvider>
            <AppChrome>{children}</AppChrome>
          </LocaleProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
