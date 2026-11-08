import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { pricingPolicyContent } from '@/lib/pricing-policy-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Chính sách giá | Nutree',
  description:
    'Trang chính sách này không ấn định giá. Checkout VietQR tiếng Việt hiển thị số tiền của gói năm trước khi chuyển khoản. Apple, Google Play và Paddle hiển thị số tiền trên kênh của họ.',
  path: '/pricing',
});

export default function PricingPolicyPage() {
  return (
    <LegalPageClient content={pricingPolicyContent} siblingHref="/privacy" siblingKey="privacy" />
  );
}
