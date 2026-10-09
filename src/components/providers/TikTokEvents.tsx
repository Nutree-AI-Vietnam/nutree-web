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

const APP_CONTENT_ID = 'nutree-ios-app';

// A click on any of these store links is reported as a Download for that store's app.
const STORE_DOWNLOADS = [
  {
    urlPrefix: 'https://apps.apple.com/',
    contentId: APP_CONTENT_ID,
    contentName: 'Download Nutree on App Store',
    description: 'App Store download click',
    productName: 'Nutree iOS App',
  },
  {
    urlPrefix: 'https://play.google.com/store/apps/',
    contentId: 'nutree-android-app',
    contentName: 'Download Nutree on Google Play',
    description: 'Google Play download click',
    productName: 'Nutree Android App',
  },
] as const;

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
      const href = (event.target as Element | null)?.closest('a')?.href;
      const store = href
        ? STORE_DOWNLOADS.find(({ urlPrefix }) => href.startsWith(urlPrefix))
        : undefined;

      if (!store) return;

      sendEvent('Download', {
        content_id: store.contentId,
        content_ids: [store.contentId],
        content_type: 'product',
        content_name: store.contentName,
        description: store.description,
        quantity: 1,
        contents: [
          {
            content_id: store.contentId,
            content_type: 'product',
            content_name: store.productName,
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
