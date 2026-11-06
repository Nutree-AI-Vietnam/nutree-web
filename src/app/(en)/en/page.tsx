import { HomePage } from '@/components/home/HomePage';
import { HOME_LANGUAGE_ALTERNATES } from '@/lib/home-language';
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION_EN, SITE_TITLE_EN, createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: SITE_TITLE_EN,
  description: SITE_DESCRIPTION_EN,
  path: '/en',
  ogLocale: 'en_US',
  languages: HOME_LANGUAGE_ALTERNATES,
  image: {
    ...DEFAULT_OG_IMAGE,
    alt: 'Nutree, AI nutrition assistant on iOS and Android',
  },
});

export default function EnglishHome() {
  return <HomePage language="en" />;
}
