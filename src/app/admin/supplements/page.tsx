import type { Metadata } from 'next';
import { AdminSupplementsPageClient } from './admin-supplements-page-client';

export const metadata: Metadata = {
  title: 'Admin Supplements | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSupplementsPage() {
  return <AdminSupplementsPageClient />;
}
