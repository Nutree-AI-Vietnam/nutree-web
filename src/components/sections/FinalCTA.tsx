'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { useInView } from '@/hooks/useInView';
import { SITE_CONFIG } from '@/lib/constants';

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

// App Store Icons
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.49l-2.302 2.302-8.634-8.635z" />
    </svg>
  );
}

export function FinalCTA() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { ref, isInView } = useInView({ threshold: 0.2 });

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
                  Start Your Transformation
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                Life happens. Cheat days happen. Nutree makes sure they don&apos;t matter.
              </motion.h2>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-white/80 max-w-lg mx-auto lg:mx-0 mb-8"
              >
                Start your {SITE_CONFIG.trial.days}-day free trial. No credit card required. Your AI Nutrition Assistant adapts, so you never have to start over.
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
                  aria-label="Download on App Store"
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
                      <div className="text-xs font-normal opacity-70">Download on the</div>
                      <div className="text-sm font-semibold -mt-0.5">App Store</div>
                    </div>
                  </Button>
                </Link>

                <Link
                  href={SITE_CONFIG.stores.googlePlay}
                  aria-label="Get it on Google Play"
                  onClick={triggerConfetti}
                  onMouseEnter={triggerConfetti}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto gap-3 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50"
                  >
                    <PlayStoreIcon className="h-6 w-6" />
                    <div className="text-left">
                      <div className="text-xs font-normal opacity-70">Get it on</div>
                      <div className="text-sm font-semibold -mt-0.5">Google Play</div>
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
                {SITE_CONFIG.trial.days}-Day Free Trial • No Credit Card Required
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
                  backgroundImage="/images/cta-mockup.png"
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
                <div className="text-sm">Days Free</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">7</div>
                <div className="text-sm">Languages</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">AI</div>
                <div className="text-sm">Powered</div>
              </div>
              <div className="h-8 w-px bg-white/20 hidden sm:block" />
              <div className="text-center hidden sm:block">
                <div className="font-display text-3xl font-bold text-white">4.9</div>
                <div className="text-sm">Rating</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
