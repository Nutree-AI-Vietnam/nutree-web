import type { Locale } from './translations';

export interface PayPlanCopy {
  id: 'monthly' | 'yearly';
  name: string;
  price: string;
  cta: string;
  stats: Array<{ value: string; label: string }>;
  features: string[];
  badge?: string;
  highlight?: boolean;
}

export interface PayCheckoutCopy {
  title: string;
  back: string;
  amountLabel: string;
  scanHint: string;
  bankLabel: string;
  accountNameLabel: string;
  accountNumberLabel: string;
  contentLabel: string;
  contentValue: string;
  copy: string;
  copied: string;
  afterPay: string;
  planLabel: string;
}

export interface PayPageCopy {
  title: string;
  subtitle: string;
  languageLabel: string;
  footnote: string;
  legalPayment: string;
  legalPricing: string;
  legalCancel: string;
  checkout: PayCheckoutCopy;
  plans: PayPlanCopy[];
}

const sharedFeaturesEn = [
  'Unlimited AI meal scans',
  'Adaptive daily targets',
  'Meal suggestions',
];

const sharedFeaturesVi = [
  'Quét món bằng AI không giới hạn',
  'Mục tiêu thích ứng mỗi ngày',
  'Gợi ý bữa ăn',
];

export const payPageContent: Record<Locale, PayPageCopy> = {
  en: {
    title: 'Choose your Nutree plan',
    subtitle: 'Payment only. Monthly or yearly — confirm the amount at checkout.',
    languageLabel: 'Toggle language',
    footnote:
      '* Transfer the exact amount shown at checkout. Access is confirmed after we match your bank transfer.',
    legalPayment: 'Payment policy',
    checkout: {
      title: 'Bank transfer',
      back: 'Change plan',
      amountLabel: 'Amount due',
      scanHint: 'Scan the VietQR with your banking app, or copy the account details.',
      bankLabel: 'Bank',
      accountNameLabel: 'Account name',
      accountNumberLabel: 'Account number',
      contentLabel: 'Transfer content',
      contentValue: 'Enter your email here…',
      copy: 'Copy',
      copied: 'Copied',
      afterPay: 'After you transfer, email the receipt so we can activate your plan.',
      planLabel: 'Plan',
    },
    legalPricing: 'Pricing policy',
    legalCancel: 'Cancel & refunds',
    plans: [
      {
        id: 'monthly',
        name: 'Monthly',
        price: '99.000đ/mo*',
        cta: 'Continue to pay',
        stats: [
          { value: '99.000đ', label: 'Every month' },
          { value: 'Weekly', label: 'Budget rebalance' },
          { value: 'Unlimited', label: 'AI meal scans' },
        ],
        features: sharedFeaturesEn,
      },
      {
        id: 'yearly',
        name: 'Yearly',
        price: '399.000đ/yr*',
        cta: 'Continue to pay',
        badge: 'Most popular',
        highlight: true,
        stats: [
          { value: '~33.000đ', label: 'Per month equivalent' },
          { value: 'Weekly', label: 'Budget rebalance' },
          { value: 'Unlimited', label: 'AI meal scans' },
        ],
        features: [...sharedFeaturesEn, 'Best value'],
      },
    ],
  },
  vi: {
    title: 'Chọn gói Nutree',
    subtitle: 'Chỉ thanh toán. Gói tháng hoặc gói năm — xác nhận số tiền lúc checkout.',
    languageLabel: 'Đổi ngôn ngữ',
    footnote:
      '* Chuyển đúng số tiền hiện ở bước checkout. Gói được kích hoạt sau khi chúng tôi đối soát chuyển khoản.',
    legalPayment: 'Chính sách thanh toán',
    checkout: {
      title: 'Chuyển khoản',
      back: 'Đổi gói',
      amountLabel: 'Số tiền cần chuyển',
      scanHint: 'Quét VietQR bằng app ngân hàng, hoặc sao chép thông tin tài khoản.',
      bankLabel: 'Ngân hàng',
      accountNameLabel: 'Tên tài khoản',
      accountNumberLabel: 'Số tài khoản',
      contentLabel: 'Nội dung chuyển khoản',
      contentValue: 'Điền vào đây email của bạn…',
      copy: 'Sao chép',
      copied: 'Đã sao chép',
      afterPay: 'Sau khi chuyển khoản, gửi biên lai để chúng tôi kích hoạt gói.',
      planLabel: 'Gói',
    },
    legalPricing: 'Chính sách giá',
    legalCancel: 'Hủy & hoàn tiền',
    plans: [
      {
        id: 'monthly',
        name: 'Tháng',
        price: '99.000đ/tháng*',
        cta: 'Tiếp tục thanh toán',
        stats: [
          { value: '99.000đ', label: 'Mỗi tháng' },
          { value: 'Hàng tuần', label: 'Cân bằng ngân sách' },
          { value: 'Không giới hạn', label: 'Quét món bằng AI' },
        ],
        features: sharedFeaturesVi,
      },
      {
        id: 'yearly',
        name: 'Năm',
        price: '399.000đ/năm*',
        cta: 'Tiếp tục thanh toán',
        badge: 'Phổ biến nhất',
        highlight: true,
        stats: [
          { value: '~33.000đ', label: 'Quy đổi mỗi tháng' },
          { value: 'Hàng tuần', label: 'Cân bằng ngân sách' },
          { value: 'Không giới hạn', label: 'Quét món bằng AI' },
        ],
        features: [...sharedFeaturesVi, 'Tiết kiệm nhất'],
      },
    ],
  },
};
