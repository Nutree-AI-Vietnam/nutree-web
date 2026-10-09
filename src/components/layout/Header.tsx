'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { AppleIcon } from '@/components/ui/AppleIcon';
import { AndroidIcon } from '@/components/ui/AndroidIcon';
import { CartIcon } from '@/components/ui/CartIcon';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/cn';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { getNavLabel } from '@/lib/translations';

const pillClass =
  'inline-flex h-10 items-center gap-2 rounded-full border border-primary-forest/20 px-3 text-sm font-medium text-primary-forest transition-colors hover:border-primary-forest/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <Logo size="sm" />

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {getNavLabel(link.href, t.nav)}
                </Link>
              ))}
            </nav>

            {/* Desktop: Cart + Language Toggle + Store links */}
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/pay" aria-label={t.common.cartLabel} className={pillClass}>
                <CartIcon className="h-4 w-4" />
                <span>{t.common.cart}</span>
              </Link>

              <button
                onClick={() => setLocale(locale === 'en' ? 'vi' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-primary-forest/20 hover:border-primary-forest/40 transition-colors"
                aria-label="Toggle language"
              >
                <span className={locale === 'en' ? 'text-foreground' : 'text-muted'}>EN</span>
                <span className="text-muted">/</span>
                <span className={locale === 'vi' ? 'text-foreground' : 'text-muted'}>VI</span>
              </button>

              {/* Visible store names stay inside the accessible name (WCAG 2.5.3). */}
              <a
                href={SITE_CONFIG.stores.appStore}
                aria-label={t.common.appStoreDownloadLabel}
                className={pillClass}
              >
                <AppleIcon className="h-4 w-4" />
                <span className="hidden xl:inline">App Store</span>
              </a>
              <a
                href={SITE_CONFIG.stores.googlePlay}
                aria-label={t.common.googlePlayDownloadLabel}
                className={pillClass}
              >
                <AndroidIcon className="h-4 w-4" />
                <span className="hidden xl:inline">Google Play</span>
              </a>
            </div>

            {/* Mobile: Cart + Menu */}
            <div className="flex items-center gap-1 md:hidden">
              <Link
                href="/pay"
                aria-label={t.common.cartLabel}
                className="flex h-10 w-10 items-center justify-center text-primary-forest"
              >
                <CartIcon />
              </Link>
              <button
                className="flex h-10 w-10 items-center justify-center"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
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
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <MobileMenu onClose={closeMobileMenu} />}
    </>
  );
}
