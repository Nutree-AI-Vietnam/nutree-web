'use client';

import { useEffect } from 'react';
import { ALL_SCREENSHOT_URLS } from '@/lib/screenshot-assets';

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function ScreenshotPreloader() {
  useEffect(() => {
    const preloadScreenshots = () => {
      for (const src of ALL_SCREENSHOT_URLS) {
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
      }
    };

    const idleWindow = window as WindowWithIdleCallback;

    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(preloadScreenshots, { timeout: 1500 });
      return () => idleWindow.cancelIdleCallback?.(handle);
    }

    const timeout = window.setTimeout(preloadScreenshots, 500);
    return () => window.clearTimeout(timeout);
  }, []);

  return null;
}
