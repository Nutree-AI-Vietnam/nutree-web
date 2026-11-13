import type { Metadata } from 'next';
import { AdminSupplementCatalogPageClient } from './admin-supplement-catalog-page-client';

export const metadata: Metadata = {
  title: 'Quản trị danh mục thực phẩm chức năng | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSupplementCatalogPage() {
  return <AdminSupplementCatalogPageClient />;
}
