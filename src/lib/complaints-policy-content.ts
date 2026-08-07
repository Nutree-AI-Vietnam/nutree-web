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

export const complaintsPolicyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Complaints and Support',
    description: 'How Nutree receives and resolves feedback, requests, and complaints.',
    toc: 'Table of Contents',
    backHome: 'Back to Home',
    home: 'Home',
    copyright: 'Nutree. All rights reserved.',
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
    tableHeaders: ['Step', 'Stage', 'Target time'],
    ...dates.en,
    sections: [
      {
        title: 'Scope and principles',
        body: [
          `Applies to support and complaints about Nutree accounts, features, pricing, payments, renewals, termination, data, and service quality. Provider: ${LEGAL_COMPANY.legalNameEn}. Address: ${LEGAL_COMPANY.addressEn}.`,
          'Intake is free of charge. We act in good faith, protect sender information, and will not ask for passwords, OTPs, CVV, or full payment card numbers.',
        ],
      },
      {
        title: 'Intake channels',
        body: [
          `Email: ${LEGAL_COMPANY.email}`,
          'In-app support/feedback when available.',
          `Written mail: ${LEGAL_COMPANY.legalNameEn}, ${LEGAL_COMPANY.addressEn}.`,
          `Website: ${LEGAL_COMPANY.websiteDisplay}.`,
          'Recommended subject: “[Nutree - Support/Complaint]” using your registered account email.',
        ],
      },
      {
        title: 'Information to provide',
        body: [
          'Name/account and registered email.',
          'What happened, when, and which feature or plan.',
          'Apple receipt if payment-related (you may mask unnecessary details).',
          'Screenshots, app version, device, and steps already tried.',
          'Desired outcome. Never send passwords, OTPs, or full card numbers.',
        ],
      },
      {
        title: 'Process and target timelines',
        body: [
          'Timelines start when we have enough information and exclude waits on you, Apple, banks, partners, or authorities.',
        ],
        table: [
          ['1', 'Intake & classification', 'Within 3 business days'],
          ['2', 'Verification', 'Depends on the case'],
          [
            '3',
            'Proposed resolution',
            'Usually within 7 business days after complete information',
          ],
          [
            '4',
            'Complex cases',
            'Not more than 15 business days except special cases',
          ],
          ['5', 'Outcome / reconsideration', 'Per the outcome notice'],
        ],
      },
      {
        title: 'Outcomes and escalation',
        body: [
          'Outcomes may include guidance, bug fixes, entitlement restore, Apple coordination, or written replies. App Store refunds are decided by Apple.',
          'You may request reconsideration with new evidence. You may also contact consumer authorities or courts under Vietnamese law. Non-waivable consumer rights are not limited by this policy.',
        ],
      },
    ],
  },
  vi: {
    title: 'Tiếp nhận và giải quyết khiếu nại',
    description: 'Phương thức tiếp nhận và giải quyết phản ánh, yêu cầu, khiếu nại về Nutree.',
    toc: 'Mục lục',
    backHome: 'Về trang chủ',
    home: 'Trang chủ',
    copyright: 'Nutree. Bảo lưu mọi quyền.',
    links: { privacy: 'Chính sách bảo mật', terms: 'Điều khoản sử dụng' },
    tableHeaders: ['Bước', 'Giai đoạn', 'Thời gian mục tiêu'],
    ...dates.vi,
    sections: [
      {
        title: 'Phạm vi và nguyên tắc',
        body: [
          `Áp dụng cho hỗ trợ và khiếu nại về tài khoản, tính năng, giá, thanh toán, gia hạn, chấm dứt, dữ liệu và chất lượng dịch vụ Nutree. Đơn vị cung cấp: ${LEGAL_COMPANY.legalName}. Địa chỉ: ${LEGAL_COMPANY.address}.`,
          'Tiếp nhận miễn phí, thiện chí, bảo vệ thông tin người gửi; không yêu cầu mật khẩu, OTP, mã bảo mật thẻ hoặc toàn bộ số thẻ.',
        ],
      },
      {
        title: 'Kênh tiếp nhận',
        body: [
          `Email: ${LEGAL_COMPANY.email}`,
          'Trong ứng dụng: mục Hỗ trợ/Phản hồi khi có.',
          `Văn bản: ${LEGAL_COMPANY.legalName}, ${LEGAL_COMPANY.address}.`,
          `Website: ${LEGAL_COMPANY.websiteDisplay}.`,
          'Khuyến nghị tiêu đề “[Nutree - Hỗ trợ/Khiếu nại]” và dùng email đăng ký tài khoản.',
        ],
      },
      {
        title: 'Thông tin cần cung cấp',
        body: [
          'Họ tên/tài khoản và email đăng ký.',
          'Mô tả sự việc, thời điểm, tính năng hoặc gói liên quan.',
          'Biên nhận Apple nếu liên quan thanh toán (có thể che thông tin không cần thiết).',
          'Ảnh chụp màn hình, phiên bản ứng dụng, thiết bị và các bước đã thử.',
          'Phương án mong muốn. Không gửi mật khẩu, OTP hoặc toàn bộ số thẻ.',
        ],
      },
      {
        title: 'Quy trình và thời gian mục tiêu',
        body: [
          'Thời gian tính từ khi nhận đủ thông tin; không gồm thời gian chờ phản hồi của người dùng, Apple, ngân hàng, đối tác hoặc cơ quan nhà nước.',
        ],
        table: [
          ['1', 'Tiếp nhận & phân loại', 'Tối đa 03 ngày làm việc'],
          ['2', 'Xác minh', 'Theo tính chất vụ việc'],
          [
            '3',
            'Đề xuất xử lý',
            'Thông thường trong 07 ngày làm việc sau khi đủ thông tin',
          ],
          [
            '4',
            'Vụ việc phức tạp',
            'Không quá 15 ngày làm việc, trừ trường hợp đặc biệt',
          ],
          ['5', 'Kết quả / xem xét lại', 'Theo thông báo kết quả'],
        ],
      },
      {
        title: 'Kết quả và khiếu nại tiếp',
        body: [
          'Phương án có thể gồm hướng dẫn, sửa lỗi, khôi phục quyền, phối hợp Apple hoặc trả lời bằng văn bản. Hoàn tiền App Store do Apple xem xét.',
          'Có thể yêu cầu xem xét lại với chứng cứ mới. Người dùng có quyền liên hệ cơ quan bảo vệ người tiêu dùng hoặc Tòa án theo pháp luật Việt Nam. Chính sách này không hạn chế quyền bắt buộc của người tiêu dùng.',
        ],
      },
    ],
  },
};
