'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import { useLocale } from '@/lib/locale-context';
import { renderTitle } from '@/lib/render-title';

interface StepConfig {
  number: number;
  gradient: string;
  icon: React.ReactNode;
}

const STEP_CONFIG: StepConfig[] = [
  {
    number: 1,
    gradient: 'from-primary-teal to-primary-emerald',
    icon: (
      <svg aria-hidden="true" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    number: 2,
    gradient: 'from-primary-emerald to-energy-lime',
    icon: (
      <svg aria-hidden="true" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
  {
    number: 3,
    gradient: 'from-energy-lime to-primary-teal',
    icon: (
      <svg aria-hidden="true" className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
];

// One beat per step: the card rises, its badge lights, then the connector draws on to the next
// badge, which lights as the line arrives.
const riseDelay = (index: number) => 150 + index * 150;
const glowDelay = (index: number) => 450 + index * 600;
const lineDelay = (index: number) => 600 + index * 600;

const LINE_FILL =
  'step-line block h-full w-full rounded-full bg-gradient-to-r from-primary-teal to-energy-lime shadow-[0_0_12px_rgba(163,230,53,0.55)]';

export function HowItWorks() {
  const { ref, isInView } = useInView({ threshold: 0.25 });
  const { t } = useLocale();

  const steps = t.howItWorks.steps.map((step, i) => ({
    ...STEP_CONFIG[i],
    title: step.title,
    description: step.description,
  }));

  return (
    <section
      ref={ref}
      id="how-it-works"
      data-inview={isInView}
      className="on-dark section-padding relative overflow-hidden bg-primary-forest text-white"
    >
      {/* Grid and two light pools: plain gradients, so the band costs no blur. */}
      <div aria-hidden="true" className="cta-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 -top-24 h-[40rem] w-[40rem] bg-[radial-gradient(closest-side,rgba(41,182,161,0.32),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-40 h-[36rem] w-[36rem] bg-[radial-gradient(closest-side,rgba(163,230,53,0.16),transparent)]"
      />

      <div className="container relative mx-auto px-4">
        <div className="reveal mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <h2 className="section-title text-white">{renderTitle(t.howItWorks.title)}</h2>
        </div>

        <ol className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li
              key={step.number}
              className="reveal relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
              style={
                {
                  '--reveal-delay': `${riseDelay(index)}ms`,
                  '--glow-delay': `${glowDelay(index)}ms`,
                } as React.CSSProperties
              }
            >
              {/* Connector to the next badge: centre to centre, under both badges. Mobile runs down
                  the badge column, desktop across the row (one column plus the gap). */}
              {index < steps.length - 1 && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute left-9 top-9 h-[calc(100%+2.5rem)] w-0.5 -translate-x-1/2 rounded-full bg-white/15 md:hidden"
                  >
                    <span
                      className={cn(LINE_FILL, 'step-line-y bg-gradient-to-b')}
                      style={{ transitionDelay: `${lineDelay(index)}ms` }}
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-12 hidden h-0.5 w-[calc(100%+2rem)] -translate-y-1/2 rounded-full bg-white/15 md:block"
                  >
                    <span
                      className={cn(LINE_FILL, 'step-line-x')}
                      style={{ transitionDelay: `${lineDelay(index)}ms` }}
                    />
                  </span>
                </>
              )}

              {/* Badge: a dark slot that fills with the step's gradient once the line reaches it. */}
              <div className="relative z-10 flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-3xl bg-primary-forest ring-1 ring-white/15 md:mb-7 md:h-24 md:w-24">
                <span aria-hidden="true" className="absolute inset-0 rounded-3xl bg-white/5" />
                <span
                  aria-hidden="true"
                  className={cn('step-glow absolute inset-0 rounded-3xl bg-gradient-to-br shadow-glow-lg', step.gradient)}
                />
                <span className="relative text-white">{step.icon}</span>
              </div>

              <div className="pt-1 md:pt-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-energy-lime">
                  {String(step.number).padStart(2, '0')}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 md:mx-auto md:max-w-[16rem] md:text-base">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
