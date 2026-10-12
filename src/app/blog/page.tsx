import { BlogListing } from '@/components/blog/BlogListing';
import { BLOG_DESCRIPTION, BLOG_FEED_PATH, BLOG_NAME, BLOG_PATH, getAllPosts, getBlogPagePath } from '@/lib/blog';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Blog dinh dưỡng Nutree: calo món Việt, giảm cân & thực đơn',
  description: BLOG_DESCRIPTION,
  path: BLOG_PATH,
  feed: { url: BLOG_FEED_PATH, title: BLOG_NAME },
});

export default function BlogPage() {
  return <BlogListing posts={getAllPosts()} page={1} getPagePath={getBlogPagePath} />;
}
