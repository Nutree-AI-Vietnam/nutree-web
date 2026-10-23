'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BankTransferCheckout } from '@/components/sections/BankTransferCheckout';
import { PricingTable } from '@/components/sections/PricingTable';
import { useLocale } from '@/lib/locale-context';
import type { PayPlanId } from '@/lib/pay-bank';
import { payPageContent } from '@/lib/pay-page-content';

function isPayPlanId(value: string | null): value is PayPlanId {
  return value === 'monthly' || value === 'yearly';
}

export function MuaGoiPageClient() {
  const { locale } = useLocale();
  const copy = payPageContent[locale];
  const [selectedId, setSelectedId] = useState<PayPlanId | null>(null);

  // Old /pay?plan=yearly links redirect here and still open on that plan. Read after mount instead of
  // useSearchParams, which would drop the whole page out of the static HTML.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('plan');
    if (isPayPlanId(requested)) setSelectedId(requested);
  }, []);

  const select = (id: PayPlanId | null) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPlan = copy.plans.find((plan) => plan.id === selectedId) ?? null;
  const legalLinks = [
    { href: '/payment', label: copy.legalPayment },
    { href: '/pricing', label: copy.legalPricing },
    { href: '/cancellation', label: copy.legalCancel },
    { href: '/usage', label: copy.legalUsage },
  ];

  return (
    <div className="container mx-auto px-4 pb-16 pt-28 md:pt-32">
      <h1 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">{copy.title}</h1>

      {selectedPlan ? (
        <div className="mt-8">
          <BankTransferCheckout plan={selectedPlan} copy={copy.checkout} onBack={() => select(null)} />
        </div>
      ) : (
        <>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">{copy.subtitle}</p>
          <div className="mt-10">
            <PricingTable plans={copy.plans} onSelect={select} />
          </div>
          <p className="mt-6 text-center text-sm text-muted">{copy.footnote}</p>
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
