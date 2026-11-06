import type { Metadata, Viewport } from 'next';
import { SITE_CONFIG } from './constants';
import { SITE_DESCRIPTION, SITE_DESCRIPTION_EN, SITE_TITLE, SITE_TITLE_EN, createPageMetadata } from './seo';

export const rootViewport: Viewport = {
  themeColor: '#1A4739',
};

const shared: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  applicationName: SITE_CONFIG.name,
  authors: [{ name: 'Nutree Team' }],
  other: {
    'facebook-domain-verification': 'f0wc0i12b96y1yc0susyi4y57rdc6v',
  },
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
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

export const vietnameseRootMetadata: Metadata = {
  ...shared,
  ...createPageMetadata({ title: SITE_TITLE, description: SITE_DESCRIPTION }),
  keywords: ['trợ lý dinh dưỡng AI', 'theo dõi dinh dưỡng', 'gợi ý bữa ăn', 'track macro', 'đếm calo', 'ngân sách dinh dưỡng tuần', 'mục tiêu tự điều chỉnh', 'meal prep'],
};

export const englishRootMetadata: Metadata = {
  ...shared,
  ...createPageMetadata({
    title: SITE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
    ogLocale: 'en_US',
  }),
};
