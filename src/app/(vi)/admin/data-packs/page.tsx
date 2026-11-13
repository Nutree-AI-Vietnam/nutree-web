import { redirect } from 'next/navigation';

/** Old address of the content release page; content is now split by kind. */
export default function AdminDataPacksPage() {
  redirect('/admin/recipes');
}
