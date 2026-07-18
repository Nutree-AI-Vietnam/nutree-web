import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { LocaleProvider } from '@/lib/locale-context';
import { HERO_SCREENSHOTS } from '@/lib/screenshot-assets';
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

export const metadata: Metadata = {
  title: 'Nutree | Trợ lý dinh dưỡng AI',
  description: 'Không phải app đếm calo bình thường. Nutree tự điều chỉnh mục tiêu hằng ngày, gợi ý bữa ăn và track macro cho bạn bằng AI.',
  keywords: ['trợ lý dinh dưỡng AI', 'theo dõi dinh dưỡng', 'gợi ý bữa ăn', 'track macro', 'đếm calo', 'ngân sách dinh dưỡng tuần', 'mục tiêu tự điều chỉnh', 'meal prep'],
  authors: [{ name: 'Nutree Team' }],
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Nutree - Trợ lý dinh dưỡng AI tự thích nghi',
    description: 'Nutree tự điều chỉnh mục tiêu hằng ngày, gợi ý bữa ăn và track macro cho bạn bằng AI.',
    url: 'https://nutreeai.com',
    siteName: 'Nutree',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/logo-512.png',
        width: 512,
        height: 512,
        alt: 'Logo Nutree',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutree - Trợ lý dinh dưỡng AI tự thích nghi',
    description: 'Nutree tự điều chỉnh mục tiêu hằng ngày, gợi ý bữa ăn và track macro cho bạn bằng AI.',
    images: ['/logo-512.png'],
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
    <html lang="vi" className={beVietnamPro.variable}>
      <head>
        <meta name="theme-color" content="#1A4739" />
        <meta name="facebook-domain-verification" content="f0wc0i12b96y1yc0susyi4y57rdc6v" />
        {Object.values(HERO_SCREENSHOTS).flatMap(({ front, back }) => [
          <link key={front} rel="preload" as="image" href={front} />,
          <link key={back} rel="preload" as="image" href={back} />,
        ])}
      </head>
      <body className="flex min-h-screen flex-col">
        <Script id="tiktok-pixel" strategy="beforeInteractive">
          {TIKTOK_PIXEL_SCRIPT}
        </Script>
        <PostHogProvider>
          <LocaleProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LocaleProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
