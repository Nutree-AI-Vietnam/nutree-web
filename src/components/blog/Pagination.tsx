import Link from 'next/link';
import { BLOG_LOCALES, type BlogLocale } from '@/lib/blog-locales';
import { cn } from '@/lib/cn';

interface PaginationProps {
  locale: BlogLocale;
  currentPage: number;
  totalPages: number;
  getPagePath: (page: number) => string;
}

const itemClassName =
  'inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors';

/** First, last and the pages around the current one, with gaps where pages are skipped. */
function getPageList(currentPage: number, totalPages: number): Array<number | 'gap'> {
  const pages = Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]))
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1 ? (['gap', page] as const) : [page]
  );
}

export function Pagination({ locale, currentPage, totalPages, getPagePath }: PaginationProps) {
  if (totalPages <= 1) return null;
  const { text } = BLOG_LOCALES[locale];

  return (
    <nav aria-label={text.pagination} className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={getPagePath(currentPage - 1)}
          className={cn(itemClassName, 'border border-border bg-white text-foreground hover:border-primary-teal')}
        >
          <span aria-hidden="true">←&nbsp;</span>{text.newer}
        </Link>
      )}
      <ol className="flex flex-wrap items-center gap-2">
        {getPageList(currentPage, totalPages).map((page, index) =>
          page === 'gap' ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={page}>
              {page === currentPage ? (
                <span aria-current="page" className={cn(itemClassName, 'bg-primary-forest text-white')}>
                  <span className="sr-only">{text.pageWord} </span>
                  {page}
                </span>
              ) : (
                <Link
                  href={getPagePath(page)}
                  className={cn(itemClassName, 'text-foreground hover:bg-primary-teal/10')}
                >
                  <span className="sr-only">{text.pageWord} </span>
                  {page}
                </Link>
              )}
            </li>
          )
        )}
      </ol>
      {currentPage < totalPages && (
        <Link
          href={getPagePath(currentPage + 1)}
          className={cn(itemClassName, 'border border-border bg-white text-foreground hover:border-primary-teal')}
        >
          {text.older}<span aria-hidden="true">&nbsp;→</span>
        </Link>
      )}
    </nav>
  );
}
