import type { Metadata } from 'next';
import { savedLocale } from '@/lib/saved-locale';
import { createPageMetadata } from '@/lib/seo';
import { researchContent } from './research-content';
import { ResearchPageClient } from './research-page-client';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await savedLocale();
  const copy = researchContent[locale];
  return createPageMetadata({
    title: `${copy.title} | Nutree`,
    description: copy.summary,
    path: '/research',
    ogType: 'article',
    ogDescription: copy.summary,
    ogLocale: locale === 'en' ? 'en_US' : 'vi_VN',
  });
}

export default function ResearchPage() {
  return <ResearchPageClient />;
}
