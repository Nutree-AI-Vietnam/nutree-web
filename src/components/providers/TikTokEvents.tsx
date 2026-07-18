'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    ttq?: {
      track: (
        event: string,
        properties?: TikTokEventProperties,
        options?: { event_id: string },
      ) => void;
    };
  }
}

const APP_STORE_URL_PREFIX = 'https://apps.apple.com/';
const APP_CONTENT_ID = 'nutree-ios-app';

type TikTokEventProperties = Record<
  string,
  string | number | string[] | Array<Record<string, string | number>>
>;

function readCookie(name: string) {
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function sendEvent(
  event: 'ViewContent' | 'Download',
  properties: TikTokEventProperties,
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
      content_id: APP_CONTENT_ID,
      content_ids: [APP_CONTENT_ID],
      content_type: 'product',
      content_name: 'Nutree iOS App',
      description: document.title,
      quantity: 1,
      contents: [
        {
          content_id: APP_CONTENT_ID,
          content_type: 'product',
          content_name: 'Nutree iOS App',
          quantity: 1,
        },
      ],
    });

    const handleClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('a');

      if (!link?.href.startsWith(APP_STORE_URL_PREFIX)) return;

      sendEvent('Download', {
        content_id: APP_CONTENT_ID,
        content_ids: [APP_CONTENT_ID],
        content_type: 'product',
        content_name: 'Download Nutree on App Store',
        description: 'App Store download click',
        quantity: 1,
        contents: [
          {
            content_id: APP_CONTENT_ID,
            content_type: 'product',
            content_name: 'Nutree iOS App',
            quantity: 1,
          },
        ],
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
