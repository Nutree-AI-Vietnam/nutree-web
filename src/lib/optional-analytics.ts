'use client';

import { readConsentCookie } from './cookie-consent';
import { SITE_CONFIG } from './constants';
import { initialGoogleTagState, optionalAnalyticsCalls, reduceGoogleTag, type GoogleTagState } from './optional-analytics-gate';

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

let googleTag: GoogleTagState = initialGoogleTagState();

function applyGoogleActions(actions: Array<'insert-script' | 'config' | 'deny'>, adsId: string) {
  if (actions.includes('deny')) stopGoogleAds();
  if (actions.includes('config')) configureGoogleAds(adsId);
  if (actions.includes('insert-script')) insertGoogleAdsScript(adsId);
}

function configureGoogleAds(adsId: string) {
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
}

function insertGoogleAdsScript(adsId: string) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsId)}`;
  script.onload = () => {
    const next = reduceGoogleTag(googleTag, 'script-load');
    googleTag = next.state;
    applyGoogleActions(next.actions, adsId);
  };
  document.head.appendChild(script);
}

/** Load Google Ads only after the script arrives and consent is still accepted. */
export function armGoogleAds(adsId: string): void {
  if (!consentGranted()) return;
  const next = reduceGoogleTag(googleTag, 'allow');
  googleTag = next.state;
  applyGoogleActions(next.actions, adsId);
}

export function stopOptionalAnalytics(): void {
  const next = reduceGoogleTag(googleTag, 'deny');
  googleTag = next.state;
  applyGoogleActions(next.actions, '');
  const calls = optionalAnalyticsCalls('denied', { posthogLoaded: true, googleLoaded: false });
  if (calls.some((call) => call.method === 'optOut')) void stopPostHog();
}
