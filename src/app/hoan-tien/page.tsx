import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { refundPolicyContent } from '@/lib/refund-policy-content';

export const metadata: Metadata = {
  title: 'Hoàn tiền / Refunds | Nutree',
  description:
    'Cung cấp, chấm dứt và hoàn tiền gói Nutree / Delivery, termination, and refunds for Nutree.',
  openGraph: {
    title: 'Hoàn tiền / Refunds | Nutree',
    type: 'website',
  },
};

export default function RefundPolicyPage() {
  return (
    <LegalPageClient content={refundPolicyContent} siblingHref="/terms" siblingKey="terms" />
  );
}
