import type { Metadata } from 'next';
import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { privacyContent } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | Nutree',
  description: 'Chính sách bảo mật của Nutree - cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu.',
  openGraph: {
    title: 'Chính sách bảo mật | Nutree',
    description: 'Cách Nutree thu thập, sử dụng và bảo vệ dữ liệu của bạn.',
    type: 'website',
  },
};

export default function PrivacyPolicy() {
  return <LegalPageClient content={privacyContent} siblingHref="/terms" siblingKey="terms" />;
}
