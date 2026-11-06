import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { privacyContent } from '@/lib/legal-content';
import { PRIVACY_LANGUAGE_ALTERNATES, PRIVACY_PATH } from '@/lib/privacy-path';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Chính sách bảo mật | Nutree',
  description:
    'Chính sách bảo mật của Nutree - cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu.',
  path: PRIVACY_PATH.vi,
  ogDescription: 'Cách Nutree thu thập, sử dụng và bảo vệ dữ liệu của bạn.',
  languages: PRIVACY_LANGUAGE_ALTERNATES,
});

export default function PrivacyPolicy() {
  return <LegalPageClient content={privacyContent} siblingHref="/terms" siblingKey="terms" />;
}
