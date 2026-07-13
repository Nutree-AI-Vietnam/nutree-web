import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { termsContent } from '@/lib/terms-content';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng | Nutree',
  description: 'Điều khoản sử dụng Nutree - các điều kiện khi sử dụng ứng dụng và dịch vụ.',
  openGraph: {
    title: 'Điều khoản sử dụng | Nutree',
    description: 'Các điều kiện khi sử dụng ứng dụng và dịch vụ Nutree.',
    type: 'website',
  },
};

export default function TermsOfService() {
  return <LegalPageClient content={termsContent} siblingHref="/privacy" siblingKey="privacy" />;
}
