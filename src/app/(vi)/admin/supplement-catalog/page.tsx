import type { Metadata } from 'next';
import { AdminSupplementCatalogPageClient } from './admin-supplement-catalog-page-client';

export const metadata: Metadata = {
  title: 'Admin Supplement catalog releases | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSupplementCatalogPage() {
  return <AdminSupplementCatalogPageClient />;
}
