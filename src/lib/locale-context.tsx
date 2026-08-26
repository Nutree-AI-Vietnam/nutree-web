'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
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

/** Get locale: localStorage (user choice) > Vietnamese default */
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'vi';
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored === 'vi' || stored === 'en') return stored;
  localStorage.setItem(LOCALE_KEY, 'vi');
  return 'vi';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('vi');

  // Hydrate locale after mount (localStorage > Vietnamese default)
  useEffect(() => {
    const initial = getInitialLocale();
    if (initial !== 'vi') {
      setLocaleState(initial);
      document.documentElement.lang = initial;
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.documentElement.lang = l;
    localStorage.setItem(LOCALE_KEY, l);
  }, []);

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
