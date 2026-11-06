'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getRouteLocale } from './route-locale';
import { Locale, translations } from './translations';

const LOCALE_KEY = 'nutree-locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: typeof translations.en;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'vi',
  setLocale: () => {},
  t: translations.vi,
});

/**
 * Pages with a language in the URL (/blog, /en/blog, /en/privacy) follow that URL.
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

/** Get locale: localStorage (user choice) > Vietnamese default */
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'vi';
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored === 'vi' || stored === 'en') return stored;
  localStorage.setItem(LOCALE_KEY, 'vi');
  return 'vi';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [storedLocale, setStoredLocale] = useState<Locale>('vi');
  const router = useRouter();
  const routeLocale = getRouteLocale(usePathname());
  const locale = routeLocale ?? storedLocale;

  // Hydrate locale after mount (localStorage > Vietnamese default)
  useEffect(() => {
    const initial = getInitialLocale();
    if (initial !== 'vi') setStoredLocale(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (l: Locale) => {
      setStoredLocale(l);
      localStorage.setItem(LOCALE_KEY, l);
      if (routeLocale && routeLocale !== l) router.push(getAlternatePath(l));
    },
    [routeLocale, router]
  );

  const t = translations[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
