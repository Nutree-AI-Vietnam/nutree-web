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
    <footer className="border-t border-border/50 bg-background/50">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <Logo size="md" linkHome={false} />
            <p className="max-w-xs text-sm text-muted">{t.footer.description}</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white/60 p-5 text-sm text-muted">
            <h2 className="font-display text-sm font-semibold text-foreground">
              {t.footer.companyInfo}
            </h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-forest/70">
                  {t.footer.companyName}
                </dt>
                <dd className="mt-1 font-medium text-foreground">{companyName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-forest/70">
                  {t.footer.taxId}
                </dt>
                <dd className="mt-1 font-medium text-foreground">{LEGAL_COMPANY.taxId}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-forest/70">
                  {t.footer.taxIssuedDate}
                </dt>
                <dd className="mt-1 font-medium text-foreground">{LEGAL_COMPANY.taxIssuedDate}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-forest/70">
                  {t.footer.taxIssuedPlace}
                </dt>
                <dd className="mt-1 font-medium text-foreground">{taxIssuedPlace}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-forest/70">
                  {t.footer.address}
                </dt>
                <dd className="mt-1 leading-relaxed text-foreground">{address}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-forest/70">
                  {t.footer.email}
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${LEGAL_COMPANY.email}`}
                    className="font-medium text-primary-forest underline-offset-4 hover:underline"
                  >
                    {LEGAL_COMPANY.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <nav
          aria-label={legalLocale === 'vi' ? 'Chính sách pháp lý' : 'Legal policies'}
          className="mt-10 grid grid-cols-1 gap-2 text-sm text-muted sm:grid-cols-2 md:grid-cols-3"
        >
          {LEGAL_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label[legalLocale]}
            </Link>
          ))}
          <Link href="/contact" className="hover:text-foreground">
            {t.footer.contact}
          </Link>
          <Link href="/research" className="hover:text-foreground">
            {t.footer.research}
          </Link>
          <Link href="/faq" className="hover:text-foreground">
            {t.footer.faq}
          </Link>
        </nav>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p>
              &copy; {currentYear} {t.footer.copyright}
            </p>
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
            <Link href="/privacy" className="hover:text-foreground">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              {t.footer.termsOfService}
            </Link>
            <Link href="/usage" className="hover:text-foreground">
              {legalLocale === 'vi' ? 'Chính sách sử dụng' : 'Usage'}
            </Link>
            <Link href="/pricing" className="hover:text-foreground">
              {legalLocale === 'vi' ? 'Chính sách giá' : 'Pricing'}
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
