import type { ReactNode } from 'react';
import { BLOG_LOCALES, type BlogLocale } from '@/lib/blog-locales';
import { cn } from '@/lib/cn';

const CALLOUT_TYPES = {
  tip: {
    box: 'border-primary-teal bg-primary-teal/[0.07]',
    heading: 'text-primary-forest',
    icon: 'M9 18h6m-5 3h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z',
  },
  note: {
    box: 'border-primary-forest bg-primary-forest/[0.04]',
    heading: 'text-primary-forest',
    icon: 'M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  warning: {
    box: 'border-energy-orange bg-energy-orange-soft',
    heading: 'text-orange-800',
    icon: 'M12 9v4m0 4h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  },
} as const;

interface CalloutProps {
  /** "tip" (default), "note" or "warning". */
  type?: string;
  /** Heading in place of the type's default label. */
  title?: string;
  /** Language of the default label; mdx.tsx sets it from the post. */
  locale?: BlogLocale;
  children?: ReactNode;
}

/** A highlighted box inside an article, written in MDX as <Callout type="tip">...</Callout>. */
export function Callout({ type = 'tip', title, locale = 'vi', children }: CalloutProps) {
  const kind = type in CALLOUT_TYPES ? (type as keyof typeof CALLOUT_TYPES) : 'tip';
  const style = CALLOUT_TYPES[kind];

  return (
    <aside className={cn('my-7 rounded-2xl border-l-4 px-5 py-4 md:px-6 md:py-5', style.box)}>
      <p className={cn('flex items-center gap-2 font-display text-base font-bold', style.heading)}>
        <svg
          aria-hidden="true"
          className="h-5 w-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={style.icon} />
        </svg>
        {title ?? BLOG_LOCALES[locale].text.callout[kind]}
      </p>
      <div className="mt-2 text-foreground/85 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_li]:my-1 [&_p]:my-2">
        {children}
      </div>
    </aside>
  );
}
