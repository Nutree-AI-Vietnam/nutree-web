import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { privacyContent } from '@/lib/legal-content';
import { privacyPageMetadata } from '@/lib/shared-locale-metadata';

export async function generateMetadata() {
  return privacyPageMetadata();
}

export default function PrivacyPolicy() {
  return <LegalPageClient content={privacyContent} siblingHref="/terms" siblingKey="terms" />;
}
