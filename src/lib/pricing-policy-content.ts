import type { Locale } from './translations';
import type { LegalPageContent } from './legal-content';
import { LEGAL_COMPANY } from './legal-company';

const { monthlyVnd, yearlyVnd, yearlyMonthlyEquivalentVnd } = LEGAL_COMPANY.pricing;

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
    description: 'List prices for Nutree subscription plans in Vietnam.',
    toc: 'Table of Contents',
    backHome: 'Back to Home',
    home: 'Home',
    copyright: 'Nutree. All rights reserved.',
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
    tableHeaders: ['Plan', 'Price', 'Details'],
    ...dates.en,
    sections: [
      {
        title: 'Scope',
        body: [
          `This policy applies to Nutree digital subscription plans offered by ${LEGAL_COMPANY.legalNameEn} (${LEGAL_COMPANY.tradeName}) in Vietnam.`,
          `Enterprise ID: ${LEGAL_COMPANY.taxId}. Address: ${LEGAL_COMPANY.addressEn}. Contact: ${LEGAL_COMPANY.email}.`,
        ],
      },
      {
        title: 'Current list prices',
        body: [
          'Prices below are Vietnam list prices at the effective date. The amount confirmed on the Apple purchase sheet is controlling.',
          `Yearly “${yearlyMonthlyEquivalentVnd} VND/month” is a reference only; the billed amount is ${yearlyVnd} VND per year.`,
          'Plans auto-renew until cancelled in Apple subscription settings.',
        ],
        table: [
          ['Monthly', `${monthlyVnd} VND`, '1 month · auto-renew until cancelled'],
          ['Yearly', `${yearlyVnd} VND`, '1 year · auto-renew until cancelled'],
        ],
      },
      {
        title: 'Promotions and offers',
        body: [
          'Nutree may offer promo codes, referral codes, or time-limited promotional prices (including amounts different from the table above).',
          'Each offer has its own eligibility, duration, and limits. Offers are not cash, are not stackable unless stated, and may be declined if expired, ineligible, or abusive.',
          'The final amount is always the amount you see and confirm in Apple checkout.',
        ],
      },
      {
        title: 'Display price vs final charge',
        body: [
          'List prices are shown in Vietnamese dong for users in Vietnam.',
          'Tax display, fees, or Apple Account region may affect what Apple shows. Confirm the final amount before purchasing.',
        ],
      },
      {
        title: 'Price changes',
        body: [
          'Future-cycle prices may change. Where the platform requires, users are notified and/or must accept the new price. The already-paid portion of a current cycle is not re-billed at the new price.',
        ],
      },
      {
        title: 'Contact',
        body: [
          `Questions about pricing: ${LEGAL_COMPANY.email}. Website: ${LEGAL_COMPANY.websiteDisplay}.`,
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách giá',
    description: 'Bảng giá niêm yết gói dịch vụ Nutree tại Việt Nam.',
    toc: 'Mục lục',
    backHome: 'Về trang chủ',
    home: 'Trang chủ',
    copyright: 'Nutree. Bảo lưu mọi quyền.',
    links: { privacy: 'Chính sách bảo mật', terms: 'Điều khoản sử dụng' },
    tableHeaders: ['Gói', 'Mức giá', 'Chi tiết'],
    ...dates.vi,
    sections: [
      {
        title: 'Phạm vi áp dụng',
        body: [
          `Áp dụng cho gói dịch vụ số Nutree do ${LEGAL_COMPANY.legalName} (tên thương mại: ${LEGAL_COMPANY.tradeName}) cung cấp tại Việt Nam.`,
          `Mã số doanh nghiệp: ${LEGAL_COMPANY.taxId}. Địa chỉ: ${LEGAL_COMPANY.address}. Liên hệ: ${LEGAL_COMPANY.email}.`,
        ],
      },
      {
        title: 'Bảng giá hiện hành',
        body: [
          'Mức giá dưới đây là giá niêm yết tại Việt Nam tại ngày hiệu lực. Số tiền người dùng xác nhận trên giao diện Apple là mức có giá trị áp dụng.',
          `Mức “${yearlyMonthlyEquivalentVnd} đồng/tháng” của gói năm chỉ là quy đổi tham khảo; khoản thanh toán thực tế là ${yearlyVnd} đồng cho một chu kỳ năm.`,
          'Gói tự động gia hạn đến khi người dùng hủy trong phần quản lý đăng ký của Apple.',
        ],
        table: [
          ['Gói tháng', `${monthlyVnd} đồng`, '01 tháng · tự động gia hạn đến khi hủy'],
          ['Gói năm', `${yearlyVnd} đồng`, '01 năm · tự động gia hạn đến khi hủy'],
        ],
      },
      {
        title: 'Ưu đãi và khuyến mại',
        body: [
          'Nutree có thể áp dụng mã ưu đãi, mã giới thiệu hoặc chương trình khuyến mại có thời hạn (bao gồm mức giá khác bảng niêm yết).',
          'Mỗi chương trình có điều kiện, thời hạn và đối tượng riêng. Ưu đãi không quy đổi tiền mặt, không cộng gộp trừ khi có thông báo khác.',
          'Số tiền cuối cùng luôn là mức hiển thị và được xác nhận tại bước thanh toán Apple.',
        ],
      },
      {
        title: 'Giá hiển thị và giá thanh toán cuối cùng',
        body: [
          'Giá niêm yết bằng đồng Việt Nam cho người dùng tại Việt Nam.',
          'Thuế, phí hoặc khu vực Tài khoản Apple có thể ảnh hưởng cách hiển thị. Hãy kiểm tra số tiền cuối cùng trước khi xác nhận.',
        ],
      },
      {
        title: 'Thay đổi giá',
        body: [
          'Giá chu kỳ tương lai có thể thay đổi. Khi nền tảng yêu cầu, người dùng sẽ được thông báo và/hoặc phải chấp thuận giá mới. Không thu thêm cho phần thời gian đã thanh toán của chu kỳ hiện tại.',
        ],
      },
      {
        title: 'Liên hệ',
        body: [
          `Giải đáp chính sách giá: ${LEGAL_COMPANY.email}. Website: ${LEGAL_COMPANY.websiteDisplay}.`,
        ],
      },
    ],
  },
};
