import type { Locale } from './translations';

// WebP exports (720×1561) of the PNG originals kept alongside them in /public/images.
export const HERO_SCREENSHOT: Record<Locale, string> = {
  en: '/images/dashboard.webp',
  vi: '/images/vi/dashboard.webp',
};

export const FEATURE_SCREENSHOTS = {
  tdee: { en: '/images/goals.webp', vi: '/images/vi/tdee.webp' },
  aiScanning: { en: '/images/meal-scanning.webp', vi: '/images/vi/meal-scanning.webp' },
  mealSuggestions: { en: '/images/meal-suggestions.webp', vi: '/images/vi/meal-suggestions.webp' },
  dashboard: { en: '/images/dashboard.webp', vi: '/images/vi/dashboard.webp' },
  edit: { en: '/images/edit-meal.webp', vi: '/images/vi/edit-meal.webp' },
} as const;

export const CTA_SCREENSHOT = '/images/cta-mockup.webp';
