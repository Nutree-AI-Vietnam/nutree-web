import { LegalPageView } from '@/components/legal/LegalPageView';
import { privacyContent } from '@/lib/legal-content';
import { PRIVACY_LANGUAGE_ALTERNATES, PRIVACY_PATH } from '@/lib/privacy-path';
import { createPageMetadata } from '@/lib/seo';

const page = privacyContent.en;

export const metadata = createPageMetadata({
  title: `${page.title} | Nutree`,
  description: page.description,
  path: PRIVACY_PATH.en,
  ogLocale: 'en_US',
  languages: PRIVACY_LANGUAGE_ALTERNATES,
});

export default function EnglishPrivacyPolicy() {
  return <LegalPageView page={page} locale="en" siblingHref="/terms" siblingKey="terms" />;
}
