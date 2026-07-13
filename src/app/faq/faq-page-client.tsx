'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { FaqAccordion } from '@/components/sections/FaqAccordion';

export function FaqPageClient() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-white to-primary-teal/5">
      <div className="container mx-auto px-4 py-20">
        <Link
          href="/"
          aria-label={t.common.backHome}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary-forest transition-colors hover:text-primary-teal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t.common.backHome}
        </Link>

        <header className="mb-12 border-b border-border/50 pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-forest text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                {t.faq.pageTitle}
              </h1>
              <p className="text-muted">{t.faq.pageDescription}</p>
            </div>
          </div>
        </header>

        <FaqAccordion sections={t.faq.sections} />

        <footer className="mt-16 border-t border-border/50 pt-8 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
          <p className="mt-2">
            <Link href="/privacy" className="text-primary-forest hover:text-primary-teal">
              {t.footer.privacyPolicy}
            </Link>
            <span className="mx-2">|</span>
            <Link href="/terms" className="text-primary-forest hover:text-primary-teal">
              {t.footer.termsOfService}
            </Link>
            <span className="mx-2">|</span>
            <Link href="/" className="text-primary-forest hover:text-primary-teal">
              {t.common.home}
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
