import type { Metadata } from 'next';
import { WhyNutreeContent } from './content';

export const metadata: Metadata = {
  title: 'Why Nutree Is the Best Solution for People Who Want to Lose Fat',
  description:
    'You don\'t lack discipline — you lack a system. Nutree removes the mental load of fat loss so you can stay in a deficit without thinking about food.',
  openGraph: {
    title: 'Why Nutree Is the Best Solution for People Who Want to Lose Fat',
    description:
      'You don\'t lack discipline — you lack a system. Nutree removes the mental load of fat loss.',
    type: 'article',
  },
};

export default function WhyPage() {
  return <WhyNutreeContent />;
}
