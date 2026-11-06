'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { localePreferenceCookie, LOCALE_PREFERENCE_COOKIE, readLocaleCookie } from './locale-preference';
import { getRouteLocale } from './route-locale';
import { Locale, translations } from './translations';

interface LocaleContextValue {
  locale: Locale;
  /** False until the saved cookie or localStorage choice has been applied on the client. */
  preferenceReady: boolean;
  setLocale: (l: Locale) => void;
  t: typeof translations.en;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'vi',
  preferenceReady: false,
  setLocale: () => {},
  t: translations.vi,
});

/**
 * `/`, `/en`, blog, and privacy URLs follow the path.
 * Every other page, including /privacy, uses the stored choice.
 */

/** The blog home in each language, for pages that have no translation. */
const BLOG_HOME: Record<Locale, string> = { vi: '/blog', en: '/en/blog' };

/**
 * Where the language switch leads from a URL-locked page: the hreflang alternate, or the other
 * blog home when that page has no alternate. /en/privacy publishes a vi alternate, so VI leaves
 * the English policy for /privacy.
 */
function getAlternatePath(target: Locale): string {
  const link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${target}"]`);
  return link ? new URL(link.href).pathname : BLOG_HOME[target];
}

function persistLocaleChoice(locale: Locale) {
  localStorage.setItem(LOCALE_PREFERENCE_COOKIE, locale);
  document.cookie = localePreferenceCookie(locale, window.location.protocol === 'https:');
}

/** Cookie wins, then an earlier explicit localStorage choice. Do not invent a vi cookie. */
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'vi';
  const fromCookie = readLocaleCookie(document.cookie);
  if (fromCookie) return fromCookie;
  const stored = localStorage.getItem(LOCALE_PREFERENCE_COOKIE);
  if (stored === 'en') {
    document.cookie = localePreferenceCookie('en', window.location.protocol === 'https:');
    return 'en';
  }
  if (stored === 'vi') return 'vi';
  return 'vi';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [storedLocale, setStoredLocale] = useState<Locale>('vi');
  const [preferenceReady, setPreferenceReady] = useState(false);
  const router = useRouter();
  const routeLocale = getRouteLocale(usePathname());
  const locale = routeLocale ?? storedLocale;

  // One update applies the saved choice and marks it ready, so children never see the vi default in between.
  useEffect(() => {
    setStoredLocale(getInitialLocale());
    setPreferenceReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (l: Locale) => {
      setStoredLocale(l);
      persistLocaleChoice(l);
      if (routeLocale && routeLocale !== l) router.push(getAlternatePath(l));
    },
    [routeLocale, router]
  );

  const t = translations[locale];

  return (
    <LocaleContext.Provider value={{ locale, preferenceReady, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
