import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { cancellationPolicyContent } from '@/lib/cancellation-policy-content';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | Nutree',
  description:
    'How to cancel your Nutree subscription, what happens after cancel, and how refunds work.',
  openGraph: {
    title: 'Cancellation & Refund Policy | Nutree',
    type: 'website',
  },
};

export default function CancellationPolicyPage() {
  return (
    <LegalPageClient
      content={cancellationPolicyContent}
      siblingHref="/terms"
      siblingKey="terms"
    />
  );
}
