import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { paymentPolicyContent } from '@/lib/payment-policy-content';

export const metadata: Metadata = {
  title: 'Payment Policy | Nutree',
  description: 'How Nutree in-app purchases work on the Apple App Store.',
  openGraph: {
    title: 'Payment Policy | Nutree',
    type: 'website',
  },
};

export default function PaymentPolicyPage() {
  return (
    <LegalPageClient content={paymentPolicyContent} siblingHref="/terms" siblingKey="terms" />
  );
}
