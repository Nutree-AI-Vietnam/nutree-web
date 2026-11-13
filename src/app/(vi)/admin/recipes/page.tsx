import type { Metadata } from 'next';
import { AdminRecipesPageClient } from './admin-recipes-page-client';

export const metadata: Metadata = {
  title: 'Quản trị thư viện công thức | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRecipesPage() {
  return <AdminRecipesPageClient />;
}
