import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { paymentPolicyContent } from '@/lib/payment-policy-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Chính sách thanh toán | Nutree',
  description:
    'Quy trình thanh toán Nutree qua Apple, Google Play, Paddle và VietQR một lần. Trang này không cam kết khôi phục trên website.',
  path: '/payment',
});

export default function PaymentPolicyPage() {
  return (
    <LegalPageClient content={paymentPolicyContent} siblingHref="/terms" siblingKey="terms" />
  );
}
