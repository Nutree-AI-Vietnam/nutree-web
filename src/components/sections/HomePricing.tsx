'use client';

import { useRouter } from 'next/navigation';
import { SpotlightGroup } from '@/components/ui/SpotlightGroup';
import { useInView } from '@/hooks/useInView';
import { useLocale } from '@/lib/locale-context';
import { payPageContent } from '@/lib/pay-page-content';
import type { PayPlanCopy } from '@/lib/pay-page-content';
import { renderTitle } from '@/lib/render-title';
import { cn } from '@/lib/cn';

// Heroicons outline paths: qr-code, envelope, device-phone-mobile.
const ASSURANCES = [
  {
    key: 'payment',
    path: 'M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z',
  },
  {
    key: 'activation',
    path: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  },
  {
    key: 'devices',
    path: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
  },
] as const;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn('mt-0.5 h-5 w-5 shrink-0', className)}
    >
      <path
        d="M16.5 5.5 8.25 14.25 3.5 9.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// "399.000đ/yr*" -> "399.000đ" + "/yr*", so the billing period can sit smaller beside the amount.
function splitPrice(price: string) {
  const slash = price.indexOf('/');
  return slash === -1
    ? { amount: price, period: '' }
    : { amount: price.slice(0, slash), period: price.slice(slash) };
}

