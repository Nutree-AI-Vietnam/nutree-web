/** Optional TikTok measurement only. A missing or outdated value stays denied. */
export const COOKIE_CONSENT_NAME = 'nutree-cookie-consent';
export const COOKIE_CONSENT_VERSION = '1';
export const TIKTOK_PIXEL_ID = 'D9DG1BJC77UD5IE51T1G';

export type CookieConsentChoice = 'accepted' | 'denied';

const YEAR_SECONDS = 60 * 60 * 24 * 365;

export function consentValue(choice: CookieConsentChoice): string {
  return `${COOKIE_CONSENT_VERSION}.${choice}`;
}

/** Only the current version counts. An older accept must not unlock the pixel. */
export function parseCookieConsent(raw: string | null | undefined): CookieConsentChoice | null {
  if (raw === consentValue('accepted')) return 'accepted';
  if (raw === consentValue('denied')) return 'denied';
  return null;
}

/** First current nutree-cookie-consent value wins. Invalid and old values are ignored. */
export function readConsentCookie(cookieHeader: string | null | undefined): CookieConsentChoice | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === COOKIE_CONSENT_NAME) return parseCookieConsent(rest.join('='));
  }
  return null;
}

/**
 * Cookie wins when it is a current choice. Storage is used only when the cookie is absent,
 * so a denied cookie cannot be overridden by an older saved accept.
 */
export function resolveStoredConsent(
  cookieHeader: string | null | undefined,
  storageValue: string | null | undefined
): CookieConsentChoice | null {
  if (!cookieHeader) return parseCookieConsent(storageValue);
  const present = cookieHeader.split(';').some((part) => part.trim().startsWith(`${COOKIE_CONSENT_NAME}=`));
  if (!present) return parseCookieConsent(storageValue);
  return readConsentCookie(cookieHeader);
}

export function consentCookie(choice: CookieConsentChoice, secure = false): string {
  const securePart = secure ? '; Secure' : '';
  return `${COOKIE_CONSENT_NAME}=${consentValue(choice)}; Path=/; Max-Age=${YEAR_SECONDS}; SameSite=Lax${securePart}`;
}

export function tiktokEventsAllowed(cookieHeader: string | null | undefined): boolean {
  return readConsentCookie(cookieHeader) === 'accepted';
}

/**
 * Send only after the current choice is accept and the SDK has finished loading.
 * Anything else is dropped. It is not stored for a later flush.
 */
export function tikTokDispatch(
  choice: CookieConsentChoice | null,
  sdkReady: boolean
): 'send' | 'drop' {
  return choice === 'accepted' && sdkReady ? 'send' : 'drop';
}
