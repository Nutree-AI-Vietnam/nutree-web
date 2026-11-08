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
 * BCT-aligned pricing policy without publishing fixed list amounts.
 * Amounts are shown by the channel before confirmation. This file does not publish a price.
 */
export const pricingPolicyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Pricing Policy',
    description:
      'How Nutree subscription prices are disclosed and confirmed. Exact amounts are shown in the app before you pay.',
    toc: 'Table of Contents',
    backHome: 'Back to Home',
    home: 'Home',
    copyright: 'Nutree. All rights reserved.',
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
    ...dates.en,
    sections: [
      {
        title: 'About this policy',
        body: [
          `Document 03/2026/CSG-NT. This Pricing Policy applies to Nutree digital subscription plans offered in Vietnam by ${LEGAL_COMPANY.legalNameEn} (trade name: ${LEGAL_COMPANY.tradeName}).`,
          `Enterprise registration number: ${LEGAL_COMPANY.taxId}. Registered address: ${LEGAL_COMPANY.addressEn}. Website: ${LEGAL_COMPANY.websiteDisplay}. Support: ${LEGAL_COMPANY.email}.`,
          'It is prepared with reference to Vietnam’s pricing, consumer-protection, and e-commerce rules.',
          'Purchases are completed through Apple in-app purchase, Google Play in-app purchase, Paddle web checkout, or a one-time VietQR bank transfer.',
        ],
      },
      {
        title: 'Where prices are provided',
        body: [
          'This policy page does not set the price. The Vietnamese VietQR checkout on this website displays the yearly amount on that screen before you transfer. Apple shows its amount on the Apple confirmation sheet. Google Play shows its amount in Google Play. Paddle shows its amount in the Paddle checkout. The amount you confirm on the screen you are using is the amount for that purchase.',
        ],
      },
      {
        title: 'Plan types',
        body: [
          'Apple, Google Play, and Paddle may offer auto-renewing plans. The plan name, period, and price appear on that channel before you confirm. This page does not list those prices.',
          'The website VietQR checkout offers one plan: a one-time yearly transfer. It does not offer a monthly VietQR plan. VietQR does not renew automatically. How to cancel a renewing plan: [Cancellation & Refunds](/cancellation).',
        ],
      },
      {
        title: 'What you get after purchase',
        body: [
          'Once payment is confirmed, your account unlocks the paid features described on the purchase screen at the time of your transaction—for example personalized nutrition planning, meal logging and analysis tools, progress tracking, and other Nutree features we publish.',
          'The exact feature list is shown before you confirm. We may improve or replace features over time without removing core paid access for a period you already paid, except when a change is needed for safety, law, platform rules, or a legitimate technical reason. We will notify you of changes that materially affect you.',
        ],
      },
      {
        title: 'Displayed price and final charge',
        body: [
          'Each channel shows the amount before you confirm. Apple shows it for an Apple in-app purchase, Google Play for a Google Play purchase, Paddle in the Paddle checkout, and VietQR as the one-time transfer amount.',
          'The amount you confirm on that channel is the amount for that purchase. This page does not publish the price. Tax or currency display follows that channel.',
        ],
      },
      {
        title: 'Promo codes, referrals, and special offers',
        body: [
          'Nutree may allow a promo code or referral code before purchase, or run a limited-time offer or pricing experiment.',
          'Each program has its own eligibility, duration, audience, usage limits, and discount. Offers cannot be exchanged for cash, do not stack unless we say so, and may be declined if expired, ineligible, already used, or abused.',
          'If an offer changes the amount you pay, that amount still appears on the channel you confirm — Apple, Google Play, Paddle, or the VietQR screen — before you pay.',
        ],
      },
      {
        title: 'Auto-renewal and price changes',
        body: [
          'Apple, Google Play, and Paddle purchases can renew until you cancel that channel. Any next charge is the one that channel shows. VietQR does not renew automatically. This page does not set a renewal price.',
          'We may adjust prices for future cycles. When the platform requires it, you will be notified and may need to accept the new price. We will not charge extra for the portion of a cycle you already paid.',
          'A price shown at one time is not a promise that it will never change. Promotional prices apply only under the terms published for that offer.',
        ],
      },
      {
        title: 'If a price looks wrong',
        body: [
          'If the Nutree screen and the confirmation amount on Apple, Google Play, Paddle, or the VietQR screen differ, check the amount on that channel before you confirm.',
          'If a completed charge looks wrong, contact [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com with the receipt from that channel. See [Payment](/payment) and [Cancellation & Refunds](/cancellation).',
        ],
      },
      {
        title: 'Contact',
        body: [
          `Questions about this Pricing Policy: ${LEGAL_COMPANY.legalNameEn}; email ${LEGAL_COMPANY.email}; website ${LEGAL_COMPANY.websiteDisplay}.`,
          'Related: [Payment Policy](/payment) · [Cancellation & Refunds](/cancellation) · [Complaints](/complaints).',
        ],
      },
      {
        title: 'Effectiveness and updates',
        body: [
          `This policy takes effect on ${LEGAL_COMPANY.effectiveDate}, version ${LEGAL_COMPANY.version}, for the Nutree product provided by ${LEGAL_COMPANY.tradeName}.`,
          'We publish this policy on our official website and/or in the app. For material changes, we will update the effective date and notify you in an appropriate way before the change applies, unless law requires immediate effect.',
          'When pricing presentation or billing terms change in a material way, we update this policy and the in-app purchase screens as needed.',
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách giá',
    description:
      'Cách Nutree công bố và xác nhận giá gói đăng ký. Mức giá cụ thể được cung cấp trong ứng dụng trước khi bạn thanh toán.',
    toc: 'Mục lục',
    backHome: 'Về trang chủ',
    home: 'Trang chủ',
    copyright: 'Nutree. Bảo lưu mọi quyền.',
    links: { privacy: 'Chính sách bảo mật', terms: 'Điều khoản sử dụng' },
    ...dates.vi,
    sections: [
      {
        title: 'Căn cứ và phạm vi áp dụng',
        body: [
          `Số: 03/2026/CSG-NT. Chính sách giá này áp dụng đối với gói dịch vụ số Nutree tại Việt Nam do ${LEGAL_COMPANY.legalName} (tên thương mại: ${LEGAL_COMPANY.tradeName}) cung cấp.`,
          `Mã số doanh nghiệp: ${LEGAL_COMPANY.taxId}. Địa chỉ trụ sở: ${LEGAL_COMPANY.address}. Website: ${LEGAL_COMPANY.websiteDisplay}. Email: ${LEGAL_COMPANY.email}.`,
          'Chính sách được xây dựng trên cơ sở Luật Giá, Luật Bảo vệ quyền lợi người tiêu dùng, Luật Thương mại điện tử và các quy định liên quan.',
          'Giao dịch được thực hiện qua mua trong ứng dụng Apple, mua trong ứng dụng Google Play, thanh toán web Paddle, hoặc chuyển khoản VietQR một lần.',
        ],
      },
      {
        title: 'Nơi cung cấp mức giá',
        body: [
          'Trang chính sách này không ấn định giá. Checkout VietQR tiếng Việt trên website hiển thị số tiền của gói năm trên màn hình đó trước khi bạn chuyển khoản. Apple hiển thị số tiền trên màn hình xác nhận của Apple. Google Play hiển thị số tiền trong Google Play. Paddle hiển thị số tiền trong bước thanh toán của Paddle. Số tiền bạn xác nhận trên màn hình đang dùng là số tiền của giao dịch đó.',
        ],
      },
      {
        title: 'Các loại gói',
        body: [
          'Apple, Google Play và Paddle có thể cung cấp gói tự động gia hạn. Tên gói, chu kỳ và mức giá xuất hiện trên kênh đó trước khi bạn xác nhận. Trang này không liệt kê các mức giá đó.',
          'Checkout VietQR trên website có một gói: chuyển khoản một lần theo năm. Checkout đó không có gói tháng. VietQR không tự động gia hạn. Hướng dẫn hủy gói có gia hạn: [Hủy & hoàn tiền](/cancellation).',
        ],
      },
      {
        title: 'Phạm vi quyền sử dụng',
        body: [
          'Sau khi giao dịch được xác nhận, tài khoản được mở quyền sử dụng các tính năng trả phí được mô tả trên màn hình mua hàng tại thời điểm giao dịch—ví dụ kế hoạch dinh dưỡng cá nhân, công cụ ghi nhận/phân tích bữa ăn, theo dõi tiến độ và các tính năng Nutree công bố.',
          'Danh mục chính xác được hiển thị trước khi bạn xác nhận mua. Việc cập nhật, cải tiến hoặc thay thế tính năng không làm mất quyền sử dụng cốt lõi của chu kỳ đã thanh toán, trừ trường hợp cần thay đổi vì an toàn, pháp luật, giới hạn của nền tảng hoặc lý do kỹ thuật chính đáng. Chúng tôi sẽ thông báo khi thay đổi có ảnh hưởng đáng kể.',
        ],
      },
      {
        title: 'Giá hiển thị và giá thanh toán cuối cùng',
        body: [
          'Mỗi kênh hiển thị số tiền trước khi bạn xác nhận. Apple hiển thị cho mua trong ứng dụng Apple, Google Play cho mua trong ứng dụng Google Play, Paddle trong bước thanh toán của Paddle, và VietQR là số tiền chuyển một lần.',
          'Số tiền bạn xác nhận trên kênh đó là số tiền của giao dịch đó. Trang này không niêm yết giá. Cách hiển thị thuế hoặc đơn vị tiền theo kênh đó.',
        ],
      },
      {
        title: 'Mã ưu đãi, mã giới thiệu và khuyến mại',
        body: [
          'Nutree có thể cho phép nhập mã ưu đãi hoặc mã giới thiệu trước khi mua, hoặc áp dụng chương trình khuyến mại / thử nghiệm giá có thời hạn.',
          'Mỗi chương trình có điều kiện, thời hạn, đối tượng, số lần sử dụng và mức giảm riêng. Ưu đãi không được quy đổi thành tiền mặt, không cộng gộp trừ khi có thông báo khác, và có thể bị từ chối khi hết hạn, sai điều kiện, gian lận hoặc đã sử dụng.',
          'Nếu ưu đãi làm thay đổi số tiền phải trả, mức đó vẫn hiện trên kênh bạn xác nhận — Apple, Google Play, Paddle hoặc màn hình VietQR — trước khi bạn trả.',
        ],
      },
      {
        title: 'Tự động gia hạn và thay đổi giá',
        body: [
          'Giao dịch Apple, Google Play và Paddle có thể gia hạn cho đến khi bạn hủy đúng kênh. Khoản tiếp theo, nếu có, là khoản kênh đó hiển thị. VietQR không tự động gia hạn. Trang này không ấn định giá gia hạn.',
          'Chúng tôi có thể điều chỉnh giá cho chu kỳ tương lai. Khi nền tảng yêu cầu, bạn sẽ được thông báo và/hoặc phải chấp thuận giá mới. Việc thay đổi không làm phát sinh thu thêm cho phần thời gian đã thanh toán trong chu kỳ hiện tại.',
          'Mức giá hiển thị tại một thời điểm không phải cam kết duy trì vô thời hạn. Giá ưu đãi chỉ áp dụng theo điều kiện công bố.',
        ],
      },
      {
        title: 'Lỗi hiển thị hoặc sai lệch giá',
        body: [
          'Nếu màn hình Nutree và số tiền xác nhận trên Apple, Google Play, Paddle hoặc màn hình VietQR khác nhau, hãy kiểm tra số tiền trên kênh đó trước khi xác nhận.',
          'Nếu giao dịch đã xong mà số tiền có vẻ sai, liên hệ [Facebook Messenger](https://m.me/1019820571221637) hoặc nutreeaidev@gmail.com kèm biên nhận của kênh đó. Xem [Chính sách thanh toán](/payment) và [Hủy & hoàn tiền](/cancellation).',
        ],
      },
      {
        title: 'Liên hệ về giá',
        body: [
          `Đơn vị giải đáp chính sách giá: ${LEGAL_COMPANY.legalName}; email: ${LEGAL_COMPANY.email}; website: ${LEGAL_COMPANY.websiteDisplay}.`,
          'Xem thêm: [Chính sách thanh toán](/payment) · [Hủy & hoàn tiền](/cancellation) · [Khiếu nại](/complaints).',
        ],
      },
      {
        title: 'Điều khoản thi hành',
        body: [
          `Chính sách này có hiệu lực từ ngày ${LEGAL_COMPANY.effectiveDate}, phiên bản ${LEGAL_COMPANY.version}, và áp dụng cho sản phẩm Nutree do ${LEGAL_COMPANY.tradeName} cung cấp.`,
          'Chúng tôi công khai chính sách tại kênh pháp lý chính thức trên website và/hoặc trong ứng dụng. Khi có thay đổi quan trọng, sẽ cập nhật ngày hiệu lực và thông báo theo phương thức phù hợp trước khi áp dụng, trừ trường hợp pháp luật yêu cầu áp dụng ngay.',
          'Khi cách trình bày giá hoặc điều khoản thanh toán thay đổi đáng kể, chúng tôi cập nhật chính sách này và màn hình mua trong ứng dụng cho phù hợp.',
        ],
      },
    ],
  },
};
