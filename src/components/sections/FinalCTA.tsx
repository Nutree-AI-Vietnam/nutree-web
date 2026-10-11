'use client';

import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { StoreBadges } from '@/components/ui/StoreBadges';
import { TiltOnPointer } from '@/components/ui/TiltOnPointer';
import { useInView } from '@/hooks/useInView';
import { SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { CTA_SCREENSHOT } from '@/lib/screenshot-assets';

export function FinalCTA() {
  const { t } = useLocale();
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} id="download" data-inview={isInView} className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="reveal relative isolate overflow-hidden rounded-3xl bg-gradient-brand px-4 py-12 shadow-[0_30px_80px_-24px_rgba(26,71,57,0.55)] sm:p-10 md:p-16">
          {/* Drifting light pools; radial gradients instead of blur filters keep paint cheap. */}
          <div
            aria-hidden="true"
            className="cta-pool pointer-events-none absolute -left-48 -top-48 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_70%)]"
          />
          <div
            aria-hidden="true"
            className="cta-pool cta-pool-alt pointer-events-none absolute -bottom-56 -right-40 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(163,230,53,0.22),transparent_70%)]"
          />
          <div aria-hidden="true" className="cta-grid pointer-events-none absolute inset-0" />

          <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row">
            <div className="flex-1 text-center lg:text-left">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-medium text-white">
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-energy-lime opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-energy-lime" />
                </span>
                {t.finalCta.badge}
              </p>

              <h2 className="mb-4 text-balance font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {t.finalCta.headline}
              </h2>

              <p className="mx-auto mb-8 max-w-lg text-lg text-white/80 lg:mx-0">
                {t.finalCta.subtext}
              </p>

              {/* Same funnel as the hero: the quiz leads, the stores follow as the direct route. */}
              <a
                href={SITE_CONFIG.quizUrl}
                className="group inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-white px-8 text-base font-semibold text-primary-forest shadow-[0_18px_40px_-16px_rgba(0,0,0,0.5)] transition duration-300 hover:bg-energy-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-forest motion-reduce:transition-none sm:w-auto"
              >
                {t.finalCta.primaryCta}
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>

              <div className="mt-7">
                <p className="mb-3 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 lg:justify-start">
                  <span aria-hidden="true" className="h-px w-8 bg-white/30 lg:hidden" />
                  {t.finalCta.orDownload}
                  <span aria-hidden="true" className="h-px w-8 bg-white/30" />
                </p>
                <StoreBadges size="sm" className="justify-center lg:justify-start" />
              </div>

              <p className="mt-6 text-sm text-white/80">{t.finalCta.trustMessage}</p>
            </div>

            <div
              className="reveal relative hidden flex-shrink-0 lg:block"
              style={{ '--reveal-delay': '200ms' } as React.CSSProperties}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 scale-150 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22),transparent_65%)]"
              />
              <TiltOnPointer className="relative [perspective:1200px]" maxTilt={8}>
                <div className="hero-bob">
                  <PhoneMockup
                    backgroundImage={CTA_SCREENSHOT}
                    imageAlt={t.common.ctaScreenshotAlt}
                    imageSizes="300px"
                    className="rotate-[4deg] transition-transform duration-500 hover:rotate-0 motion-reduce:transition-none"
                  />
                </div>
              </TiltOnPointer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
