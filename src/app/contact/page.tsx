import { createPageMetadata } from '@/lib/seo';
import { ContactPageClient } from './contact-page-client';

export const metadata = createPageMetadata({
  title: 'Liên hệ | Nutree',
  description:
    'Liên hệ đội ngũ Nutree qua email, Facebook Messenger hoặc TikTok khi bạn có câu hỏi, góp ý hoặc cần hỗ trợ kỹ thuật.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactPageClient />;
}
