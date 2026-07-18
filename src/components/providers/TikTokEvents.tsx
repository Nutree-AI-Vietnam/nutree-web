'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    ttq?: {
      track: (event: string, properties?: Record<string, string | number>, options?: { event_id: string }) => void;
    };
  }
}

const APP_STORE_URL_PREFIX = 'https://apps.apple.com/';

function readCookie(name: string) {
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function sendEvent(
  event: 'ViewContent' | 'ClickButton',
  properties: Record<string, string | number>,
) {
  const eventId = crypto.randomUUID();

  window.ttq?.track(event, properties, { event_id: eventId });

  void fetch('/api/tiktok-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      event,
      eventId,
      url: window.location.href,
      referrer: document.referrer || undefined,
      ttclid: new URLSearchParams(window.location.search).get('ttclid') || undefined,
      ttp: readCookie('_ttp'),
      properties,
    }),
  });
}

export function TikTokEvents() {
  useEffect(() => {
    sendEvent('ViewContent', {
      content_id: window.location.pathname || '/',
      content_type: 'product',
      content_name: document.title,
    });

    const handleClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('a');

      if (!link?.href.startsWith(APP_STORE_URL_PREFIX)) return;

      sendEvent('ClickButton', {
        content_id: 'app-store-download',
        content_type: 'product',
        content_name: 'Download Nutree on App Store',
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
