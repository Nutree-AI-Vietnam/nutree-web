'use client';

import Image from 'next/image';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { TiltOnPointer } from '@/components/ui/TiltOnPointer';
import { cn } from '@/lib/cn';
import { HERO_SHOWCASE } from '@/lib/hero-showcase-content';
import { useLocale } from '@/lib/locale-context';
import { HERO_SCREENSHOT } from '@/lib/screenshot-assets';

// The hero-ring-fill keyframe in globals.css starts from this circumference (2π × 30 ≈ 188.5).
const RING_RADIUS = 30;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Warm off-white surface of the in-app meal cards.
const cardSurface = 'bg-[#FFFBF8] ring-1 ring-black/5';

const scanCorners = [
  'left-1 top-1 rounded-tl-md border-l-2 border-t-2',
  'right-1 top-1 rounded-tr-md border-r-2 border-t-2',
  'bottom-1 left-1 rounded-bl-md border-b-2 border-l-2',
  'bottom-1 right-1 rounded-br-md border-b-2 border-r-2',
];

/**
 * Phone dashboard with floating cards that replay one meal scan on load: the photo is scanned,
 * the dish is recognised, the daily ring fills and the macros land. The cards repeat what the
 * screenshot already shows, so they are hidden from assistive tech and the phone's alt text speaks for them.
 * On desktop the stack tilts toward the mouse and each card floats at its own depth in front of the phone.
 */
export function HeroScanShowcase() {
  const { locale, t } = useLocale();
  const showcase = HERO_SHOWCASE[locale];
  const ringOffset = RING_CIRCUMFERENCE * (1 - Math.min(showcase.consumed / showcase.target, 1));

  return (
    <div className="relative mx-auto w-full max-w-[460px] lg:max-w-[520px]">
      {/* Light ring orbiting behind the phone. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square h-[80%] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="hero-halo h-full w-full rounded-full" />
      </div>

      <TiltOnPointer className="relative md:[perspective:1400px]">
        <div className="relative mx-auto w-fit">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-24 -inset-y-10 bg-[radial-gradient(closest-side,rgba(41,182,161,0.3),transparent)]"
          />
          <PhoneMockup
            backgroundImage={HERO_SCREENSHOT[locale]}
            imageAlt={t.common.dashboardScreenshotAlt}
            imagePriority
            imageSizes="(max-width: 640px) 232px, (max-width: 768px) 280px, 300px"
            className="w-[232px] sm:w-[280px] md:w-[300px]"
          />
        </div>

        <div aria-hidden="true" className="preserve-3d absolute inset-0">
          <div className="absolute left-0 top-[10%] z-20 [transform:translateZ(60px)]">
            <div className="hero-bob" style={{ animationDelay: '-1.5s' }}>
              <div
                className={cn(
                  cardSurface,
                  'hero-pop flex w-[176px] items-center gap-3 rounded-2xl p-2.5 shadow-glass-lg sm:w-[228px]'
                )}
                style={{ animationDelay: '200ms' }}
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl sm:h-16 sm:w-16">
                  <Image
                    src={showcase.mealImage}
                    alt=""
                    width={64}
                    height={64}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                  <div className="hero-scan-overlay absolute inset-0 opacity-0">
                    <div className="hero-scan-beam absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,rgba(41,182,161,0.45)_94%,#29B6A1_100%)]" />
                    {scanCorners.map((corner) => (
                      <span key={corner} className={cn('absolute h-3 w-3 border-white', corner)} />
                    ))}
                  </div>
                </div>
                <div className="grid min-w-0 flex-1">
                  <div className="hero-scan-skeleton col-start-1 row-start-1 flex flex-col justify-center gap-2 opacity-0">
                    <span className="h-2.5 w-4/5 rounded-full bg-primary-forest/10" />
                    <span className="h-2.5 w-1/2 rounded-full bg-primary-forest/10" />
                  </div>
                  <div className="hero-scan-result col-start-1 row-start-1">
                    <p className="line-clamp-2 text-balance text-sm font-semibold leading-snug text-foreground">
                      {showcase.mealName}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-primary-emerald">{showcase.mealEnergy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-[46%] z-20 hidden [transform:translateZ(90px)] sm:block">
            <div className="hero-bob" style={{ animationDelay: '-3s' }}>
              <div
                className={cn(
                  cardSurface,
                  'hero-pop flex flex-col items-center rounded-2xl px-4 py-3 shadow-glass-lg'
                )}
                style={{ animationDelay: '1800ms' }}
              >
                <div className="relative h-[76px] w-[76px]">
                  <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90">
                    <circle cx="38" cy="38" r={RING_RADIUS} fill="none" stroke="#E8EEEB" strokeWidth="8" />
                    <circle
                      cx="38"
                      cy="38"
                      r={RING_RADIUS}
                      fill="none"
                      stroke="#29B6A1"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={ringOffset}
                      className="hero-ring-progress"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold leading-none tabular-nums text-foreground">
                      {showcase.consumed}
                    </span>
                    <span className="mt-0.5 text-[10px] text-muted">kcal</span>
                  </div>
                </div>
                <p className="mt-2 whitespace-nowrap text-xs font-semibold text-primary-forest">
                  {showcase.remaining}
                </p>
              </div>
            </div>
          </div>

          <ul className="absolute bottom-[9%] right-0 z-20 flex flex-col items-end gap-2 [transform:translateZ(45px)] sm:left-0 sm:right-auto sm:items-start">
            {showcase.macros.map((macro, index) => (
              <li
                key={macro.label}
                className={cn(
                  cardSurface,
                  'hero-pop inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground shadow-glass'
                )}
                style={{ animationDelay: `${2200 + index * 150}ms` }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: macro.color }} />
                {macro.label} {macro.grams}g
              </li>
            ))}
          </ul>
        </div>
      </TiltOnPointer>
    </div>
  );
}
