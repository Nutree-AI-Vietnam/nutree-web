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

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'vi';
  const stored = localStorage.getItem(LOCALE_KEY);
  return stored === 'en' ? 'en' : 'vi';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('vi');

  // Hydrate from localStorage after mount
  useEffect(() => {
    const stored = getStoredLocale();
    if (stored !== 'vi') {
      setLocaleState(stored);
      document.documentElement.lang = stored;
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
