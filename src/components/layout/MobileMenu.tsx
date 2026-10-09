'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { StoreBadges } from '@/components/ui/StoreBadges';
import { NAV_LINKS } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { getNavLabel } from '@/lib/translations';
import { cn } from '@/lib/cn';

interface MobileMenuProps {
  /** Keep this stable (useCallback): the open/close effect below depends on it. */
  onClose: () => void;
}

const STAGGER_MS = 70;

const rowDelay = (index: number) => ({ animationDelay: `${index * STAGGER_MS}ms` });

export function MobileMenu({ onClose }: MobileMenuProps) {
  const { locale, setLocale, t } = useLocale();
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open the page behind holds still and Escape closes. Focus starts on the close button
  // and goes back to whatever opened the menu.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKeyDown);
      opener?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="menu-overlay-in fixed inset-0 z-50 bg-background/95 backdrop-blur-lg md:hidden"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <Logo size="sm" />
          <button
            ref={closeRef}
            className="flex h-10 w-10 items-center justify-center"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center justify-center gap-8">
          {NAV_LINKS.map((link, index) => (
            <div key={link.href} className="menu-item-in" style={rowDelay(index)}>
              <Link
                href={link.href}
                className="font-display text-2xl font-semibold text-foreground transition-colors hover:text-primary-emerald"
                onClick={onClose}
              >
                {getNavLabel(link.href, t.nav)}
              </Link>
            </div>
          ))}

          {/* Language Toggle */}
          <div className="menu-item-in flex items-center gap-4" style={rowDelay(NAV_LINKS.length)}>
            <button
              onClick={() => { setLocale('en'); onClose(); }}
              className={cn('text-lg font-semibold', locale === 'en' ? 'text-primary-forest' : 'text-muted')}
            >
              English
            </button>
            <span className="text-muted">|</span>
            <button
              onClick={() => { setLocale('vi'); onClose(); }}
              className={cn('text-lg font-semibold', locale === 'vi' ? 'text-primary-forest' : 'text-muted')}
            >
              Tiếng Việt
            </button>
          </div>

          {/* Store badges */}
          <div className="menu-item-in w-full max-w-xs px-4" style={rowDelay(NAV_LINKS.length + 1)}>
            <StoreBadges onClick={onClose} className="justify-center" />
          </div>
        </nav>
      </div>
    </div>
  );
}
