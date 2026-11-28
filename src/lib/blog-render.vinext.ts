import { createElement } from 'react';
import { componentsFor } from '@/components/blog/mdx';
import type { BlogPost } from '@/lib/blog';
import { BLOG_LOCALES } from '@/lib/blog-locales';
import type { PostHeading } from '@/lib/blog-mdx-hast';
import { posts } from 'nutree:blog-mdx';

/** Uses the MDX modules compiled while the Worker was built. */
export async function renderPostBody(post: BlogPost): Promise<{ content: React.ReactNode; headings: PostHeading[] }> {
  const compiled = posts[`${post.locale}:${post.slug}`];
  if (!compiled) {
    throw new Error(`${BLOG_LOCALES[post.locale].contentDir}/${post.slug}.mdx: compiled module is missing`);
  }
  return {
    content: createElement(compiled.Content, { components: componentsFor(post.locale) }),
    headings: compiled.headings,
  };
}
