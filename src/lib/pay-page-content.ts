import { formatVnd, PAY_AMOUNTS, type PayPlanId } from './pay-bank';
import type { Locale } from './translations';

export interface PayPlanCopy {
  id: PayPlanId;
  name: string;
  badge: string;
  amount: string;
  period: string;
  perMonth: string;
  cta: string;
  featuresTitle: string;
  features: string[];
  assurances: string[];
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
  eyebrow: string;
  title: string;
  subtitle: string;
  footnote: string;
  legalNavLabel: string;
  legalPayment: string;
  legalPricing: string;
  legalCancel: string;
  legalUsage: string;
  checkout: PayCheckoutCopy;
  plan: PayPlanCopy;
}

const yearlyAmount = formatVnd(PAY_AMOUNTS.yearly);
// The yearly price spread over 12 months, shown as a reading aid only.
const yearlyPerMonth = formatVnd(Math.round(PAY_AMOUNTS.yearly / 12));

export const payPageContent: Record<Locale, PayPageCopy> = {
  en: {
    eyebrow: 'Nutree Premium',
    title: 'One plan, a full year of Nutree',
    subtitle: 'Pay once for 12 months by bank transfer with a VietQR code.',
    footnote: 'Transfer the exact amount shown at checkout.',
    legalNavLabel: 'Payment policies',
    legalPayment: 'Payment policy',
    legalPricing: 'Pricing policy',
    legalCancel: 'Cancel & refunds',
    legalUsage: 'Usage policy',
    checkout: {
      title: 'Bank transfer',
      back: 'Back to plan',
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
    plan: {
      id: 'yearly',
      name: 'Yearly plan',
      badge: '12 months',
      amount: yearlyAmount,
      period: '/ year',
      perMonth: `About ${yearlyPerMonth} per month`,
      cta: 'Pay with VietQR',
      featuresTitle: 'Everything included',
      features: ['Unlimited AI meal scans', 'Adaptive daily targets', 'Meal suggestions'],
      assurances: ['One payment for 12 months', 'Bank transfer via VietQR'],
    },
  },
  vi: {
    eyebrow: 'Nutree Premium',
    title: 'Một gói duy nhất, trọn một năm',
    subtitle: 'Thanh toán một lần cho 12 tháng bằng chuyển khoản qua mã VietQR.',
    footnote: 'Chuyển đúng số tiền hiện ở bước thanh toán.',
    legalNavLabel: 'Chính sách thanh toán',
    legalPayment: 'Chính sách thanh toán',
    legalPricing: 'Chính sách giá',
    legalCancel: 'Hủy & hoàn tiền',
    legalUsage: 'Chính sách sử dụng',
    checkout: {
      title: 'Chuyển khoản',
      back: 'Quay lại gói',
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
    plan: {
      id: 'yearly',
      name: 'Gói năm',
      badge: '12 tháng',
      amount: yearlyAmount,
      period: '/ năm',
      perMonth: `Khoảng ${yearlyPerMonth} mỗi tháng`,
      cta: 'Thanh toán qua VietQR',
      featuresTitle: 'Bao gồm đầy đủ',
      features: ['Quét món bằng AI không giới hạn', 'Mục tiêu thích ứng mỗi ngày', 'Gợi ý bữa ăn'],
      assurances: ['Thanh toán một lần cho 12 tháng', 'Chuyển khoản qua VietQR'],
    },
  },
};
