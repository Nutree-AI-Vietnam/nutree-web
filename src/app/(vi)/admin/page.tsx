import type { Metadata } from 'next';
import { AdminHomePageClient } from './admin-home-page-client';

export const metadata: Metadata = {
  title: 'Nutree Admin',
  robots: { index: false, follow: false },
};

export default function AdminHomePage() {
  return <AdminHomePageClient />;
}
