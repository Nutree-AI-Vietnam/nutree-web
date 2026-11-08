import { DeleteAccountArticle } from '@/components/account/DeleteAccountArticle';
import { DELETE_ACCOUNT_LANGUAGES, DELETE_ACCOUNT_PATH, deleteAccountContent } from '@/lib/delete-account-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: `${deleteAccountContent.en.title} | Nutree`,
  description: deleteAccountContent.en.description,
  path: DELETE_ACCOUNT_PATH.en,
  ogLocale: 'en_US',
  languages: DELETE_ACCOUNT_LANGUAGES,
});

export default function EnglishDeleteAccountPage() {
  return <DeleteAccountArticle locale="en" />;
}
