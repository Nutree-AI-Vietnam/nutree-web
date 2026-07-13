import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { ContactPageClient } from './contact-page-client';

export const metadata: Metadata = {
  title: 'Contact Us | Nutree',
  description: 'Contact the Nutree team by email, Facebook Messenger, or TikTok.',
  openGraph: {
    title: 'Contact Us | Nutree',
    description: 'Contact the Nutree team by email, Facebook Messenger, or TikTok.',
    type: 'website',
    url: `${SITE_CONFIG.url}/contact`,
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
