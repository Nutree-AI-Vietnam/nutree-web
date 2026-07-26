import type { Metadata } from 'next';
import { ResearchPageClient } from './research-page-client';

export const metadata: Metadata = {
  title: 'Science & Sources | Nutree',
  description: 'Peer-reviewed papers, public-health sources, and formulas that provide context for Nutree’s nutrition estimates.',
  openGraph: {
    title: 'Science & Sources | Nutree',
    description: 'Peer-reviewed papers, public-health sources, formulas, limitations, and source material for Nutree’s nutrition estimates.',
    type: 'article',
  },
};

export default function ResearchPage() {
  return <ResearchPageClient />;
}
