import { LegalPageView } from '@/components/legal/LegalPageView';
import { cancellationPolicyContent } from '@/lib/cancellation-policy-content';
import { languageAlternatesFor } from '@/lib/privacy-path';
import { createPageMetadata } from '@/lib/seo';

const page = cancellationPolicyContent.en;

export const metadata = createPageMetadata({
  title: `${page.title} | Nutree`,
  description: page.description,
  path: '/en/cancellation',
  ogLocale: 'en_US',
  languages: languageAlternatesFor('/cancellation'),
});

export default function EnglishCancellationPage() {
  return <LegalPageView page={page} locale="en" siblingHref="/terms" siblingKey="terms" />;
}
