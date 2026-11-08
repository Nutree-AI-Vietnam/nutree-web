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
    tableHeaders: ['Step', 'Stage', 'Time stated on this page'],
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
          `Published company email: ${LEGAL_COMPANY.email}.`,
          'Payment and access help uses the same contacts as the Payment Policy: [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com.',
          'In-app support/feedback when available.',
          `Written mail: ${LEGAL_COMPANY.legalNameEn}, ${LEGAL_COMPANY.addressEn}.`,
          `Website: ${LEGAL_COMPANY.websiteDisplay}.`,
          'This page does not rank these contacts or publish a reply deadline.',
        ],
      },
      {
        title: 'Information to provide',
        body: [
          'Name/account and registered email.',
          'What happened, when, and which feature or plan.',
          'The receipt from the channel that charged you — Apple, Google Play, Paddle, or the VietQR transfer — if the complaint is about a payment. You may mask unnecessary details.',
          'Screenshots, app version, device, and steps already tried.',
          'Desired outcome. Never send passwords, OTPs, or full card numbers.',
        ],
      },
      {
        title: 'Process',
        body: [
          'This page does not publish a 3, 7, or 15 business-day commitment. No replacement deadline is stated here.',
        ],
        table: [
          ['1', 'Intake & classification', 'No deadline is published on this page'],
          ['2', 'Verification', 'No deadline is published on this page'],
          ['3', 'Proposed resolution', 'No deadline is published on this page'],
          ['4', 'Complex cases', 'No deadline is published on this page'],
          ['5', 'Outcome / reconsideration', 'No deadline is published on this page'],
        ],
      },
      {
        title: 'Outcomes and escalation',
        body: [
          'Outcomes may include guidance, bug fixes, entitlement help, or a written reply. Apple reviews App Store refund requests. Google Play reviews Google Play refund requests. Nutree does not publish its own refund promise for Paddle; see the Paddle Buyer Terms. This page does not add a Nutree refund promise for VietQR.',
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
    tableHeaders: ['Bước', 'Giai đoạn', 'Thời gian nêu trên trang này'],
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
          `Email công ty đã công bố: ${LEGAL_COMPANY.email}.`,
          'Hỗ trợ thanh toán và quyền dùng dùng cùng liên hệ với Chính sách thanh toán: [Facebook Messenger](https://m.me/1019820571221637) hoặc nutreeaidev@gmail.com.',
          'Trong ứng dụng: mục Hỗ trợ/Phản hồi khi có.',
          `Văn bản: ${LEGAL_COMPANY.legalName}, ${LEGAL_COMPANY.address}.`,
          `Website: ${LEGAL_COMPANY.websiteDisplay}.`,
          'Trang này không xếp hạng các liên hệ này và không công bố hạn trả lời.',
        ],
      },
      {
        title: 'Thông tin cần cung cấp',
        body: [
          'Họ tên/tài khoản và email đăng ký.',
          'Mô tả sự việc, thời điểm, tính năng hoặc gói liên quan.',
          'Biên nhận của kênh đã tính tiền — Apple, Google Play, Paddle hoặc chuyển khoản VietQR — nếu khiếu nại về thanh toán. Có thể che thông tin không cần thiết.',
          'Ảnh chụp màn hình, phiên bản ứng dụng, thiết bị và các bước đã thử.',
          'Phương án mong muốn. Không gửi mật khẩu, OTP hoặc toàn bộ số thẻ.',
        ],
      },
      {
        title: 'Quy trình',
        body: [
          'Trang này không công bố cam kết 3, 7 hoặc 15 ngày làm việc. Không có hạn thay thế trên trang này.',
        ],
        table: [
          ['1', 'Tiếp nhận & phân loại', 'Trang này không công bố hạn'],
          ['2', 'Xác minh', 'Trang này không công bố hạn'],
          ['3', 'Đề xuất xử lý', 'Trang này không công bố hạn'],
          ['4', 'Vụ việc phức tạp', 'Trang này không công bố hạn'],
          ['5', 'Kết quả / xem xét lại', 'Trang này không công bố hạn'],
        ],
      },
      {
        title: 'Kết quả và khiếu nại tiếp',
        body: [
          'Phương án có thể gồm hướng dẫn, sửa lỗi, hỗ trợ quyền dùng hoặc trả lời bằng văn bản. Apple xem xét yêu cầu hoàn tiền App Store. Google Play xem xét yêu cầu hoàn tiền Google Play. Nutree không công bố cam kết hoàn tiền riêng cho Paddle; xem Điều khoản người mua của Paddle. Trang này không thêm cam kết hoàn tiền riêng của Nutree cho VietQR.',
          'Có thể yêu cầu xem xét lại với chứng cứ mới. Người dùng có quyền liên hệ cơ quan bảo vệ người tiêu dùng hoặc Tòa án theo pháp luật Việt Nam. Chính sách này không hạn chế quyền bắt buộc của người tiêu dùng.',
        ],
      },
    ],
  },
};
