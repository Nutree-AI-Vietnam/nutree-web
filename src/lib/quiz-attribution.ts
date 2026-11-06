import { SITE_CONFIG } from './constants';

/**
 * Keeps the quiz path, including /survey/en, and adds campaign tags that are not already present.
 * This is the same handoff the click listener uses. It does not change language and does not read
 * the main-site locale cookie, which the quiz host never receives.
 */
export function applyQuizAttribution(href: string, attribution: Record<string, string | undefined>): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (url.host !== new URL(SITE_CONFIG.quizUrl).host) return href;
  for (const [name, value] of Object.entries(attribution)) {
    if (value && !url.searchParams.has(name)) url.searchParams.set(name, value);
  }
  return url.toString();
}
