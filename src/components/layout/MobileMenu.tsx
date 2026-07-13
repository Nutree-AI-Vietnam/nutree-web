'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { AppleIcon } from '@/components/ui/AppleIcon';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { getNavLabel } from '@/lib/translations';
import { cn } from '@/lib/cn';

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const { locale, setLocale, t } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg md:hidden"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <Logo size="sm" />
          <button
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
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                className="font-display text-2xl font-semibold text-foreground"
                onClick={onClose}
              >
                {getNavLabel(link.href, t.nav)}
              </Link>
            </motion.div>
          ))}

          {/* Language Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: NAV_LINKS.length * 0.1 }}
            className="flex items-center gap-4"
          >
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
          </motion.div>

          {/* App Store Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (NAV_LINKS.length + 1) * 0.1 }}
            className="w-full max-w-xs px-4"
          >
            <Link
              href={SITE_CONFIG.stores.appStore}
              onClick={onClose}
              aria-label={t.common.appStoreDownloadLabel}
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2"
              >
                <AppleIcon className="h-5 w-5" />
                {t.hero.downloadFree}
              </Button>
            </Link>
          </motion.div>
        </nav>
      </div>
    </motion.div>
  );
}
