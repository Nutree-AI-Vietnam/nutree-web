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

/** MoMo one-time pass copy. Shown on the Vietnamese checkout only while MoMo is enabled. */
export interface MomoPayCopy {
  methodLabel: string;
  wallet: string;
  walletHint: string;
  atm: string;
  atmHint: string;
  vietqr: string;
  vietqrHint: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailHint: string;
  oneTime: string;
  pay: (amount: string) => string;
  payAtm: (amount: string) => string;
  summary: (amount: string, weeks: number) => string;
  opening: string;
  pricesUpdated: (amount: string) => string;
  checkoutError: string;
  invalidEmail: string;
  choose: string;
  intro: string;
  confirmingHeadline: string;
  confirmingBody: string;
  paidHeadline: string;
  paidBody: string;
  failedHeadline: string;
  failedBody: string;
  expiredHeadline: string;
  expiredBody: string;
  sessionHeadline: string;
  sessionBody: string;
  unconfirmedHeadline: string;
  unconfirmedBody: string;
  support: string;
  notPaid: string;
  slow: string;
  orderLabel: string;
  tryAgain: string;
  retry: string;
  openAppStore: string;
  openGooglePlay: string;
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
  momo: MomoPayCopy;
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
    momo: {
      methodLabel: 'Payment method',
      wallet: 'MoMo wallet',
      walletHint: 'Open the MoMo app or scan a QR',
      atm: 'Domestic ATM card',
      atmHint: 'A Vietnamese bank card, on MoMo',
      vietqr: 'VietQR transfer',
      vietqrHint: 'Scan the code in your banking app',
      emailLabel: 'Email you use to sign in to Nutree',
      emailPlaceholder: 'you@email.com',
      emailHint: 'After MoMo confirms the payment, open Nutree and sign in with this email to activate the pass.',
      oneTime: 'One-time payment',
      pay: (amount) => `Pay ${amount} with MoMo`,
      payAtm: (amount) => `Pay ${amount} with an ATM card`,
      summary: (amount, weeks) =>
        `You pay ${amount} once for ${weeks} weeks of Nutree Premium. It does not renew and there is no further charge.`,
      opening: 'Opening MoMo…',
      pricesUpdated: (amount) => `MoMo charges ${amount} for this plan. Press pay to continue with that amount.`,
      checkoutError: 'MoMo is temporarily unavailable. Please try again later.',
      invalidEmail: 'Enter the email you will use to sign in to Nutree.',
      choose: 'Pay',
      intro: 'Pay once for the yearly plan with MoMo wallet, a domestic ATM card, or a VietQR transfer.',
      confirmingHeadline: 'Confirming your payment',
      confirmingBody: 'We are waiting for MoMo to confirm the transaction.',
      paidHeadline: 'Payment confirmed',
      paidBody: 'MoMo confirmed the payment. Open Nutree and sign in with the email you used at checkout to activate the pass.',
      failedHeadline: 'Payment was not completed',
      failedBody: 'The MoMo transaction was cancelled or did not succeed. This attempt was not charged.',
      expiredHeadline: 'The payment session expired',
      expiredBody: 'The MoMo session expired before it finished. This attempt was not charged.',
      sessionHeadline: 'No payment session in this browser',
      sessionBody: 'This browser no longer has a payment session. Open checkout again in the same browser.',
      unconfirmedHeadline: 'Payment is not confirmed',
      unconfirmedBody:
        'This page could not read the result from MoMo. The payment may be unfinished, and this attempt may not have been charged. If you did pay, open Nutree and sign in with the email you used at checkout.',
      support: 'Pass not active yet? Send the order id to',
      notPaid: 'Not paid yet? Choose a plan',
      slow: 'MoMo is still processing the transaction. Check again in a few minutes.',
      orderLabel: 'Order id',
      tryAgain: 'Choose a plan again',
      retry: 'Check again',
      openAppStore: 'Download on the App Store',
      openGooglePlay: 'Get it on Google Play',
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
    momo: {
      methodLabel: 'Phương thức thanh toán',
      wallet: 'Ví MoMo',
      walletHint: 'Mở app MoMo hoặc quét QR',
      atm: 'Thẻ ATM Nội Địa',
      atmHint: 'Thẻ ngân hàng Việt Nam, qua MoMo',
      vietqr: 'Chuyển khoản VietQR',
      vietqrHint: 'Quét mã bằng app ngân hàng',
      emailLabel: 'Email đăng nhập Nutree',
      emailPlaceholder: 'ban@email.com',
      emailHint: 'Sau khi MoMo xác nhận, mở Nutree và đăng nhập bằng email này để kích hoạt gói.',
      oneTime: 'Thanh toán một lần',
      pay: (amount) => `Thanh toán ${amount} bằng MoMo`,
      payAtm: (amount) => `Thanh toán ${amount} bằng thẻ ATM`,
      summary: (amount, weeks) =>
        `Bạn thanh toán ${amount} một lần cho ${weeks} tuần Nutree Premium. Gói không tự động gia hạn và không trừ tiền thêm.`,
      opening: 'Đang mở MoMo…',
      pricesUpdated: (amount) => `MoMo tính ${amount} cho gói này. Bấm thanh toán để tiếp tục với số tiền đó.`,
      checkoutError: 'MoMo tạm thời không khả dụng. Vui lòng thử lại sau.',
      invalidEmail: 'Nhập email bạn sẽ dùng để đăng nhập Nutree.',
      choose: 'Thanh toán',
      intro: 'Thanh toán một lần cho gói năm bằng Ví MoMo, thẻ ATM nội địa hoặc chuyển khoản VietQR.',
      confirmingHeadline: 'Đang xác nhận thanh toán',
      confirmingBody: 'Chúng tôi đang chờ MoMo xác nhận giao dịch.',
      paidHeadline: 'Thanh toán thành công',
      paidBody: 'MoMo đã xác nhận thanh toán. Mở Nutree và đăng nhập bằng email đã dùng lúc thanh toán để kích hoạt gói.',
      failedHeadline: 'Thanh toán chưa hoàn tất',
      failedBody: 'Giao dịch MoMo đã bị hủy hoặc chưa thành công. Lần thử này chưa bị trừ tiền.',
      expiredHeadline: 'Phiên thanh toán đã hết hạn',
      expiredBody: 'Phiên thanh toán MoMo đã hết hạn trước khi hoàn tất. Lần thử này chưa bị trừ tiền.',
      sessionHeadline: 'Không tìm thấy phiên thanh toán',
      sessionBody: 'Trình duyệt này không còn phiên thanh toán. Hãy mở lại trang thanh toán trên cùng trình duyệt.',
      unconfirmedHeadline: 'Chưa xác nhận được thanh toán',
      unconfirmedBody:
        'Trang này chưa đọc được kết quả từ MoMo. Giao dịch có thể chưa hoàn tất và lần này có thể chưa bị trừ tiền. Nếu bạn đã thanh toán, mở Nutree và đăng nhập bằng email đã dùng lúc thanh toán.',
      support: 'Gói chưa được kích hoạt? Gửi mã đơn hàng tới',
      notPaid: 'Chưa thanh toán? Chọn gói',
      slow: 'MoMo vẫn đang xử lý giao dịch. Kiểm tra lại sau ít phút.',
      orderLabel: 'Mã đơn hàng',
      tryAgain: 'Chọn lại gói',
      retry: 'Kiểm tra lại',
      openAppStore: 'Tải trên App Store',
      openGooglePlay: 'Tải trên Google Play',
    },
  },
};
