import type { MetadataRoute } from 'next';
import { BLOG_PATH, getActiveCategories, getAllPosts, getCategoryPath, type BlogPost } from '@/lib/blog';
import { SITE_CONFIG } from '@/lib/constants';

type SitemapEntry = MetadataRoute.Sitemap[number];

const ROUTES: Array<Pick<SitemapEntry, 'changeFrequency' | 'priority'> & { path: string }> = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/why', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.8 },
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

/** The blog index, each category with posts, and every post. Numbered pages stay out: they only list posts. */
function blogEntries(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    {
      url: `${SITE_CONFIG.url}${BLOG_PATH}`,
      lastModified: latestUpdate(posts),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...getActiveCategories().map((category): SitemapEntry => ({
      url: `${SITE_CONFIG.url}${getCategoryPath(category.slug)}`,
      lastModified: latestUpdate(posts.filter((post) => post.category.slug === category.slug)),
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
    ...posts.map((post): SitemapEntry => ({
      url: `${SITE_CONFIG.url}${post.url}`,
      lastModified: post.updated,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_CONFIG.url}${path}`,
    changeFrequency,
    priority,
  }));

  return [...pages, ...blogEntries()];
}
