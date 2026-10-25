import type { Metadata } from 'next';
import { SITE_CONFIG } from './constants';

export const SITE_TITLE = 'Nutree | Trợ lý dinh dưỡng AI, đếm calo & track macro';

export const SITE_DESCRIPTION =
  'Không phải app đếm calo bình thường. Nutree tự điều chỉnh mục tiêu hằng ngày, gợi ý bữa ăn và track macro cho bạn bằng AI. Tải miễn phí trên iOS và Android.';

export const DEFAULT_OG_IMAGE = {
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
  /** Share image in place of the default card, such as a blog post's cover. */
  image?: { url: string; alt: string; width?: number; height?: number };
  /** Open Graph article fields; implies og:type article. Times are ISO 8601. */
  article?: { publishedTime: string; modifiedTime: string; section: string; tags: string[] };
  keywords?: string[];
  /** RSS feed advertised with a <link rel="alternate">, so feed readers can find it from the page. */
  feed?: { url: string; title: string };
  /** Open Graph locale such as en_US; defaults to the site's Vietnamese. */
  ogLocale?: string;
  /** hreflang → path of this page in each language, rendered as <link rel="alternate" hreflang>. */
  languages?: Record<string, string>;
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
  image = DEFAULT_OG_IMAGE,
  article,
  keywords,
  feed,
  ogLocale = 'vi_VN',
  languages,
}: PageMetadataInput): Metadata {
  const socialDescription = ogDescription ?? description;
  const openGraph = {
    title,
    description: socialDescription,
    ...(path && { url: path }),
    siteName: SITE_CONFIG.name,
    locale: ogLocale,
    images: [image],
  };

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 && { keywords }),
    ...((path || feed || languages) && {
      alternates: {
        ...(path && { canonical: path }),
        ...(languages && { languages }),
        ...(feed && { types: { 'application/rss+xml': [feed] } }),
      },
    }),
    openGraph: article
      ? {
          ...openGraph,
          type: 'article',
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          section: article.section,
          tags: article.tags,
        }
      : { ...openGraph, type: ogType },
    twitter: {
      card: 'summary_large_image',
      title,
      description: socialDescription,
      images: [image],
    },
  };
}
