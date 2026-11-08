import type { Metadata } from 'next';
import { savedLocale } from '@/lib/saved-locale';
import { createPageMetadata } from '@/lib/seo';
import { translations } from '@/lib/translations';
import { WhyNutreeContent } from './content';

const WHY_DESCRIPTION = {
  vi: 'Vì sao người bận rộn dễ mắc skinny fat, và Nutree giảm quyết định mỗi ngày bằng mục tiêu tự chỉnh cùng gợi ý bữa.',
  en: 'Why busy people get stuck skinny fat, and how Nutree cuts daily food decisions with targets that adapt to what you eat.',
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await savedLocale();
  const copy = translations[locale].whyNutree;
  return createPageMetadata({
    title: copy.heroTitle,
    description: WHY_DESCRIPTION[locale],
    path: '/why',
    ogType: 'article',
    ogDescription: WHY_DESCRIPTION[locale],
    ogLocale: locale === 'en' ? 'en_US' : 'vi_VN',
  });
}

export default function WhyPage() {
  return <WhyNutreeContent />;
}
