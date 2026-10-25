'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
 * Blog pages have a language in their URL (/blog is Vietnamese, /en/blog English), so the header
 * and footer follow the article instead of the stored choice. Every other page uses the stored one.
 */
export function getRouteLocale(pathname: string | null): Locale | undefined {
  if (!pathname) return undefined;
  if (pathname === '/en/blog' || pathname.startsWith('/en/blog/')) return 'en';
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return 'vi';
  return undefined;
}

/** The blog home in each language, for pages that have no translation. */
const BLOG_HOME: Record<Locale, string> = { vi: '/blog', en: '/en/blog' };

/**
 * Where the language switch leads from a blog page: the translation that the page announces with
 * <link rel="alternate" hreflang>, or the other blog's home when the article has none.
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
