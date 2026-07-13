import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { LocaleProvider } from '@/lib/locale-context';
import { HERO_SCREENSHOTS } from '@/lib/screenshot-assets';
import './globals.css';

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
