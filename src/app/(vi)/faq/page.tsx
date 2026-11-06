import { createPageMetadata } from '@/lib/seo';
import { FaqPageClient } from './faq-page-client';

export const metadata = createPageMetadata({
  title: 'Câu hỏi thường gặp | Nutree',
  description:
    'Giải đáp câu hỏi về Nutree — track dinh dưỡng bằng AI, gợi ý bữa ăn, gói đăng ký và hơn thế nữa.',
  path: '/faq',
});

export default function FaqPage() {
  return <FaqPageClient />;
}
