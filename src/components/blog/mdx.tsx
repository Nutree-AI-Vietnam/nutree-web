import type { ComponentProps } from 'react';
import type { Element, ElementContent, Root, RootContent } from 'hast';
import Image from 'next/image';
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { AppCta } from '@/components/blog/AppCta';
import { Callout } from '@/components/blog/Callout';
import type { BlogPost, PostImage } from '@/lib/blog';
import { BLOG_LOCALES, type BlogLocale } from '@/lib/blog-locales';
import { cn } from '@/lib/cn';
import { SITE_CONFIG } from '@/lib/constants';

export interface PostHeading {
  id: string;
  text: string;
}

const bodyText = 'text-[1.0625rem] leading-[1.8] text-foreground/85 md:text-lg';

function MdxLink({ href = '', className, children, locale, ...props }: ComponentProps<'a'> & { locale: BlogLocale }) {
  const linkClassName = cn(
    'font-medium text-primary-forest underline decoration-primary-teal decoration-2 underline-offset-[3px] transition-colors hover:decoration-primary-forest',
    className
  );
  const sitePath = href.startsWith(SITE_CONFIG.url) ? href.slice(SITE_CONFIG.url.length) || '/' : href;

  if (sitePath.startsWith('/') && !sitePath.startsWith('//')) {
    return (
      <Link href={sitePath} className={linkClassName} {...props}>
        {children}
      </Link>
    );
  }
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName} {...props}>
        {children}
        <span className="sr-only"> {BLOG_LOCALES[locale].text.opensInNewTab}</span>
      </a>
    );
  }
  return (
    <a href={href} className={linkClassName} {...props}>
      {children}
    </a>
  );
}

/** Styles for the HTML that Markdown produces, plus the custom components posts may use. */
const components = {
  h2: ({ className, ...props }: ComponentProps<'h2'>) => (
    <h2
      className={cn(
        // GFM labels its footnotes with a screen-reader-only h2; keep that one hidden.
        className?.includes('sr-only')
          ? className
          : 'mb-4 mt-12 scroll-mt-6 text-balance font-display text-2xl font-bold leading-snug text-foreground md:text-[1.75rem]'
      )}
      {...props}
    />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3
      className="mb-3 mt-9 scroll-mt-6 font-display text-xl font-bold leading-snug text-foreground md:text-[1.375rem]"
      {...props}
    />
  ),
  h4: (props: ComponentProps<'h4'>) => (
    <h4 className="mb-2 mt-7 scroll-mt-6 font-display text-lg font-semibold text-foreground" {...props} />
  ),
  p: (props: ComponentProps<'p'>) => <p className={cn('my-5', bodyText)} {...props} />,
  ul: (props: ComponentProps<'ul'>) => (
    <ul className={cn('my-5 list-disc space-y-2 pl-6 marker:text-primary-teal', bodyText)} {...props} />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol
      className={cn('my-5 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-primary-forest', bodyText)}
      {...props}
    />
  ),
  li: (props: ComponentProps<'li'>) => (
    <li className="pl-1.5 [&>ol]:my-2 [&>p]:my-2 [&>ul]:my-2" {...props} />
  ),
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote
      className="my-7 border-l-4 border-primary-teal bg-primary-teal/5 py-1 pl-5 pr-4 [&>p]:my-3"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  strong: (props: ComponentProps<'strong'>) => <strong className="font-semibold text-foreground" {...props} />,
  code: (props: ComponentProps<'code'>) => (
    <code
      className="rounded-md bg-primary-forest/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] text-primary-forest"
      {...props}
    />
  ),
  pre: (props: ComponentProps<'pre'>) => (
    <pre
      className="my-6 overflow-x-auto rounded-2xl bg-foreground p-5 text-sm leading-relaxed text-white [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
      {...props}
    />
  ),
  table: (props: ComponentProps<'table'>) => (
    // Wide tables scroll inside their frame instead of widening the page on phones; the
    // tabIndex lets keyboard users scroll it too.
    <div tabIndex={0} className="my-8 overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="w-full border-collapse text-left text-[0.9375rem] [&_tr:last-child>td]:border-0" {...props} />
    </div>
  ),
  thead: (props: ComponentProps<'thead'>) => <thead className="bg-primary-forest/[0.04]" {...props} />,
  th: (props: ComponentProps<'th'>) => (
    <th className="border-b border-border px-4 py-3 font-semibold text-foreground" {...props} />
  ),
  td: (props: ComponentProps<'td'>) => (
    <td className="border-b border-border/60 px-4 py-3 align-top text-foreground/85" {...props} />
  ),
  figure: (props: ComponentProps<'figure'>) => <figure className="my-8" {...props} />,
  figcaption: (props: ComponentProps<'figcaption'>) => (
    <figcaption className="mt-3 text-balance text-center text-sm leading-relaxed text-muted" {...props} />
  ),
  img: ({ src, alt = '', width, height, ...props }: ComponentProps<'img'>) =>
    // imageFigures gives every image the post validated its pixel size, so next/image can resize it.
    typeof src === 'string' && width && height ? (
      <Image
        src={src}
        alt={alt}
        width={Number(width)}
        height={Number(height)}
        sizes="(min-width: 768px) 736px, 100vw"
        className="h-auto w-full rounded-2xl bg-primary-forest/5"
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} loading="lazy" decoding="async" className="mx-auto block h-auto max-w-full rounded-2xl" {...props} />
    ),
  section: ({ className, ...props }: ComponentProps<'section'>) => (
    <section
      className={cn(
        className,
        className?.includes('footnotes') &&
          'mt-12 border-t border-border pt-6 text-sm text-muted [&_li]:pl-1 [&_ol]:text-sm [&_p]:my-1 [&_p]:text-sm'
      )}
      {...props}
    />
  ),
};

