'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { useInView } from '@/hooks/useInView';
import { SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { AppleIcon } from '@/components/ui/AppleIcon';
import { CTA_SCREENSHOT } from '@/lib/screenshot-assets';

// Confetti particle
function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ['#1A4739', '#29B6A1', '#A3E635', '#FB923C', '#E91E63'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{
        y: [-20, -100 - Math.random() * 100],
        x: [0, x + (Math.random() - 0.5) * 100],
        opacity: [1, 0],
        scale: [1, 0.5],
        rotate: [0, 360 + Math.random() * 360],
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: 'easeOut',
      }}
      className="absolute pointer-events-none"
      style={{
        width: 8 + Math.random() * 8,
        height: 8 + Math.random() * 8,
        backgroundColor: randomColor,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
    />
  );
}

export function FinalCTA() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const { t } = useLocale();

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <section ref={ref} id="download" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 md:p-16"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-energy-lime/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
              >
                <span className="text-2xl" role="img" aria-label="celebration">
                  🎉
                </span>
                <span className="text-sm font-medium text-white">
                  {t.finalCta.badge}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                {t.finalCta.headline}
              </motion.h2>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-white/80 max-w-lg mx-auto lg:mx-0 mb-8"
              >
                {t.finalCta.subtext}
              </motion.p>

              {/* CTA Buttons with Confetti */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start relative"
              >
                {/* Confetti container */}
                {showConfetti && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2">
                    {[...Array(20)].map((_, i) => (
                      <ConfettiParticle
                        key={i}
                        delay={i * 0.02}
                        x={(i % 2 === 0 ? 1 : -1) * (20 + i * 5)}
                      />
                    ))}
                  </div>
                )}

                <Link
                  href={SITE_CONFIG.stores.appStore}
                  aria-label={t.common.appStoreDownloadLabel}
                  onClick={triggerConfetti}
                  onMouseEnter={triggerConfetti}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto gap-3 bg-white text-primary-forest border-white hover:bg-white/90 hover:border-white/90"
                  >
                    <AppleIcon className="h-6 w-6" />
                    <div className="text-left">
                      <div className="text-xs font-normal opacity-70">{t.finalCta.downloadOnThe}</div>
                      <div className="text-sm font-semibold -mt-0.5">{t.finalCta.appStore}</div>
                    </div>
                  </Button>
                </Link>
              </motion.div>

              {/* Trust message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 text-sm text-white/60"
              >
                {t.finalCta.trustMessage}
              </motion.p>
            </div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 5 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="flex-shrink-0 hidden lg:block"
            >
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-white/20 blur-3xl scale-150 rounded-full" />
                <PhoneMockup
                  backgroundImage={CTA_SCREENSHOT}
                  imageAlt={t.common.ctaScreenshotAlt}
                  className="transform hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative z-10 mt-12 pt-8 border-t border-white/20"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">{SITE_CONFIG.trial.days}</div>
                <div className="text-sm">{t.finalCta.stats.daysFree}</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">7</div>
                <div className="text-sm">{t.finalCta.stats.languages}</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">#1</div>
                <div className="text-sm">{t.finalCta.stats.rating}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
