import { redirect } from 'next/navigation';

/** The review queue is now a tab of the supplement catalog. */
export default function AdminSupplementsPage() {
  redirect('/admin/supplement-catalog?tab=review');
}