function MarketingPlanCard({
  plan,
  index,
  onSelect,
}: {
  plan: PayPlanCopy;
  index: number;
  onSelect: (planId: PayPlanCopy['id']) => void;
}) {
  const highlighted = Boolean(plan.highlight);
  const { amount, period } = splitPrice(plan.price);

  return (
    <article
      // On phones the recommended plan comes first; side by side it keeps its place.
      className={cn('reveal h-full', highlighted && 'order-first md:order-none')}
      style={{ '--reveal-delay': `${120 + index * 80}ms` } as React.CSSProperties}
    >
      {/* The lift lives on this inner box because the reveal owns the article's transform. */}
      <div
        className={cn(
          'relative h-full rounded-[1.75rem] transition-transform duration-300 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
          // The highlighted plan sits inside a 1.5px frame that a rotating beam of light runs around.
          highlighted && 'isolate overflow-hidden bg-primary-teal/30 p-[1.5px] shadow-glow-lg'
        )}
      >
        {highlighted ? (
          <span
            aria-hidden="true"
            className="beam-spin pointer-events-none bg-[conic-gradient(from_0deg,transparent_0deg,rgba(163,230,53,0.95)_50deg,rgba(255,255,255,0.9)_80deg,transparent_140deg,transparent_360deg)]"
          />
        ) : null}

        <div
          className={cn(
            'relative flex h-full flex-col overflow-hidden p-7 md:p-8',
            highlighted
              ? 'rounded-[calc(1.75rem_-_1.5px)] bg-gradient-to-br from-primary-forest via-primary-emerald to-primary-teal text-white'
              : 'spotlight-card rounded-[1.75rem] border border-white/60 bg-white/65 shadow-glass transition-shadow duration-300 hover:shadow-glass-lg'
          )}
        >
          {highlighted ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-36 -top-36 h-[22rem] w-[22rem] bg-[radial-gradient(closest-side,rgba(163,230,53,0.22),transparent)]"
            />
          ) : null}

          {plan.badge ? (
            <span
              className={cn(
                'absolute right-5 top-5 z-10 inline-flex min-h-8 items-center rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.14em]',
                highlighted
                  ? 'bg-white/20 text-white'
                  : 'bg-primary-forest/10 text-primary-forest'
              )}
            >
              {plan.badge}
            </span>
          ) : null}

          <div className="relative">
            <p
              className={cn(
                'pr-28 text-sm font-semibold uppercase tracking-[0.18em]',
                highlighted ? 'text-white/75' : 'text-primary-forest/70'
              )}
            >
              {plan.name}
            </p>
            <p
              className={cn(
                'mt-3 font-display tracking-tight',
                highlighted ? 'text-white' : 'text-primary-forest'
              )}
            >
              <span className="text-4xl font-extrabold md:text-[2.75rem]">{amount}</span>
              {period ? (
                <span
                  className={cn(
                    'ml-1 text-base font-semibold',
                    highlighted ? 'text-white/70' : 'text-muted'
                  )}
                >
                  {period}
                </span>
              ) : null}
            </p>
            {/* Side by side, a card without savings keeps the empty row so both cards' stats line up. */}
            <div
              className={cn(
                'mt-3 min-h-7 flex-wrap items-center gap-2.5',
                plan.compareAtPrice || plan.savings ? 'flex' : 'hidden md:flex'
              )}
            >
              {plan.compareAtPrice ? (
                <s
                  className={cn(
                    'text-sm font-semibold',
                    highlighted ? 'text-white/60' : 'text-muted'
                  )}
                >
                  {plan.compareAtLabel ? <span className="sr-only">{plan.compareAtLabel} </span> : null}
                  {plan.compareAtPrice}
                </s>
              ) : null}
              {plan.savings ? (
                <span className="inline-flex items-center rounded-full bg-energy-lime px-2.5 py-1 text-xs font-extrabold uppercase tracking-[0.08em] text-primary-forest shadow-[0_0_24px_rgba(163,230,53,0.45)]">
                  {plan.savings}
                </span>
              ) : null}
            </div>
          </div>

          <dl className="relative mt-6 grid grid-cols-3 gap-3">
            {plan.stats.map((stat) => (
              <div
                key={`${plan.id}-${stat.label}`}
                className={cn(
                  'rounded-2xl px-2 py-3 text-center',
                  highlighted ? 'bg-white/10' : 'bg-primary-forest/[0.04]'
                )}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd
                  className={cn(
                    'font-display text-sm font-bold tracking-tight md:text-base',
                    highlighted ? 'text-white' : 'text-primary-forest'
                  )}
                >
                  {stat.value}
                </dd>
                <p
                  className={cn(
                    'mt-1 text-[10px] font-medium uppercase tracking-[0.12em]',
                    highlighted ? 'text-white/70' : 'text-muted'
                  )}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>

          <ul className="relative mt-8 flex-1 space-y-3">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className={cn(
                  'flex items-start gap-3 text-sm font-medium leading-relaxed',
                  highlighted ? 'text-white/90' : 'text-foreground'
                )}
              >
                <CheckIcon className={highlighted ? 'text-energy-lime' : 'text-primary-teal'} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => onSelect(plan.id)}
            className={cn(
              'group relative mt-8 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99]',
              highlighted
                ? 'bg-white text-primary-forest shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:ring-white'
                : 'bg-gradient-brand text-white shadow-glow hover:-translate-y-0.5 hover:shadow-glow-lg focus-visible:ring-primary-teal'
            )}
          >
            {plan.cta}
            <svg
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export function HomePricing() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const { ref, isInView } = useInView({ threshold: 0.12 });
  const plans = payPageContent[locale].plans;

  const onSelect = (planId: PayPlanCopy['id']) => {
    router.push(`/pay?plan=${planId}`);
  };

  return (
    <section id="pricing" ref={ref} data-inview={isInView} className="section-padding relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary-teal/[0.06] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(41,182,161,0.16),transparent)]"
      />

      <div className="container relative z-10 mx-auto px-4">
        <header className="section-header reveal">
          <span className="section-badge">{t.homePricing.badge}</span>
          <h2 className="section-title">{renderTitle(t.homePricing.title)}</h2>
          <p className="section-subtitle">{t.homePricing.subtitle}</p>
        </header>

        <SpotlightGroup className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch md:gap-6">
          {plans.map((plan, index) => (
            <MarketingPlanCard
              key={plan.id}
              plan={plan}
              index={index}
              onSelect={onSelect}
            />
          ))}
        </SpotlightGroup>

        <ul
          className="reveal mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-foreground/80"
          style={{ '--reveal-delay': '300ms' } as React.CSSProperties}
        >
          {ASSURANCES.map((item) => (
            <li key={item.key} className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-teal/10 text-primary-teal">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                </svg>
              </span>
              {t.homePricing.assurances[item.key]}
            </li>
          ))}
        </ul>

        <p
          className="reveal mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted"
          style={{ '--reveal-delay': '350ms' } as React.CSSProperties}
        >
          {t.homePricing.footnote}
        </p>
      </div>
    </section>
  );
}
