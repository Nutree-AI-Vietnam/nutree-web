import { LegalPageView } from '@/components/legal/LegalPageView';
import { paymentPolicyContent } from '@/lib/payment-policy-content';
import { languageAlternatesFor } from '@/lib/privacy-path';
import { createPageMetadata } from '@/lib/seo';

const page = paymentPolicyContent.en;

export const metadata = createPageMetadata({
  title: `${page.title} | Nutree`,
  description: page.description,
  path: '/en/payment',
  ogLocale: 'en_US',
  languages: languageAlternatesFor('/payment'),
});

export default function EnglishPaymentPage() {
  return <LegalPageView page={page} locale="en" siblingHref="/terms" siblingKey="terms" />;
}
