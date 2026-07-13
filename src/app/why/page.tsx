import type { Metadata } from 'next';
import { WhyNutreeContent } from './content';

export const metadata: Metadata = {
  title: 'Vì sao Nutree giúp bạn thoát skinny fat',
  description:
    'Bạn không thiếu kỷ luật. Bạn cần một hệ thống cho body recomposition. Nutree giảm tải việc ăn uống để mỡ giảm và cơ tăng cùng lúc.',
  openGraph: {
    title: 'Vì sao Nutree giúp bạn thoát skinny fat',
    description:
      'Thoát skinny fat bằng hệ thống được xây cho recomp, không chỉ là một app đếm calo.',
    type: 'article',
  },
};

export default function WhyPage() {
  return <WhyNutreeContent />;
}
