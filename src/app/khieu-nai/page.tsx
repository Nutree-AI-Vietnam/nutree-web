import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { complaintsPolicyContent } from '@/lib/complaints-policy-content';

export const metadata: Metadata = {
  title: 'Khiếu nại / Complaints | Nutree',
  description:
    'Phương thức tiếp nhận và giải quyết khiếu nại Nutree / How Nutree receives and resolves complaints.',
  openGraph: {
    title: 'Khiếu nại / Complaints | Nutree',
    type: 'website',
  },
};

export default function ComplaintsPolicyPage() {
  return (
    <LegalPageClient content={complaintsPolicyContent} siblingHref="/privacy" siblingKey="privacy" />
  );
}
