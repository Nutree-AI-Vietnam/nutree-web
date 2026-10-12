import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogCta } from '@/components/blog/BlogCta';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { PostCard } from '@/components/blog/PostCard';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { renderPostBody } from '@/components/blog/mdx';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  BLOG_FEED_PATH,
  BLOG_NAME,
  formatPostDate,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  toIsoDateTime,
} from '@/lib/blog';
import { getBlogBreadcrumbs, getPostStructuredData } from '@/lib/blog-structured-data';
import { createPageMetadata } from '@/lib/seo';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post) return {};

  return createPageMetadata({
    title: `${post.title} | Nutree`,
    description: post.description,
    path: post.url,
    image: post.image && { url: post.image.src, alt: post.image.alt },
    article: {
      publishedTime: toIsoDateTime(post.date),
      modifiedTime: toIsoDateTime(post.updated),
      section: post.category.label,
      tags: post.tags,
    },
    keywords: post.tags,
    feed: { url: BLOG_FEED_PATH, title: BLOG_NAME },
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();

  const { content, headings } = await renderPostBody(post);
  const relatedPosts = getRelatedPosts(post);

  return (
    <>
      <JsonLd data={getPostStructuredData(post)} />
      <div className="bg-gradient-to-b from-primary-teal/[0.07] via-background to-background pb-8 pt-24 md:pt-32">
        <article className="container mx-auto max-w-3xl px-4">
          <header>
            {/* The title is the page's h1, so the trail stops at the category. */}
            <Breadcrumbs items={getBlogBreadcrumbs(post.category)} />
            {post.draft && (
              <p className="mt-6 inline-flex rounded-full bg-energy-orange-soft px-3 py-1 text-sm font-semibold text-orange-800">
                Bản nháp: chỉ hiện khi chạy dev, không lên production
              </p>
            )}
            <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-tight text-foreground md:text-[2.75rem] md:leading-[1.15]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">{post.description}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
              <span className="font-semibold text-foreground">Đội ngũ Nutree</span>
              <span aria-hidden="true">·</span>
              <span>
                Đăng <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </span>
              {post.updated !== post.date && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Cập nhật <time dateTime={post.updated}>{formatPostDate(post.updated)}</time>
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} phút đọc</span>
            </p>
          </header>

          {post.image && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-primary-forest/5">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                priority
                sizes="(min-width: 768px) 736px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          <TableOfContents headings={headings} />

          <div className="mt-8">{content}</div>

          {post.tags.length > 0 && (
            <ul aria-label="Từ khoá" className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-primary-forest/[0.06] px-3 py-1 text-sm text-primary-forest">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <aside
            aria-label="Lưu ý về nội dung sức khoẻ"
            className="mt-10 rounded-2xl border border-border bg-white p-5 text-sm leading-relaxed text-muted"
          >
            Bài viết chỉ nhằm cung cấp thông tin tham khảo, không thay thế chẩn đoán hay tư vấn của bác sĩ
            hoặc chuyên gia dinh dưỡng. Nếu bạn đang mang thai, cho con bú, có bệnh lý nền hoặc đang dùng
            thuốc, hãy hỏi ý kiến chuyên gia trước khi thay đổi chế độ ăn. Xem cách Nutree chọn{' '}
            <Link
              href="/research"
              className="font-medium text-primary-forest underline decoration-primary-teal decoration-2 underline-offset-[3px]"
            >
              nguồn khoa học
            </Link>
            .
          </aside>
        </article>

        {relatedPosts.length > 0 && (
          <section aria-labelledby="related-posts" className="container mx-auto mt-20 max-w-6xl px-4">
            <h2 id="related-posts" className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Bài viết liên quan
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.slug} post={relatedPost} headingLevel="h3" />
              ))}
            </div>
          </section>
        )}
      </div>
      <BlogCta />
    </>
  );
}
