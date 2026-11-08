import { DeleteAccountArticle } from '@/components/account/DeleteAccountArticle';
import { DELETE_ACCOUNT_LANGUAGES, DELETE_ACCOUNT_PATH, deleteAccountContent } from '@/lib/delete-account-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: `${deleteAccountContent.vi.title} | Nutree`,
  description: deleteAccountContent.vi.description,
  path: DELETE_ACCOUNT_PATH.vi,
  languages: DELETE_ACCOUNT_LANGUAGES,
});

export default function DeleteAccountPage() {
  return <DeleteAccountArticle locale="vi" />;
}
