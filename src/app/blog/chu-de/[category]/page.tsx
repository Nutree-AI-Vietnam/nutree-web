import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogListing } from '@/components/blog/BlogListing';
import { BLOG_FEED_PATH, BLOG_NAME, getActiveCategories, getCategoryPath, getPostsByCategory } from '@/lib/blog';
import { createPageMetadata } from '@/lib/seo';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Only categories with posts get a page, so an empty topic never ships as a thin page.
export const dynamicParams = false;

export function generateStaticParams() {
  return getActiveCategories().map((category) => ({ category: category.slug }));
}

function findCategory(slug: string) {
  return getActiveCategories().find((category) => category.slug === slug);
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = findCategory((await params).category);
  if (!category) return {};

  return createPageMetadata({
    title: `${category.label} | ${BLOG_NAME}`,
    description: category.description,
    path: getCategoryPath(category.slug),
    feed: { url: BLOG_FEED_PATH, title: BLOG_NAME },
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = findCategory((await params).category);
  if (!category) notFound();

  return (
    <BlogListing
      posts={getPostsByCategory(category.slug)}
      page={1}
      category={category}
      getPagePath={(page) => getCategoryPath(category.slug, page)}
    />
  );
}
