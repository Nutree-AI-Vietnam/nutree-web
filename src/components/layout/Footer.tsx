'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { getNavLabel } from '@/lib/translations';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLocale();

  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="md" linkHome={false} />
            <p className="max-w-xs text-sm text-muted">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              {t.footer.quickLinks}
            </h3>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {getNavLabel(link.href, t.nav)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              {t.footer.getInTouch}
            </h3>
            <p className="text-sm text-muted">
              {t.footer.contactPrompt}
            </p>
            <Link
              href={`mailto:${SITE_CONFIG.supportEmail}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-forest transition-colors hover:text-primary-teal"
            >
              {t.footer.contactSupport}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </Link>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href={SITE_CONFIG.social.facebookMessenger}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Messenger"
                className="text-muted transition-colors hover:text-primary-teal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.942 1.47 5.567 3.773 7.28V22l3.446-1.897c.92.255 1.894.393 2.9.393C17.523 20.496 22 16.35 22 11.243 22 6.145 17.523 2 12 2zm1.22 12.285l-2.584-2.76-5.043 2.76 5.544-5.893 2.65 2.76 4.977-2.76-5.544 5.893z" />
                </svg>
              </a>
              <a
                href={SITE_CONFIG.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-muted transition-colors hover:text-primary-teal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.67a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted md:flex-row">
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
