import { LegalPageView } from '@/components/legal/LegalPageView';
import { complaintsPolicyContent } from '@/lib/complaints-policy-content';
import { languageAlternatesFor } from '@/lib/privacy-path';
import { createPageMetadata } from '@/lib/seo';

const page = complaintsPolicyContent.en;

export const metadata = createPageMetadata({
  title: `${page.title} | Nutree`,
  description: page.description,
  path: '/en/complaints',
  ogLocale: 'en_US',
  languages: languageAlternatesFor('/complaints'),
});

export default function EnglishComplaintsPage() {
  return <LegalPageView page={page} locale="en" siblingHref="/privacy" siblingKey="privacy" />;
}
