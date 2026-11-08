import type { Metadata } from 'next';
import { savedLocale } from '@/lib/saved-locale';
import { createPageMetadata } from '@/lib/seo';
import { translations } from '@/lib/translations';
import { ContactPageClient } from './contact-page-client';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await savedLocale();
  const copy = translations[locale].contact;
  return createPageMetadata({
    title: `${copy.title} | Nutree`,
    description: copy.description,
    path: '/contact',
    ogLocale: locale === 'en' ? 'en_US' : 'vi_VN',
  });
}

export default function ContactPage() {
  return <ContactPageClient />;
}
