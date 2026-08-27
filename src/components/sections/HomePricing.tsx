'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useInView } from '@/hooks/useInView';
import { useLocale } from '@/lib/locale-context';
import { payPageContent } from '@/lib/pay-page-content';
import type { PayPlanCopy } from '@/lib/pay-page-content';
import { cn } from '@/lib/cn';

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

function MarketingPlanCard({
  plan,
  index,
  isInView,
  onSelect,
}: {
  plan: PayPlanCopy;
  index: number;
  isInView: boolean;
  onSelect: (planId: PayPlanCopy['id']) => void;
}) {
  const highlighted = Boolean(plan.highlight);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.12 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 md:p-8',
        'border backdrop-blur-xl transition-shadow duration-300',
        highlighted
          ? 'border-primary-teal/35 bg-gradient-to-br from-primary-forest via-primary-emerald to-primary-teal text-white shadow-glow'
          : 'border-white/50 bg-white/55 shadow-glass hover:shadow-glass-lg'
      )}
    >
      {plan.badge ? (
        <span
          className={cn(
            'absolute right-5 top-5 inline-flex min-h-8 items-center rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.14em]',
            highlighted
              ? 'bg-white/18 text-white'
              : 'bg-primary-forest/10 text-primary-forest'
          )}
        >
          {plan.badge}
        </span>
      ) : null}

      <div className="pr-20">
        <p
          className={cn(
            'text-sm font-semibold uppercase tracking-[0.18em]',
            highlighted ? 'text-white/75' : 'text-primary-forest/70'
          )}
        >
          {plan.name}
        </p>
        <p
          className={cn(
            'mt-3 font-display text-4xl font-extrabold tracking-tight md:text-[2.75rem]',
            highlighted ? 'text-white' : 'text-primary-forest'
          )}
        >
          {plan.price}
        </p>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-3">
        {plan.stats.map((stat) => (
          <div
            key={`${plan.id}-${stat.label}`}
            className={cn(
              'rounded-2xl px-2 py-3 text-center',
              highlighted ? 'bg-white/12' : 'bg-primary-forest/[0.04]'
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

      <ul className="mt-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={cn(
              'flex items-start gap-3 text-sm font-medium leading-relaxed',
              highlighted ? 'text-white/92' : 'text-foreground'
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
          'mt-8 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full px-6 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99]',
          highlighted
            ? 'bg-white text-primary-forest shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:ring-white'
            : 'bg-gradient-brand text-white shadow-glow hover:-translate-y-0.5 hover:shadow-glow-lg focus-visible:ring-primary-teal'
        )}
      >
        {plan.cta}
      </button>
    </motion.article>
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
    <section id="pricing" ref={ref} className="section-padding relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary-teal/[0.06] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-teal/15 blur-3xl"
      />

      <div className="container relative z-10 mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-header"
        >
          <span className="section-badge">{t.homePricing.badge}</span>
          <h2 className="section-title">{t.homePricing.title}</h2>
          <p className="section-subtitle">{t.homePricing.subtitle}</p>
        </motion.header>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch md:gap-6">
          {plans.map((plan, index) => (
            <MarketingPlanCard
              key={plan.id}
              plan={plan}
              index={index}
              isInView={isInView}
              onSelect={onSelect}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted"
        >
          {t.homePricing.footnote}
        </motion.p>
      </div>
    </section>
  );
}
