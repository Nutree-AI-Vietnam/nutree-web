import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { complaintsPolicyContent } from '@/lib/complaints-policy-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Tiếp nhận và giải quyết khiếu nại | Nutree',
  description:
    'Cách Nutree tiếp nhận và giải quyết phản ánh, yêu cầu hỗ trợ và khiếu nại về tài khoản, thanh toán, dữ liệu và chất lượng dịch vụ.',
  path: '/complaints',
});

export default function ComplaintsPolicyPage() {
  return (
    <LegalPageClient
      content={complaintsPolicyContent}
      siblingHref="/privacy"
      siblingKey="privacy"
    />
  );
}
