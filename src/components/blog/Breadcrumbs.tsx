import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  /** Omitted for the current page, which renders as plain text. */
  path?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-foreground/30">
                /
              </span>
            )}
            {item.path ? (
              <Link
                href={item.path}
                className="inline-flex min-h-8 items-center transition-colors hover:text-primary-forest"
              >
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
