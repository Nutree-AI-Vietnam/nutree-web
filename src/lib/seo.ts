import type { Metadata } from 'next';
import { SITE_CONFIG } from './constants';

export const SITE_TITLE = 'Nutree | Trợ lý dinh dưỡng AI, đếm calo & track macro';

export const SITE_DESCRIPTION =
  'Không phải app đếm calo bình thường. Nutree tự điều chỉnh mục tiêu hằng ngày, gợi ý bữa ăn và track macro cho bạn bằng AI. Tải miễn phí trên iOS và Android.';

const DEFAULT_OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Nutree, trợ lý dinh dưỡng AI trên iOS và Android',
};

interface PageMetadataInput {
  title: string;
  description: string;
  /** Route path such as '/faq'. Sets the canonical URL and og:url; omit it where no single URL applies. */
  path?: string;
  ogType?: 'website' | 'article';
  /** Shorter copy for social cards when the search description runs long. */
  ogDescription?: string;
}

/**
 * Page metadata with complete Open Graph and Twitter objects. Next replaces these objects
 * wholesale rather than merging them with the layout's, so a page that set only a title
 * would lose the share image and locale.
 */
export function createPageMetadata({
  title,
  description,
  path,
  ogType = 'website',
  ogDescription,
}: PageMetadataInput): Metadata {
  const socialDescription = ogDescription ?? description;

  return {
    title,
    description,
    ...(path && { alternates: { canonical: path } }),
    openGraph: {
      title,
      description: socialDescription,
      ...(path && { url: path }),
      siteName: SITE_CONFIG.name,
      locale: 'vi_VN',
      type: ogType,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: socialDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
