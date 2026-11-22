import { AdminFrame } from '@/components/admin/AdminFrame';

/** The sidebar and sign-in stay put. Only the page inside them changes. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminFrame>{children}</AdminFrame>;
}
