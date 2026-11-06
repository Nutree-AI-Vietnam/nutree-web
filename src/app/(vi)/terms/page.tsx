import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { termsContent } from '@/lib/terms-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Điều khoản sử dụng | Nutree',
  description: 'Điều khoản sử dụng Nutree - các điều kiện khi sử dụng ứng dụng và dịch vụ.',
  path: '/terms',
  ogDescription: 'Các điều kiện khi sử dụng ứng dụng và dịch vụ Nutree.',
});

export default function TermsOfService() {
  return <LegalPageClient content={termsContent} siblingHref="/privacy" siblingKey="privacy" />;
}
