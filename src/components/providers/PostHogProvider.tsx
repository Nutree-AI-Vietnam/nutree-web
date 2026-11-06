'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { readConsentCookie } from '@/lib/cookie-consent';
import {
  getCookieConsentServerSnapshot,
  getCookieConsentSnapshot,
  subscribeCookieConsent,
} from '@/lib/cookie-consent-store';
import { stopPostHog } from '@/lib/optional-analytics';
import { optionalAnalyticsCalls } from '@/lib/optional-analytics-gate';

interface User {
  id: string;
  email?: string;
  name?: string;
}

const ANALYTICS_DELAY_MS = 1500;

export function PostHogProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: User;
}) {
  const { choice } = useSyncExternalStore(
    subscribeCookieConsent,
    getCookieConsentSnapshot,
    getCookieConsentServerSnapshot
  );

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    if (choice !== 'accepted') {
      if (choice === 'denied') void stopPostHog();
      return;
    }

    let cancelled = false;
    let idleHandle: number | undefined;

    const load = () => {
      void import('posthog-js').then(({ default: posthog }) => {
        const calls = optionalAnalyticsCalls(
          readConsentCookie(document.cookie),
          { posthogLoaded: Boolean(posthog.__loaded), googleLoaded: false },
          user?.id ? { id: user.id } : undefined
        );
        if (cancelled || !calls.some((call) => call.method === 'init' || call.method === 'optIn')) {
          if (calls.some((call) => call.method === 'stopSessionRecording')) posthog.stopSessionRecording?.();
          if (calls.some((call) => call.method === 'optOut')) posthog.opt_out_capturing();
          return;
        }
        if (calls.some((call) => call.method === 'init')) {
          posthog.init(key, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
            capture_pageview: true,
            session_recording: {
              recordCrossOriginIframes: true,
            },
          });
        }
        if (calls.some((call) => call.method === 'optIn')) posthog.opt_in_capturing();
        if (calls.some((call) => call.method === 'startSessionRecording')) posthog.startSessionRecording();
        if (calls.some((call) => call.method === 'identify') && user?.id) {
          posthog.identify(user.id, {
            email: user.email,
            name: user.name,
          });
        }
      });
    };

    const timer = window.setTimeout(() => {
      if (cancelled || readConsentCookie(document.cookie) !== 'accepted') return;
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(load, { timeout: 3000 });
      } else {
        load();
      }
    }, ANALYTICS_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
    };
  }, [choice, user]);

  return children;
}
