import { cn } from '@/lib/cn';
import type { PayPlanCopy } from '@/lib/pay-page-content';

interface PricingTableProps {
  plans: PayPlanCopy[];
  onSelect: (planId: PayPlanCopy['id']) => void;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 h-5 w-5 shrink-0 text-primary-teal"
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

function PlanCard({ plan, onSelect }: { plan: PayPlanCopy; onSelect: (planId: PayPlanCopy['id']) => void }) {
  return (
    <article
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white',
        plan.highlight ? 'border-primary-teal shadow-lg shadow-primary-teal/15' : 'border-border'
      )}
    >
      {plan.badge ? (
        <p className="bg-primary-forest py-2 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          {plan.badge}
        </p>
      ) : null}

      <div
        className={cn(
          'flex flex-col px-6 pb-6 pt-7',
          plan.highlight && 'bg-primary-teal text-white',
          !plan.badge && 'pt-8'
        )}
      >
        <h2
          className={cn(
            'text-center text-sm font-extrabold uppercase tracking-[0.2em]',
            plan.highlight ? 'text-white' : 'text-primary-forest'
          )}
        >
          {plan.name}
        </h2>
        <p
          className={cn(
            'mt-3 text-center font-display text-3xl font-extrabold tracking-tight',
            plan.highlight ? 'text-white' : 'text-primary-teal'
          )}
        >
          {plan.price}
        </p>
        <button
          type="button"
          onClick={() => onSelect(plan.id)}
          className={cn(
            'mt-6 inline-flex min-h-11 items-center justify-center rounded-full px-5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            plan.highlight
              ? 'bg-white text-primary-teal hover:bg-white/90 focus-visible:ring-white'
              : 'bg-primary-teal text-white hover:bg-primary-emerald focus-visible:ring-primary-teal'
          )}
        >
          {plan.cta}
        </button>
      </div>

      <div className={cn('flex flex-1 flex-col px-6 pb-8', plan.highlight && 'pt-2')}>
        <dl className="space-y-5 py-6 text-foreground">
          {plan.stats.map((stat) => (
            <div key={`${plan.id}-${stat.label}`} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-lg font-extrabold uppercase tracking-wide">{stat.value}</dd>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>

        <div className="border-t border-dashed border-border" />

        <ul className="mt-6 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm font-medium">
              <CheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function PricingTable({ plans, onSelect }: PricingTableProps) {
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} onSelect={onSelect} />
      ))}
    </div>
  );
}
