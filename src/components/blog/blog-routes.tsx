import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogCta } from '@/components/blog/BlogCta';
import { BlogListing } from '@/components/blog/BlogListing';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { PostCard } from '@/components/blog/PostCard';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { renderPostBody } from '@/components/blog/mdx';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  formatPostDate,
  getActiveCategories,
  getAllPosts,
  getBlogPagePath,
  getCategoryPath,
  getCategoryPaths,
  getExtraPageNumbers,
  getLanguageAlternates,
  getPostBySlug,
  getPostPaths,
  getPostsByCategory,
  getRelatedPosts,
  getTranslation,
  parsePageNumber,
  toIsoDateTime,
} from '@/lib/blog';
import { BLOG_LOCALES, BLOG_LOCALE_LIST, type BlogLocale } from '@/lib/blog-locales';
import { getBlogBreadcrumbs, getPostStructuredData } from '@/lib/blog-structured-data';
import { createPageMetadata } from '@/lib/seo';

/*
 * Every blog route, built once per language. The page files under src/app/blog and src/app/en/blog
 * only pick the language and re-export these, so the two blogs never drift apart.
 */

function listingMetadata(locale: BlogLocale, input: { title: string; description: string; path: string; languages?: Record<string, string> }) {
  const config = BLOG_LOCALES[locale];
  return createPageMetadata({
    ...input,
    ogLocale: config.ogLocale,
    feed: { url: config.feedPath, title: config.name },
  });
}

/** <locale path>: the blog index. Both languages always have one, so they pair with hreflang. */
export function blogIndexRoute(locale: BlogLocale) {
  const config = BLOG_LOCALES[locale];

  return {
    metadata: listingMetadata(locale, {
      title: config.indexTitle,
      description: config.description,
      path: config.path,
      languages: getLanguageAlternates(
        Object.fromEntries(BLOG_LOCALE_LIST.map((item) => [item, BLOG_LOCALES[item].path]))
      ),
    }),
    Page: function BlogIndexPage() {
      return (
        <BlogListing
          locale={locale}
          posts={getAllPosts(locale)}
          page={1}
          getPagePath={(page) => getBlogPagePath(locale, page)}
        />
      );
    },
  };
}

interface NumberedPageProps {
  params: Promise<{ page: string }>;
}

