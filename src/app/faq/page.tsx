import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { translations } from '@/lib/translations';
import { FaqPageClient } from './faq-page-client';

export const metadata: Metadata = {
  title: 'FAQ | Nutree',
  description: 'Frequently asked questions about Nutree — AI nutrition tracking, meal suggestions, subscriptions, and more.',
  openGraph: {
    title: 'FAQ | Nutree',
    description: 'Frequently asked questions about Nutree — AI nutrition tracking, meal suggestions, subscriptions, and more.',
    type: 'website',
    url: `${SITE_CONFIG.url}/faq`,
  },
};

export default function FaqPage() {
  const t = translations.en.faq;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-white to-primary-teal/5">
      <div className="container mx-auto px-4 py-20">
        {/* Back to Home */}
        <Link
          href="/"
          aria-label="Back to home page"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-forest transition-colors hover:text-primary-teal mb-8"
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
          Back to Home
        </Link>

        {/* Header */}
        <header className="mb-12 pb-8 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
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
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {t.pageTitle}
              </h1>
              <p className="text-muted">{t.pageDescription}</p>
            </div>
          </div>
        </header>

        {/* Accordion — client component reads locale from context */}
        <FaqPageClient />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/50 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} Nutree. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/privacy" className="text-primary-forest hover:text-primary-teal">
              Privacy Policy
            </Link>
            <span className="mx-2">|</span>
            <Link href="/terms" className="text-primary-forest hover:text-primary-teal">
              Terms of Service
            </Link>
            <span className="mx-2">|</span>
            <Link href="/" className="text-primary-forest hover:text-primary-teal">
              Home
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
