import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { pricingPolicyContent } from '@/lib/pricing-policy-content';
import { pricingPageMetadata } from '@/lib/shared-locale-metadata';

export async function generateMetadata() {
  return pricingPageMetadata();
}

export default function PricingPolicyPage() {
  return (
    <LegalPageClient content={pricingPolicyContent} siblingHref="/privacy" siblingKey="privacy" />
  );
}
