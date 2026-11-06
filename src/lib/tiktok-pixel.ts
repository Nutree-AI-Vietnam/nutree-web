import { TIKTOK_PIXEL_ID } from './cookie-consent';

type TikTokCommand = unknown[];

interface TikTokStub extends Array<TikTokCommand> {
  methods?: string[];
  setAndDefer?: (target: TikTokStub, method: string) => void;
  load?: (pixelId: string) => void;
  page?: () => void;
  track?: (event: string, properties?: unknown, options?: unknown) => void;
  holdConsent?: () => void;
  grantConsent?: () => void;
  revokeConsent?: () => void;
  disableCookie?: () => void;
  _i?: Record<string, unknown[]>;
}

declare global {
  interface Window {
    TiktokAnalyticsObject?: string;
    ttq?: TikTokStub;
  }
}

const METHODS = [
  'page',
  'track',
  'identify',
  'instances',
  'debug',
  'on',
  'off',
  'once',
  'ready',
  'alias',
  'group',
  'enableCookie',
  'disableCookie',
  'holdConsent',
  'revokeConsent',
  'grantConsent',
];

let scriptInserted = false;
let sdkReady = false;
const waiters = new Set<() => void>();

function currentChoice(): 'accepted' | 'denied' | null {
  const raw = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('nutree-cookie-consent='))
    ?.slice('nutree-cookie-consent='.length);
  if (raw === '1.accepted') return 'accepted';
  if (raw === '1.denied') return 'denied';
  return null;
}

function stub(): TikTokStub {
  if (window.ttq) return window.ttq;
  const ttq = [] as TikTokStub;
  window.TiktokAnalyticsObject = 'ttq';
  window.ttq = ttq;
  ttq.methods = METHODS;
  ttq.setAndDefer = (target, method) => {
    const queue = target;
    queue[method as 'page'] = ((...args: unknown[]) => {
      queue.push([method, ...args]);
    }) as TikTokStub['page'];
  };
  for (const method of METHODS) ttq.setAndDefer?.(ttq, method);
  ttq.load = (pixelId: string) => {
    ttq._i = ttq._i || {};
    ttq._i[pixelId] = [];
    const registry = ttq as TikTokStub & { _t?: Record<string, number>; _o?: Record<string, unknown> };
    registry._t = registry._t || {};
    registry._t[pixelId] = Date.now();
    registry._o = registry._o || {};
    registry._o[pixelId] = {};
    const script = document.createElement('script');
    script.async = true;
    script.id = 'nutree-tiktok-pixel';
    script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${pixelId}&lib=ttq`;
    script.onload = () => onSdkLoaded();
    const first = document.getElementsByTagName('script')[0];
    first?.parentNode?.insertBefore(script, first);
  };
  return ttq;
}

function dropWaiters() {
  waiters.clear();
}

function grantAndNotify() {
  if (currentChoice() !== 'accepted' || !sdkReady) {
    dropWaiters();
    return;
  }
  window.ttq?.grantConsent?.();
  window.ttq?.page?.();
  const queued = [...waiters];
  dropWaiters();
  for (const notify of queued) notify();
}

function onSdkLoaded() {
  sdkReady = true;
  if (currentChoice() !== 'accepted') {
    window.ttq?.revokeConsent?.();
    window.ttq?.disableCookie?.();
    dropWaiters();
    return;
  }
  grantAndNotify();
}

/** Insert the pixel only while consent is currently accepted. Does not call page or track before load. */
export function armTikTokPixel() {
  if (currentChoice() !== 'accepted') return;
  if (sdkReady) {
    grantAndNotify();
    return;
  }
  if (scriptInserted) return;
  scriptInserted = true;
  const ttq = stub();
  ttq.holdConsent?.();
  ttq.load?.(TIKTOK_PIXEL_ID);
}

/** Stop future sends. Waiters recorded before the SDK loaded are discarded, not flushed. */
export function withdrawTikTokPixel() {
  dropWaiters();
  window.ttq?.revokeConsent?.();
  window.ttq?.disableCookie?.();
}

export function whenTikTokReady(notify: () => void) {
  if (currentChoice() !== 'accepted') return;
  if (sdkReady) {
    notify();
    return;
  }
  waiters.add(notify);
  armTikTokPixel();
}
