import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { usagePageMetadata } from '@/lib/shared-locale-metadata';
import { usagePolicyContent } from '@/lib/usage-policy-content';

export async function generateMetadata() {
  return usagePageMetadata();
}

export default function UsagePolicyPage() {
  return (
    <LegalPageClient content={usagePolicyContent} siblingHref="/terms" siblingKey="terms" />
  );
}
