import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { pricingPolicyContent } from '@/lib/pricing-policy-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Chính sách giá | Nutree',
  description:
    'Cách Nutree công bố và xác nhận giá gói đăng ký. Mức giá cụ thể được cung cấp trong ứng dụng trước khi bạn thanh toán.',
  path: '/pricing',
});

export default function PricingPolicyPage() {
  return (
    <LegalPageClient content={pricingPolicyContent} siblingHref="/privacy" siblingKey="privacy" />
  );
}
