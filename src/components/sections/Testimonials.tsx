'use client';

import { useState } from 'react';
import { AnimationPauseToggle } from '@/components/ui/AnimationPauseToggle';
import { SpotlightGroup } from '@/components/ui/SpotlightGroup';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import { useLocale } from '@/lib/locale-context';
import { renderTitle } from '@/lib/render-title';

const AVATARS = ['SM', 'DK', 'LT', 'MJ'];

// Dark enough at every stop for white initials.
const AVATAR_TONES = [
  'from-primary-forest to-primary-teal',
  'from-primary-emerald to-primary-forest',
  'from-primary-teal to-primary-emerald',
  'from-primary-forest to-primary-emerald',
];

const QUOTE_PATH =
  'M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  achievement?: string;
  avatar: string;
  tone: string;
}

function StarRating({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex gap-0.5 text-amber-400', className)}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="spotlight-card flex w-[300px] shrink-0 flex-col rounded-3xl border border-white/70 bg-white/85 p-6 shadow-glass transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-glass-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[380px] sm:p-7">
      <div className="flex items-center justify-between">
        <StarRating />
        <svg aria-hidden="true" className="h-8 w-8 text-primary-teal/20" fill="currentColor" viewBox="0 0 24 24">
          <path d={QUOTE_PATH} />
        </svg>
      </div>

      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground sm:text-base">
        <p>&ldquo;{testimonial.quote}&rdquo;</p>
      </blockquote>

      {testimonial.achievement ? (
        <p className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-teal/10 px-3 py-1 text-xs font-semibold text-primary-emerald">
          <svg aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
          {testimonial.achievement}
        </p>
      ) : null}

      <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-5">
        <span
          aria-hidden="true"
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-white shadow-glow',
            testimonial.tone
          )}
        >
          {testimonial.avatar}
        </span>
        <span className="min-w-0">
          <span className="block font-display font-bold text-foreground">{testimonial.author}</span>
          <span className="block text-sm text-muted">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const [paused, setPaused] = useState(false);
  const { ref, isInView } = useInView({ threshold: 0.2 });
  // The row only runs while it is on screen.
  const { ref: rowRef, isInView: rowOnScreen } = useInView({ threshold: 0, triggerOnce: false });
  const { t } = useLocale();

  const testimonials: Testimonial[] = t.testimonials.items.map((item, i) => ({
    ...item,
    avatar: AVATARS[i % AVATARS.length],
    tone: AVATAR_TONES[i % AVATAR_TONES.length],
  }));

  return (
    <section ref={ref} data-inview={isInView} className="section-padding relative overflow-hidden">
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-forest/5 to-transparent"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-8 h-36 w-36 -translate-x-1/2 text-primary-teal/[0.07] md:top-12 md:h-48 md:w-48"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d={QUOTE_PATH} />
      </svg>

      <div className="container relative z-10 mx-auto px-4">
        <div className="reveal text-center">
          <h2 className="section-title">{renderTitle(t.testimonials.title)}</h2>

          <div aria-hidden="true" className="mt-6 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {testimonials.map((item) => (
                <span
                  key={item.id}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br font-display text-[11px] font-bold text-white ring-2 ring-background',
                    item.tone
                  )}
                >
                  {item.avatar}
                </span>
              ))}
            </div>
            <StarRating />
          </div>
        </div>
      </div>

      <div
        className="reveal relative z-10 mt-4 md:mt-6"
        style={{ '--reveal-delay': '150ms' } as React.CSSProperties}
      >
        <SpotlightGroup>
          <div
            ref={rowRef}
            className="marquee py-10"
            data-paused={paused || !rowOnScreen ? '' : undefined}
            style={{ '--marquee-duration': '60s' } as React.CSSProperties}
          >
            {/* Reduced motion: the row stops and wraps into a centred two-column wall. */}
            <div className="marquee-track motion-reduce:mx-auto motion-reduce:max-w-[52rem] motion-reduce:px-4">
              {testimonials.map((item) => (
                <TestimonialCard key={item.id} testimonial={item} />
              ))}
            </div>
            <div className="marquee-track" aria-hidden="true">
              {testimonials.map((item) => (
                <TestimonialCard key={item.id} testimonial={item} />
              ))}
            </div>
          </div>
        </SpotlightGroup>

        <div className="flex justify-center">
          <AnimationPauseToggle paused={paused} onToggle={() => setPaused((value) => !value)} />
        </div>
      </div>
    </section>
  );
}
