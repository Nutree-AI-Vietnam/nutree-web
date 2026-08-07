import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { paymentPolicyContent } from '@/lib/payment-policy-content';

export const metadata: Metadata = {
  title: 'Chính sách thanh toán / Payment Policy | Nutree',
  description:
    'Chính sách thanh toán Nutree qua Apple App Store / Payment policy for Nutree App Store purchases.',
  openGraph: {
    title: 'Chính sách thanh toán / Payment Policy | Nutree',
    type: 'website',
  },
};

export default function PaymentPolicyPage() {
  return (
    <LegalPageClient content={paymentPolicyContent} siblingHref="/terms" siblingKey="terms" />
  );
}
