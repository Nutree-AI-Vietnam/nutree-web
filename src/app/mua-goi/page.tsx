import { createPageMetadata } from '@/lib/seo';
import { MuaGoiPageClient } from './mua-goi-page-client';

export const metadata = createPageMetadata({
  title: 'Mua gói Nutree: chọn gói và thanh toán bằng mã QR | Nutree',
  description:
    'Mua gói năm Nutree, quét mã VietQR bằng app ngân hàng để thanh toán. Xem chính sách thanh toán, hủy và hoàn tiền trước khi mua.',
  path: '/mua-goi',
});

export default function MuaGoiPage() {
  return <MuaGoiPageClient />;
}
