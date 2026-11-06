export const SITE_CONFIG = {
  name: 'Nutree',
  tagline: 'Not another calorie counter. An AI Nutrition Assistant that adapts.',
  description: 'Not another calorie counter. Nutree is an AI Nutrition Assistant that adapts your daily targets, plans meals, and tracks every macro automatically.',
  url: 'https://nutreeai.com',
  // Home hero "Get started" target; the quiz lives on its own subdomain.
  // The quiz negotiates its own language. This host-only cookie is not sent there.
  quizUrl: 'https://quiz.nutreeai.com',
  // Verified 2026-11-06: GET /survey/en is 200 with html lang=en and data-funnel-locale=en
  // even when Accept-Language is vi-VN. /en on the quiz host is 404. ?lang= is not a locale switch.
  quizEnglishUrl: 'https://quiz.nutreeai.com/survey/en',
  supportEmail: 'support@nutreeai.com',
  stores: {
    appStore: 'https://apps.apple.com/vn/app/nutree-eat-with-science/id6751159552',
    // Same app id. Apple's country-less URL 301s to the storefront for the visitor.
    // Verified 2026-11-06: /app/id6751159552 → /us/app/nutree-eat-with-science/id6751159552
    // and iTunes lookup seller is NUTREE AI VIETNAM JOINT STOCK COMPANY.
    appStoreGlobal: 'https://apps.apple.com/app/id6751159552',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.nutreeai.mobile',
  },
  social: {
    facebookMessenger: 'https://m.me/1019820571221637',
    tiktok: 'https://www.tiktok.com/@nutree.ai',
  },
} as const;

/** English quiz entry is an explicit path. Vietnamese keeps the quiz root, which the quiz localizes itself. */
export function quizEntryUrl(locale: 'vi' | 'en'): string {
  return locale === 'en' ? SITE_CONFIG.quizEnglishUrl : SITE_CONFIG.quizUrl;
}

export function appStoreUrl(locale: 'vi' | 'en'): string {
  return locale === 'en' ? SITE_CONFIG.stores.appStoreGlobal : SITE_CONFIG.stores.appStore;
}

// Root-relative anchors so the links also work from sub-pages like /faq.
export const NAV_LINKS = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#features', label: 'Features' },
  { href: '/blog', label: 'Blog' },
  { href: '/mua-goi', label: 'Purchase' },
  { href: '/#download', label: 'Download' },
] as const;
