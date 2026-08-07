import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { pricingPolicyContent } from '@/lib/pricing-policy-content';

export const metadata: Metadata = {
  title: 'Pricing Policy | Nutree',
  description:
    'How Nutree subscription prices are shown and confirmed in the App Store.',
  openGraph: {
    title: 'Pricing Policy | Nutree',
    type: 'website',
  },
};

export default function PricingPolicyPage() {
  return (
    <LegalPageClient content={pricingPolicyContent} siblingHref="/privacy" siblingKey="privacy" />
  );
}
