import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { usagePolicyContent } from '@/lib/usage-policy-content';

export const metadata: Metadata = {
  title: 'Usage Policy | Nutree',
  description:
    'How Nutree web payment unlocks the mobile app through an email deeplink after checkout.',
  openGraph: {
    title: 'Usage Policy | Nutree',
    type: 'website',
  },
};

export default function UsagePolicyPage() {
  return (
    <LegalPageClient content={usagePolicyContent} siblingHref="/terms" siblingKey="terms" />
  );
}
