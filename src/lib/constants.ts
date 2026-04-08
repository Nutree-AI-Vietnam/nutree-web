export const SITE_CONFIG = {
  name: 'Nutree',
  tagline: 'Not another calorie counter. An AI Nutrition Assistant that adapts.',
  description: 'Not another calorie counter. Nutree is an AI Nutrition Assistant that adapts your daily targets, plans meals, and tracks every macro automatically.',
  url: 'https://nutreeai.com',
  supportEmail: 'nutreeaidev@gmail.com',
  stores: {
    appStore: 'https://apps.apple.com/vn/app/nutree-eat-with-science/id6751159552',
  },
  trial: {
    days: 3,
    message: 'Start with 3 days free.',
  },
  social: {
    facebookMessenger: 'https://m.me/1019820571221637',
    tiktok: 'https://www.tiktok.com/@nutree.ai',
  },
} as const;

export const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#download', label: 'Download' },
] as const;

export const FEATURES = [
  {
    id: 'ai-scanning',
    title: 'Effortless Food Logging',
    description: 'Photo scan, barcode, or describe in plain text. AI decomposes every ingredient and derives fiber-aware calories from your macros automatically.',
    icon: 'camera',
  },
  {
    id: 'meal-suggestions',
    title: 'Daily Meal Guidance',
    description: 'Personalized meals with exact portions, a meal prep calendar to plan your week, and step-by-step recipe instructions.',
    icon: 'sparkles',
  },
  {
    id: 'dashboard',
    title: 'Adaptive Daily Targets',
    description: 'Your weekly nutrition budget rebalances automatically. Cheat day? Nutree adjusts tomorrow\'s target so you stay on track without guilt.',
    icon: 'chart',
  },
  {
    id: 'edit',
    title: 'Science-Based Nutrition',
    description: 'Weight-based macros (g/kg) grounded in evidence. Cut, bulk, or recomposition goals with TDEE personalized to your body and activity level.',
    icon: 'pencil',
  },
  {
    id: 'personalize',
    title: 'Built Around You',
    description: '7 languages, dark/light themes, metric/imperial, redesigned onboarding. Your AI Nutrition Assistant, your way.',
    icon: 'settings',
  },
] as const;

export const SOCIAL_LINKS: readonly import('@/types').SocialLink[] = [
  {
    id: 'website',
    label: 'Nutree Website',
    url: SITE_CONFIG.url,
    icon: 'globe',
    description: 'Learn more about Nutree',
  },
  {
    id: 'app-store',
    label: 'Download on App Store',
    url: SITE_CONFIG.stores.appStore,
    icon: 'apple',
    isAppStore: true,
  },
  {
    id: 'facebook',
    label: 'Facebook Group',
    url: 'https://www.facebook.com/groups/nutreeai',
    icon: 'facebook',
    description: 'Join our community',
  },
  {
    id: 'tiktok',
    label: 'Follow on TikTok',
    url: 'https://www.tiktok.com/@nutreeai',
    icon: 'tiktok',
  },
];

export const FEATURE_ICONS = {
  camera: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>`,

  sparkles: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>`,

  chart: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>`,

  pencil: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>`,

  settings: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>`,
} as const;

