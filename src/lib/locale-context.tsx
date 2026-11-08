'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { localePreferenceCookie, LOCALE_PREFERENCE_COOKIE, readLocaleCookie } from './locale-preference';
import { getRouteLocale, languageSwitchHref } from './route-locale';
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

/**
 * Prefer the page's hreflang twin (a translated blog post). Otherwise use the known URL pair.
 * A full load is required: a client transition can replay a cached redirect from the old cookie
 * and leave the visitor on the language they just left.
 */
function resolveLanguageSwitch(target: Locale): string {
  const current = window.location.pathname;
  const link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${target}"]`);
  if (link) {
    try {
      const path = new URL(link.href, window.location.origin).pathname;
      if (path && path !== current) return path;
    } catch {
      // A bad alternate falls through to the path map.
    }
  }
  return languageSwitchHref(current, target);
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

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [storedLocale, setStoredLocale] = useState<Locale>(initialLocale ?? 'vi');
  const [preferenceReady, setPreferenceReady] = useState(initialLocale != null);
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

  // Keep cookie and localStorage together after a real English entry.
  // A Vietnamese choice writes vi first; this does not run again until the route changes.
  useEffect(() => {
    const cookie = readLocaleCookie(document.cookie);
    if (cookie === 'vi') return;
    if (routeLocale !== 'en' && cookie !== 'en') return;
    const stored = localStorage.getItem(LOCALE_PREFERENCE_COOKIE);
    if (cookie === 'en' && stored === 'en') return;
    persistLocaleChoice('en');
    setStoredLocale('en');
  }, [routeLocale]);

  const setLocale = useCallback(
    (l: Locale) => {
      persistLocaleChoice(l);
      const next = resolveLanguageSwitch(l);
      const current = window.location.pathname;
      if (next === current) {
        setStoredLocale(l);
        if (!routeLocale) window.location.reload();
        return;
      }
      window.location.assign(`${next}${window.location.search}${window.location.hash}`);
    },
    [routeLocale]
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
