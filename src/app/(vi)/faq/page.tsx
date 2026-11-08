import { FaqPageClient } from './faq-page-client';
import { faqPageMetadata } from '@/lib/shared-locale-metadata';

export async function generateMetadata() {
  return faqPageMetadata();
}

export default function FaqPage() {
  return <FaqPageClient />;
}
