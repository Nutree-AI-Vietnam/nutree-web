import type { Metadata } from 'next';
import { ResearchPageClient } from './research-page-client';

export const metadata: Metadata = {
  title: 'Research & Methodology | Nutree',
  description: 'How Nutree estimates nutrition targets, the product rules it applies, and the evidence that provides context for them.',
  openGraph: {
    title: 'Research & Methodology | Nutree',
    description: 'An explanation of Nutree’s estimation methods, product rules, limitations, and source material.',
    type: 'article',
  },
};

export default function ResearchPage() {
  return <ResearchPageClient />;
}
