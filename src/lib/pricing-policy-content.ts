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
 * Prices are disclosed in the app and on the Apple confirmation screen.
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
          'At publication, purchases are completed in the Nutree iOS app through the Apple App Store.',
        ],
      },
      {
        title: 'Where prices are provided',
        body: [
          'Nutree does not publish fixed subscription amounts on this website. The current price for each plan is provided inside the Nutree app on the purchase screen.',
          'Before you pay, Apple shows the final amount, currency, billing period, and auto-renewal terms on the confirmation sheet for your Apple Account.',
          'The amount you see and confirm on Apple is the amount that applies to that purchase.',
        ],
      },
      {
        title: 'Plan types',
        body: [
          'Nutree offers auto-renewing subscription plans (for example monthly and yearly). The plan name, period, and price for your offer appear in the app before checkout.',
          'Plans renew automatically until you cancel in Apple subscription settings. How to cancel: [Cancellation & Refunds](/cancellation).',
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
          'For Vietnam users, prices are typically shown in Vietnamese dong (VND) in the Nutree experience, subject to App Store and Apple Account display rules.',
          'Before you buy: you can review the plan name, price, billing period, auto-renewal terms, and confirmation control in the app. Apple then shows the final amount charged to your Apple Account.',
          'Tax, fees, and account region: the amount Apple shows may reflect tax display, fees, or conversion rules for your Apple Account region. The amount you see and confirm on the final Apple step is controlling.',
        ],
      },
      {
        title: 'Promo codes, referrals, and special offers',
        body: [
          'Nutree may allow a promo code or referral code before purchase, or run a limited-time offer or pricing experiment.',
          'Each program has its own eligibility, duration, audience, usage limits, and discount. Offers cannot be exchanged for cash, do not stack unless we say so, and may be declined if expired, ineligible, already used, or abused.',
          'If an offer changes the amount you pay, that amount still appears in the app and on Apple before you confirm.',
        ],
      },
      {
        title: 'Auto-renewal and price changes',
        body: [
          'Monthly and yearly plans renew for the same period until you cancel in Apple’s subscription settings. The next cycle is charged according to the information Apple shows at renewal.',
          'We may adjust prices for future cycles. When the platform requires it, you will be notified and may need to accept the new price. We will not charge extra for the portion of a cycle you already paid.',
          'A price shown at one time is not a promise that it will never change. Promotional prices apply only under the terms published for that offer.',
        ],
      },
      {
        title: 'If a price looks wrong',
        body: [
          'If the Nutree screen and the Apple confirmation amount differ, always check the final Apple amount before confirming.',
          `If a completed charge looks incorrect, email ${LEGAL_COMPANY.email} with your Apple receipt and a screenshot. We will review entitlement status and help under our [Payment](/payment) and [Cancellation & Refunds](/cancellation) policies.`,
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
          'Tại thời điểm ban hành, giao dịch được thực hiện trong ứng dụng Nutree trên iOS qua Apple App Store.',
        ],
      },
      {
        title: 'Nơi cung cấp mức giá',
        body: [
          'Nutree không niêm yết mức giá gói cố định trên website này. Mức giá hiện hành của từng gói được cung cấp trong ứng dụng Nutree, trên màn hình mua hàng.',
          'Trước khi thanh toán, Apple hiển thị số tiền cuối cùng, đơn vị tiền tệ, chu kỳ và điều khoản tự động gia hạn trên giao diện xác nhận của Tài khoản Apple.',
          'Số tiền bạn nhìn thấy và xác nhận trên Apple là mức áp dụng cho giao dịch đó.',
        ],
      },
      {
        title: 'Các loại gói',
        body: [
          'Nutree cung cấp các gói đăng ký tự động gia hạn (ví dụ gói tháng và gói năm). Tên gói, chu kỳ và mức giá của ưu đãi dành cho bạn được hiển thị trong app trước khi thanh toán.',
          'Gói tự động gia hạn theo chu kỳ đã chọn cho đến khi bạn hủy trong phần quản lý đăng ký của Apple. Hướng dẫn hủy: [Hủy & hoàn tiền](/cancellation).',
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
          'Đối với người dùng tại Việt Nam, giá thường được hiển thị bằng đồng Việt Nam trong trải nghiệm Nutree, theo quy tắc hiển thị của App Store và Tài khoản Apple.',
          'Xác nhận trước giao dịch: Trước khi mua, bạn được xem tên gói, giá, chu kỳ, cơ chế tự động gia hạn và nút xác nhận trong app. Giao diện xác nhận của Apple hiển thị số tiền cuối cùng được tính cho Tài khoản Apple.',
          'Thuế, phí và khu vực tài khoản: Khoản tiền thực tế có thể chịu cách hiển thị thuế, phí hoặc quy đổi theo quy định của Apple và khu vực Tài khoản Apple. Mức có giá trị áp dụng là mức bạn nhìn thấy và xác nhận tại bước thanh toán cuối cùng.',
        ],
      },
      {
        title: 'Mã ưu đãi, mã giới thiệu và khuyến mại',
        body: [
          'Nutree có thể cho phép nhập mã ưu đãi hoặc mã giới thiệu trước khi mua, hoặc áp dụng chương trình khuyến mại / thử nghiệm giá có thời hạn.',
          'Mỗi chương trình có điều kiện, thời hạn, đối tượng, số lần sử dụng và mức giảm riêng. Ưu đãi không được quy đổi thành tiền mặt, không cộng gộp trừ khi có thông báo khác, và có thể bị từ chối khi hết hạn, sai điều kiện, gian lận hoặc đã sử dụng.',
          'Nếu ưu đãi làm thay đổi số tiền phải trả, mức đó vẫn được hiển thị trong app và trên Apple trước khi bạn xác nhận.',
        ],
      },
      {
        title: 'Tự động gia hạn và thay đổi giá',
        body: [
          'Gói tháng và gói năm tiếp tục gia hạn theo chu kỳ đã chọn cho đến khi bạn hủy trong phần quản lý đăng ký của Apple. Phí chu kỳ tiếp theo được tính theo thông tin Apple hiển thị tại thời điểm gia hạn.',
          'Chúng tôi có thể điều chỉnh giá cho chu kỳ tương lai. Khi nền tảng yêu cầu, bạn sẽ được thông báo và/hoặc phải chấp thuận giá mới. Việc thay đổi không làm phát sinh thu thêm cho phần thời gian đã thanh toán trong chu kỳ hiện tại.',
          'Mức giá hiển thị tại một thời điểm không phải cam kết duy trì vô thời hạn. Giá ưu đãi chỉ áp dụng theo điều kiện công bố.',
        ],
      },
      {
        title: 'Lỗi hiển thị hoặc sai lệch giá',
        body: [
          'Nếu xảy ra lỗi kỹ thuật dẫn đến chênh lệch giữa giao diện Nutree và giao diện xác nhận của Apple, bạn cần kiểm tra số tiền cuối cùng trước khi xác nhận.',
          `Nếu giao dịch đã hoàn tất với số tiền bất thường, hãy gửi biên nhận và ảnh chụp tới ${LEGAL_COMPANY.email} để chúng tôi đối soát và hỗ trợ theo [Chính sách thanh toán](/payment) và [Hủy & hoàn tiền](/cancellation).`,
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
