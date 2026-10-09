'use client';

import { HeroBackdrop } from '@/components/sections/HeroBackdrop';
import { HeroScanShowcase } from '@/components/sections/HeroScanShowcase';
import { StoreBadges } from '@/components/ui/StoreBadges';
import { cn } from '@/lib/cn';
import { useLocale } from '@/lib/locale-context';

// Heroicons outline paths: trophy, check-badge, language.
const TRUST_ITEMS = [
  {
    key: 'rating',
    color: 'text-amber-500',
    path: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75c-.621 0-1.125.504-1.125 1.125v3.375m9-13.5V6a3 3 0 01-3 3h-3a3 3 0 01-3-3v-.75m9 0h2.25A2.25 2.25 0 0121 7.5v.75a3.75 3.75 0 01-3.75 3.75H16.5m-9-6.75H5.25A2.25 2.25 0 003 7.5v.75A3.75 3.75 0 006.75 12H7.5',
  },
  {
    key: 'personalizedPlan',
    color: 'text-primary-teal',
    path: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    key: 'languages',
    color: 'text-primary-teal',
    path: 'M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802',
  },
] as const;

export function HeroV2() {
  const { locale, t } = useLocale();

  return (
    <section className="relative overflow-hidden pt-20 md:pt-24">
      <HeroBackdrop />

      <div className="container relative mx-auto px-4">
        {/* The bottom padding clears the phone's shadow, which the section would otherwise clip. */}
        <div className="flex flex-col items-center justify-center gap-12 pb-20 pt-12 md:py-16 lg:min-h-[calc(100vh-6rem)] lg:flex-row lg:gap-8">
          <div className="max-w-xl flex-1 text-center lg:max-w-none lg:text-left">
            {/* One h1 for the page: the product category leads, the slogan lines follow. */}
            <h1 className="mb-6">
              <span className="hero-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary-forest/20 bg-primary-forest/10 px-4 py-2 font-body text-sm font-medium text-primary-forest">
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary-teal opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-teal" />
                </span>
                {t.hero.badge}
              </span>{' '}
              {t.hero.headlines.map((line, index) => (
                <span
                  key={line}
                  className={cn(
                    // Arbitrary sizes leave line-height alone (text-8xl would reset it to 1 at lg),
                    // so the locale leading below holds at every breakpoint.
                    'block text-[3rem] font-extrabold tracking-tight sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5.25rem] xl:text-[6rem]',
                    // Vietnamese capitals carry marks above and below (Ợ, Õ, Ạ), so its lines need more room.
                    locale === 'vi' ? 'leading-[1.08]' : 'leading-[0.92]'
                  )}
                >
                  {/* Each line rises out of its own mask, then a lime sheen crosses it once. */}
                  <span className="hero-line-mask">
                    <span className="hero-line" style={{ animationDelay: `${120 + index * 110}ms` }}>
                      <span className="hero-sheen" style={{ animationDelay: `${1000 + index * 140}ms` }}>
                        {line}
                      </span>
                    </span>
                  </span>{' '}
                </span>
              ))}
              {t.hero.tagline && (
                <span className="hero-fade-up mt-4 block text-2xl font-bold md:text-3xl" style={{ animationDelay: '480ms' }}>
                  <span className="gradient-text">{t.hero.tagline}</span>
                </span>
              )}
            </h1>

            <p
              className="hero-fade-up mx-auto mb-8 max-w-md text-lg text-muted md:text-xl lg:mx-0"
              style={{ animationDelay: '420ms' }}
            >
              {t.hero.subheadline}
            </p>

            <div className="hero-fade-up" style={{ animationDelay: '540ms' }}>
              <StoreBadges className="justify-center lg:justify-start" />
            </div>

            {/* A second path for visitors who want the price before they install. */}
            <div className="hero-fade-up mt-5" style={{ animationDelay: '600ms' }}>
              <a
                href="#pricing"
                className="rounded text-sm font-semibold text-primary-forest underline decoration-primary-teal/40 decoration-2 underline-offset-4 transition-colors hover:decoration-primary-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-4"
              >
                {t.hero.plansCta}
              </a>
            </div>

            <ul
              className="hero-fade-up mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted lg:justify-start"
              style={{ animationDelay: '660ms' }}
            >
              {TRUST_ITEMS.map((item) => (
                <li key={item.key} className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    className={cn('h-5 w-5', item.color)}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                  </svg>
                  {t.hero.trustBadges[item.key]}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative w-full flex-1">
            <HeroScanShowcase />
          </div>
        </div>
      </div>

      {/* Scroll cue, only where the hero fills the screen. */}
      <div
        aria-hidden="true"
        className="hero-fade-up pointer-events-none absolute inset-x-0 bottom-6 mx-auto hidden w-6 lg:block"
        style={{ animationDelay: '1200ms' }}
      >
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-primary-forest/25 pt-2">
          <span className="scroll-cue-dot h-2 w-1 rounded-full bg-primary-teal" />
        </div>
      </div>
    </section>
  );
}
