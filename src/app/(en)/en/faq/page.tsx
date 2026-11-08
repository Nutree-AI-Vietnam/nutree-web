import { FaqPageClient } from '@/app/(vi)/faq/faq-page-client';
import { languageAlternatesFor } from '@/lib/privacy-path';
import { createPageMetadata } from '@/lib/seo';
import { translations } from '@/lib/translations';

const faq = translations.en.faq;

export const metadata = createPageMetadata({
  title: `${faq.pageTitle} | Nutree`,
  description: faq.pageDescription,
  path: '/en/faq',
  ogLocale: 'en_US',
  languages: languageAlternatesFor('/faq'),
});

export default function EnglishFaqPage() {
  return <FaqPageClient locale="en" />;
}
