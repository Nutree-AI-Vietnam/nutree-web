import type { Metadata } from 'next';
import { AdminMealCatalogPageClient } from './admin-meal-catalog-page-client';

export const metadata: Metadata = {
  title: 'Admin Meal Catalog | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMealCatalogPage() {
  return <AdminMealCatalogPageClient />;
}
