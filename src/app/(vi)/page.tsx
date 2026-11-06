import { HomePage } from '@/components/home/HomePage';
import { HOME_LANGUAGE_ALTERNATES } from '@/lib/home-language';
import { SITE_DESCRIPTION, SITE_TITLE, createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: '/',
  languages: HOME_LANGUAGE_ALTERNATES,
});

export default function Home() {
  return <HomePage language="vi" />;
}
