import type { Metadata } from 'next';
import { LinksContent } from './LinksContent';

export const metadata: Metadata = {
  title: 'Nutree | Links',
  description:
    'Download Nutree, join our community, and follow us on social media.',
  openGraph: {
    title: 'Nutree | Links',
    description:
      'Download Nutree, join our community, and follow us on social media.',
    url: 'https://nutreeai.com/links',
    siteName: 'Nutree',
    type: 'website',
    images: [{ url: '/logo-512.png', width: 512, height: 512, alt: 'Nutree' }],
  },
};

export default function LinksPage() {
  return <LinksContent />;
}
