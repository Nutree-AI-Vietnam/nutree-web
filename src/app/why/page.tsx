import type { Metadata } from 'next';
import { WhyNutreeContent } from './content';

export const metadata: Metadata = {
  title: 'Why Nutree Is the Best Solution for People Who Want to Escape Skinny Fat',
  description:
    'You don\'t lack discipline — you lack a system built for body recomposition. Nutree removes the mental load so fat goes down AND muscle goes up, at the same time.',
  openGraph: {
    title: 'Why Nutree Is the Best Solution for People Who Want to Escape Skinny Fat',
    description:
      'Escape skinny fat with a system built for recomposition — not just another calorie counter.',
    type: 'article',
  },
};

export default function WhyPage() {
  return <WhyNutreeContent />;
}
