import { BLOG_NAME, BLOG_PATH, getCategoryPath, toIsoDateTime, type BlogPost } from './blog';
import type { BlogCategory } from './blog-categories';
import { SITE_CONFIG } from './constants';
import { DEFAULT_OG_IMAGE } from './seo';
import { ORGANIZATION_ID, WEBSITE_ID, organization, website } from './structured-data';

const BLOG_ID = `${SITE_CONFIG.url}${BLOG_PATH}#blog`;

export interface Breadcrumb {
  name: string;
  path: string;
}

const absoluteUrl = (path: string) => `${SITE_CONFIG.url}${path}`;

const blog = {
  '@type': 'Blog',
  '@id': BLOG_ID,
  url: absoluteUrl(BLOG_PATH),
  name: BLOG_NAME,
  inLanguage: 'vi',
  publisher: { '@id': ORGANIZATION_ID },
  isPartOf: { '@id': WEBSITE_ID },
};

/** Trang chủ › Blog, then an optional category and page, shared by every blog page. */
export function getBlogBreadcrumbs(category?: BlogCategory, last?: Breadcrumb): Breadcrumb[] {
  return [
    { name: 'Trang chủ', path: '/' },
    { name: 'Blog', path: BLOG_PATH },
    ...(category ? [{ name: category.label, path: getCategoryPath(category.slug) }] : []),
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

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      blog,
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
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
        datePublished: toIsoDateTime(post.date),
        dateModified: toIsoDateTime(post.updated),
        author: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: SITE_CONFIG.name, url: SITE_CONFIG.url },
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: 'vi',
        articleSection: post.category.label,
        ...(post.tags.length > 0 && { keywords: post.tags.join(', ') }),
        isPartOf: { '@id': BLOG_ID },
      },
      breadcrumbList(getBlogBreadcrumbs(post.category, { name: post.title, path: post.url })),
    ],
  };
}

interface ListingStructuredDataInput {
  name: string;
  description: string;
  path: string;
  posts: BlogPost[];
  /** Position of the first post across all pages, so page 2 continues the numbering. */
  firstPosition: number;
  breadcrumbs: Breadcrumb[];
}

export function getListingStructuredData({
  name,
  description,
  path,
  posts,
  firstPosition,
  breadcrumbs,
}: ListingStructuredDataInput) {
  const url = absoluteUrl(path);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      website,
      blog,
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: 'vi',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': BLOG_ID },
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
