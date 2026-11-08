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
import { HOME_LANGUAGE_ALTERNATES, HOME_PATH } from '@/lib/home-language';
import { languageAlternatesFor, PRIVACY_LANGUAGE_ALTERNATES, PRIVACY_PATH } from '@/lib/privacy-path';

type SitemapEntry = MetadataRoute.Sitemap[number];

const ROUTES: Array<Pick<SitemapEntry, 'changeFrequency' | 'priority'> & { path: string }> = [
  { path: HOME_PATH.vi, changeFrequency: 'weekly', priority: 1 },
  { path: HOME_PATH.en, changeFrequency: 'weekly', priority: 1 },
  { path: '/why', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/en/faq', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/delete-account', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/en/delete-account', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/mua-goi', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/research', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
  { path: PRIVACY_PATH.vi, changeFrequency: 'yearly', priority: 0.3 },
  { path: PRIVACY_PATH.en, changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/en/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/usage', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/en/usage', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/pricing', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/en/pricing', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/payment', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/en/payment', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cancellation', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/en/cancellation', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/complaints', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/en/complaints', changeFrequency: 'yearly', priority: 0.3 },
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

const privacyLanguages = Object.fromEntries(
  Object.entries(PRIVACY_LANGUAGE_ALTERNATES).map(([lang, path]) => [lang, absoluteUrl(path)])
);

const homeLanguages = Object.fromEntries(
  Object.entries(HOME_LANGUAGE_ALTERNATES).map(([lang, path]) => [lang, absoluteUrl(path)])
);

const PAIRED_VI_PATHS = ['/terms', '/usage', '/pricing', '/payment', '/cancellation', '/complaints', '/faq'] as const;

function languagesForSitemapPath(path: string) {
  if (path === PRIVACY_PATH.vi || path === PRIVACY_PATH.en) return privacyLanguages;
  if (path === HOME_PATH.vi || path === HOME_PATH.en) return homeLanguages;
  const viPath = path.startsWith('/en/') ? path.slice(3) : path;
  if (!(PAIRED_VI_PATHS as readonly string[]).includes(viPath)) return undefined;
  return Object.fromEntries(
    Object.entries(languageAlternatesFor(viPath as (typeof PAIRED_VI_PATHS)[number])).map(([lang, href]) => [
      lang,
      absoluteUrl(href),
    ])
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ROUTES.map(({ path, changeFrequency, priority }) => {
    const languages = languagesForSitemapPath(path);
    return {
      url: `${SITE_CONFIG.url}${path}`,
      changeFrequency,
      priority,
      ...(languages ? { alternates: { languages } } : {}),
    };
  });

  return [...pages, ...BLOG_LOCALE_LIST.flatMap(blogEntries)];
}
