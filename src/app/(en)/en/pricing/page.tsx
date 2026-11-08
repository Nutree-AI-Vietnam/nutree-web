import { LegalPageView } from '@/components/legal/LegalPageView';
import { pricingPolicyContent } from '@/lib/pricing-policy-content';
import { languageAlternatesFor } from '@/lib/privacy-path';
import { createPageMetadata } from '@/lib/seo';

const page = pricingPolicyContent.en;

export const metadata = createPageMetadata({
  title: `${page.title} | Nutree`,
  description: page.description,
  path: '/en/pricing',
  ogLocale: 'en_US',
  languages: languageAlternatesFor('/pricing'),
});

export default function EnglishPricingPage() {
  return <LegalPageView page={page} locale="en" siblingHref="/privacy" siblingKey="privacy" />;
}
