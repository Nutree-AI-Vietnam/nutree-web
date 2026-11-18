import type { Metadata } from 'next';
import { AdminPremiumGrantPageClient } from './admin-premium-grant-page-client';

export const metadata: Metadata = {
  title: 'Cấp Premium | Nutree Admin',
  robots: { index: false, follow: false },
};

export default function AdminPremiumGrantPage() {
  return <AdminPremiumGrantPageClient />;
}
