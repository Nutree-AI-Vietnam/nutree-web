import type { PostHeading } from '@/components/blog/mdx';

/** Jump links to a post's sections; short posts with fewer than three skip it. */
export function TableOfContents({ headings }: { headings: PostHeading[] }) {
  if (headings.length < 3) return null;

  return (
    <nav aria-labelledby="toc-heading" className="mt-10 rounded-2xl border border-border bg-white p-5 md:p-6">
      <p id="toc-heading" className="text-xs font-bold uppercase tracking-[0.16em] text-primary-forest">
        Nội dung bài viết
      </p>
      <ol className="mt-3 space-y-1 text-[0.9375rem]">
        {headings.map((heading, index) => (
          <li key={heading.id} className="flex gap-3">
            <span aria-hidden="true" className="min-w-5 pt-1.5 font-semibold text-primary-teal">
              {index + 1}.
            </span>
            <a
              href={`#${heading.id}`}
              className="inline-flex min-h-9 items-center leading-snug text-foreground/85 transition-colors hover:text-primary-forest hover:underline"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
