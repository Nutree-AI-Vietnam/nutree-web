'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BankTransferCheckout } from '@/components/sections/BankTransferCheckout';
import { PricingCard } from '@/components/sections/PricingCard';
import { appStoreUrl, quizEntryUrl, SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { payPageContent } from '@/lib/pay-page-content';
import { translations, type Locale } from '@/lib/translations';

export function MuaGoiPageClient({ serverLocale }: { serverLocale: Locale }) {
  const { locale, preferenceReady } = useLocale();
  // Stay on the server cookie until the provider has applied that same cookie. Switching earlier
  // reads the provider's initial vi and can paint VietQR, then open ?plan checkout, before the cookie wins.
  const displayLocale = preferenceReady ? locale : serverLocale;
  const copy = payPageContent[displayLocale];
  const showVietQr = displayLocale !== 'en';
  const [isCheckout, setIsCheckout] = useState(false);

  // Old /pay?plan=yearly links redirect here and still open checkout. The monthly plan is no longer
  // sold, so ?plan=monthly shows the plan instead. Read after mount instead of useSearchParams, which
  // would drop the whole page out of the static HTML.
  useEffect(() => {
    if (!showVietQr) {
      setIsCheckout(false);
      return;
    }
    const requested = new URLSearchParams(window.location.search).get('plan');
    if (requested === copy.plan.id) setIsCheckout(true);
  }, [copy.plan.id, showVietQr]);

  const showCheckout = (value: boolean) => {
    setIsCheckout(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const legalLinks = [
    { href: '/payment', label: copy.legalPayment },
    { href: '/pricing', label: copy.legalPricing },
    { href: '/cancellation', label: copy.legalCancel },
    { href: '/usage', label: copy.legalUsage },
  ];

  return (
    <div className="container mx-auto px-4 pb-16 pt-28 md:pt-32">
      {showVietQr && isCheckout ? (
        <>
          <h1 className="sr-only">{copy.title}</h1>
          <BankTransferCheckout plan={copy.plan} copy={copy.checkout} onBack={() => showCheckout(false)} />
        </>
      ) : (
        <>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary-emerald">
            {copy.eyebrow}
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl text-balance text-center font-display text-3xl font-extrabold tracking-tight text-primary-forest md:text-5xl">
            {copy.title}
          </h1>
          {showVietQr ? (
            <p className="mx-auto mt-4 max-w-xl text-center text-base text-muted md:text-lg">{copy.subtitle}</p>
          ) : null}
          {showVietQr ? (
            <>
              <div className="mt-12">
                <PricingCard plan={copy.plan} onSelect={() => showCheckout(true)} />
              </div>
              <p className="mt-6 text-center text-sm text-muted">{copy.footnote}</p>
            </>
          ) : (
            <div className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-4 text-center">
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary-forest px-6 text-base font-semibold text-white"
                href={quizEntryUrl('en')}
              >
                {translations.en.hero.primaryCta}
              </a>
              <p className="text-base text-muted">{translations[displayLocale].hero.orDownload}</p>
              <a className="font-semibold text-primary-forest underline-offset-4 hover:underline" href={appStoreUrl('en')}>
                {translations[displayLocale].common.appStoreDownloadLabel}
              </a>
              <a className="font-semibold text-primary-forest underline-offset-4 hover:underline" href={SITE_CONFIG.stores.googlePlay}>
                {translations[displayLocale].common.googlePlayDownloadLabel}
              </a>
            </div>
          )}
        </>
      )}

      <nav
        aria-label={copy.legalNavLabel}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
      >
        {legalLinks.map((link) => (
          <Link key={link.href} href={link.href} className="text-primary-forest underline-offset-4 hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
