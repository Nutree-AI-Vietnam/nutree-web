import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { PayPageClient } from './pay-page-client';

export const metadata: Metadata = {
  title: 'Pay | Nutree',
  description: 'Choose a Nutree plan and continue to payment. Amounts are confirmed at checkout.',
  openGraph: {
    title: 'Pay | Nutree',
    description: 'Choose a Nutree plan and continue to payment.',
    type: 'website',
    url: `${SITE_CONFIG.url}/pay`,
  },
};

export default function PayPage() {
  return <PayPageClient />;
}
