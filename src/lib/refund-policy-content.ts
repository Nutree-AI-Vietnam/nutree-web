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

export const refundPolicyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Delivery, Termination, and Refunds',
    description: 'How Nutree delivers digital access, ends service, and handles refunds.',
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
          `Nutree is a digital online service with no physical goods delivery. Provider: ${LEGAL_COMPANY.legalNameEn}. Contact: ${LEGAL_COMPANY.email}. Address: ${LEGAL_COMPANY.addressEn}.`,
        ],
      },
      {
        title: 'How service is delivered',
        body: [
          'Access is delivered in the Nutree app after a valid purchase is verified.',
          'Monthly plans last one month; yearly plans last one year; both auto-renew until cancelled in Apple settings.',
        ],
      },
      {
        title: 'User cancellation and account deletion',
        body: [
          'Cancel auto-renewal in Apple ID → Subscriptions → Nutree → Cancel.',
          'Deleting the app does not cancel the subscription or delete server data by itself.',
          'Deleting a Nutree account and cancelling Apple billing are separate steps.',
        ],
      },
      {
        title: 'Refund principles',
        body: [
          'For App Store purchases, Apple decides refunds. Nutree cannot transfer Apple funds back to your payment method itself.',
          'This policy does not limit non-waivable consumer rights under Vietnamese law.',
          'Cancelling auto-renewal does not automatically refund the current paid period.',
          'Contact us promptly for duplicate charges, paid-but-not-activated access, unrecognized purchases, or serious service defects.',
        ],
      },
      {
        title: 'How to request a refund',
        body: [
          'Request a refund from Apple at reportaproblem.apple.com using the Apple ID that purchased Nutree.',
          `For Nutree support, email ${LEGAL_COMPANY.email} with account email, receipt, date, amount, description, and screenshots.`,
          'If Apple refunds or revokes a purchase, Nutree adjusts or ends the matching entitlement.',
        ],
      },
      {
        title: 'Data after service ends',
        body: [
          'Ending a subscription does not always delete your account or data. Request deletion under the Privacy Policy when needed. Some transaction or legal records may be retained as required by law.',
        ],
      },
      {
        title: 'Complaints',
        body: [
          `Complaints follow the complaints policy at /khieu-nai. Contact: ${LEGAL_COMPANY.email}.`,
        ],
      },
    ],
  },
  vi: {
    title: 'Cung cấp, chấm dứt và hoàn tiền',
    description: 'Cách Nutree cung cấp dịch vụ số, chấm dứt gói và xử lý hoàn tiền.',
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
          `Nutree là dịch vụ số cung cấp trực tuyến; không giao nhận hàng hóa vật lý. Đơn vị cung cấp: ${LEGAL_COMPANY.legalName}. Liên hệ: ${LEGAL_COMPANY.email}. Địa chỉ: ${LEGAL_COMPANY.address}.`,
        ],
      },
      {
        title: 'Phương thức cung cấp dịch vụ',
        body: [
          'Dịch vụ được cung cấp điện tử qua ứng dụng Nutree sau khi giao dịch hợp lệ được xác minh.',
          'Gói tháng có chu kỳ 01 tháng; gói năm có chu kỳ 01 năm; tự động gia hạn đến khi hủy trong quản lý đăng ký của Apple.',
        ],
      },
      {
        title: 'Hủy gia hạn và xóa tài khoản',
        body: [
          'Hủy gia hạn trong Cài đặt Tài khoản Apple → Đăng ký → Nutree → Hủy đăng ký.',
          'Xóa ứng dụng không hủy thuê bao và không tự động xóa dữ liệu trên hệ thống.',
          'Xóa tài khoản Nutree và hủy đăng ký Apple là hai thủ tục độc lập.',
        ],
      },
      {
        title: 'Nguyên tắc hoàn tiền',
        body: [
          'Đối với giao dịch App Store, Apple quyết định hoàn tiền. Nutree không thể tự chuyển tiền từ hệ thống Apple về phương thức thanh toán của người dùng.',
          'Chính sách này không hạn chế quyền bắt buộc của người tiêu dùng theo pháp luật Việt Nam.',
          'Hủy gia hạn không tự động tạo khoản hoàn tiền cho chu kỳ hiện tại.',
          'Nên báo ngay khi bị tính phí trùng, đã thanh toán nhưng không kích hoạt, giao dịch không nhận biết, hoặc lỗi kỹ thuật nghiêm trọng.',
        ],
      },
      {
        title: 'Cách yêu cầu hoàn tiền',
        body: [
          'Gửi yêu cầu tới Apple tại reportaproblem.apple.com bằng Tài khoản Apple đã mua.',
          `Hỗ trợ Nutree: gửi ${LEGAL_COMPANY.email} email tài khoản, biên nhận, ngày, số tiền, mô tả vấn đề và ảnh chụp lỗi.`,
          'Khi Apple chấp thuận hoàn tiền hoặc thu hồi giao dịch, Nutree điều chỉnh hoặc chấm dứt quyền sử dụng tương ứng.',
        ],
      },
      {
        title: 'Dữ liệu sau khi chấm dứt',
        body: [
          'Hết hạn hoặc hủy thuê bao không nhất thiết xóa tài khoản và dữ liệu. Có thể yêu cầu xóa tài khoản theo Chính sách bảo mật. Một số dữ liệu giao dịch/pháp lý có thể được lưu theo thời hạn pháp luật yêu cầu.',
        ],
      },
      {
        title: 'Khiếu nại',
        body: [
          `Khiếu nại theo chính sách tại /khieu-nai. Liên hệ: ${LEGAL_COMPANY.email}.`,
        ],
      },
    ],
  },
};
