'use client';

import {
  COOKIE_CONSENT_NAME,
  type CookieConsentChoice,
  consentCookie,
  consentValue,
  resolveStoredConsent,
} from './cookie-consent';
import { armTikTokPixel, withdrawTikTokPixel } from './tiktok-pixel';
import { stopOptionalAnalytics } from './optional-analytics';

interface CookieConsentSnapshot {
  choice: CookieConsentChoice | null;
  hydrated: boolean;
  bannerOpen: boolean;
}

const SERVER_SNAPSHOT: CookieConsentSnapshot = {
  choice: null,
  hydrated: false,
  bannerOpen: false,
};

let choice: CookieConsentChoice | null = null;
let hydrated = false;
let bannerOpen = false;
let snapshot: CookieConsentSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  snapshot = { choice, hydrated, bannerOpen };
  listeners.forEach((listener) => listener());
}

export function subscribeCookieConsent(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCookieConsentSnapshot() {
  return snapshot;
}

export function getCookieConsentServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function persist(next: CookieConsentChoice) {
  const secure = window.location.protocol === 'https:';
  localStorage.setItem(COOKIE_CONSENT_NAME, consentValue(next));
  document.cookie = consentCookie(next, secure);
}

export function hydrateCookieConsent() {
  if (hydrated) return;
  const stored = resolveStoredConsent(
    document.cookie,
    window.localStorage.getItem(COOKIE_CONSENT_NAME)
  );
  choice = stored;
  if (stored && !document.cookie.includes(`${COOKIE_CONSENT_NAME}=`)) persist(stored);
  bannerOpen = stored === null;
  hydrated = true;
  emit();
  if (stored === 'accepted') armTikTokPixel();
  else if (stored === 'denied') stopOptionalAnalytics();
}

export function chooseCookieConsent(next: CookieConsentChoice) {
  choice = next;
  persist(next);
  bannerOpen = false;
  emit();
  if (next === 'accepted') armTikTokPixel();
  else {
    withdrawTikTokPixel();
    stopOptionalAnalytics();
  }
}

export function openCookieConsent() {
  bannerOpen = true;
  emit();
}
