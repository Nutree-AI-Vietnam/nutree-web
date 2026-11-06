import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { paymentPolicyContent } from '@/lib/payment-policy-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Chính sách thanh toán | Nutree',
  description:
    'Quy trình thanh toán gói Nutree qua Apple App Store: phương thức thanh toán, kích hoạt, khôi phục, tự động gia hạn và xử lý giao dịch lỗi.',
  path: '/payment',
});

export default function PaymentPolicyPage() {
  return (
    <LegalPageClient content={paymentPolicyContent} siblingHref="/terms" siblingKey="terms" />
  );
}
