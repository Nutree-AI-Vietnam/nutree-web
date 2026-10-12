import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogListing } from '@/components/blog/BlogListing';
import {
  BLOG_DESCRIPTION,
  BLOG_FEED_PATH,
  BLOG_NAME,
  getAllPosts,
  getBlogPagePath,
  getExtraPageNumbers,
  parsePageNumber,
} from '@/lib/blog';
import { createPageMetadata } from '@/lib/seo';

interface BlogPageProps {
  params: Promise<{ page: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getExtraPageNumbers(getAllPosts().length).map((page) => ({ page }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const page = parsePageNumber((await params).page, getAllPosts().length);
  if (!page) return {};

  return createPageMetadata({
    title: `${BLOG_NAME} – Trang ${page}`,
    description: BLOG_DESCRIPTION,
    path: getBlogPagePath(page),
    feed: { url: BLOG_FEED_PATH, title: BLOG_NAME },
  });
}

export default async function BlogNumberedPage({ params }: BlogPageProps) {
  const posts = getAllPosts();
  const page = parsePageNumber((await params).page, posts.length);
  if (!page) notFound();

  return <BlogListing posts={posts} page={page} getPagePath={getBlogPagePath} />;
}
