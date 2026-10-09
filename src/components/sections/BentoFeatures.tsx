'use client';

import { useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import { AnimationPauseToggle } from '@/components/ui/AnimationPauseToggle';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { SpotlightGroup } from '@/components/ui/SpotlightGroup';
import Image from 'next/image';
import { useLocale } from '@/lib/locale-context';
import { renderTitle } from '@/lib/render-title';
import { FEATURE_SCREENSHOTS } from '@/lib/screenshot-assets';

type LocaleScreenshot = string | { en: string; vi: string };

interface FeatureConfig {
  id: string;
  icon: React.ReactNode;
  screenshot?: LocaleScreenshot;
}

function resolveScreenshot(screenshot: LocaleScreenshot | undefined, locale: string): string | undefined {
  if (!screenshot) return undefined;
  if (typeof screenshot === 'string') return screenshot;
  return screenshot[locale as keyof typeof screenshot] ?? screenshot.en;
}

const FEATURE_CONFIG: Record<string, Omit<FeatureConfig, 'id'>> = {
  'tdee': {
    screenshot: FEATURE_SCREENSHOTS.tdee,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
  'ai-scanning': {
    screenshot: FEATURE_SCREENSHOTS.aiScanning,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  'meal-suggestions': {
    screenshot: FEATURE_SCREENSHOTS.mealSuggestions,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  'dashboard': {
    screenshot: FEATURE_SCREENSHOTS.dashboard,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  'edit': {
    screenshot: FEATURE_SCREENSHOTS.edit,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  'languages': {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
      </svg>
    ),
  },
};

// Swipes shorter than this, or more vertical than horizontal, are taps or scrolls.
const SWIPE_PX = 50;

export function BentoFeatures() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  // Autoplay runs only while the showcase is near the middle of the screen.
  const { ref: showcaseRef, isInView: isOnScreen } = useInView({
    threshold: 0,
    rootMargin: '-20% 0px -20% 0px',
    triggerOnce: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lookingAtPhone, setLookingAtPhone] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const { t, locale } = useLocale();

  const features = t.features.items.map(item => {
    const config = FEATURE_CONFIG[item.id] ?? { icon: null };
    return {
      ...item,
      ...config,
      screenshot: resolveScreenshot(config.screenshot, locale),
    };
  });

  const playing = isOnScreen && !lookingAtPhone && !keyboardFocus && !userPaused;

  const advance = () => setSelectedIndex(current => (current + 1) % features.length);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Captured, so a drag released off the phone still ends here and never leaves a stale start.
    event.currentTarget.setPointerCapture(event.pointerId);
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(event.clientY - start.y)) return;
    setSelectedIndex(current =>
      dx > 0 ? Math.max(current - 1, 0) : Math.min(current + 1, features.length - 1)
    );
  };

  // Keyboard users hold the current feature while they tab through; mouse clicks don't count.
  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    try {
      if (event.target.matches(':focus-visible')) setKeyboardFocus(true);
    } catch {
      // Engines without :focus-visible keep playing.
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardFocus(false);
  };

  return (
    <section ref={ref} id="features" data-inview={isInView} className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="reveal mb-10 text-center">
          <h2 className="section-title">
            {renderTitle(t.features.title)}
          </h2>
        </div>

        {/* Side-by-side Layout: Preview (left) | Features (right) */}
        <div
          ref={showcaseRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-12 items-start"
        >
          {/* Left: iPhone Preview with Swipe */}
          <div
            className="reveal lg:sticky lg:top-24 order-2 lg:order-1 flex flex-col items-center"
            style={{ '--reveal-delay': '200ms' } as React.CSSProperties}
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-16 -inset-y-8 bg-[radial-gradient(closest-side,rgba(41,182,161,0.28),transparent)]"
              />

              {/* iPhone Mockup with swipe; a mouse resting on the screen holds autoplay. Vertical
                  drags still scroll the page. */}
              <div
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => {
                  swipeStart.current = null;
                }}
                onPointerEnter={event => event.pointerType === 'mouse' && setLookingAtPhone(true)}
                onPointerLeave={event => event.pointerType === 'mouse' && setLookingAtPhone(false)}
                className="relative cursor-grab touch-pan-y select-none active:cursor-grabbing"
              >
                <PhoneMockup className="w-[280px] md:w-[350px]">
                  {/* Every screen is mounted and stacked, so switching is a pure opacity and
                      transform transition: screens behind the current one wait to the left,
                      screens ahead wait to the right. The lazy images load as the section nears. */}
                  {features.map((feature, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={feature.id}
                        aria-hidden={!isSelected || undefined}
                        className={cn(
                          'absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-primary-teal/5',
                          'transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
                          isSelected
                            ? 'translate-x-0 scale-100 opacity-100'
                            : cn('scale-[0.97] opacity-0', index < selectedIndex ? '-translate-x-14' : 'translate-x-14')
                        )}
                      >
                        {feature.screenshot ? (
                          <Image
                            src={feature.screenshot}
                            alt={t.common.featureScreenshotAlt(feature.title)}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 280px, 350px"
                            unoptimized
                            draggable={false}
                          />
                        ) : (
                          <div className="px-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow [&_svg]:h-8 [&_svg]:w-8">
                              {feature.icon}
                            </div>
                            <p className="font-display text-xl font-bold text-foreground">{feature.title}</p>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Glass glare across the screen. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_32%)]"
                  />
                </PhoneMockup>
              </div>
            </div>

            {/* Swipe indicator dots and the autoplay switch */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center">
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className="group flex h-6 items-center rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal"
                    aria-label={t.common.goToFeature(index + 1)}
                    aria-current={selectedIndex === index ? 'true' : undefined}
                  >
                    <span
                      className={cn(
                        'block h-2 rounded-full transition-all duration-300',
                        selectedIndex === index ? 'w-6 bg-primary-teal' : 'w-2 bg-border group-hover:bg-primary-teal/50'
                      )}
                    />
                  </button>
                ))}
              </div>
              <AnimationPauseToggle paused={userPaused} onToggle={() => setUserPaused(paused => !paused)} />
            </div>

            {/* Swipe hint */}
            <p className="text-xs text-muted mt-2">{t.features.swipeHint}</p>
          </div>

          {/* Right: Feature List. Every item keeps its size, so autoplay never moves the layout. */}
          <SpotlightGroup className="space-y-3 order-1 lg:order-2">
            {features.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  className="reveal"
                  style={{ '--reveal-delay': `${200 + index * 60}ms` } as React.CSSProperties}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-pressed={isSelected}
                    className={cn(
                      'spotlight-card relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left lg:p-5',
                      'transition-[background-color,border-color,box-shadow] duration-300',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2',
                      isSelected
                        ? 'border-primary-teal/50 bg-white shadow-glass-lg'
                        : 'border-border bg-white/50 hover:border-primary-teal/40 hover:bg-white/80'
                    )}
                  >
                    {/* Selected wash */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary-teal/[0.08] via-transparent to-energy-lime/[0.08] transition-opacity duration-300',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />

                    {/* Icon */}
                    <span
                      className={cn(
                        'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-[background-color,color,box-shadow] duration-300',
                        isSelected ? 'bg-gradient-brand text-white shadow-glow' : 'bg-primary-forest/10 text-primary-forest'
                      )}
                    >
                      {item.icon}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          'font-display text-base font-semibold transition-colors duration-300 lg:text-lg',
                          isSelected ? 'text-primary-forest' : 'text-foreground'
                        )}
                      >
                        {item.title}
                      </h3>
                      <p className="text-muted mt-1 text-sm">{item.description}</p>
                    </div>

                    {/* Arrow toward the phone, which sits to the left on wide screens. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'hidden h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 lg:flex',
                        isSelected ? 'bg-primary-teal text-white' : 'text-muted'
                      )}
                    >
                      <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </span>

                    {/* Autoplay timer; when it fills, the next feature takes over. */}
                    {isSelected && (
                      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] overflow-hidden">
                        <span
                          className="feature-progress block h-full w-full bg-gradient-energy"
                          style={{ animationPlayState: playing ? 'running' : 'paused' }}
                          onAnimationEnd={advance}
                        />
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </SpotlightGroup>
        </div>
      </div>
    </section>
  );
}
