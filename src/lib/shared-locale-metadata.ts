import { cancellationPolicyContent } from '@/lib/cancellation-policy-content';
import { complaintsPolicyContent } from '@/lib/complaints-policy-content';
import { privacyContent } from '@/lib/legal-content';
import { paymentPolicyContent } from '@/lib/payment-policy-content';
import { pricingPolicyContent } from '@/lib/pricing-policy-content';
import { languageAlternatesFor, PRIVACY_LANGUAGE_ALTERNATES, PRIVACY_PATH } from '@/lib/privacy-path';
import { savedLocale } from '@/lib/saved-locale';
import { createPageMetadata } from '@/lib/seo';
import { termsContent } from '@/lib/terms-content';
import { translations } from '@/lib/translations';
import { usagePolicyContent } from '@/lib/usage-policy-content';
import type { Metadata } from 'next';

const faqLanguages = languageAlternatesFor('/faq');

/** Published Vietnamese FAQ metadata. English uses the same strings as /en/faq. */
export const vietnameseFaqMetadata = createPageMetadata({
  title: 'Câu hỏi thường gặp | Nutree',
  description:
    'Giải đáp câu hỏi về Nutree: ghi bữa ăn bằng AI, gợi ý món, gói đăng ký, xóa tài khoản và cách liên hệ hỗ trợ khi cần.',
  path: '/faq',
  languages: faqLanguages,
});

export async function faqPageMetadata(): Promise<Metadata> {
  if ((await savedLocale()) !== 'en') return vietnameseFaqMetadata;
  const english = translations.en.faq;
  return createPageMetadata({
    title: `${english.pageTitle} | Nutree`,
    description: english.pageDescription,
    path: '/faq',
    ogLocale: 'en_US',
    languages: faqLanguages,
  });
}

export const vietnamesePrivacyMetadata = createPageMetadata({
  title: 'Chính sách bảo mật | Nutree',
  description:
    'Chính sách bảo mật của Nutree: dữ liệu nào được thu thập, dùng để làm gì, chia sẻ với ai, lưu bao lâu và cách yêu cầu xóa.',
  path: PRIVACY_PATH.vi,
  ogDescription: 'Cách Nutree thu thập, sử dụng và bảo vệ dữ liệu của bạn.',
  languages: PRIVACY_LANGUAGE_ALTERNATES,
});

export async function privacyPageMetadata(): Promise<Metadata> {
  if ((await savedLocale()) !== 'en') return vietnamesePrivacyMetadata;
  const page = privacyContent.en;
  return createPageMetadata({
    title: `${page.title} | Nutree`,
    description: page.description,
    path: PRIVACY_PATH.vi,
    ogLocale: 'en_US',
    languages: PRIVACY_LANGUAGE_ALTERNATES,
  });
}

type PairedPath = Parameters<typeof languageAlternatesFor>[0];

function pairedMetadata(
  path: PairedPath,
  vietnamese: Metadata,
  english: { title: string; description: string },
): () => Promise<Metadata> {
  return async () => {
    if ((await savedLocale()) !== 'en') return vietnamese;
    return createPageMetadata({
      title: `${english.title} | Nutree`,
      description: english.description,
      path,
      ogLocale: 'en_US',
      languages: languageAlternatesFor(path),
    });
  };
}

const termsLanguages = languageAlternatesFor('/terms');
const vietnameseTermsMetadata = createPageMetadata({
  title: 'Điều khoản sử dụng | Nutree',
  description:
    'Điều khoản khi dùng ứng dụng và website Nutree, gồm tài khoản, gói đăng ký và những việc người dùng không được làm.',
  path: '/terms',
  ogDescription: 'Các điều kiện khi sử dụng ứng dụng và dịch vụ Nutree.',
  languages: termsLanguages,
});

export const termsPageMetadata = pairedMetadata('/terms', vietnameseTermsMetadata, termsContent.en);

const paymentLanguages = languageAlternatesFor('/payment');
const vietnamesePaymentMetadata = createPageMetadata({
  title: 'Chính sách thanh toán | Nutree',
  description:
    'Quy trình thanh toán Nutree qua Apple, Google Play, Paddle và VietQR một lần. Trang này không cam kết khôi phục trên website.',
  path: '/payment',
  languages: paymentLanguages,
});

export const paymentPageMetadata = pairedMetadata('/payment', vietnamesePaymentMetadata, paymentPolicyContent.en);

const pricingLanguages = languageAlternatesFor('/pricing');
const vietnamesePricingMetadata = createPageMetadata({
  title: 'Chính sách giá | Nutree',
  description:
    'Trang này không ấn định giá. Số tiền hiện trên màn hình xác nhận của Apple, Google Play, Paddle hoặc trang chuyển khoản VietQR.',
  path: '/pricing',
  languages: pricingLanguages,
});

export const pricingPageMetadata = pairedMetadata('/pricing', vietnamesePricingMetadata, pricingPolicyContent.en);

const usageLanguages = languageAlternatesFor('/usage');
const vietnameseUsageMetadata = createPageMetadata({
  title: 'Chính sách sử dụng | Nutree',
  description:
    'Trang này mô tả thanh toán trên website Nutree và nói rõ website không gửi email kích hoạt hay deeplink vào app.',
  path: '/usage',
  languages: usageLanguages,
});

export const usagePageMetadata = pairedMetadata('/usage', vietnameseUsageMetadata, usagePolicyContent.en);

const cancellationLanguages = languageAlternatesFor('/cancellation');
const vietnameseCancellationMetadata = createPageMetadata({
  title: 'Chính sách hủy & hoàn tiền | Nutree',
  description:
    'Cách hủy gói Nutree, bạn còn dùng được gì sau khi hủy, và hoàn tiền được xử lý ra sao trên từng kênh thanh toán.',
  path: '/cancellation',
  languages: cancellationLanguages,
});

export const cancellationPageMetadata = pairedMetadata(
  '/cancellation',
  vietnameseCancellationMetadata,
  cancellationPolicyContent.en,
);

const complaintsLanguages = languageAlternatesFor('/complaints');
const vietnameseComplaintsMetadata = createPageMetadata({
  title: 'Tiếp nhận và giải quyết khiếu nại | Nutree',
  description:
    'Cách Nutree tiếp nhận và giải quyết phản ánh, yêu cầu hỗ trợ và khiếu nại về tài khoản, thanh toán, dữ liệu và chất lượng dịch vụ.',
  path: '/complaints',
  languages: complaintsLanguages,
});

export const complaintsPageMetadata = pairedMetadata(
  '/complaints',
  vietnameseComplaintsMetadata,
  complaintsPolicyContent.en,
);
