import type { Locale } from './translations';
import type { LegalPageContent } from './legal-content';
import { LEGAL_COMPANY } from './legal-company';

const dates = {
  en: {
    effectiveDate: '27/08/2026',
    updatedDate: '27/08/2026',
    version: '1.0',
  },
  vi: {
    effectiveDate: '27/08/2026',
    updatedDate: '27/08/2026',
    version: '1.0',
  },
};

export const usagePolicyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Usage Policy',
    description:
      'How Nutree web payment unlocks the mobile app: choose a plan, pay, receive a deeplink by email, and start using Nutree.',
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
          `This Usage Policy explains how customers activate and use Nutree after paying on the Nutree website (${LEGAL_COMPANY.websiteDisplay}). Provider: ${LEGAL_COMPANY.legalNameEn}. Support: ${LEGAL_COMPANY.email}.`,
          'It covers the web checkout path where payment is confirmed on the website and access is delivered to the Nutree mobile app through a deeplink. In-app Apple App Store purchases follow the [Payment Policy](/payment) separately.',
        ],
      },
      {
        title: 'Step 1 — Choose a plan on the website',
        body: [
          'Open the Nutree website and go to [Pay](/pay) (also linked from the homepage plans section).',
          'Select Monthly or Yearly. Prices and features are shown before you continue to checkout.',
        ],
        images: [
          {
            src: '/images/vi/dashboard.png',
            alt: 'Nutree app preview after plan activation',
            caption: 'Nutree mobile experience unlocked after successful activation.',
          },
        ],
      },
      {
        title: 'Step 2 — Complete payment',
        body: [
          'Follow the on-screen checkout instructions (for example bank transfer with VietQR and the exact amount shown).',
          'Transfer the exact amount and keep your payment receipt / transaction reference.',
          `If the checkout asks you to send a receipt, email it to ${LEGAL_COMPANY.email} with the transfer content or order reference so Nutree can match the payment.`,
        ],
        images: [
          {
            src: '/pay/mbbank-vietqr.png',
            alt: 'Example VietQR bank-transfer checkout for Nutree',
            caption: 'Example: scan VietQR or copy bank details on the pay page, then transfer the exact amount.',
          },
        ],
      },
      {
        title: 'Step 3 — Receive the deeplink by email',
        body: [
          'After Nutree confirms your payment, we send an activation email to the email address used for the purchase / lead.',
          'That email contains a deeplink (universal / app link) to open Nutree and unlock the paid plan. Check Inbox and Spam/Promotions if you do not see it within a reasonable time after confirmation.',
          `If the email does not arrive, contact ${LEGAL_COMPANY.email} with your payment proof and the email address you used.`,
        ],
      },
      {
        title: 'Step 4 — Open the deeplink and use Nutree',
        body: [
          'On your iPhone, tap the deeplink in the activation email.',
          'If Nutree is already installed, the app opens and continues activation (sign-in / email confirmation may be required so the purchase matches your account).',
          'If Nutree is not installed yet, install Nutree from the App Store, then reopen the same activation email and tap the deeplink again.',
          'After successful activation you can use paid features such as AI meal scans, adaptive daily targets, and meal guidance on Home.',
        ],
        images: [
          {
            src: '/images/vi/meal-scanning.png',
            alt: 'Nutree meal scanning after activation',
            caption: 'After activation, use Nutree features such as AI meal scanning in the app.',
          },
        ],
      },
      {
        title: 'Account matching and security',
        body: [
          'Use the same email for purchase, activation email, and app sign-in when asked. Mismatched emails can delay entitlement.',
          'Do not share your deeplink. Links may expire or become single-use for security.',
          'Nutree does not ask for your banking password in email or chat.',
        ],
      },
      {
        title: 'Troubleshooting',
        body: [
          'No email: wait a few minutes, check Spam, confirm the email spelling, then contact support with payment proof.',
          'Link opens the browser instead of the app: install or update Nutree, then reopen the same email link on your phone.',
          'Paid but features locked: finish the in-app email / sign-in steps from the deeplink, then restart the app. If still locked, email support with your receipt.',
        ],
      },
      {
        title: 'Related policies',
        body: [
          'See also: [Payment Policy](/payment) · [Pricing Policy](/pricing) · [Cancellation & Refunds](/cancellation) · [Complaints & Support](/complaints) · [Terms of Service](/terms).',
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách sử dụng',
    description:
      'Hướng dẫn kích hoạt và dùng Nutree sau khi thanh toán trên website: chọn gói, thanh toán, nhận deeplink qua email và mở app.',
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
          `Chính sách này mô tả cách khách hàng kích hoạt và sử dụng Nutree sau khi thanh toán trên website (${LEGAL_COMPANY.websiteDisplay}). Đơn vị cung cấp: ${LEGAL_COMPANY.legalName}. Hỗ trợ: ${LEGAL_COMPANY.email}.`,
          'Áp dụng cho luồng thanh toán trên website: xác nhận thanh toán xong, quyền dùng được gửi tới app Nutree qua deeplink. Giao dịch mua trong app qua Apple App Store áp dụng riêng theo [Chính sách thanh toán](/payment).',
        ],
      },
      {
        title: 'Bước 1 — Chọn gói trên website',
        body: [
          'Truy cập website Nutree và vào trang [Thanh toán](/pay) (hoặc chọn gói ngay trên trang chủ).',
          'Chọn gói Tháng hoặc gói Năm. Giá và quyền lợi được hiển thị trước khi tiếp tục thanh toán.',
        ],
        images: [
          {
            src: '/images/vi/dashboard.png',
            alt: 'Giao diện Nutree sau khi kích hoạt gói',
            caption: 'Trải nghiệm app Nutree sau khi kích hoạt thành công.',
          },
        ],
      },
      {
        title: 'Bước 2 — Hoàn tất thanh toán',
        body: [
          'Làm theo hướng dẫn checkout trên màn hình (ví dụ chuyển khoản VietQR đúng số tiền hiển thị).',
          'Chuyển đúng số tiền và lưu biên lai / mã giao dịch.',
          `Nếu checkout yêu cầu gửi biên lai, hãy gửi về ${LEGAL_COMPANY.email} kèm nội dung chuyển khoản hoặc mã đơn để Nutree đối soát.`,
        ],
        images: [
          {
            src: '/pay/mbbank-vietqr.png',
            alt: 'Ví dụ mã VietQR thanh toán Nutree',
            caption: 'Ví dụ: quét VietQR hoặc sao chép thông tin tài khoản trên trang thanh toán, rồi chuyển đúng số tiền.',
          },
        ],
      },
      {
        title: 'Bước 3 — Nhận deeplink qua email',
        body: [
          'Sau khi Nutree xác nhận thanh toán thành công, hệ thống gửi email kích hoạt tới địa chỉ email dùng khi mua / để lại trên website.',
          'Email này chứa deeplink (universal / app link) để mở Nutree và kích hoạt gói đã thanh toán. Nếu chưa thấy email, hãy kiểm tra Hộp thư đến và Thư rác/Quảng cáo.',
          `Nếu không nhận được email, liên hệ ${LEGAL_COMPANY.email} kèm bằng chứng thanh toán và địa chỉ email đã dùng.`,
        ],
      },
      {
        title: 'Bước 4 — Mở deeplink và dùng Nutree',
        body: [
          'Trên iPhone, chạm vào deeplink trong email kích hoạt.',
          'Nếu đã cài Nutree, app sẽ mở và tiếp tục bước kích hoạt (có thể cần đăng nhập / xác nhận email để khớp giao dịch với tài khoản).',
          'Nếu chưa cài Nutree, hãy tải Nutree trên App Store, rồi mở lại cùng email kích hoạt và chạm deeplink lần nữa.',
          'Sau khi kích hoạt thành công, bạn dùng được các tính năng trả phí như quét món AI, mục tiêu thích ứng và gợi ý bữa ăn trên Home.',
        ],
        images: [
          {
            src: '/images/vi/meal-scanning.png',
            alt: 'Quét món bằng AI trên Nutree sau kích hoạt',
            caption: 'Sau kích hoạt, dùng các tính năng như quét món bằng AI trong app.',
          },
        ],
      },
      {
        title: 'Khớp tài khoản và bảo mật',
        body: [
          'Nên dùng cùng một email cho thanh toán, email kích hoạt và đăng nhập app khi được yêu cầu. Email không khớp có thể làm chậm việc nhận quyền.',
          'Không chia sẻ deeplink. Liên kết có thể hết hạn hoặc chỉ dùng một lần vì lý do bảo mật.',
          'Nutree không yêu cầu mật khẩu ngân hàng qua email hoặc chat.',
        ],
      },
      {
        title: 'Xử lý sự cố',
        body: [
          'Không nhận email: đợi vài phút, kiểm tra Thư rác, xác nhận đúng địa chỉ email, rồi liên hệ hỗ trợ kèm biên lai.',
          'Link mở trình duyệt thay vì app: cài hoặc cập nhật Nutree, rồi mở lại cùng liên kết trong email trên điện thoại.',
          'Đã thanh toán nhưng chưa mở khóa tính năng: hoàn tất bước email / đăng nhập trong app từ deeplink, rồi mở lại app. Nếu vẫn lỗi, gửi biên lai tới email hỗ trợ.',
        ],
      },
      {
        title: 'Chính sách liên quan',
        body: [
          'Xem thêm: [Chính sách thanh toán](/payment) · [Chính sách giá](/pricing) · [Hủy & hoàn tiền](/cancellation) · [Khiếu nại & hỗ trợ](/complaints) · [Điều khoản sử dụng](/terms).',
        ],
      },
    ],
  },
};
