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
  locale: 'en',
  setLocale: () => {},
  t: translations.en,
});

/** Detect locale from browser language (Vietnamese browser → 'vi') */
function detectLocale(): Locale {
  return navigator.language.startsWith('vi') ? 'vi' : 'en';
}

/** Get locale: localStorage (user choice) > browser detection > 'en' fallback */
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored === 'vi' || stored === 'en') return stored;
  // First visit: detect from browser language, persist so detection runs once
  const detected = detectLocale();
  localStorage.setItem(LOCALE_KEY, detected);
  return detected;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Hydrate locale after mount (localStorage > browser detection > 'en')
  useEffect(() => {
    const initial = getInitialLocale();
    if (initial !== 'en') {
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
