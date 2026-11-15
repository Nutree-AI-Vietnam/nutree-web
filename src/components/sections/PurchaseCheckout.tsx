'use client';

import { useEffect, useRef, useState } from 'react';
import { BankTransferCheckout } from '@/components/sections/BankTransferCheckout';
import { MomoLogo } from '@/components/ui/MomoLogo';
import { cn } from '@/lib/cn';
import { formatVnd, PAY_AMOUNTS } from '@/lib/pay-bank';
import type { MomoPayCopy, PayCheckoutCopy, PayPlanCopy } from '@/lib/pay-page-content';
import {
  MOMO_YEARLY_WEEKS,
  rememberMomoCheckout,
  startMomoCheckout,
  type MomoPayMethod,
} from '@/lib/payments/momo';
import type { Locale } from '@/lib/translations';

type CheckoutMethod = MomoPayMethod | 'vietqr';

interface PurchaseCheckoutProps {
  plan: PayPlanCopy;
  copy: PayCheckoutCopy;
  momo: MomoPayCopy;
  momoEnabled: boolean;
  locale: Locale;
  onBack: () => void;
}

function BackButton({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-forest transition-colors hover:text-primary-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2"
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
        <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}

function PaymentMethodChoice({
  value,
  copy,
  disabled,
  onChange,
}: {
  value: CheckoutMethod;
  copy: MomoPayCopy;
  disabled: boolean;
  onChange: (method: CheckoutMethod) => void;
}) {
  const options = [
    { id: 'wallet' as const, label: copy.wallet, hint: copy.walletHint },
    { id: 'atm' as const, label: copy.atm, hint: copy.atmHint },
    { id: 'vietqr' as const, label: copy.vietqr, hint: copy.vietqrHint },
  ];
  return (
    <div role="radiogroup" aria-label={copy.methodLabel} className="overflow-hidden rounded-2xl border border-border bg-white">
      {options.map((option, index) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option.id)}
            className={cn(
              'flex min-h-[4.25rem] w-full items-center gap-3 px-3.5 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-teal disabled:cursor-not-allowed disabled:opacity-60',
              index > 0 && 'border-t border-border',
              selected && 'bg-primary-teal/10',
            )}
          >
            {option.id === 'vietqr' ? (
              <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-[22%] bg-primary-forest/5 text-primary-forest">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 3h2v2h-2v-2Zm4-3h2v2h-2v-2Zm0 4h2v2h-2v-2Zm-4-4h2v2h-2v-2Z" fill="currentColor" />
                </svg>
              </span>
            ) : (
              <MomoLogo size={32} />
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-[0.95rem] font-extrabold leading-tight text-foreground">{option.label}</span>
              <span className="mt-0.5 block text-[0.74rem] font-semibold leading-snug text-muted">{option.hint}</span>
            </span>
            <span aria-hidden="true" className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border-2', selected ? 'border-primary-forest' : 'border-border')}>
              {selected ? <span className="h-2.5 w-2.5 rounded-full bg-primary-forest" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Vietnamese checkout. MoMo (wallet or domestic ATM) and VietQR pay the same
 * yearly plan. MoMo is a one-time pass priced by the API; VietQR stays the
 * bank transfer already on this page.
 */
export function PurchaseCheckout({ plan, copy, momo, momoEnabled, locale, onBack }: PurchaseCheckoutProps) {
  const [method, setMethod] = useState<CheckoutMethod>(momoEnabled ? 'wallet' : 'vietqr');
  const [amount, setAmount] = useState<number>(PAY_AMOUNTS.yearly);
  const [busy, setBusy] = useState(false);
  const [checkoutFailed, setCheckoutFailed] = useState(false);
  const [pricesChanged, setPricesChanged] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const leaveBusy = (event: PageTransitionEvent) => {
      if (event.persisted) setBusy(false);
    };
    window.addEventListener('pageshow', leaveBusy);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('pageshow', leaveBusy);
    };
  }, []);

  if (!momoEnabled) {
    return <BankTransferCheckout plan={plan} copy={copy} onBack={onBack} />;
  }

  const formatted = formatVnd(amount);
  const payLabel = busy ? momo.opening : method === 'atm' ? momo.payAtm(formatted) : momo.pay(formatted);

  const pay = async () => {
    if (busy || method === 'vietqr') return;
    setBusy(true);
    setCheckoutFailed(false);
    try {
      const started = await startMomoCheckout(method, locale === 'en' ? 'en' : 'vi');
      if (!mountedRef.current) return;
      if (started.amount !== amount) {
        setAmount(started.amount);
        setPricesChanged(true);
        setBusy(false);
        return;
      }
      rememberMomoCheckout(started.orderId);
      window.location.assign(started.payUrl);
    } catch {
      if (!mountedRef.current) return;
      setBusy(false);
      setCheckoutFailed(true);
    }
  };

  return (
    <section className="mx-auto max-w-xl">
      <BackButton label={copy.back} onBack={onBack} />
      {method === 'vietqr' ? null : (
        <h2 className="mb-4 font-display text-2xl font-extrabold text-primary-forest md:text-3xl">
          {method === 'atm' ? momo.atm : momo.wallet}
        </h2>
      )}
      <PaymentMethodChoice
        value={method}
        copy={momo}
        disabled={busy}
        onChange={(next) => {
          setMethod(next);
          setCheckoutFailed(false);
        }}
      />
      {method === 'vietqr' ? (
        <div className="mt-8">
          <BankTransferCheckout plan={plan} copy={copy} onBack={onBack} hideBack />
        </div>
      ) : (
        <div className="mt-6">
          <div className="mt-4 border-y border-border py-3 text-foreground">
            <p className="flex items-baseline justify-between gap-3">
              <span className="font-extrabold">{plan.name}</span>
              <span className="text-right">
                <strong className="text-[1.1rem] tabular-nums">{formatted}</strong>
                <span className="block text-[0.78rem] text-muted">{momo.oneTime}</span>
              </span>
            </p>
          </div>
          {pricesChanged ? (
            <p role="status" className="mt-3 rounded-2xl bg-[#FFF7ED] px-4 py-3 text-sm font-bold text-[#9A3412]">
              {momo.pricesUpdated(formatted)}
            </p>
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              void pay();
            }}
            className="mt-4 flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#a50064] px-5 text-base font-extrabold text-white shadow-[0_14px_28px_rgb(165_0_100_/_0.22)] transition hover:bg-[#8a0054] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a50064]/25 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MomoLogo size={26} className="bg-white" />
            <span>{payLabel}</span>
          </button>
          <p className="mt-3 text-center text-[0.76rem] leading-relaxed text-muted">{momo.summary(formatted, MOMO_YEARLY_WEEKS)}</p>
          {checkoutFailed ? (
            <p role="alert" className="mt-3 rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm font-bold text-red-700">
              {momo.checkoutError}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
