import { BlogCta } from '@/components/blog/BlogCta';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { CategoryNav } from '@/components/blog/CategoryNav';
import { Pagination } from '@/components/blog/Pagination';
import { PostCard } from '@/components/blog/PostCard';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  BLOG_DESCRIPTION,
  BLOG_NAME,
  POSTS_PER_PAGE,
  getActiveCategories,
  getPageItems,
  getTotalPages,
  type BlogPost,
} from '@/lib/blog';
import type { BlogCategory } from '@/lib/blog-categories';
import { getBlogBreadcrumbs, getListingStructuredData } from '@/lib/blog-structured-data';

interface BlogListingProps {
  /** Every post in the listing, newest first; the current page is sliced from it. */
  posts: BlogPost[];
  page: number;
  /** Set on a category's pages; omitted on the all-posts listing. */
  category?: BlogCategory;
  getPagePath: (page: number) => string;
}

/** Shared body of /blog, its numbered pages and the category pages. */
export function BlogListing({ posts, page, category, getPagePath }: BlogListingProps) {
  const heading = category?.label ?? BLOG_NAME;
  const description = category?.description ?? BLOG_DESCRIPTION;
  const path = getPagePath(page);
  const pagePosts = getPageItems(posts, page);
  const breadcrumbs = getBlogBreadcrumbs(category, page > 1 ? { name: `Trang ${page}`, path } : undefined);

  return (
    <>
      <JsonLd
        data={getListingStructuredData({
          name: page > 1 ? `${heading} – Trang ${page}` : heading,
          description,
          path,
          posts: pagePosts,
          firstPosition: (page - 1) * POSTS_PER_PAGE + 1,
          breadcrumbs,
        })}
      />
      <div className="bg-gradient-to-b from-primary-teal/[0.07] via-background to-background pb-8 pt-24 md:pt-32">
        <div className="container mx-auto max-w-6xl px-4">
          <Breadcrumbs
            items={breadcrumbs.map((crumb, index) =>
              index === breadcrumbs.length - 1 ? { name: crumb.name } : crumb
            )}
          />
          <header className="mt-6 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary-forest">
              {category ? 'Chủ đề' : 'Kiến thức dinh dưỡng'}
            </p>
            <h1 className="mt-3 text-balance font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
              {heading}
              {page > 1 && <span className="text-muted"> · Trang {page}</span>}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>
          </header>

          <CategoryNav categories={getActiveCategories()} activeSlug={category?.slug} />

          {pagePosts.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post, index) => (
                <PostCard key={post.slug} post={post} priority={index === 0} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-3xl border border-dashed border-border bg-white/70 px-6 py-12 text-center text-muted">
              Bài viết đầu tiên sắp lên sóng. Bạn quay lại sau nhé!
            </p>
          )}

          <Pagination currentPage={page} totalPages={getTotalPages(posts.length)} getPagePath={getPagePath} />
        </div>
      </div>
      <BlogCta />
    </>
  );
}
