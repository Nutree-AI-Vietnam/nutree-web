'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FlipPhone } from '@/components/ui/FlipPhone';
import { SITE_CONFIG } from '@/lib/constants';

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

export function HeroV2() {
  const headlines = ['IDEAS.', 'TRACK.', 'THRIVE.'];

  return (
    <section className="relative min-h-screen pt-20 md:pt-24 overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-bg opacity-60" />

      <div className="container mx-auto px-4">
        <div className="flex min-h-[calc(100vh-80px)] flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8 py-12 md:py-16">
          {/* Left: Content */}
          <div className="flex-1 max-w-xl lg:max-w-none text-center lg:text-left z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary-forest/10 border border-primary-forest/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-teal opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-teal" />
              </span>
              <span className="text-sm font-medium text-primary-forest">AI Nutrition Assistant</span>
            </motion.div>

            {/* Headlines */}
            <div className="mb-6">
              {headlines.map((line, index) => (
                <motion.h1
                  key={line}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-tight"
                >
                  <span className="gradient-text">{line}</span>
                </motion.h1>
              ))}
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-muted max-w-md mx-auto lg:mx-0 mb-8"
            >
              Not another calorie counter. Nutree adapts your daily targets, plans your meals, and tracks every macro — automatically.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <Link href={SITE_CONFIG.stores.appStore} aria-label="Download on App Store">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto gap-3 shadow-glow hover:shadow-glow-lg"
                >
                  <AppleIcon className="h-5 w-5" />
                  <span>Download Free</span>
                </Button>
              </Link>
              <Link href={SITE_CONFIG.stores.googlePlay} aria-label="Get it on Google Play">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-3">
                  <PlayStoreIcon className="h-5 w-5" />
                  <span>Google Play</span>
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted"
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9 Rating</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{SITE_CONFIG.trial.days}-Day Free Trial</span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
                <span>7 Languages</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Phone Mockup with Tap-to-Flip */}
          <div className="flex-1 relative flex justify-center items-center z-10 w-full max-w-md mx-auto">
            <FlipPhone
              frontImage="/images/dashboard.png"
              backImage="/images/goals.png"
              frontIcons={[
                { emoji: '🍊', position: 'top-16 -right-8', delay: 0.5 },
                { emoji: '🍋', position: 'top-1/2 -right-4', delay: 0.7 },
                { emoji: '🍇', position: 'top-1/3 -left-6', delay: 0.9 },
              ]}
              backIcons={[
                { emoji: '🥗', position: 'top-20 -right-4', delay: 0.6 },
                { emoji: '🍎', position: 'bottom-20 -left-6', delay: 0.8 },
                { emoji: '🥑', position: 'top-1/2 -right-8', delay: 1.0 },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator - moved down on mobile to avoid overlap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