/** The components with the post's language bound, for link labels and component text. */
function componentsFor(locale: BlogLocale) {
  return {
    ...components,
    a: (props: ComponentProps<'a'>) => <MdxLink {...props} locale={locale} />,
    Callout: (props: ComponentProps<typeof Callout>) => <Callout {...props} locale={locale} />,
    AppCta: () => <AppCta locale={locale} />,
  };
}

/** Compiles a post body to React, returning its h2 sections for the table of contents. */
export async function renderPostBody(post: BlogPost) {
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

/** Records each top-level h2 after rehype-slug has given it an id. */
function collectHeadings(headings: PostHeading[]) {
  return () => (tree: Root) => {
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2' && typeof node.properties.id === 'string') {
        headings.push({ id: node.properties.id, text: textOf(node).trim() });
      }
    }
  };
}

/**
 * Turns each image standing alone in a paragraph into a figure captioned with its Markdown title,
 * and gives it the pixel size the loader read from the file.
 */
function imageFigures(images: PostImage[]) {
  const bySrc = new Map(images.map((image) => [image.src, image]));

  const toFigure = (node: Element): Element | undefined => {
    const content = node.children.filter((child) => child.type !== 'text' || child.value.trim());
    const [img] = content;
    if (node.tagName !== 'p' || content.length !== 1 || img?.type !== 'element' || img.tagName !== 'img') {
      return undefined;
    }
    const image = bySrc.get(String(img.properties.src));
    const { title } = img.properties;
    delete img.properties.title;
    if (image) Object.assign(img.properties, { width: image.width, height: image.height });

    const caption = image?.caption ?? (typeof title === 'string' ? title.trim() : '');
    const children: ElementContent[] = [img];
    if (caption) {
      children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] });
    }
    return { type: 'element', tagName: 'figure', properties: {}, children };
  };

  // Callouts are MDX elements rather than HTML ones, so walk anything with children.
  const walk = (parent: { children: Array<RootContent | ElementContent> }) => {
    parent.children.forEach((child, index) => {
      const figure = child.type === 'element' ? toFigure(child) : undefined;
      if (figure) parent.children[index] = figure;
      else if ('children' in child) walk(child);
    });
  };

  return () => (tree: Root) => walk(tree);
}

function textOf(node: Element | ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}
