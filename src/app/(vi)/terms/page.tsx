import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { termsPageMetadata } from '@/lib/shared-locale-metadata';
import { termsContent } from '@/lib/terms-content';

export async function generateMetadata() {
  return termsPageMetadata();
}

export default function TermsOfService() {
  return <LegalPageClient content={termsContent} siblingHref="/privacy" siblingKey="privacy" />;
}
