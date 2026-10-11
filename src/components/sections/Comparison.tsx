'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import { useLocale } from '@/lib/locale-context';
import { renderTitle } from '@/lib/render-title';

// Heroicons outline: minus-circle for the counter column, check-circle for Nutree.
const COUNTER_ICON = 'M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z';
const NUTREE_ICON = 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z';

// Desktop columns: label 28%, counter 32%, Nutree 40%, with no gap, so the panel behind the
// Nutree column can start at a plain 60%.
const COLUMNS = 'md:grid-cols-[28%_32%_40%]';
const HEAD_CELL = 'reveal text-xs font-bold uppercase tracking-[0.2em] md:px-6 md:pb-4 md:pt-7';
const MOBILE_LABEL = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] md:hidden';

function CellIcon({ path, className }: { path: string; className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('mt-0.5 h-5 w-5 shrink-0', className)}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export function Comparison() {
  const { t } = useLocale();
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const { columns, rows } = t.comparison;

  return (
    <section ref={ref} id="compare" data-inview={isInView} className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="reveal mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="section-eyebrow">{t.comparison.eyebrow}</p>
          <h2 className="section-title">{renderTitle(t.comparison.title)}</h2>
          <p className="section-subtitle">{t.comparison.subtitle}</p>
        </div>

        {/* Below md every row is a card. From md up the cards dissolve (display: contents) into
            one grid, and a single dark panel behind the third column makes Nutree's answers read
            as one continuous card that overhangs the table. */}
        <div className={cn('relative isolate mx-auto max-w-5xl md:grid', COLUMNS)}>
          <div
            aria-hidden="true"
            className="reveal absolute -bottom-5 -top-5 left-[60%] right-0 -z-10 hidden rounded-[2rem] bg-gradient-brand shadow-[0_30px_80px_-24px_rgba(26,71,57,0.55)] md:block"
          />

          <div className="hidden md:contents">
            <span aria-hidden="true" />
            <p className={cn(HEAD_CELL, 'text-muted')}>{columns.counter}</p>
            <p className={cn(HEAD_CELL, 'text-energy-lime')}>{columns.nutree}</p>
          </div>

          <div className="flex flex-col gap-4 md:contents">
            {rows.map((row, index) => {
              const isLast = index === rows.length - 1;
              const delay = { '--reveal-delay': `${index * 90}ms` } as React.CSSProperties;
              const rule = !isLast && 'md:border-b';

              return (
                <article
                  key={row.label}
                  className="rounded-2xl border border-border bg-white/70 p-5 shadow-glass md:contents"
                >
                  <h3
                    className={cn(
                      'reveal font-display text-lg font-bold text-foreground md:px-2 md:py-6 md:text-xl',
                      rule,
                      'md:border-border'
                    )}
                    style={delay}
                  >
                    {row.label}
                  </h3>

                  <div className={cn('reveal mt-4 md:mt-0 md:px-6 md:py-6', rule, 'md:border-border')} style={delay}>
                    <span className={cn(MOBILE_LABEL, 'text-muted/70')}>{columns.counter}</span>
                    <p className="flex items-start gap-2.5 leading-relaxed text-muted">
                      <CellIcon path={COUNTER_ICON} className="text-muted/50" />
                      <span>{row.counter}</span>
                    </p>
                  </div>

                  <div
                    className={cn(
                      'reveal mt-4 rounded-xl bg-primary-forest/[0.06] p-4 md:mt-0 md:rounded-none md:bg-transparent md:px-6 md:py-6',
                      rule,
                      'md:border-white/15'
                    )}
                    style={delay}
                  >
                    <span className={cn(MOBILE_LABEL, 'text-primary-emerald')}>{columns.nutree}</span>
                    <p className="flex items-start gap-2.5 font-medium leading-relaxed text-foreground md:text-white">
                      <CellIcon path={NUTREE_ICON} className="text-primary-teal md:text-energy-lime" />
                      <span>{row.nutree}</span>
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <p className="reveal mx-auto mt-10 max-w-xl text-center text-sm text-muted md:mt-14" style={{ '--reveal-delay': '360ms' } as React.CSSProperties}>
          {t.comparison.footnote}{' '}
          <a
            href="/faq"
            className="font-semibold text-primary-forest underline decoration-primary-teal/50 underline-offset-4 transition hover:decoration-primary-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            {t.comparison.footnoteLink}
          </a>
        </p>
      </div>
    </section>
  );
}
