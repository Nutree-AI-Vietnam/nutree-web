import { createPageMetadata } from '@/lib/seo';
import { WhyNutreeContent } from './content';

export const metadata = createPageMetadata({
  title: 'Vì sao Nutree giúp bạn thoát skinny fat',
  description:
    'Bạn không thiếu kỷ luật. Bạn cần một hệ thống cho body recomposition. Nutree giảm tải việc ăn uống để mỡ giảm và cơ tăng cùng lúc.',
  path: '/why',
  ogType: 'article',
  ogDescription:
    'Thoát skinny fat bằng hệ thống được xây cho recomp, không chỉ là một app đếm calo.',
});

export default function WhyPage() {
  return <WhyNutreeContent />;
}
