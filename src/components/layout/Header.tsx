'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { AppleIcon } from '@/components/ui/AppleIcon';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/cn';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { getNavLabel } from '@/lib/translations';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
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

            {/* Desktop: Language Toggle + App Store */}
            <div className="hidden items-center gap-3 md:flex">
              <button
                onClick={() => setLocale(locale === 'en' ? 'vi' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-primary-forest/20 hover:border-primary-forest/40 transition-colors"
                aria-label="Toggle language"
              >
                <span className={locale === 'en' ? 'text-foreground' : 'text-muted'}>EN</span>
                <span className="text-muted">/</span>
                <span className={locale === 'vi' ? 'text-foreground' : 'text-muted'}>VI</span>
              </button>

              <Link
                href={SITE_CONFIG.stores.appStore}
                aria-label={t.common.appStoreDownloadLabel}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2 border-primary-forest/20 hover:border-primary-forest/40"
                >
                  <AppleIcon className="h-4 w-4" />
                  <span className="hidden lg:inline">App Store</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="flex h-10 w-10 items-center justify-center md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
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
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
