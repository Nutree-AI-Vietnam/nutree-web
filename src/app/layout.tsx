import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { LocaleProvider } from '@/lib/locale-context';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nutreeai.com'),
  title: 'Nutree | AI Nutrition Assistant',
  description: 'Not another calorie counter. Nutree is an AI Nutrition Assistant that adapts your daily targets, plans meals, and tracks every macro automatically.',
  keywords: ['AI nutrition assistant', 'nutrition tracking', 'meal planning', 'macro tracking', 'calorie tracker', 'cheat day rebalancing', 'adaptive targets', 'meal prep'],
  authors: [{ name: 'Nutree Team' }],
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Nutree - AI Nutrition Assistant That Adapts',
    description: 'Not another calorie counter. Nutree adapts your daily targets, plans meals, and tracks every macro automatically.',
    url: 'https://nutreeai.com',
    siteName: 'Nutree',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/logo-512.png',
        width: 512,
        height: 512,
        alt: 'Nutree Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutree - AI Nutrition Assistant That Adapts',
    description: 'Not another calorie counter. Nutree adapts your daily targets, plans meals, and tracks every macro automatically.',
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
    <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable}`}>
      <head>
        <meta name="theme-color" content="#1A4739" />
      </head>
      <body className="flex min-h-screen flex-col">
        <PostHogProvider>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
