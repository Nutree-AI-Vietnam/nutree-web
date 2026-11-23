import type { Metadata } from 'next';
import { AdminMealCatalogPageClient } from './admin-meal-catalog-page-client';

export const metadata: Metadata = {
  title: 'Danh mục món đã bỏ | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMealCatalogPage() {
  return <AdminMealCatalogPageClient />;
}
