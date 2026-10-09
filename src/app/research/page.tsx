import { createPageMetadata } from '@/lib/seo';
import { ResearchPageClient } from './research-page-client';

export const metadata = createPageMetadata({
  title: 'Khoa học & nguồn | Nutree',
  description:
    'Bài báo khoa học, nguồn y tế công cộng và công thức phía sau các ước tính dinh dưỡng của Nutree, cùng những giới hạn của ứng dụng.',
  path: '/research',
  ogType: 'article',
  ogDescription: 'Nguồn, công thức và giới hạn phía sau các ước tính dinh dưỡng của Nutree.',
});

export default function ResearchPage() {
  return <ResearchPageClient />;
}
