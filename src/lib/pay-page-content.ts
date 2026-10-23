import { formatVnd, PAY_AMOUNTS, type PayPlanId } from './pay-bank';
import type { Locale } from './translations';

export interface PayPlanCopy {
  id: PayPlanId;
  name: string;
  price: string;
  cta: string;
  stats: Array<{ value: string; label: string }>;
  features: string[];
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
  footnote: string;
  legalNavLabel: string;
  legalPayment: string;
  legalPricing: string;
  legalCancel: string;
  legalUsage: string;
  checkout: PayCheckoutCopy;
  plans: PayPlanCopy[];
}

const featuresEn = ['Unlimited AI meal scans', 'Adaptive daily targets', 'Meal suggestions'];
const featuresVi = ['Quét món bằng AI không giới hạn', 'Mục tiêu thích ứng mỗi ngày', 'Gợi ý bữa ăn'];

const monthlyAmount = formatVnd(PAY_AMOUNTS.monthly);
const yearlyAmount = formatVnd(PAY_AMOUNTS.yearly);
// The yearly price spread over 12 months, so it can be compared with the monthly plan.
const yearlyPerMonth = formatVnd(Math.round(PAY_AMOUNTS.yearly / 12));

export const payPageContent: Record<Locale, PayPageCopy> = {
  en: {
    title: 'Choose your Nutree plan',
    subtitle: 'Choose monthly or yearly, then pay by bank transfer with a VietQR code.',
    footnote: '* Transfer the exact amount shown at checkout.',
    legalNavLabel: 'Payment policies',
    legalPayment: 'Payment policy',
    legalPricing: 'Pricing policy',
    legalCancel: 'Cancel & refunds',
    legalUsage: 'Usage policy',
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
      afterPay: 'Need help after you transfer? Contact us at',
      planLabel: 'Plan',
    },
    plans: [
      {
        id: 'monthly',
        name: 'Monthly',
        price: `${monthlyAmount}/mo*`,
        cta: 'Choose this plan',
        stats: [
          { value: monthlyAmount, label: 'Every month' },
          { value: 'Unlimited', label: 'AI meal scans' },
        ],
        features: featuresEn,
      },
      {
        id: 'yearly',
        name: 'Yearly',
        price: `${yearlyAmount}/yr*`,
        cta: 'Choose this plan',
        highlight: true,
        stats: [
          { value: yearlyPerMonth, label: 'Per month, billed yearly' },
          { value: 'Unlimited', label: 'AI meal scans' },
        ],
        features: featuresEn,
      },
    ],
  },
  vi: {
    title: 'Chọn gói Nutree',
    subtitle: 'Chọn gói tháng hoặc gói năm, rồi thanh toán bằng chuyển khoản qua mã VietQR.',
    footnote: '* Chuyển đúng số tiền hiện ở bước checkout.',
    legalNavLabel: 'Chính sách thanh toán',
    legalPayment: 'Chính sách thanh toán',
    legalPricing: 'Chính sách giá',
    legalCancel: 'Hủy & hoàn tiền',
    legalUsage: 'Chính sách sử dụng',
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
      afterPay: 'Cần hỗ trợ sau khi chuyển khoản? Liên hệ',
      planLabel: 'Gói',
    },
    plans: [
      {
        id: 'monthly',
        name: 'Tháng',
        price: `${monthlyAmount}/tháng*`,
        cta: 'Chọn gói này',
        stats: [
          { value: monthlyAmount, label: 'Mỗi tháng' },
          { value: 'Không giới hạn', label: 'Quét món bằng AI' },
        ],
        features: featuresVi,
      },
      {
        id: 'yearly',
        name: 'Năm',
        price: `${yearlyAmount}/năm*`,
        cta: 'Chọn gói này',
        highlight: true,
        stats: [
          { value: yearlyPerMonth, label: 'Mỗi tháng, thanh toán theo năm' },
          { value: 'Không giới hạn', label: 'Quét món bằng AI' },
        ],
        features: featuresVi,
      },
    ],
  },
};
