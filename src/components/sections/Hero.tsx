'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FlipPhone } from '@/components/ui/FlipPhone';
import { SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { AppleIcon } from '@/components/ui/AppleIcon';
import { HERO_SCREENSHOTS } from '@/lib/screenshot-assets';

export function HeroV2() {
  const { locale, t } = useLocale();
  const headlines = t.hero.headlines;
  const heroScreens = HERO_SCREENSHOTS[locale];

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
              <span className="text-sm font-medium text-primary-forest">{t.hero.badge}</span>
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

            {/* VI tagline */}
            {locale === 'vi' && t.hero.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="font-display text-2xl md:text-3xl font-bold mb-4"
              >
                <span className="gradient-text">{t.hero.tagline}</span>
              </motion.p>
            )}

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-muted max-w-md mx-auto lg:mx-0 mb-8"
            >
              {t.hero.subheadline}
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
                  <span>{t.hero.downloadFree}</span>
                </Button>
              </Link>
            </motion.div>

            {/* Product Hunt Badge */}
            <motion.a
              href={SITE_CONFIG.productHunt.badgeHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Nutree on Product Hunt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mb-8 inline-flex h-[54px] w-[250px] overflow-hidden rounded-md transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:ring-offset-2 focus:ring-offset-background"
            >
              <Image
                src={SITE_CONFIG.productHunt.badgeImage}
                alt={SITE_CONFIG.productHunt.badgeAlt}
                width={250}
                height={54}
                unoptimized
              />
            </motion.a>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted"
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75c-.621 0-1.125.504-1.125 1.125v3.375m9-13.5V6a3 3 0 01-3 3h-3a3 3 0 01-3-3v-.75m9 0h2.25A2.25 2.25 0 0121 7.5v.75a3.75 3.75 0 01-3.75 3.75H16.5m-9-6.75H5.25A2.25 2.25 0 003 7.5v.75A3.75 3.75 0 006.75 12H7.5" />
                </svg>
                <span>{t.hero.trustBadges.rating}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t.hero.trustBadges.freeTrial}</span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
                <span>{t.hero.trustBadges.languages}</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Phone Mockup with Tap-to-Flip */}
          <div className="flex-1 relative flex justify-center items-center z-10 w-full max-w-md mx-auto">
            <FlipPhone
              frontImage={heroScreens.front}
              backImage={heroScreens.back}
              frontImageAlt="Nutree daily dashboard screenshot"
              backImageAlt="Nutree onboarding screenshot"
              priority
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
          <span className="text-xs uppercase tracking-wider">{t.hero.scroll}</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
