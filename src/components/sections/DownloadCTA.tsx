'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useInView } from '@/hooks/useInView';
import { SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';

// Apple App Store Icon
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}


export function DownloadCTA() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const { t } = useLocale();

  return (
    <section
      ref={ref}
      id="download"
      className="py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 md:p-16 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl translate-x-1/2 translate-y-1/2" />

          {/* Content */}
          <div className="relative z-10">
            {/* Trial Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              <span className="text-sm font-medium text-white">
                {t.hero.trustBadges.freeTrial}
              </span>
            </motion.div>

            <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {t.finalCta.headline}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              {t.finalCta.subtext}
            </p>

            {/* Platform CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* iOS Download */}
              <Link
                href={SITE_CONFIG.stores.appStore}
                aria-label={t.common.appStoreDownloadLabel}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full min-w-[200px] border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 sm:w-auto gap-3"
                >
                  <AppleIcon className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs font-normal opacity-80">{t.finalCta.downloadOnThe}</div>
                    <div className="text-sm font-semibold -mt-0.5">{t.finalCta.appStore}</div>
                  </div>
                </Button>
              </Link>

            </div>

            {/* Trial Info */}
            <p className="mt-6 text-sm text-white/60">
              {t.whyNutree.cta.fineprint}
            </p>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">{SITE_CONFIG.trial.days}</div>
                <div className="text-sm">{t.finalCta.stats.daysFree}</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">2</div>
                <div className="text-sm">{t.finalCta.stats.languages}</div>
              </div>

              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">AI</div>
                <div className="text-sm">{t.finalCta.stats.aiPowered}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
