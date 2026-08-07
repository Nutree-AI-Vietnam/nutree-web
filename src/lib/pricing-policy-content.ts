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

export const pricingPolicyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Pricing Policy',
    description:
      'How Nutree subscription prices are shown, confirmed, and may change.',
    toc: 'Table of Contents',
    backHome: 'Back to Home',
    home: 'Home',
    copyright: 'Nutree. All rights reserved.',
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
    ...dates.en,
    sections: [
      {
        title: 'Scope',
        body: [
          `This policy applies to Nutree digital subscription plans offered by ${LEGAL_COMPANY.legalNameEn} (${LEGAL_COMPANY.tradeName}).`,
          `Enterprise ID: ${LEGAL_COMPANY.taxId}. Address: ${LEGAL_COMPANY.addressEn}. Contact: ${LEGAL_COMPANY.email}.`,
          'At publication, purchases are completed in the Nutree iOS app through the Apple App Store.',
        ],
      },
      {
        title: 'Where you see the price',
        body: [
          'Nutree offers auto-renewing subscription plans (for example monthly and yearly). The specific price, billing period, currency, and any offer terms are shown in the app and again on the Apple purchase confirmation sheet before you buy.',
          'The amount you see and confirm on Apple is the controlling price for that transaction. Website marketing does not need to list every current offer amount.',
          'Prices may vary by App Store territory, tax display rules, Apple Account region, active promotion, or experiment/offer assignment.',
        ],
      },
      {
        title: 'Plan structure',
        body: [
          'Standard plan types include recurring monthly and yearly access to paid features described on the purchase screen at the time of the transaction.',
          'Subscriptions auto-renew for the same period unless you cancel in Apple subscription settings before the next renewal.',
          'Feature access for a paid cycle is the paid feature set shown at purchase. Product updates may improve or replace features without removing core paid access for a cycle already paid, except for safety, legal, platform, or necessary technical reasons.',
        ],
      },
      {
        title: 'Promotions, codes, and experiments',
        body: [
          'Nutree may run promo codes, referrals, limited-time offers, or pricing experiments (A/B tests). Each program has its own eligibility, duration, and limits.',
          'Offers are not cash, are not stackable unless stated, and may be declined if expired, ineligible, already used, or abusive.',
          'An experimental or promotional amount is valid only when it is shown to you in the app and confirmed on Apple for that purchase. It is not a permanent public list price for all users.',
        ],
      },
      {
        title: 'Price changes',
        body: [
          'Future-cycle prices may change. Where the platform requires, users are notified and/or must accept the new price. The already-paid portion of a current cycle is not re-billed at the new price.',
          'Published marketing or older screenshots are not a promise of a permanent price.',
        ],
      },
      {
        title: 'Contact',
        body: [
          `Questions about pricing: ${LEGAL_COMPANY.email}. Website: ${LEGAL_COMPANY.websiteDisplay}.`,
          'If the amount charged looks wrong, keep your Apple receipt and contact us under the payment and refund policies.',
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách giá',
    description:
      'Cách Nutree hiển thị, xác nhận và điều chỉnh giá gói đăng ký.',
    toc: 'Mục lục',
    backHome: 'Về trang chủ',
    home: 'Trang chủ',
    copyright: 'Nutree. Bảo lưu mọi quyền.',
    links: { privacy: 'Chính sách bảo mật', terms: 'Điều khoản sử dụng' },
    ...dates.vi,
    sections: [
      {
        title: 'Phạm vi áp dụng',
        body: [
          `Áp dụng cho gói dịch vụ số Nutree do ${LEGAL_COMPANY.legalName} (tên thương mại: ${LEGAL_COMPANY.tradeName}) cung cấp.`,
          `Mã số doanh nghiệp: ${LEGAL_COMPANY.taxId}. Địa chỉ: ${LEGAL_COMPANY.address}. Liên hệ: ${LEGAL_COMPANY.email}.`,
          'Tại thời điểm ban hành, giao dịch được thực hiện trong ứng dụng Nutree trên iOS qua Apple App Store.',
        ],
      },
      {
        title: 'Nơi hiển thị giá',
        body: [
          'Nutree cung cấp các gói đăng ký tự động gia hạn (ví dụ gói tháng, gói năm). Mức giá, chu kỳ, đơn vị tiền tệ và điều kiện ưu đãi (nếu có) được hiển thị trong ứng dụng và trên giao diện xác nhận của Apple trước khi mua.',
          'Số tiền người dùng nhìn thấy và xác nhận trên Apple là mức có giá trị áp dụng cho giao dịch đó. Website marketing không bắt buộc niêm yết mọi mức giá đang thử nghiệm.',
          'Giá có thể khác nhau theo khu vực App Store, cách hiển thị thuế, khu vực Tài khoản Apple, chương trình ưu đãi hoặc phân nhóm thử nghiệm/cung cấp ưu đãi.',
        ],
      },
      {
        title: 'Cấu trúc gói',
        body: [
          'Các loại gói tiêu chuẩn bao gồm quyền truy cập định kỳ theo tháng hoặc năm đối với tính năng trả phí được mô tả trên màn hình mua tại thời điểm giao dịch.',
          'Gói tự động gia hạn theo chu kỳ đã chọn cho đến khi người dùng hủy trong phần quản lý đăng ký của Apple.',
          'Quyền sử dụng trong chu kỳ đã thanh toán là các tính năng trả phí đã hiển thị khi mua. Việc cập nhật sản phẩm không làm mất quyền cốt lõi của chu kỳ đã trả, trừ lý do an toàn, pháp luật, nền tảng hoặc kỹ thuật cần thiết.',
        ],
      },
      {
        title: 'Ưu đãi, mã và thử nghiệm giá',
        body: [
          'Nutree có thể áp dụng mã ưu đãi, giới thiệu, ưu đãi có thời hạn hoặc thử nghiệm giá (A/B). Mỗi chương trình có điều kiện, thời hạn và giới hạn riêng.',
          'Ưu đãi không quy đổi tiền mặt, không cộng gộp trừ khi có thông báo khác, và có thể bị từ chối nếu hết hạn, không đủ điều kiện, đã dùng hoặc gian lận.',
          'Mức giá thử nghiệm/ưu đãi chỉ có hiệu lực khi được hiển thị cho bạn trong app và xác nhận trên Apple cho giao dịch đó; không phải bảng giá niêm yết cố định cho mọi người dùng.',
        ],
      },
      {
        title: 'Thay đổi giá',
        body: [
          'Giá chu kỳ tương lai có thể thay đổi. Khi nền tảng yêu cầu, người dùng sẽ được thông báo và/hoặc phải chấp thuận giá mới. Không thu thêm cho phần thời gian đã thanh toán của chu kỳ hiện tại.',
          'Nội dung marketing hoặc ảnh chụp màn hình cũ không phải cam kết giữ giá vĩnh viễn.',
        ],
      },
      {
        title: 'Liên hệ',
        body: [
          `Giải đáp chính sách giá: ${LEGAL_COMPANY.email}. Website: ${LEGAL_COMPANY.websiteDisplay}.`,
          'Nếu số tiền bị tính bất thường, hãy giữ biên nhận Apple và liên hệ theo chính sách thanh toán/hoàn tiền.',
        ],
      },
    ],
  },
};
