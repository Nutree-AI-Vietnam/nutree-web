'use client';

import { useEffect } from 'react';
import { SITE_CONFIG } from '@/lib/constants';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Campaign tags and ad click IDs. The quiz on its own subdomain is where people buy, so these have
 * to travel with the visitor from the landing page to the quiz, or paid clicks can't be matched to
 * purchases.
 */
const ATTRIBUTION_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'ttclid',
  'msclkid',
] as const;

const STORAGE_KEY = 'nutree-ad-attribution';

// Google Ads stays off until the team sets these; there is no placeholder account.
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
/** Conversion label for "clicked through to the quiz", from the Google Ads conversion action. */
const GOOGLE_ADS_QUIZ_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_QUIZ_LABEL;
const QUIZ_HOST = new URL(SITE_CONFIG.quizUrl).host;
const TAG_DELAY_MS = 1500;

type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>>;

/** Storage can be blocked (private mode, disabled cookies); attribution is then simply skipped. */
function readAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') as Attribution;
  } catch {
    return {};
  }
}

/** Keeps the tags of the latest ad click in this session; a landing without tags keeps the old ones. */
function captureLandingAttribution() {
  const params = new URLSearchParams(window.location.search);
  const found = Object.fromEntries(
    ATTRIBUTION_PARAMS.flatMap((name) => {
      const value = params.get(name);
      return value ? [[name, value]] : [];
    })
  );
  if (Object.keys(found).length === 0) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    // Blocked storage: the quiz links just go out untagged.
  }
}

/** Google's tag, inserted once the page is idle like the other analytics, and linked to the quiz domain. */
function loadGoogleAds(adsId: string) {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js reads the arguments object itself, so it must be pushed as is.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('set', 'linker', { domains: [QUIZ_HOST] });
  window.gtag('config', adsId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsId)}`;
  document.head.appendChild(script);
}

/** Reports a click through to the quiz, with the page it came from, to the analytics that are on. */
function reportQuizClick(attribution: Attribution) {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    void import('posthog-js').then(({ default: posthog }) => {
      if (posthog.__loaded) {
        posthog.capture('quiz_cta_click', { from_path: window.location.pathname, ...attribution });
      }
    });
  }
  if (GOOGLE_ADS_ID && GOOGLE_ADS_QUIZ_LABEL) {
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_QUIZ_LABEL}`,
      transport_type: 'beacon',
    });
  }
}

export function AdAttribution() {
  useEffect(() => {
    captureLandingAttribution();

    let idleHandle: number | undefined;
    const timer = GOOGLE_ADS_ID
      ? window.setTimeout(() => {
          const load = () => loadGoogleAds(GOOGLE_ADS_ID);
          if ('requestIdleCallback' in window) idleHandle = window.requestIdleCallback(load, { timeout: 3000 });
          else load();
        }, TAG_DELAY_MS)
      : undefined;

    // Runs before the browser follows the link, so the tagged URL is the one it opens.
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest('a');
      if (!anchor?.href) return;
      const url = new URL(anchor.href);
      if (url.host !== QUIZ_HOST) return;

      const attribution = readAttribution();
      for (const [name, value] of Object.entries(attribution)) {
        if (!url.searchParams.has(name)) url.searchParams.set(name, value);
      }
      anchor.href = url.toString();
      if (event.type === 'click') reportQuizClick(attribution);
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('auxclick', handleClick, true);
    return () => {
      window.clearTimeout(timer);
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('auxclick', handleClick, true);
    };
  }, []);

  return null;
}
