import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { usagePolicyContent } from '@/lib/usage-policy-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Chính sách sử dụng | Nutree',
  description:
    'Trang này mô tả thanh toán trên website Nutree. Trang không nói website gửi email kích hoạt hoặc deeplink.',
  path: '/usage',
});

export default function UsagePolicyPage() {
  return (
    <LegalPageClient content={usagePolicyContent} siblingHref="/terms" siblingKey="terms" />
  );
}
