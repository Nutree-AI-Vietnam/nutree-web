import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { FaqPageClient } from './faq-page-client';

export const metadata: Metadata = {
  title: 'Câu hỏi thường gặp | Nutree',
  description: 'Giải đáp câu hỏi về Nutree — track dinh dưỡng bằng AI, gợi ý bữa ăn, gói đăng ký và hơn thế nữa.',
  openGraph: {
    title: 'Câu hỏi thường gặp | Nutree',
    description: 'Giải đáp câu hỏi về Nutree — track dinh dưỡng bằng AI, gợi ý bữa ăn, gói đăng ký và hơn thế nữa.',
    type: 'website',
    url: `${SITE_CONFIG.url}/faq`,
  },
};

export default function FaqPage() {
  return <FaqPageClient />;
}
