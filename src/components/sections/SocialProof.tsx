'use client';

import { useEffect, useRef, useState } from 'react';
import { SpotlightGroup } from '@/components/ui/SpotlightGroup';
import { useInView } from '@/hooks/useInView';
import { useLocale } from '@/lib/locale-context';

interface StatConfig {
  value: number;
  suffix: string;
  key: 'mealsTracked' | 'rating' | 'accuracy' | 'languages';
  icon: React.ReactNode;
  prefix?: string;
  /** Rankings read wrong mid-count ("#0"), so they stay put. */
  countUp: boolean;
}

const STAT_CONFIG: StatConfig[] = [
  {
    value: 10,
    suffix: 'K+',
    key: 'mealsTracked',
    countUp: true,
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    value: 1,
    suffix: '',
    key: 'rating',
    prefix: '#',
    countUp: false,
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75c-.621 0-1.125.504-1.125 1.125v3.375m9-13.5V6a3 3 0 01-3 3h-3a3 3 0 01-3-3v-.75m9 0h2.25A2.25 2.25 0 0121 7.5v.75a3.75 3.75 0 01-3.75 3.75H16.5m-9-6.75H5.25A2.25 2.25 0 003 7.5v.75A3.75 3.75 0 006.75 12H7.5" />
      </svg>
    ),
  },
  {
    value: 95,
    suffix: '%',
    key: 'accuracy',
    countUp: true,
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    value: 7,
    suffix: '',
    key: 'languages',
    countUp: true,
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
      </svg>
    ),
  },
];

const COUNT_MS = 1600;
const STAGGER_MS = 120;

/**
 * Counts up to `value` once `start` is true. The server renders the final number and the client
 * drops to 0 only after mounting, while the band is still hidden by its reveal, so nothing flashes.
 * Without JS, or with reduced motion, the final number simply stays.
 */
function useCountUp(value: number, start: boolean, delayMs: number, enabled: boolean) {
  const [count, setCount] = useState(value);
  const armed = useRef(false);

  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    armed.current = true;
    setCount(0);
  }, [enabled]);

  useEffect(() => {
    if (!start || !armed.current) return;
    let frame = 0;
    let startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min(Math.max(now - startTime - delayMs, 0) / COUNT_MS, 1);
      // Ease-out-expo: races up, then settles onto the final digit.
      setCount(progress < 1 ? Math.round((1 - Math.pow(2, -10 * progress)) * value) : value);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value, delayMs]);

  return count;
}

function StatCell({ stat, index, start, label }: { stat: StatConfig; index: number; start: boolean; label: string }) {
  const count = useCountUp(stat.value, start, index * STAGGER_MS, stat.countUp);
  const prefix = stat.prefix ?? '';

  return (
    // The label leads in the markup (dt before dd); flex order shows icon and number first.
    <div className="spotlight-card group flex flex-col items-center bg-white px-3 py-7 text-center md:px-6 md:py-9">
      <dt className="order-2 mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted md:text-xs">
        {label}
      </dt>
      <dd className="order-1 flex flex-col items-center">
        <span
          aria-hidden="true"
          className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-teal/10 text-primary-emerald ring-1 ring-primary-teal/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none"
        >
          {stat.icon}
        </span>
        <span className="font-display text-4xl font-extrabold tracking-tight tabular-nums md:text-5xl lg:text-6xl">
          <span className="sr-only">
            {prefix}
            {stat.value}
            {stat.suffix}
          </span>
          <span aria-hidden="true" className="gradient-text">
            {prefix}
            {count}
            {stat.suffix}
          </span>
        </span>
      </dd>
    </div>
  );
}

export function SocialProof() {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const { t } = useLocale();

  return (
    <section ref={ref} data-inview={isInView} className="relative z-10 py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="reveal relative mx-auto max-w-5xl">
          {/* Soft teal pool under the band; a gradient, not a blur, so it costs nothing to paint. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -inset-y-10 bg-[radial-gradient(closest-side,rgba(41,182,161,0.16),transparent)]"
          />
          {/* The 1px gaps over the border colour draw the hairlines between cells. */}
          <SpotlightGroup className="relative overflow-hidden rounded-3xl border border-border/70 bg-border/70 shadow-glass-lg">
            <dl className="grid grid-cols-2 gap-px md:grid-cols-4">
              {STAT_CONFIG.map((stat, index) => (
                <StatCell
                  key={stat.key}
                  stat={stat}
                  index={index}
                  start={isInView}
                  label={t.socialProof[stat.key]}
                />
              ))}
            </dl>
          </SpotlightGroup>
        </div>
      </div>
    </section>
  );
}
