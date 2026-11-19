import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { componentsFor } from '@/components/blog/mdx';
import type { BlogPost } from '@/lib/blog';
import { BLOG_LOCALES } from '@/lib/blog-locales';
import { collectHeadings, imageFigures, type PostHeading } from '@/lib/blog-mdx-hast';

/** Compiles a post body to React, returning its h2 sections for the table of contents. */
export async function renderPostBody(post: BlogPost): Promise<{ content: React.ReactNode; headings: PostHeading[] }> {
  const headings: PostHeading[] = [];

  try {
    const { content } = await compileMDX({
      source: post.body,
      components: componentsFor(post.locale),
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, collectHeadings(headings), imageFigures(post.images)],
          remarkRehypeOptions: {
            footnoteLabel: BLOG_LOCALES[post.locale].text.footnotes,
            footnoteBackLabel: BLOG_LOCALES[post.locale].text.footnoteBack,
          },
        },
      },
    });
    return { content, headings };
  } catch (error) {
    throw new Error(`${BLOG_LOCALES[post.locale].contentDir}/${post.slug}.mdx: ${(error as Error).message}`);
  }
}
