import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { complaintsPolicyContent } from '@/lib/complaints-policy-content';
import { complaintsPageMetadata } from '@/lib/shared-locale-metadata';

export async function generateMetadata() {
  return complaintsPageMetadata();
}

export default function ComplaintsPolicyPage() {
  return (
    <LegalPageClient
      content={complaintsPolicyContent}
      siblingHref="/privacy"
      siblingKey="privacy"
    />
  );
}
