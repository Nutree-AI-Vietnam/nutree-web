import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { paymentPolicyContent } from '@/lib/payment-policy-content';
import { paymentPageMetadata } from '@/lib/shared-locale-metadata';

export async function generateMetadata() {
  return paymentPageMetadata();
}

export default function PaymentPolicyPage() {
  return (
    <LegalPageClient content={paymentPolicyContent} siblingHref="/terms" siblingKey="terms" />
  );
}
