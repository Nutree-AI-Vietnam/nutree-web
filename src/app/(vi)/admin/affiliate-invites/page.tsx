import type { Metadata } from 'next';
import { AdminAffiliateInvitesPageClient } from './admin-affiliate-invites-page-client';

export const metadata: Metadata = {
  title: 'Quản trị lời mời cộng tác viên | Nutree',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAffiliateInvitesPage() {
  return <AdminAffiliateInvitesPageClient />;
}
