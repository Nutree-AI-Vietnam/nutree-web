import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { usagePolicyContent } from '@/lib/usage-policy-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Chính sách sử dụng | Nutree',
  description:
    'Hướng dẫn kích hoạt và dùng Nutree sau khi thanh toán trên website: chọn gói, thanh toán, nhận deeplink qua email và mở app.',
  path: '/usage',
});

export default function UsagePolicyPage() {
  return (
    <LegalPageClient content={usagePolicyContent} siblingHref="/terms" siblingKey="terms" />
  );
}
