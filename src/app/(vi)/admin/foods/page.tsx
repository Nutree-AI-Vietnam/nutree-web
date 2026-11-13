import type { Metadata } from 'next';
import { AdminFoodsPageClient } from './admin-foods-page-client';

export const metadata: Metadata = {
  title: 'Admin Food database | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminFoodsPage() {
  return <AdminFoodsPageClient />;
}
