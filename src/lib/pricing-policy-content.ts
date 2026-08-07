import type { Locale } from './translations';
import type { LegalPageContent } from './legal-content';
import { LEGAL_COMPANY } from './legal-company';

const dates = {
  en: {
    effectiveDate: LEGAL_COMPANY.effectiveDate,
    updatedDate: LEGAL_COMPANY.effectiveDate,
    version: LEGAL_COMPANY.version,
  },
  vi: {
    effectiveDate: LEGAL_COMPANY.effectiveDate,
    updatedDate: LEGAL_COMPANY.effectiveDate,
    version: LEGAL_COMPANY.version,
  },
};

/** Plain-language pricing policy. No fixed public prices; store shows the amount. */
export const pricingPolicyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Pricing Policy',
    description:
      'A simple guide to how Nutree subscription prices work—and how you always see the amount before you pay.',
    toc: 'On this page',
    backHome: 'Back to Home',
    home: 'Home',
    copyright: 'Nutree. All rights reserved.',
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
    ...dates.en,
    sections: [
      {
        title: 'In short',
        body: [
          'Nutree is a paid subscription. You pick a plan in the app, check the price on Apple’s confirmation screen, then confirm to buy.',
          'The price you confirm with Apple is the price for that purchase. Please rely on that screen—not a number on this website or an old screenshot.',
          `Purchases are currently made through the Apple App Store. Service provider: ${LEGAL_COMPANY.legalNameEn}.`,
        ],
      },
      {
        title: 'How you see the price',
        body: [
          'In the Nutree app, you will see the plan options (such as monthly or yearly) and any special offer that applies to you.',
          'Apple then shows the amount, currency, and renewal details one more time before you confirm payment.',
          'The amount can vary by country or region, taxes shown on your receipt, and any special offer available on your account.',
        ],
      },
      {
        title: 'How subscriptions work',
        body: [
          'Most plans renew automatically each month or each year until you cancel.',
          'After you pay, you keep the paid features described at the time of purchase for that paid period. We may improve the app over time; we will not take away the main paid access you already paid for, except when we must for safety, legal, or store requirements.',
          'To stop future charges, cancel the subscription in your Apple account settings. Removing the app does not cancel your subscription. Full steps: [Cancellation & Refunds](/cancellation).',
        ],
      },
      {
        title: 'Special offers',
        body: [
          'From time to time we may share discounts, invite codes, or limited-time offers.',
          'Each offer has its own conditions—who can use it, for how long, and how many times. Offers cannot be exchanged for cash and usually cannot be combined unless we say so.',
          'If you see an offer in the app and complete payment at that amount with Apple, that price applies only to that purchase. Other people may see a different amount at a different time.',
        ],
      },
      {
        title: 'If prices change later',
        body: [
          'The price for later renewals may change. When required, Apple will let you know, and you may need to accept the new price before the next renewal.',
          'We will not charge you again for time you already paid at the old price.',
          'Ads or older images of the app are not a guarantee of a fixed price forever.',
        ],
      },
      {
        title: 'Questions?',
        body: [
          `Write to us at ${LEGAL_COMPANY.email} and include your Apple receipt if a charge looks incorrect, or if paid features did not unlock after purchase.`,
          'You may also find these pages helpful: [Payment](/payment) · [Cancellation & Refunds](/cancellation) · [Complaints](/complaints).',
          `Company: ${LEGAL_COMPANY.legalNameEn}. Registration number: ${LEGAL_COMPANY.taxId}. Address: ${LEGAL_COMPANY.addressEn}. Website: ${LEGAL_COMPANY.websiteDisplay}.`,
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách giá',
    description:
      'Hướng dẫn đơn giản về cách giá gói Nutree hoạt động—và vì sao bạn luôn thấy số tiền trước khi thanh toán.',
    toc: 'Nội dung trang',
    backHome: 'Về trang chủ',
    home: 'Trang chủ',
    copyright: 'Nutree. Bảo lưu mọi quyền.',
    links: { privacy: 'Chính sách bảo mật', terms: 'Điều khoản sử dụng' },
    ...dates.vi,
    sections: [
      {
        title: 'Tóm tắt',
        body: [
          'Nutree là gói đăng ký trả phí. Bạn chọn gói trong ứng dụng, kiểm tra giá trên màn hình xác nhận của Apple, rồi xác nhận mua.',
          'Số tiền bạn xác nhận với Apple là giá áp dụng cho lần mua đó. Hãy dựa vào màn hình đó—không phải con số trên website hay ảnh chụp màn hình cũ.',
          `Hiện tại, thanh toán được thực hiện qua App Store của Apple. Đơn vị cung cấp: ${LEGAL_COMPANY.legalName}.`,
        ],
      },
      {
        title: 'Bạn thấy giá ở đâu',
        body: [
          'Trong ứng dụng Nutree, bạn sẽ thấy các lựa chọn gói (ví dụ theo tháng hoặc theo năm) và ưu đãi đang áp dụng cho bạn (nếu có).',
          'Apple sẽ hiển thị lại số tiền, loại tiền và thông tin gia hạn trước khi bạn xác nhận thanh toán.',
          'Số tiền có thể khác nhau tùy quốc gia hoặc khu vực, thuế hiển thị trên biên nhận, và ưu đãi dành cho tài khoản của bạn.',
        ],
      },
      {
        title: 'Gói đăng ký hoạt động ra sao',
        body: [
          'Hầu hết các gói sẽ tự gia hạn mỗi tháng hoặc mỗi năm cho đến khi bạn hủy.',
          'Sau khi thanh toán, bạn được dùng các tính năng đã nêu lúc mua trong khoảng thời gian đã trả. Ứng dụng có thể được cải thiện theo thời gian; chúng tôi không gỡ quyền sử dụng chính bạn đã trả, trừ khi bắt buộc vì an toàn, pháp luật hoặc yêu cầu của cửa hàng ứng dụng.',
          'Để dừng các khoản phí sau này, hãy hủy gói trong phần đăng ký của tài khoản Apple. Gỡ ứng dụng không có nghĩa là đã hủy gói. Hướng dẫn chi tiết: [Hủy & hoàn tiền](/cancellation).',
        ],
      },
      {
        title: 'Ưu đãi đặc biệt',
        body: [
          'Thỉnh thoảng chúng tôi có thể gửi giảm giá, mã mời hoặc ưu đãi có thời hạn.',
          'Mỗi ưu đãi có điều kiện riêng—ai được dùng, dùng trong bao lâu, và dùng bao nhiêu lần. Ưu đãi không đổi thành tiền mặt và thường không gộp chung trừ khi chúng tôi nói rõ.',
          'Nếu bạn thấy một ưu đãi trong ứng dụng và hoàn tất thanh toán với Apple ở mức đó, mức giá đó chỉ áp dụng cho lần mua đó. Người khác có thể thấy mức khác vào thời điểm khác.',
        ],
      },
      {
        title: 'Nếu giá thay đổi sau này',
        body: [
          'Giá cho các lần gia hạn sau có thể thay đổi. Khi cần, Apple sẽ thông báo và bạn có thể phải chấp nhận giá mới trước kỳ gia hạn tiếp theo.',
          'Chúng tôi không thu thêm cho khoảng thời gian bạn đã thanh toán theo giá cũ.',
          'Quảng cáo hoặc hình ảnh cũ của ứng dụng không phải cam kết giữ một mức giá mãi mãi.',
        ],
      },
      {
        title: 'Cần hỗ trợ?',
        body: [
          `Gửi email cho chúng tôi tại ${LEGAL_COMPANY.email} và đính kèm biên nhận Apple nếu khoản phí trông chưa đúng, hoặc tính năng trả phí chưa mở sau khi mua.`,
          'Bạn cũng có thể xem: [Thanh toán](/payment) · [Hủy & hoàn tiền](/cancellation) · [Khiếu nại](/complaints).',
          `Công ty: ${LEGAL_COMPANY.legalName}. Mã số doanh nghiệp: ${LEGAL_COMPANY.taxId}. Địa chỉ: ${LEGAL_COMPANY.address}. Website: ${LEGAL_COMPANY.websiteDisplay}.`,
        ],
      },
    ],
  },
};
