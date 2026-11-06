import { DeleteAccountArticle } from '@/components/account/DeleteAccountArticle';
import { deleteAccountContent } from '@/lib/delete-account-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: `${deleteAccountContent.title} | Nutree`,
  description: deleteAccountContent.description,
  path: '/delete-account',
});

export default function DeleteAccountPage() {
  return <DeleteAccountArticle />;
}
