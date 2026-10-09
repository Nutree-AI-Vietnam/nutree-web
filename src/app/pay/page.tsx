import { createPageMetadata } from '@/lib/seo';
import { PayPageClient } from './pay-page-client';

export const metadata = createPageMetadata({
  title: 'Chọn gói và thanh toán | Nutree',
  description:
    'Chọn gói Nutree theo tháng hoặc theo năm rồi tiếp tục thanh toán. Số tiền được xác nhận ở bước checkout.',
  path: '/pay',
  ogDescription: 'Chọn gói Nutree và tiếp tục thanh toán.',
});

export default function PayPage() {
  return <PayPageClient />;
}
