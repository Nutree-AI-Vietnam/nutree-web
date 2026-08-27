'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { LEGAL_COMPANY, LEGAL_LINKS } from '@/lib/legal-company';
import { useLocale } from '@/lib/locale-context';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, locale } = useLocale();
  const legalLocale = locale === 'vi' ? 'vi' : 'en';
  const companyName = legalLocale === 'vi' ? LEGAL_COMPANY.legalName : LEGAL_COMPANY.legalNameEn;
  const taxIssuedPlace =
    legalLocale === 'vi' ? LEGAL_COMPANY.taxIssuedPlace : LEGAL_COMPANY.taxIssuedPlaceEn;
  const address = legalLocale === 'vi' ? LEGAL_COMPANY.address : LEGAL_COMPANY.addressEn;

  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-background to-primary-forest/[0.03]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.95fr] lg:gap-12">
          <div className="space-y-4">
            <Logo size="md" linkHome={false} />
            <p className="max-w-sm text-sm leading-relaxed text-muted">{t.footer.description}</p>
            <a
              href={`mailto:${LEGAL_COMPANY.email}`}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-primary-forest underline-offset-4 transition-colors hover:text-primary-teal hover:underline"
            >
              {LEGAL_COMPANY.email}
            </a>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary-forest/65">
              {t.footer.companyInfo}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              <p className="font-semibold text-foreground">{companyName}</p>
              <p>
                <span className="text-foreground/80">{t.footer.taxId}:</span> {LEGAL_COMPANY.taxId}
              </p>
              <p>
                <span className="text-foreground/80">{t.footer.taxIssuedDate}:</span>{' '}
                {LEGAL_COMPANY.taxIssuedDate}
              </p>
              <p>
                <span className="text-foreground/80">{t.footer.taxIssuedPlace}:</span>{' '}
                {taxIssuedPlace}
              </p>
              <p className="max-w-xs">{address}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary-forest/65">
              {legalLocale === 'vi' ? 'Chính sách' : 'Policies'}
            </h2>
            <nav
              aria-label={legalLocale === 'vi' ? 'Chính sách pháp lý' : 'Legal policies'}
              className="mt-4 grid grid-cols-1 gap-2.5 text-sm text-muted sm:grid-cols-2 lg:grid-cols-1"
            >
              {LEGAL_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="min-h-9 inline-flex items-center transition-colors hover:text-primary-forest"
                >
                  {item.label[legalLocale]}
                </Link>
              ))}
              <Link
                href="/contact"
                className="min-h-9 inline-flex items-center transition-colors hover:text-primary-forest"
              >
                {t.footer.contact}
              </Link>
              <Link
                href="/research"
                className="min-h-9 inline-flex items-center transition-colors hover:text-primary-forest"
              >
                {t.footer.research}
              </Link>
              <Link
                href="/faq"
                className="min-h-9 inline-flex items-center transition-colors hover:text-primary-forest"
              >
                {t.footer.faq}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-8 text-sm text-muted md:flex-row md:items-center">
          <div className="space-y-1">
            <p>
              &copy; {currentYear} {t.footer.copyright}
            </p>
            <p className="text-xs">
              Powered by{' '}
              <a
                href="https://platform.fatsecret.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                fatsecret Platform API
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs md:justify-end">
            <Link href="/privacy" className="hover:text-foreground">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              {t.footer.termsOfService}
            </Link>
            <Link href="/usage" className="hover:text-foreground">
              {legalLocale === 'vi' ? 'Chính sách sử dụng' : 'Usage'}
            </Link>
            <Link href="/cancellation" className="hover:text-foreground">
              {legalLocale === 'vi' ? 'Hủy & hoàn tiền' : 'Cancellation'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
