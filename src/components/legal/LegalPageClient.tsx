'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { LegalPageContent, LegalSection } from '@/lib/legal-content';
import { LEGAL_LINKS } from '@/lib/legal-company';
import type { Locale } from '@/lib/translations';
import { useLocale } from '@/lib/locale-context';

interface LegalPageClientProps {
  content: Record<Locale, LegalPageContent>;
  siblingHref: '/privacy' | '/terms';
  siblingKey: 'privacy' | 'terms';
}

export function LegalPageClient({ content, siblingHref, siblingKey }: LegalPageClientProps) {
  const { locale } = useLocale();
  const page = content[locale];
  const legalLocale = locale === 'vi' ? 'vi' : 'en';

  useEffect(() => {
    document.title = `${page.title} | Nutree`;
  }, [page.title]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-white to-primary-teal/5">
      <div className="container mx-auto max-w-3xl px-4 py-20">
        <Link href="/" className="mb-8 inline-flex text-sm font-medium text-primary-forest hover:text-primary-teal">
          {page.backHome}
        </Link>

        <header className="mb-12 border-b border-border/50 pb-8">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{page.title}</h1>
          <p className="mt-3 text-muted">{page.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
            <span><strong>{locale === 'vi' ? 'Ngày hiệu lực' : 'Effective Date'}:</strong> {page.effectiveDate}</span>
            <span><strong>{locale === 'vi' ? 'Cập nhật lần cuối' : 'Last Updated'}:</strong> {page.updatedDate}</span>
            <span><strong>{locale === 'vi' ? 'Phiên bản' : 'Version'}:</strong> {page.version}</span>
          </div>
        </header>

        <TableOfContents page={page} />

        <div className="space-y-10 text-muted">
          {page.sections.map((section, index) => (
            <LegalSectionView
              key={section.title}
              index={index + 1}
              section={section}
              headers={page.tableHeaders}
            />
          ))}
        </div>

        <nav
          aria-label={legalLocale === 'vi' ? 'Chính sách pháp lý' : 'Legal policies'}
          className="mt-14 rounded-xl border border-border/50 bg-white/50 p-5"
        >
          <h2 className="font-display mb-3 text-sm font-semibold text-foreground">
            {legalLocale === 'vi' ? 'Các chính sách pháp lý' : 'Legal policies'}
          </h2>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {LEGAL_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-primary-forest hover:text-primary-teal">
                  {item.label[legalLocale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="mt-16 border-t border-border/50 pt-8 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} {page.copyright}</p>
          <p className="mt-2">
            <Link href={siblingHref} className="text-primary-forest hover:text-primary-teal">
              {page.links[siblingKey]}
            </Link>
            <span className="mx-2">|</span>
            <Link href="/" className="text-primary-forest hover:text-primary-teal">{page.home}</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}

function TableOfContents({ page }: { page: LegalPageContent }) {
  return (
    <nav className="mb-12 rounded-xl border border-border/50 bg-white/50 p-6">
      <h2 className="mb-4 font-display font-semibold text-foreground">{page.toc}</h2>
      <ol className="grid list-inside list-decimal gap-2 text-sm text-muted md:grid-cols-2">
        {page.sections.map((section, index) => (
          <li key={section.title}>
            <a href={`#section-${index + 1}`} className="hover:text-primary-forest">{section.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function LegalSectionView({ index, section, headers }: { index: number; section: LegalSection; headers?: [string, string, string] }) {
  return (
    <section id={`section-${index}`} className="scroll-mt-8">
      <h2 className="mb-4 flex items-center gap-3 font-display text-xl font-semibold text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-sm font-bold text-primary-forest">{index}</span>
        {section.title}
      </h2>
      <div className="space-y-4 pl-11">
        {section.body?.map((paragraph) => (
          <p key={paragraph}>
            <RichLegalText text={paragraph} />
          </p>
        ))}
        {section.table && headers && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  {headers.map((header) => <th key={header} className="px-4 py-3 text-left text-foreground">{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {section.table.map(([service, purpose, data]) => (
                  <tr key={service} className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium text-foreground">{service}</td>
                    <td className="px-4 py-3">{purpose}</td>
                    <td className="px-4 py-3">{data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/** Renders markdown-style [label](href) plus bare emails and https URLs as links. */
function RichLegalText({ text }: { text: string }) {
  const linkClass = 'text-primary-forest underline-offset-2 hover:text-primary-teal hover:underline';
  // Split on [label](href), emails, and https URLs while keeping delimiters
  const tokenPattern =
    /(\[[^\]]+\]\([^)]+\)|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?:\/\/[^\s)]+)/g;
  const parts = text.split(tokenPattern).filter((part) => part.length > 0);

  return (
    <>
      {parts.map((part, i) => {
        const md = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (md) {
          const [, label, href] = md;
          const isInternal = href.startsWith('/');
          if (isInternal) {
            return (
              <Link key={`${i}-${href}`} href={href} className={linkClass}>
                {label}
              </Link>
            );
          }
          return (
            <a
              key={`${i}-${href}`}
              href={href}
              className={linkClass}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {label}
            </a>
          );
        }
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
          return (
            <a key={`${i}-${part}`} href={`mailto:${part}`} className={linkClass}>
              {part}
            </a>
          );
        }
        if (/^https?:\/\//.test(part)) {
          return (
            <a
              key={`${i}-${part}`}
              href={part}
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part.replace(/^https?:\/\//, '')}
            </a>
          );
        }
        return <span key={`${i}-${part.slice(0, 12)}`}>{part}</span>;
      })}
    </>
  );
}
