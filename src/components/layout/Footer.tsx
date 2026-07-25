'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLocale();

  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="container mx-auto px-4 py-10 md:py-12">
        {/* Brand */}
        <div className="space-y-4">
          <Logo size="md" linkHome={false} />
          <p className="max-w-xs text-sm text-muted">
            {t.footer.description}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p>&copy; {currentYear} {t.footer.copyright}</p>
            <p className="text-xs">
              Powered by{' '}
              <a
                href="https://platform.fatsecret.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                fatsecret Platform API
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
            <Link href="/contact" className="hover:text-foreground">{t.footer.contact}</Link>
            <Link href="/research" className="hover:text-foreground">{t.footer.research}</Link>
            <Link href="/privacy" className="hover:text-foreground">{t.footer.privacyPolicy}</Link>
            <Link href="/terms" className="hover:text-foreground">{t.footer.termsOfService}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
