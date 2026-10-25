import { getCategoryPath, getTranslation, toIsoDateTime, type BlogPost } from './blog';
import type { BlogCategory } from './blog-categories';
import { BLOG_LOCALES, DEFAULT_BLOG_LOCALE, type BlogLocale } from './blog-locales';
import { SITE_CONFIG } from './constants';
import { DEFAULT_OG_IMAGE } from './seo';
import { ORGANIZATION_ID, WEBSITE_ID, organization, website } from './structured-data';

export interface Breadcrumb {
  name: string;
  path: string;
}

const absoluteUrl = (path: string) => `${SITE_CONFIG.url}${path}`;

const articleId = (post: BlogPost) => `${absoluteUrl(post.url)}#article`;

/** The blog of one language: /blog and /en/blog are separate Blog entities. */
function blog(locale: BlogLocale) {
  const config = BLOG_LOCALES[locale];
  return {
    '@type': 'Blog',
    '@id': `${absoluteUrl(config.path)}#blog`,
    url: absoluteUrl(config.path),
    name: config.name,
    inLanguage: config.htmlLang,
    publisher: { '@id': ORGANIZATION_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

/** Home › Blog, then an optional category and page, shared by every blog page. */
export function getBlogBreadcrumbs(locale: BlogLocale, category?: BlogCategory, last?: Breadcrumb): Breadcrumb[] {
  const { path, text } = BLOG_LOCALES[locale];
  return [
    { name: text.home, path: '/' },
    { name: text.blog, path },
    ...(category ? [{ name: category.label, path: getCategoryPath(locale, category.slug) }] : []),
    ...(last ? [last] : []),
  ];
}

function breadcrumbList(breadcrumbs: Breadcrumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function getPostStructuredData(post: BlogPost) {
  const url = absoluteUrl(post.url);
  const translation = getTranslation(post);
  // The default language's version counts as the original; the other one is its translation.
  const translationLink = translation && {
    [post.locale === DEFAULT_BLOG_LOCALE ? 'workTranslation' : 'translationOfWork']: {
      '@id': articleId(translation),
    },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      blog(post.locale),
      {
        '@type': 'BlogPosting',
        '@id': articleId(post),
        url,
        mainEntityOfPage: url,
        headline: post.title,
        description: post.description,
        // The 16:9 cover first, then the pictures in the article, so search can show any of them.
        image:
          post.images.length > 0
            ? post.images.map((image) => ({
                '@type': 'ImageObject',
                url: absoluteUrl(image.src),
                width: image.width,
                height: image.height,
                ...(image.caption && { caption: image.caption }),
              }))
            : [absoluteUrl(DEFAULT_OG_IMAGE.url)],
        ...(post.image && { thumbnailUrl: absoluteUrl(post.image.src) }),
        datePublished: toIsoDateTime(post.date),
        dateModified: toIsoDateTime(post.updated),
        author: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: SITE_CONFIG.name, url: SITE_CONFIG.url },
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: BLOG_LOCALES[post.locale].htmlLang,
        articleSection: post.category.label,
        wordCount: post.wordCount,
        ...(post.tags.length > 0 && { keywords: post.tags.join(', ') }),
        ...translationLink,
        isPartOf: { '@id': blog(post.locale)['@id'] },
      },
      breadcrumbList(getBlogBreadcrumbs(post.locale, post.category, { name: post.title, path: post.url })),
    ],
  };
}

interface ListingStructuredDataInput {
  locale: BlogLocale;
  name: string;
  description: string;
  path: string;
  posts: BlogPost[];
  /** Position of the first post across all pages, so page 2 continues the numbering. */
  firstPosition: number;
  breadcrumbs: Breadcrumb[];
}

export function getListingStructuredData({
  locale,
  name,
  description,
  path,
  posts,
  firstPosition,
  breadcrumbs,
}: ListingStructuredDataInput) {
  const url = absoluteUrl(path);
  const blogEntity = blog(locale);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      website,
      blogEntity,
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: BLOG_LOCALES[locale].htmlLang,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': blogEntity['@id'] },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: firstPosition + index,
            url: absoluteUrl(post.url),
            name: post.title,
          })),
        },
      },
      breadcrumbList(breadcrumbs),
    ],
  };
}
