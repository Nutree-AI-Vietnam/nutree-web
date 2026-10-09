'use client';

import { useEffect } from 'react';

interface User {
  id: string;
  email?: string;
  name?: string;
}

// Analytics waits until the page has painted and gone idle, so its bundle never competes with
// first paint or hydration. Without a key it never loads.
const ANALYTICS_DELAY_MS = 1500;

export function PostHogProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: User;
}) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    let cancelled = false;
    let idleHandle: number | undefined;

    const load = () => {
      import('posthog-js').then(({ default: posthog }) => {
        if (cancelled) return;
        posthog.init(key, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
          capture_pageview: true,
          session_recording: {
            recordCrossOriginIframes: true,
          },
        });

        // Identify user if logged in
        if (user?.id) {
          posthog.identify(user.id, {
            email: user.email,
            name: user.name,
          });
        }
      });
    };

    const timer = window.setTimeout(() => {
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
  }, [user]);

  return children;
}
