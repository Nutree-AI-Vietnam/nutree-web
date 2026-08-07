import type { Locale } from './translations';
import type { LegalPageContent } from './legal-content';
import { LEGAL_COMPANY } from './legal-company';

/** Standard Vietnam list prices from BCT pricing policy (03/2026/CSG-NT). */
const PRICING = {
  monthlyVnd: '99.000',
  yearlyVnd: '399.000',
  yearlyMonthlyRefVnd: '33.250',
  docNumber: '03/2026/CSG-NT',
} as const;

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
 * BCT-aligned pricing policy (Chính sách giá) — professional, plain language.
 * Structure follows BCT document sections I–VII.
 */
export const pricingPolicyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Pricing Policy',
    description:
      'Official prices and billing terms for Nutree subscription plans in Vietnam.',
    toc: 'Table of Contents',
    backHome: 'Back to Home',
    home: 'Home',
    copyright: 'Nutree. All rights reserved.',
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
    tableHeaders: ['Plan', 'List price', 'Billing'],
    ...dates.en,
    sections: [
      {
        title: 'About this policy',
        body: [
          `Document ${PRICING.docNumber}. This Pricing Policy applies to Nutree digital subscription plans offered in Vietnam by ${LEGAL_COMPANY.legalNameEn} (trade name: ${LEGAL_COMPANY.tradeName}).`,
          `Enterprise registration number: ${LEGAL_COMPANY.taxId}. Registered address: ${LEGAL_COMPANY.addressEn}. Website: ${LEGAL_COMPANY.websiteDisplay}. Support: ${LEGAL_COMPANY.email}.`,
          'It is prepared with reference to Vietnam’s pricing, consumer-protection, and e-commerce rules. Prices below reflect the standard Nutree plans published for the Vietnam market as of the effective date.',
          'At publication, purchases are completed in the Nutree iOS app through the Apple App Store.',
        ],
      },
      {
        title: 'Current standard prices',
        body: [
          'These are our standard list prices for Vietnam. You will always review the final amount on the Apple confirmation screen before you pay.',
          `For the yearly plan, “about ${PRICING.yearlyMonthlyRefVnd} VND/month” is only a convenience breakdown. The amount charged for a full year is ${PRICING.yearlyVnd} VND per billing cycle.`,
          'Both plans renew automatically until you cancel. How to cancel: [Cancellation & Refunds](/cancellation).',
        ],
        table: [
          [
            'Monthly plan',
            `${PRICING.monthlyVnd} VND`,
            '1 month · auto-renews until cancelled',
          ],
          [
            'Yearly plan',
            `${PRICING.yearlyVnd} VND`,
            `1 year (about ${PRICING.yearlyMonthlyRefVnd} VND/month reference) · auto-renews until cancelled`,
          ],
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
          'Currency: Standard prices for Vietnam users are listed in Vietnamese dong (VND) in the Nutree experience for Vietnam.',
          'Before you buy: you can review the plan name, price, billing period, auto-renewal terms, and confirmation control in the app. Apple then shows the final amount charged to your Apple Account.',
          'Tax, fees, and account region: the amount Apple shows may reflect tax display, fees, or conversion rules for your Apple Account region. The amount you see and confirm on the final Apple step is the amount that applies to that purchase.',
        ],
      },
      {
        title: 'Promo codes, referrals, and special offers',
        body: [
          'Nutree may allow a promo code or referral code before purchase, or run a limited-time offer.',
          'Each program has its own eligibility, duration, audience, usage limits, and discount. Offers cannot be exchanged for cash, do not stack unless we say so, and may be declined if expired, ineligible, already used, or abused.',
          'If an offer changes the amount you pay, that amount still appears in the app and on Apple before you confirm. An offer price is not a permanent change to the standard list prices above unless we update this policy.',
        ],
      },
      {
        title: 'Auto-renewal and price changes',
        body: [
          'Monthly and yearly plans renew for the same period until you cancel in Apple’s subscription settings. The next cycle is charged according to the information Apple shows at renewal.',
          'We may adjust prices for future cycles. When the platform requires it, you will be notified and may need to accept the new price. We will not charge extra for the portion of a cycle you already paid.',
          'Current standard prices are not a promise that they will never change. Promotional prices apply only under the terms published for that offer.',
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
          'When standard list prices change, we update this policy together with the app and payment systems as needed.',
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách giá',
    description:
      'Bảng giá và điều khoản thanh toán chính thức cho gói dịch vụ Nutree tại Việt Nam.',
    toc: 'Mục lục',
    backHome: 'Về trang chủ',
    home: 'Trang chủ',
    copyright: 'Nutree. Bảo lưu mọi quyền.',
    links: { privacy: 'Chính sách bảo mật', terms: 'Điều khoản sử dụng' },
    tableHeaders: ['Gói dịch vụ', 'Mức giá', 'Chu kỳ & gia hạn'],
    ...dates.vi,
    sections: [
      {
        title: 'Căn cứ và phạm vi áp dụng',
        body: [
          `Số: ${PRICING.docNumber}. Chính sách giá này áp dụng đối với gói dịch vụ số Nutree tại Việt Nam do ${LEGAL_COMPANY.legalName} (tên thương mại: ${LEGAL_COMPANY.tradeName}) cung cấp.`,
          `Mã số doanh nghiệp: ${LEGAL_COMPANY.taxId}. Địa chỉ trụ sở: ${LEGAL_COMPANY.address}. Website: ${LEGAL_COMPANY.websiteDisplay}. Email: ${LEGAL_COMPANY.email}.`,
          'Chính sách được xây dựng trên cơ sở Luật Giá, Luật Bảo vệ quyền lợi người tiêu dùng, Luật Thương mại điện tử và các quy định liên quan.',
          'Mức giá dưới đây được lập theo giao diện và gói dịch vụ Nutree tại thời điểm ban hành, áp dụng cho thị trường Việt Nam. Tại thời điểm ban hành, giao dịch được thực hiện trong ứng dụng Nutree trên iOS qua Apple App Store.',
        ],
      },
      {
        title: 'Bảng giá dịch vụ hiện hành',
        body: [
          'Đây là mức giá niêm yết chuẩn tại Việt Nam. Trước khi thanh toán, bạn luôn được xem lại số tiền trên giao diện xác nhận của Apple.',
          `Mức “khoảng ${PRICING.yearlyMonthlyRefVnd} đồng/tháng” của gói năm chỉ là quy đổi tham khảo. Khoản thanh toán thực tế cho một chu kỳ năm là ${PRICING.yearlyVnd} đồng.`,
          'Gói đăng ký tự động gia hạn theo chu kỳ đã chọn cho đến khi bạn hủy. Hướng dẫn hủy: [Hủy & hoàn tiền](/cancellation).',
        ],
        table: [
          [
            'Gói tháng',
            `${PRICING.monthlyVnd} đồng`,
            '01 tháng · tự động gia hạn đến khi hủy',
          ],
          [
            'Gói năm',
            `${PRICING.yearlyVnd} đồng`,
            `01 năm (tham khảo khoảng ${PRICING.yearlyMonthlyRefVnd} đồng/tháng) · tự động gia hạn đến khi hủy`,
          ],
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
          'Đơn vị tiền tệ: Giá được niêm yết bằng đồng Việt Nam trên giao diện Nutree dành cho người dùng tại Việt Nam.',
          'Xác nhận trước giao dịch: Trước khi mua, bạn được xem tên gói, giá, chu kỳ, cơ chế tự động gia hạn và nút xác nhận. Giao diện xác nhận của Apple hiển thị số tiền cuối cùng được tính cho Tài khoản Apple.',
          'Thuế, phí và khu vực tài khoản: Khoản tiền thực tế có thể chịu cách hiển thị thuế, phí hoặc quy đổi theo quy định của Apple và khu vực Tài khoản Apple. Mức có giá trị áp dụng là mức bạn nhìn thấy và xác nhận tại bước thanh toán cuối cùng.',
        ],
      },
      {
        title: 'Mã ưu đãi, mã giới thiệu và khuyến mại',
        body: [
          'Nutree có thể cho phép nhập mã ưu đãi hoặc mã giới thiệu trước khi mua, hoặc áp dụng chương trình khuyến mại có thời hạn.',
          'Mỗi chương trình có điều kiện, thời hạn, đối tượng, số lần sử dụng và mức giảm riêng. Ưu đãi không được quy đổi thành tiền mặt, không cộng gộp trừ khi có thông báo khác, và có thể bị từ chối khi hết hạn, sai điều kiện, gian lận hoặc đã sử dụng.',
          'Nếu ưu đãi làm thay đổi số tiền phải trả, mức đó vẫn được hiển thị trong app và trên Apple trước khi bạn xác nhận. Giá ưu đãi không tự động thay thế bảng giá niêm yết chuẩn ở trên, trừ khi chúng tôi cập nhật chính sách này.',
        ],
      },
      {
        title: 'Tự động gia hạn và thay đổi giá',
        body: [
          'Gói tháng và gói năm tiếp tục gia hạn theo chu kỳ đã chọn cho đến khi bạn hủy trong phần quản lý đăng ký của Apple. Phí chu kỳ tiếp theo được tính theo thông tin Apple hiển thị tại thời điểm gia hạn.',
          'Chúng tôi có thể điều chỉnh giá cho chu kỳ tương lai. Khi nền tảng yêu cầu, bạn sẽ được thông báo và/hoặc phải chấp thuận giá mới. Việc thay đổi không làm phát sinh thu thêm cho phần thời gian đã thanh toán trong chu kỳ hiện tại.',
          'Mức giá hiện hành không phải cam kết duy trì vô thời hạn. Giá ưu đãi chỉ áp dụng theo điều kiện công bố.',
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
          'Bảng giá chuẩn cần được cập nhật đồng thời trên tài liệu, website, ứng dụng và hệ thống thanh toán khi có thay đổi mức niêm yết.',
        ],
      },
    ],
  },
};