/** <locale path>/<page segment>/<n>: older posts. */
export function blogNumberedRoute(locale: BlogLocale) {
  const config = BLOG_LOCALES[locale];

  return {
    generateStaticParams: () => getExtraPageNumbers(getAllPosts(locale).length).map((page) => ({ page })),
    generateMetadata: async ({ params }: NumberedPageProps): Promise<Metadata> => {
      const page = parsePageNumber((await params).page, getAllPosts(locale).length);
      if (!page) return {};
      return listingMetadata(locale, {
        title: `${config.name} – ${config.text.page(page)}`,
        description: config.description,
        path: getBlogPagePath(locale, page),
      });
    },
    Page: async function BlogNumberedPage({ params }: NumberedPageProps) {
      const posts = getAllPosts(locale);
      const page = parsePageNumber((await params).page, posts.length);
      if (!page) notFound();
      return (
        <BlogListing
          locale={locale}
          posts={posts}
          page={page}
          getPagePath={(pageNumber) => getBlogPagePath(locale, pageNumber)}
        />
      );
    },
  };
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

/** <locale path>/<category segment>/<category>. Only categories with posts get a page. */
export function categoryRoute(locale: BlogLocale) {
  const config = BLOG_LOCALES[locale];
  const findCategory = (slug: string) => getActiveCategories(locale).find((category) => category.slug === slug);

  return {
    generateStaticParams: () => getActiveCategories(locale).map((category) => ({ category: category.slug })),
    generateMetadata: async ({ params }: CategoryPageProps): Promise<Metadata> => {
      const category = findCategory((await params).category);
      if (!category) return {};
      return listingMetadata(locale, {
        title: `${category.label} | ${config.name}`,
        description: category.description,
        path: getCategoryPath(locale, category.slug),
        languages: getLanguageAlternates(getCategoryPaths(category)),
      });
    },
    Page: async function CategoryPage({ params }: CategoryPageProps) {
      const category = findCategory((await params).category);
      if (!category) notFound();
      return (
        <BlogListing
          locale={locale}
          posts={getPostsByCategory(locale, category.slug)}
          page={1}
          category={category}
          getPagePath={(page) => getCategoryPath(locale, category.slug, page)}
        />
      );
    },
  };
}

interface CategoryNumberedPageProps {
  params: Promise<{ category: string; page: string }>;
}

/** <locale path>/<category segment>/<category>/<page segment>/<n>. */
export function categoryNumberedRoute(locale: BlogLocale) {
  const config = BLOG_LOCALES[locale];

  async function resolvePage(params: CategoryNumberedPageProps['params']) {
    const { category: slug, page: segment } = await params;
    const category = getActiveCategories(locale).find((item) => item.slug === slug);
    if (!category) return undefined;
    const posts = getPostsByCategory(locale, category.slug);
    const page = parsePageNumber(segment, posts.length);
    return page ? { category, posts, page } : undefined;
  }

  return {
    generateStaticParams: () =>
      getActiveCategories(locale).flatMap((category) =>
        getExtraPageNumbers(getPostsByCategory(locale, category.slug).length).map((page) => ({
          category: category.slug,
          page,
        }))
      ),
    generateMetadata: async ({ params }: CategoryNumberedPageProps): Promise<Metadata> => {
      const resolved = await resolvePage(params);
      if (!resolved) return {};
      const { category, page } = resolved;
      return listingMetadata(locale, {
        title: `${category.label} – ${config.text.page(page)} | ${config.name}`,
        description: category.description,
        path: getCategoryPath(locale, category.slug, page),
      });
    },
    Page: async function CategoryNumberedPage({ params }: CategoryNumberedPageProps) {
      const resolved = await resolvePage(params);
      if (!resolved) notFound();
      const { category, posts, page } = resolved;
      return (
        <BlogListing
          locale={locale}
          posts={posts}
          page={page}
          category={category}
          getPagePath={(pageNumber) => getCategoryPath(locale, category.slug, pageNumber)}
        />
      );
    },
  };
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

/** <locale path>/<slug>: one article. */
export function postRoute(locale: BlogLocale) {
  const config = BLOG_LOCALES[locale];
  const { text } = config;
  const linkClassName =
    'font-medium text-primary-forest underline decoration-primary-teal decoration-2 underline-offset-[3px]';

  return {
    generateStaticParams: () => getAllPosts(locale).map((post) => ({ slug: post.slug })),
    generateMetadata: async ({ params }: PostPageProps): Promise<Metadata> => {
      const post = getPostBySlug(locale, (await params).slug);
      if (!post) return {};

      return createPageMetadata({
        title: `${post.title} | Nutree`,
        description: post.description,
        path: post.url,
        image: post.image && {
          url: post.image.src,
          alt: post.image.alt,
          width: post.image.width,
          height: post.image.height,
        },
        article: {
          publishedTime: toIsoDateTime(post.date),
          modifiedTime: toIsoDateTime(post.updated),
          section: post.category.label,
          tags: post.tags,
        },
        keywords: post.tags,
        feed: { url: config.feedPath, title: config.name },
        ogLocale: config.ogLocale,
        languages: getLanguageAlternates(getPostPaths(post)),
      });
    },
    Page: async function PostPage({ params }: PostPageProps) {
      const post = getPostBySlug(locale, (await params).slug);
      if (!post) notFound();

      const { content, headings } = await renderPostBody(post);
      const relatedPosts = getRelatedPosts(post);
      const translation = getTranslation(post);

      return (
        <>
          <JsonLd data={getPostStructuredData(post)} />
          <div
            lang={config.htmlLang}
            className="bg-gradient-to-b from-primary-teal/[0.07] via-background to-background pb-8 pt-24 md:pt-32"
          >
            <article className="container mx-auto max-w-3xl px-4">
              <header>
                {/* The title is the page's h1, so the trail stops at the category. */}
                <Breadcrumbs items={getBlogBreadcrumbs(locale, post.category)} />
                {post.draft && (
                  <p className="mt-6 inline-flex rounded-full bg-energy-orange-soft px-3 py-1 text-sm font-semibold text-orange-800">
                    {text.draftBadge}
                  </p>
                )}
                <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-tight text-foreground md:text-[2.75rem] md:leading-[1.15]">
                  {post.title}
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">{post.description}</p>
                <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                  <span className="font-semibold text-foreground">{text.byline}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {text.published} <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
                  </span>
                  {post.updated !== post.date && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        {text.updated} <time dateTime={post.updated}>{formatPostDate(post.updated, locale)}</time>
                      </span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>{text.minutesRead(post.readingMinutes)}</span>
                </p>
                {translation && (
                  <p className="mt-3 text-sm">
                    {/* The link text is in the other language, so it is marked as such. */}
                    <Link
                      href={translation.url}
                      hrefLang={BLOG_LOCALES[translation.locale].htmlLang}
                      lang={BLOG_LOCALES[translation.locale].htmlLang}
                      className={linkClassName}
                    >
                      {text.readIn}
                    </Link>
                  </p>
                )}
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

              <TableOfContents headings={headings} locale={locale} />

              <div className="mt-8">{content}</div>

              {post.tags.length > 0 && (
                <ul aria-label={text.tags} className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-primary-forest/[0.06] px-3 py-1 text-sm text-primary-forest">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              <aside
                aria-label={text.disclaimerLabel}
                className="mt-10 rounded-2xl border border-border bg-white p-5 text-sm leading-relaxed text-muted"
              >
                {text.disclaimer}{' '}
                <Link href="/research" className={linkClassName}>
                  {text.disclaimerLink}
                </Link>
                .
              </aside>
            </article>

            {relatedPosts.length > 0 && (
              <section aria-labelledby="related-posts" className="container mx-auto mt-20 max-w-6xl px-4">
                <h2 id="related-posts" className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  {text.related}
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
    },
  };
}
