import type { MetadataRoute } from 'next';
import {
  getActiveCategories,
  getAllPosts,
  getCategoryPath,
  getCategoryPaths,
  getLanguageAlternates,
  getPostPaths,
  type BlogPost,
} from '@/lib/blog';
import { BLOG_LOCALES, BLOG_LOCALE_LIST, type BlogLocale } from '@/lib/blog-locales';
import { SITE_CONFIG } from '@/lib/constants';

type SitemapEntry = MetadataRoute.Sitemap[number];

const ROUTES: Array<Pick<SitemapEntry, 'changeFrequency' | 'priority'> & { path: string }> = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/why', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/mua-goi', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/research', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/usage', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/pricing', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/payment', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cancellation', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/complaints', changeFrequency: 'yearly', priority: 0.3 },
];

/** Newest `updated` date among the posts, so a listing changes date whenever one of its posts does. */
function latestUpdate(posts: BlogPost[]): string | undefined {
  return posts.reduce<string | undefined>(
    (latest, post) => (!latest || post.updated > latest ? post.updated : latest),
    undefined
  );
}

const absoluteUrl = (path: string) => `${SITE_CONFIG.url}${path}`;

/** hreflang alternates as absolute URLs, for pages that exist in both languages. */
function alternates(paths: Partial<Record<BlogLocale, string>>): Pick<SitemapEntry, 'alternates'> {
  const languages = getLanguageAlternates(paths);
  return languages
    ? { alternates: { languages: Object.fromEntries(Object.entries(languages).map(([lang, path]) => [lang, absoluteUrl(path)])) } }
    : {};
}

/**
 * One language's blog index, each category with posts, and every post. Numbered pages stay out: they
 * only list posts.
 */
function blogEntries(locale: BlogLocale): MetadataRoute.Sitemap {
  const posts = getAllPosts(locale);
  const indexPaths = Object.fromEntries(BLOG_LOCALE_LIST.map((item) => [item, BLOG_LOCALES[item].path]));

  return [
    {
      url: absoluteUrl(BLOG_LOCALES[locale].path),
      lastModified: latestUpdate(posts),
      changeFrequency: 'daily',
      priority: 0.8,
      ...alternates(indexPaths),
    },
    ...getActiveCategories(locale).map((category): SitemapEntry => ({
      url: absoluteUrl(getCategoryPath(locale, category.slug)),
      lastModified: latestUpdate(posts.filter((post) => post.category.slug === category.slug)),
      changeFrequency: 'weekly',
      priority: 0.6,
      ...alternates(getCategoryPaths(category)),
    })),
    ...posts.map((post): SitemapEntry => ({
      url: absoluteUrl(post.url),
      lastModified: post.updated,
      changeFrequency: 'monthly',
      priority: 0.7,
      images: post.images.map((image) => absoluteUrl(image.src)),
      ...alternates(getPostPaths(post)),
    })),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_CONFIG.url}${path}`,
    changeFrequency,
    priority,
  }));

  return [...pages, ...BLOG_LOCALE_LIST.flatMap(blogEntries)];
}
