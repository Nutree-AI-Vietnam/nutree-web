'use client';

import { cn } from '@/lib/cn';
import { useLocale } from '@/lib/locale-context';

interface AnimationPauseToggleProps {
  paused: boolean;
  onToggle: () => void;
  className?: string;
}

// Visible stop control for content that moves on its own (WCAG 2.2.2). Reduced-motion users
// never see the motion, so they never see the button either.
export function AnimationPauseToggle({ paused, onToggle, className }: AnimationPauseToggleProps) {
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? t.common.playAnimation : t.common.pauseAnimation}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/80 text-primary-forest shadow-sm transition-colors hover:border-primary-teal hover:text-primary-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2 motion-reduce:hidden',
        className
      )}
    >
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        {paused ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        )}
      </svg>
    </button>
  );
}
