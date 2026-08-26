'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/constants';
import {
  formatVnd,
  PAY_AMOUNTS,
  PAY_BANK,
  transferContent,
  type PayPlanId,
} from '@/lib/pay-bank';
import type { PayCheckoutCopy, PayPlanCopy } from '@/lib/pay-page-content';

interface BankTransferCheckoutProps {
  plan: PayPlanCopy;
  copy: PayCheckoutCopy;
  onBack: () => void;
}

function CopyRow({
  label,
  value,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="truncate font-display text-base font-bold text-foreground">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-primary-forest/20 px-3 text-sm font-semibold text-primary-forest transition-colors hover:border-primary-forest/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

export function BankTransferCheckout({ plan, copy, onBack }: BankTransferCheckoutProps) {
  const planId = plan.id as PayPlanId;
  const amount = formatVnd(PAY_AMOUNTS[planId]);
  const content = transferContent(planId);

  return (
    <section className="mx-auto max-w-xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-forest transition-colors hover:text-primary-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2"
      >
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
          <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {copy.back}
      </button>

      <h1 className="font-display text-3xl font-extrabold text-primary-forest">{copy.title}</h1>
      <p className="mt-2 text-muted">{copy.scanHint}</p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-black p-4">
        <Image
          src={PAY_BANK.qrSrc}
          alt={PAY_BANK.qrAlt}
          width={720}
          height={960}
          className="mx-auto h-auto w-full max-w-sm object-contain"
          priority
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-white px-5 py-2">
        <CopyRow label={copy.amountLabel} value={amount} copyLabel={copy.copy} copiedLabel={copy.copied} />
        <CopyRow label={copy.bankLabel} value={PAY_BANK.bankName} copyLabel={copy.copy} copiedLabel={copy.copied} />
        <CopyRow label={copy.accountNameLabel} value={PAY_BANK.accountName} copyLabel={copy.copy} copiedLabel={copy.copied} />
        <CopyRow
          label={copy.accountNumberLabel}
          value={PAY_BANK.accountNumber}
          copyLabel={copy.copy}
          copiedLabel={copy.copied}
        />
        <CopyRow label={copy.contentLabel} value={content} copyLabel={copy.copy} copiedLabel={copy.copied} />
        <div className="py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{copy.planLabel}</p>
          <p className="font-display text-base font-bold text-foreground">
            {plan.name} · {plan.price.replace('*', '')}
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {copy.afterPay}{' '}
        <a
          href={`mailto:${SITE_CONFIG.supportEmail}?subject=Nutree%20bank%20transfer`}
          className="font-semibold text-primary-forest underline-offset-4 hover:underline"
        >
          {SITE_CONFIG.supportEmail}
        </a>
      </p>
    </section>
  );
}
