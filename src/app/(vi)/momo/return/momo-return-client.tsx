'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MomoLogo } from '@/components/ui/MomoLogo';
import { appStoreUrl, SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { payPageContent } from '@/lib/pay-page-content';
import { fetchMomoOrderStatus, momoOrderIdFrom, readRememberedMomoEmail, readRememberedMomoOrderId } from '@/lib/payments/momo';

/**
 * `session`: no order id to look up. `unconfirmed`: this browser cannot read the
 * order, yet the buyer may already have paid, so it must not push them to pay again.
 */
type ReturnState = 'confirming' | 'paid' | 'failed' | 'expired' | 'session' | 'unconfirmed' | 'slow';

const POLL_MS = 3000;
const GIVE_UP_MS = 120_000;

export function MomoReturnClient() {
  const { locale, preferenceReady } = useLocale();
  const copy = payPageContent[preferenceReady && locale === 'en' ? 'en' : 'vi'].momo;
  const [orderId, setOrderId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [state, setState] = useState<ReturnState>('confirming');
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = momoOrderIdFrom(params) ?? readRememberedMomoOrderId();
    setOrderId(id);
    setEmail(readRememberedMomoEmail());
    setState(id ? 'confirming' : 'session');
    setReady(true);
  }, [attempt]);

  useEffect(() => {
    if (!ready || !orderId || state !== 'confirming') return;
    let stopped = false;
    let timer = 0;
    const startedAt = Date.now();
    const finish = (next: ReturnState) => {
      stopped = true;
      window.clearTimeout(timer);
      setState(next);
    };
    const poll = async () => {
      const order = await fetchMomoOrderStatus(orderId).catch(() => null);
      if (stopped) return;
      if (order?.status === 'paid') return finish('paid');
      if (order?.status === 'failed' || order?.status === 'expired') return finish(order.status);
      if (order?.httpStatus === 401 || order?.httpStatus === 404) return finish('unconfirmed');
      if (Date.now() - startedAt > GIVE_UP_MS) return finish('slow');
      timer = window.setTimeout(() => {
        void poll();
      }, POLL_MS);
    };
    void poll();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [orderId, ready, state]);

  if (!ready) {
    return (
      <div className="container mx-auto max-w-xl px-4 pb-16 pt-28 text-center md:pt-32">
        <div aria-hidden="true" className="mx-auto mt-16 h-8 w-8 animate-spin rounded-full border-4 border-[#f3d6e7] border-t-[#a50064]" />
      </div>
    );
  }

  const view = {
    confirming: { headline: copy.confirmingHeadline, body: copy.confirmingBody },
    paid: { headline: copy.paidHeadline, body: copy.paidBody },
    failed: { headline: copy.failedHeadline, body: copy.failedBody },
    expired: { headline: copy.expiredHeadline, body: copy.expiredBody },
    session: { headline: copy.sessionHeadline, body: copy.sessionBody },
    unconfirmed: { headline: copy.unconfirmedHeadline, body: copy.unconfirmedBody },
    slow: { headline: copy.confirmingHeadline, body: copy.slow },
  }[state];

  return (
    <div className="container mx-auto max-w-xl px-4 pb-16 pt-28 text-center md:pt-32">
      <div className="mx-auto mt-6 flex justify-center">
        <MomoLogo size={56} />
      </div>
      <h1 className="mt-5 font-display text-3xl font-extrabold text-primary-forest">{view.headline}</h1>
      <p className="mt-3 text-muted" role="status">
        {view.body}
      </p>
      {email && (state === 'paid' || state === 'unconfirmed') ? <p className="mt-2 font-semibold text-foreground">{email}</p> : null}
      {state === 'confirming' ? (
        <div aria-hidden="true" className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-4 border-[#f3d6e7] border-t-[#a50064]" />
      ) : null}
      {orderId ? (
        <p className="mt-6 text-sm font-semibold text-muted">
          {copy.orderLabel}: <span className="font-mono text-primary-forest">{orderId}</span>
        </p>
      ) : null}
      {state === 'paid' || state === 'unconfirmed' ? (
        <div className="mt-8 flex flex-col items-center gap-3">
          <a className="font-semibold text-primary-forest underline-offset-4 hover:underline" href={appStoreUrl('vi')}>
            {copy.openAppStore}
          </a>
          <a className="font-semibold text-primary-forest underline-offset-4 hover:underline" href={SITE_CONFIG.stores.googlePlay}>
            {copy.openGooglePlay}
          </a>
        </div>
      ) : null}
      {state === 'unconfirmed' && orderId ? (
        <p className="mt-6 text-sm text-muted">
          {copy.support}{' '}
          <a className="font-extrabold text-primary-forest underline" href={`mailto:${SITE_CONFIG.supportEmail}?subject=${encodeURIComponent(`MoMo ${orderId}`)}`}>
            {SITE_CONFIG.supportEmail}
          </a>
        </p>
      ) : null}
      {(state === 'failed' || state === 'expired' || state === 'session') && (
        <Link
          href="/mua-goi"
          className="mx-auto mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary-forest px-6 font-extrabold text-white transition hover:bg-primary-emerald"
        >
          {copy.tryAgain}
        </Link>
      )}
      {state === 'slow' ? (
        <button
          type="button"
          onClick={() => {
            setState('confirming');
            setAttempt((value) => value + 1);
          }}
          className="mx-auto mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary-forest px-6 font-extrabold text-white transition hover:bg-primary-emerald"
        >
          {copy.retry}
        </button>
      ) : null}
      {state === 'unconfirmed' ? (
        <p className="mt-8">
          <Link href="/mua-goi" className="text-sm font-semibold text-muted underline">
            {copy.notPaid}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
