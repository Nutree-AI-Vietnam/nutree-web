import type { Metadata } from 'next';
import { AdminRecipesPageClient } from './admin-recipes-page-client';

export const metadata: Metadata = {
  title: 'Admin Recipe library | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRecipesPage() {
  return <AdminRecipesPageClient />;
}
