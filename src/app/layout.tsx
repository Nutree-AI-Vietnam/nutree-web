import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AppChrome } from '@/components/layout/AppChrome';
import { AdAttribution } from '@/components/providers/AdAttribution';
import { CookieConsent } from '@/components/providers/CookieConsent';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { TikTokEvents } from '@/components/providers/TikTokEvents';
import { SITE_CONFIG } from '@/lib/constants';
import { LocaleProvider } from '@/lib/locale-context';
import { SITE_DESCRIPTION, SITE_TITLE, createPageMetadata } from '@/lib/seo';
import './globals.css';

// Self-hosted, one latin + Vietnamese file per weight; see src/app/fonts/README.md.
const beVietnamPro = localFont({
  src: [
    { path: './fonts/BeVietnamPro-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/BeVietnamPro-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/BeVietnamPro-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/BeVietnamPro-Bold.woff2', weight: '700', style: 'normal' },
    { path: './fonts/BeVietnamPro-ExtraBold.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-be-vietnam',
  display: 'swap',
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
    // Lets Google Discover and image results show full-width pictures and full snippets.
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
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
        <TikTokEvents />
        <AdAttribution />
        <PostHogProvider>
          <LocaleProvider>
            <AppChrome>{children}</AppChrome>
            <CookieConsent />
          </LocaleProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
