import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { privacyContent } from '@/lib/legal-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Chính sách bảo mật | Nutree',
  description:
    'Chính sách bảo mật của Nutree - cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu.',
  path: '/privacy',
  ogDescription: 'Cách Nutree thu thập, sử dụng và bảo vệ dữ liệu của bạn.',
});

export default function PrivacyPolicy() {
  return <LegalPageClient content={privacyContent} siblingHref="/terms" siblingKey="terms" />;
}
