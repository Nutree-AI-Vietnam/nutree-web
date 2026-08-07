import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { pricingPolicyContent } from '@/lib/pricing-policy-content';

export const metadata: Metadata = {
  title: 'Chính sách giá / Pricing Policy | Nutree',
  description:
    'Chính sách giá gói Nutree tại Việt Nam / Pricing policy for Nutree plans in Vietnam.',
  openGraph: {
    title: 'Chính sách giá / Pricing Policy | Nutree',
    type: 'website',
  },
};

export default function PricingPolicyPage() {
  return (
    <LegalPageClient content={pricingPolicyContent} siblingHref="/privacy" siblingKey="privacy" />
  );
}
