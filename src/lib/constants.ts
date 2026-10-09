export const SITE_CONFIG = {
  name: 'Nutree',
  tagline: 'Not another calorie counter. An AI Nutrition Assistant that adapts.',
  description: 'Not another calorie counter. Nutree is an AI Nutrition Assistant that adapts your daily targets, plans meals, and tracks every macro automatically.',
  url: 'https://nutreeai.com',
  supportEmail: 'nutreeaidev@gmail.com',
  stores: {
    appStore: 'https://apps.apple.com/vn/app/nutree-eat-with-science/id6751159552',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.nutreeai.mobile',
  },
  social: {
    facebookMessenger: 'https://m.me/1019820571221637',
    tiktok: 'https://www.tiktok.com/@nutree.ai',
  },
} as const;

// Root-relative anchors so the links also work from sub-pages like /faq.
export const NAV_LINKS = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#features', label: 'Features' },
  { href: '/#pricing', label: 'Plans' },
  { href: '/#download', label: 'Download' },
  { href: '/pay', label: 'Pay' },
] as const;
