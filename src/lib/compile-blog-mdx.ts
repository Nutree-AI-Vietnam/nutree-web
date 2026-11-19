import { compile } from '@mdx-js/mdx';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { BLOG_LOCALES, type BlogLocale } from './blog-locales';
import { collectHeadings, imageFigures, type MdxSizedImage } from './blog-mdx-hast';

/** JS module for one post. Vite bundles it, so the Worker never evaluates a string. */
export async function compileBlogModule(body: string, locale: BlogLocale, images: MdxSizedImage[]): Promise<string> {
  const headings: { id: string; text: string }[] = [];
  const text = BLOG_LOCALES[locale].text;
  const file = await compile(body, {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, collectHeadings(headings), imageFigures(images)],
    remarkRehypeOptions: {
      footnoteLabel: text.footnotes,
      footnoteBackLabel: text.footnoteBack,
    },
  });
  return `${String(file)}\nexport const headings = ${JSON.stringify(headings)};\n`;
}
