import type { Locale } from './translations';

export const HERO_SCREENSHOTS: Record<Locale, { front: string; back: string }> = {
  en: { front: '/images/dashboard.png', back: '/images/onboarding.png' },
  vi: { front: '/images/vi/dashboard.png', back: '/images/vi/onboarding.png' },
};

export const FEATURE_SCREENSHOTS = {
  tdee: { en: '/images/goals.png', vi: '/images/vi/tdee.png' },
  aiScanning: { en: '/images/meal-scanning.png', vi: '/images/vi/meal-scanning.png' },
  mealSuggestions: { en: '/images/meal-suggestions.png', vi: '/images/vi/meal-suggestions.png' },
  dashboard: { en: '/images/dashboard.png', vi: '/images/vi/dashboard.png' },
  edit: { en: '/images/edit-meal.png', vi: '/images/vi/edit-meal.png' },
} as const;

export const CTA_SCREENSHOT = '/images/cta-mockup.png';

export const ALL_SCREENSHOT_URLS = Array.from(
  new Set([
    ...Object.values(HERO_SCREENSHOTS).flatMap(({ front, back }) => [front, back]),
    ...Object.values(FEATURE_SCREENSHOTS).flatMap(({ en, vi }) => [en, vi]),
    CTA_SCREENSHOT,
  ])
);
