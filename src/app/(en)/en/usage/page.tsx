import { LegalPageView } from '@/components/legal/LegalPageView';
import { usagePolicyContent } from '@/lib/usage-policy-content';
import { languageAlternatesFor } from '@/lib/privacy-path';
import { createPageMetadata } from '@/lib/seo';

const page = usagePolicyContent.en;

export const metadata = createPageMetadata({
  title: `${page.title} | Nutree`,
  description: page.description,
  path: '/en/usage',
  ogLocale: 'en_US',
  languages: languageAlternatesFor('/usage'),
});

export default function EnglishUsagePage() {
  return <LegalPageView page={page} locale="en" siblingHref="/terms" siblingKey="terms" />;
}
