import type { Metadata } from 'next';
import { savedLocale } from '@/lib/saved-locale';
import { createPageMetadata } from '@/lib/seo';
import { translations } from '@/lib/translations';
import { WhyNutreeContent } from './content';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await savedLocale();
  const copy = translations[locale].whyNutree;
  return createPageMetadata({
    title: copy.heroTitle,
    description: copy.heroSubtitle,
    path: '/why',
    ogType: 'article',
    ogDescription: copy.heroSubtitle,
    ogLocale: locale === 'en' ? 'en_US' : 'vi_VN',
  });
}

export default function WhyPage() {
  return <WhyNutreeContent />;
}
