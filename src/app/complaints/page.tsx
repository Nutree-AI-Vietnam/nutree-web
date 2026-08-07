import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { complaintsPolicyContent } from '@/lib/complaints-policy-content';

export const metadata: Metadata = {
  title: 'Complaints Policy | Nutree',
  description:
    'How Nutree receives and resolves feedback, support requests, and complaints.',
  openGraph: {
    title: 'Complaints Policy | Nutree',
    type: 'website',
  },
};

export default function ComplaintsPolicyPage() {
  return (
    <LegalPageClient
      content={complaintsPolicyContent}
      siblingHref="/privacy"
      siblingKey="privacy"
    />
  );
}
