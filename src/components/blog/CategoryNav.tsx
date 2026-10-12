import Link from 'next/link';
import { BLOG_PATH, getCategoryPath } from '@/lib/blog';
import type { BlogCategory } from '@/lib/blog-categories';
import { cn } from '@/lib/cn';

interface CategoryNavProps {
  categories: BlogCategory[];
  /** Slug of the category being viewed; undefined on the all-posts listing. */
  activeSlug?: string;
}

const chipClassName =
  'inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors';
const activeClassName = 'border-primary-forest bg-primary-forest text-white';
const idleClassName = 'border-border bg-white text-foreground/80 hover:border-primary-teal hover:text-primary-forest';

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  if (categories.length < 2) return null;

  return (
    <nav aria-label="Chủ đề" className="mt-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href={BLOG_PATH}
            aria-current={activeSlug ? undefined : 'true'}
            className={cn(chipClassName, activeSlug ? idleClassName : activeClassName)}
          >
            Tất cả
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={getCategoryPath(category.slug)}
              aria-current={category.slug === activeSlug ? 'true' : undefined}
              className={cn(chipClassName, category.slug === activeSlug ? activeClassName : idleClassName)}
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
