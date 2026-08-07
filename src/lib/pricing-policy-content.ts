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

/**
 * Pricing policy copy: clear, scannable, user-first (what you see before you pay),
 * store-driven amounts for A/B tests. No fixed public price table.
 */
export const pricingPolicyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Pricing Policy',
    description:
      'You always see the price before you pay. Here is how Nutree subscriptions are priced and confirmed.',
    toc: 'On this page',
    backHome: 'Back to Home',
    home: 'Home',
    copyright: 'Nutree. All rights reserved.',
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
    ...dates.en,
    sections: [
      {
        title: 'The short version',
        body: [
          'Nutree is a paid, auto-renewing subscription. You choose a plan in the app, review the price on the Apple confirmation screen, then confirm.',
          'The amount you confirm on Apple is the price that applies to that purchase—not a number on this website, a screenshot, or an older offer you saw somewhere else.',
          `At publication, in-app purchases run through the Apple App Store. Provider: ${LEGAL_COMPANY.legalNameEn} (${LEGAL_COMPANY.tradeName}).`,
        ],
      },
      {
        title: 'Where the price appears',
        body: [
          'In the Nutree app: plan type (for example monthly or yearly), billing period, and any active offer are shown on the purchase screen.',
          'On Apple: the final amount, currency, and renewal terms appear again before Face ID, Touch ID, or password confirmation.',
          'That final Apple amount can differ by App Store country or region, tax display, Apple Account territory, promotion, or offer test group.',
        ],
      },
      {
        title: 'How plans work',
        body: [
          'Plans typically renew monthly or yearly until you cancel.',
          'You keep the paid features described at purchase for the period you already paid. Product updates may improve or replace features, but should not strip core paid access for a period already paid—except for safety, legal, platform, or necessary technical reasons.',
          'To stop future charges, cancel in Apple subscription settings. Deleting the app does not cancel billing. Step-by-step help: [Cancellation & Refunds](/cancellation).',
        ],
      },
      {
        title: 'Offers, codes, and price tests',
        body: [
          'We may run promos, referral codes, limited-time deals, or pricing experiments (A/B tests).',
          'Each offer has its own rules: who qualifies, how long it lasts, and how many times it can be used. Offers are not cash and usually do not stack unless we say so.',
          'If an offer appears in your app and you confirm it on Apple, that amount is valid for that transaction only. It is not a permanent public list price for every user.',
        ],
      },
      {
        title: 'If a price changes later',
        body: [
          'Prices for future renewals may change. When Apple requires it, you will be notified and may need to accept the new price before renewal.',
          'We do not re-bill the portion of a cycle you already paid at a new rate.',
          'Marketing copy or old screenshots are not a lock-in promise of a forever price.',
        ],
      },
      {
        title: 'Need help?',
        body: [
          `Email ${LEGAL_COMPANY.email} with your Apple receipt if a charge looks wrong, access did not unlock, or you need help reading a confirmation screen.`,
          'Related policies: [Payment](/payment) · [Cancellation & Refunds](/cancellation) · [Complaints](/complaints).',
          `Company details: MST ${LEGAL_COMPANY.taxId}. ${LEGAL_COMPANY.addressEn}. Website: ${LEGAL_COMPANY.websiteDisplay}.`,
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách giá',
    description:
      'Bạn luôn thấy giá trước khi thanh toán. Đây là cách Nutree hiển thị và xác nhận giá gói đăng ký.',
    toc: 'Nội dung trang',
    backHome: 'Về trang chủ',
    home: 'Trang chủ',
    copyright: 'Nutree. Bảo lưu mọi quyền.',
    links: { privacy: 'Chính sách bảo mật', terms: 'Điều khoản sử dụng' },
    ...dates.vi,
    sections: [
      {
        title: 'Tóm tắt nhanh',
        body: [
          'Nutree là gói trả phí, tự động gia hạn. Bạn chọn gói trong app, xem giá trên màn hình xác nhận của Apple, rồi xác nhận mua.',
          'Số tiền bạn xác nhận trên Apple là mức áp dụng cho giao dịch đó—không phải con số trên website, ảnh chụp màn hình, hay ưu đãi cũ bạn từng thấy ở nơi khác.',
          `Tại thời điểm ban hành, mua hàng trong app qua Apple App Store. Đơn vị cung cấp: ${LEGAL_COMPANY.legalName} (${LEGAL_COMPANY.tradeName}).`,
        ],
      },
      {
        title: 'Giá hiện ở đâu',
        body: [
          'Trong app Nutree: loại gói (ví dụ tháng hoặc năm), chu kỳ thanh toán và ưu đãi đang áp dụng (nếu có) hiện trên màn hình mua.',
          'Trên Apple: số tiền cuối, đơn vị tiền tệ và điều khoản gia hạn hiện lại trước khi xác nhận bằng Face ID, Touch ID hoặc mật khẩu.',
          'Số tiền cuối trên Apple có thể khác theo quốc gia/khu vực App Store, cách hiển thị thuế, khu vực Tài khoản Apple, khuyến mại, hoặc nhóm thử nghiệm ưu đãi.',
        ],
      },
      {
        title: 'Gói hoạt động thế nào',
        body: [
          'Gói thường gia hạn theo tháng hoặc năm cho đến khi bạn hủy.',
          'Bạn giữ các tính năng trả phí đã mô tả lúc mua trong chu kỳ đã thanh toán. Cập nhật sản phẩm có thể cải tiến hoặc thay thế tính năng, nhưng không được gỡ quyền cốt lõi của chu kỳ đã trả—trừ lý do an toàn, pháp luật, nền tảng hoặc kỹ thuật cần thiết.',
          'Để dừng các lần tính phí sau: hủy trong phần đăng ký của Apple. Xóa app không hủy thanh toán. Hướng dẫn chi tiết: [Hủy & hoàn tiền](/cancellation).',
        ],
      },
      {
        title: 'Ưu đãi, mã và thử nghiệm giá',
        body: [
          'Chúng tôi có thể chạy khuyến mại, mã giới thiệu, ưu đãi có thời hạn, hoặc thử nghiệm giá (A/B).',
          'Mỗi chương trình có quy tắc riêng: ai đủ điều kiện, kéo dài bao lâu, dùng được bao nhiêu lần. Ưu đãi không đổi ra tiền mặt và thường không cộng gộp trừ khi chúng tôi nói rõ.',
          'Nếu ưu đãi hiện trong app của bạn và bạn xác nhận trên Apple, mức đó chỉ áp dụng cho giao dịch đó—không phải bảng giá niêm yết cố định cho mọi người.',
        ],
      },
      {
        title: 'Khi giá thay đổi sau này',
        body: [
          'Giá cho các kỳ gia hạn sau có thể thay đổi. Khi Apple yêu cầu, bạn sẽ được thông báo và có thể cần chấp nhận giá mới trước khi gia hạn.',
          'Chúng tôi không thu lại phần chu kỳ bạn đã trả theo mức giá mới.',
          'Nội dung marketing hay ảnh chụp màn hình cũ không phải cam kết giữ một mức giá mãi mãi.',
        ],
      },
      {
        title: 'Cần hỗ trợ?',
        body: [
          `Gửi email ${LEGAL_COMPANY.email} kèm biên nhận Apple nếu số tiền trông bất thường, chưa mở được quyền sau khi trả, hoặc cần đọc lại màn hình xác nhận.`,
          'Chính sách liên quan: [Thanh toán](/payment) · [Hủy & hoàn tiền](/cancellation) · [Khiếu nại](/complaints).',
          `Thông tin doanh nghiệp: MST ${LEGAL_COMPANY.taxId}. ${LEGAL_COMPANY.address}. Website: ${LEGAL_COMPANY.websiteDisplay}.`,
        ],
      },
    ],
  },
};
