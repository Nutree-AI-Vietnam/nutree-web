import type { Metadata } from 'next';
import { AdminDataPacksPageClient } from './admin-data-packs-page-client';

export const metadata: Metadata = {
  title: 'Admin Data Packs | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDataPacksPage() {
  return <AdminDataPacksPageClient />;
}
