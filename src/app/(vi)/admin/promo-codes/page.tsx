import type { Metadata } from 'next';
import { AdminPromoCodesPageClient } from './admin-promo-codes-page-client';

export const metadata: Metadata = {
  title: 'Quản trị mã khuyến mãi | Nutree',
  robots: { index: false, follow: false },
};

export default function AdminPromoCodesPage() {
  return <AdminPromoCodesPageClient />;
}
