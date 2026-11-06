import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { quizEntryUrl } from '@/lib/constants';
import { parseLocalePreference } from '@/lib/locale-preference';
import { createPageMetadata } from '@/lib/seo';
import { translations } from '@/lib/translations';
import { MuaGoiPageClient } from './mua-goi-page-client';

const VIETNAMESE_PURCHASE_METADATA = createPageMetadata({
  title: 'Mua gói Nutree: chọn gói và thanh toán bằng mã QR | Nutree',
  description:
    'Mua gói năm Nutree, quét mã VietQR bằng app ngân hàng để thanh toán. Xem chính sách thanh toán, hủy và hoàn tiền trước khi mua.',
  path: '/mua-goi',
});

export async function generateMetadata(): Promise<Metadata> {
  const saved = parseLocalePreference((await cookies()).get('nutree-locale')?.value);
  if (saved !== 'en') return VIETNAMESE_PURCHASE_METADATA;
  const english = translations.en;
  return createPageMetadata({
    title: `${english.nav.purchase} | Nutree`,
    description: `${english.common.appStoreDownloadLabel}. ${english.common.googlePlayDownloadLabel}. ${english.hero.primaryCta}: ${quizEntryUrl('en')}.`,
    path: '/mua-goi',
    ogLocale: 'en_US',
  });
}

export default async function MuaGoiPage() {
  const saved = parseLocalePreference((await cookies()).get('nutree-locale')?.value);
  return <MuaGoiPageClient serverLocale={saved ?? 'vi'} />;
}
