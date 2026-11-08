import { LegalPageView } from '@/components/legal/LegalPageView';
import { termsContent } from '@/lib/terms-content';
import { languageAlternatesFor } from '@/lib/privacy-path';
import { createPageMetadata } from '@/lib/seo';

const page = termsContent.en;

export const metadata = createPageMetadata({
  title: `${page.title} | Nutree`,
  description: page.description,
  path: '/en/terms',
  ogLocale: 'en_US',
  languages: languageAlternatesFor('/terms'),
});

export default function EnglishTermsPage() {
  return <LegalPageView page={page} locale="en" siblingHref="/privacy" siblingKey="privacy" />;
}
