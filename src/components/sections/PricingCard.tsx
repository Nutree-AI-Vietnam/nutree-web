import type { PayPlanCopy } from '@/lib/pay-page-content';

interface PricingCardProps {
  plan: PayPlanCopy;
  onSelect: () => void;
}

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-teal/10 text-primary-emerald">
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
        <path
          d="M16.5 5.5 8.25 14.25 3.5 9.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-teal">
      <path
        d="M10 2.5 4 4.75v4.5c0 3.7 2.55 6.9 6 8.25 3.45-1.35 6-4.55 6-8.25v-4.5L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m7.5 10 1.75 1.75L12.75 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PricingCard({ plan, onSelect }: PricingCardProps) {
  return (
    <article className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-border bg-white shadow-glass-lg md:grid-cols-[1.05fr_1fr]">
      <div className="relative overflow-hidden bg-primary-forest px-7 py-9 text-white md:px-10 md:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-teal/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-energy-lime/10 blur-3xl"
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
              {plan.badge}
            </span>
          </div>

          <p className="mt-8 flex items-baseline gap-2">
            <span className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">{plan.amount}</span>
            <span className="text-base font-medium text-white/70">{plan.period}</span>
          </p>
          <p className="mt-2 text-sm text-white/70">{plan.perMonth}</p>

          <button
            type="button"
            onClick={onSelect}
            className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-primary-forest transition hover:bg-energy-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-forest"
          >
            {plan.cta}
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
              <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <ul className="mt-6 space-y-2">
            {plan.assurances.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                <ShieldIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col justify-center px-7 py-9 md:px-10 md:py-12">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{plan.featuresTitle}</h3>
        <ul className="mt-6 space-y-5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-base font-medium text-foreground">
              <CheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
