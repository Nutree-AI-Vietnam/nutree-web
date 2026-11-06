'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { privacyPath } from '@/lib/privacy-path';
import {
  chooseCookieConsent,
  getCookieConsentServerSnapshot,
  getCookieConsentSnapshot,
  hydrateCookieConsent,
  subscribeCookieConsent,
} from '@/lib/cookie-consent-store';

export function CookieConsent() {
  const { t, locale } = useLocale();
  const { hydrated, bannerOpen } = useSyncExternalStore(
    subscribeCookieConsent,
    getCookieConsentSnapshot,
    getCookieConsentServerSnapshot
  );

  useEffect(() => {
    hydrateCookieConsent();
  }, []);

  if (!hydrated || !bannerOpen) return null;

  return (
    <section
      aria-label={t.cookies.title}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background px-4 py-4 shadow-glass-lg"
    >
      <div className="container mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-base font-bold text-primary-forest">{t.cookies.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t.cookies.body}</p>
          <p className="mt-2">
            <Link className="text-sm font-semibold text-primary-forest underline" href={privacyPath(locale)}>
              {t.cookies.privacy}
            </Link>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:w-80">
          <button
            type="button"
            className="min-h-12 rounded-full border-2 border-primary-forest px-4 text-sm font-semibold text-primary-forest"
            onPointerDown={() => chooseCookieConsent('denied')}
            onClick={() => chooseCookieConsent('denied')}
          >
            {t.cookies.reject}
          </button>
          <button
            type="button"
            className="min-h-12 rounded-full border-2 border-primary-forest bg-primary-forest px-4 text-sm font-semibold text-white"
            onClick={() => chooseCookieConsent('accepted')}
          >
            {t.cookies.accept}
          </button>
        </div>
      </div>
    </section>
  );
}
