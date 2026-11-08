import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { cancellationPolicyContent } from '@/lib/cancellation-policy-content';
import { cancellationPageMetadata } from '@/lib/shared-locale-metadata';

export async function generateMetadata() {
  return cancellationPageMetadata();
}

export default function CancellationPolicyPage() {
  return (
    <LegalPageClient
      content={cancellationPolicyContent}
      siblingHref="/terms"
      siblingKey="terms"
    />
  );
}
