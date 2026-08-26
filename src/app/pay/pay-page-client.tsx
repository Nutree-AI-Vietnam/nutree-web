'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { BankTransferCheckout } from '@/components/sections/BankTransferCheckout';
import { PricingTable } from '@/components/sections/PricingTable';
import { useLocale } from '@/lib/locale-context';
import type { PayPlanCopy } from '@/lib/pay-page-content';
import { payPageContent } from '@/lib/pay-page-content';

export function PayPageClient() {
  const { locale, setLocale } = useLocale();
  const copy = payPageContent[locale];
  const [selectedPlanId, setSelectedPlanId] = useState<PayPlanCopy['id'] | null>(null);
  const selectedPlan = copy.plans.find((plan) => plan.id === selectedPlanId) ?? null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPlanId]);

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <header className="border-b border-border/60 bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo size="sm" />
          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'vi' : 'en')}
            aria-label={copy.languageLabel}
            className="inline-flex min-h-11 items-center rounded-full border border-primary-forest/20 px-4 text-sm font-semibold text-primary-forest transition-colors hover:border-primary-forest/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2"
          >
            {locale === 'en' ? 'VI' : 'EN'}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 md:py-16">
        {selectedPlan ? (
          <BankTransferCheckout
            plan={selectedPlan}
            copy={copy.checkout}
            onBack={() => setSelectedPlanId(null)}
          />
        ) : (
          <>
            <header className="mb-10 text-center md:mb-14">
              <h1 className="font-display text-3xl font-extrabold text-primary-forest md:text-4xl">
                {copy.title}
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted">{copy.subtitle}</p>
            </header>

            <PricingTable plans={copy.plans} onSelect={setSelectedPlanId} />

            <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-muted">{copy.footnote}</p>
          </>
        )}

        <nav
          aria-label={locale === 'vi' ? 'Chính sách thanh toán' : 'Payment policies'}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-primary-forest"
        >
          <Link href="/payment" className="underline-offset-4 hover:underline">
            {copy.legalPayment}
          </Link>
          <Link href="/pricing" className="underline-offset-4 hover:underline">
            {copy.legalPricing}
          </Link>
          <Link href="/cancellation" className="underline-offset-4 hover:underline">
            {copy.legalCancel}
          </Link>
        </nav>
      </div>
    </div>
  );
}
