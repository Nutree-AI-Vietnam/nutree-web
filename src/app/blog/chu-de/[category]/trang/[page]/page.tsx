import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogListing } from '@/components/blog/BlogListing';
import {
  BLOG_FEED_PATH,
  BLOG_NAME,
  getActiveCategories,
  getCategoryPath,
  getExtraPageNumbers,
  getPostsByCategory,
  parsePageNumber,
} from '@/lib/blog';
import { createPageMetadata } from '@/lib/seo';

interface CategoryNumberedPageProps {
  params: Promise<{ category: string; page: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getActiveCategories().flatMap((category) =>
    getExtraPageNumbers(getPostsByCategory(category.slug).length).map((page) => ({
      category: category.slug,
      page,
    }))
  );
}

async function resolvePage(params: CategoryNumberedPageProps['params']) {
  const { category: slug, page: segment } = await params;
  const category = getActiveCategories().find((item) => item.slug === slug);
  if (!category) return undefined;

  const posts = getPostsByCategory(category.slug);
  const page = parsePageNumber(segment, posts.length);
  return page ? { category, posts, page } : undefined;
}

export async function generateMetadata({ params }: CategoryNumberedPageProps): Promise<Metadata> {
  const resolved = await resolvePage(params);
  if (!resolved) return {};
  const { category, page } = resolved;

  return createPageMetadata({
    title: `${category.label} – Trang ${page} | ${BLOG_NAME}`,
    description: category.description,
    path: getCategoryPath(category.slug, page),
    feed: { url: BLOG_FEED_PATH, title: BLOG_NAME },
  });
}

export default async function CategoryNumberedPage({ params }: CategoryNumberedPageProps) {
  const resolved = await resolvePage(params);
  if (!resolved) notFound();
  const { category, posts, page } = resolved;

  return (
    <BlogListing
      posts={posts}
      page={page}
      category={category}
      getPagePath={(pageNumber) => getCategoryPath(category.slug, pageNumber)}
    />
  );
}
