import { LegalPageClient } from '@/components/legal/LegalPageClient';
import { cancellationPolicyContent } from '@/lib/cancellation-policy-content';
import { languageAlternatesFor } from '@/lib/privacy-path';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Chính sách hủy & hoàn tiền | Nutree',
  description:
    'Cách hủy gói đăng ký Nutree, điều gì xảy ra sau khi hủy và hoàn tiền được xử lý như thế nào.',
  path: '/cancellation',
  languages: languageAlternatesFor('/cancellation'),
});

export default function CancellationPolicyPage() {
  return (
    <LegalPageClient
      content={cancellationPolicyContent}
      siblingHref="/terms"
      siblingKey="terms"
    />
  );
}
