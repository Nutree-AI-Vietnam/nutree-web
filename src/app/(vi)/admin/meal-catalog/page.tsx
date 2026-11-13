import type { Metadata } from 'next';
import { AdminMealCatalogPageClient } from './admin-meal-catalog-page-client';

export const metadata: Metadata = {
  title: 'Quản trị danh mục món ăn | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMealCatalogPage() {
  return <AdminMealCatalogPageClient />;
}
