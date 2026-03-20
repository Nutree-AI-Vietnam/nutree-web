'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface LinkCardProps {
  label: string;
  url: string;
  icon: React.ReactNode;
  description?: string;
  /** When true, renders as non-clickable guidance instead of a link */
  showSearchGuidance?: boolean;
  appName?: string;
  index?: number;
}

export function LinkCard({
  label,
  url,
  icon,
  description,
  showSearchGuidance = false,
  appName = 'Nutree',
  index = 0,
}: LinkCardProps) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-forest/10 text-primary-forest">
        {icon}
      </span>
      <span className="flex flex-col text-left">
        <span className="font-display text-sm font-semibold text-foreground sm:text-base">
          {showSearchGuidance
            ? `Search "${appName}" in your App Store`
            : label}
        </span>
        {(description || showSearchGuidance) && (
          <span className="text-xs text-muted">
            {showSearchGuidance
              ? 'Open App Store or Google Play on your device'
              : description}
          </span>
        )}
      </span>
      {!showSearchGuidance && (
        <svg
          className="ml-auto h-5 w-5 shrink-0 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      )}
      {showSearchGuidance && (
        <svg
          className="ml-auto h-5 w-5 shrink-0 text-primary-teal"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      )}
    </>
  );

  const sharedClasses = cn(
    'flex w-full items-center gap-3 rounded-2xl border border-border bg-white/80 px-4 py-3.5',
    'backdrop-blur-sm transition-all duration-200',
    !showSearchGuidance &&
      'hover:border-primary-teal/30 hover:shadow-glass active:scale-[0.98]',
    showSearchGuidance && 'border-primary-teal/20 bg-primary-teal/5'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      {showSearchGuidance ? (
        <div className={sharedClasses}>{content}</div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={sharedClasses}
        >
          {content}
        </a>
      )}
    </motion.div>
  );
}
