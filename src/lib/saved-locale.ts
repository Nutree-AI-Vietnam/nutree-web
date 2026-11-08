import { cookies } from 'next/headers';
import { LOCALE_PREFERENCE_COOKIE, parseLocalePreference } from '@/lib/locale-preference';
import type { Locale } from '@/lib/translations';

/** Saved language for pages that follow the preference cookie. Missing or invalid stays Vietnamese. */
export async function savedLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_PREFERENCE_COOKIE)?.value;
  return parseLocalePreference(value) === 'en' ? 'en' : 'vi';
}
