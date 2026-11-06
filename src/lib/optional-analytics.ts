'use client';

import { readConsentCookie } from './cookie-consent';
import { SITE_CONFIG } from './constants';

function consentGranted(): boolean {
  return readConsentCookie(document.cookie) === 'accepted';
}

/** Stop a PostHog instance that was already started. Does not initialize one. */
export async function stopPostHog(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  const { default: posthog } = await import('posthog-js');
  if (!posthog.__loaded) return;
  posthog.stopSessionRecording?.();
  posthog.opt_out_capturing();
}

/** Deny future Google Ads hits. Does nothing if gtag was never installed. */
export function stopGoogleAds(): void {
  if (!window.gtag) return;
  window.gtag('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
}

export function stopOptionalAnalytics(): void {
  stopGoogleAds();
  void stopPostHog();
}

let googleScriptInserted = false;

/** Load Google Ads only after the script arrives and consent is still accepted. */
export function armGoogleAds(adsId: string): void {
  if (!consentGranted() || googleScriptInserted) return;
  googleScriptInserted = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsId)}`;
  script.onload = () => {
    if (!consentGranted()) return;
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // gtag.js reads the arguments object itself, so it must be pushed as is.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('set', 'linker', { domains: [new URL(SITE_CONFIG.quizUrl).host] });
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    window.gtag('config', adsId);
  };
  document.head.appendChild(script);
}
