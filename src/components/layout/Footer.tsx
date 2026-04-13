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
            {SITE_CONFIG.description}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted md:flex-row">
          <p>&copy; {currentYear} {t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">{t.footer.privacyPolicy}</Link>
            <Link href="/terms" className="hover:text-foreground">{t.footer.termsOfService}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
