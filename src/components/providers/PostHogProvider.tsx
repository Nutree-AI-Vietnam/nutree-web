'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { readConsentCookie } from '@/lib/cookie-consent';
import {
  getCookieConsentServerSnapshot,
  getCookieConsentSnapshot,
  subscribeCookieConsent,
} from '@/lib/cookie-consent-store';
import { stopPostHog } from '@/lib/optional-analytics';

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
        if (cancelled || readConsentCookie(document.cookie) !== 'accepted') {
          if (posthog.__loaded) {
            posthog.stopSessionRecording?.();
            posthog.opt_out_capturing();
          }
          return;
        }
        if (!posthog.__loaded) {
          posthog.init(key, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
            capture_pageview: true,
            session_recording: {
              recordCrossOriginIframes: true,
            },
          });
        } else {
          posthog.opt_in_capturing();
          posthog.startSessionRecording();
        }
        if (user?.id && readConsentCookie(document.cookie) === 'accepted') {
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
