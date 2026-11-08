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
      'What this page says about the Nutree website checkout. It does not promise an activation email, a deeplink, or that the app unlocks.',
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
          `This Usage Policy is about the Nutree website (${LEGAL_COMPANY.websiteDisplay}). Provider: ${LEGAL_COMPANY.legalNameEn}. Published company email: ${LEGAL_COMPANY.email}.`,
          'The Vietnamese purchase page can show a one-time yearly VietQR transfer. The English purchase page does not show that VietQR checkout. Apple in-app purchase, Google Play in-app purchase, and Paddle web checkout are described in the [Payment Policy](/payment). This page does not say those three channels use a website deeplink.',
          'This page does not promise that a website payment sends an activation email, a deeplink, or unlocks the app.',
        ],
      },
      {
        title: 'Step 1 — Choose a plan on the website',
        body: [
          'On the Vietnamese purchase page, VietQR is offered for one plan: a one-time yearly transfer. This page does not say that checkout offers a monthly plan.',
          'The amount shown on the screen you are using is the amount for that screen. This page does not publish a second price.',
        ],
        images: [
          {
            src: '/images/vi/dashboard.webp',
            alt: 'Nutree app preview after plan activation',
            caption: 'Illustration of the Nutree app. This image is not a promise that a website payment unlocks the app.',
          },
        ],
      },
      {
        title: 'Step 2 — Complete payment',
        body: [
          'Follow the on-screen checkout instructions (for example bank transfer with VietQR and the exact amount shown).',
          'Transfer the exact amount and keep your payment receipt / transaction reference.',
          'If the checkout asks you to send a receipt, send it through [Facebook Messenger](https://m.me/1019820571221637) or to nutreeaidev@gmail.com with the transfer content or order reference. This page does not promise a match or a deadline.',
        ],
        images: [
          {
            src: '/pay/mbbank-vietqr.png',
            alt: 'Example VietQR bank-transfer checkout for Nutree',
            caption: 'Example: scan VietQR or copy the bank details, then transfer the exact amount.',
          },
        ],
      },
      {
        title: 'Step 3 — Email and links',
        body: [
          'This page does not promise an activation email or a deeplink after a website payment.',
          'If you receive a message about a purchase, check who sent it before you open a link. Nutree does not ask for a banking password in email or chat.',
          'If you need help, contact [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com with your payment proof and the email address you used. This page does not promise a reply time.',
        ],
      },
      {
        title: 'Step 4 — Using the app',
        body: [
          'This page does not give device-specific activation steps and does not promise that opening a link unlocks paid features.',
          'Apple in-app purchase, Google Play in-app purchase, and Paddle web checkout follow the [Payment Policy](/payment). They do not use the Vietnamese VietQR screen.',
          'Install Nutree from the store for your device if you do not already have it. This page does not promise that installing the app unlocks a website payment.',
        ],
        images: [
          {
            src: '/images/vi/meal-scanning.webp',
            alt: 'Nutree meal scanning after activation',
            caption: 'Illustration of meal scanning in the Nutree app. This image is not a promise that a website payment unlocks that feature.',
          },
        ],
      },
      {
        title: 'Account matching and security',
        body: [
          'When a screen asks you to sign in, use the email that screen asks for. This page does not promise that matching an email unlocks a purchase.',
          'If you receive a link about a purchase, do not share it. This page does not say how long a link lasts.',
          'Nutree does not ask for your banking password in email or chat.',
        ],
      },
      {
        title: 'Troubleshooting',
        body: [
          'No email: this page does not promise an email. If you need help, contact [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com with payment proof.',
          'A link opens the browser: this page does not promise that a link opens the app.',
          'Paid but features locked: this page does not promise that a website payment unlocks features. Apple and Google Play restore is described in the [Payment Policy](/payment). Other help: the same Messenger link or nutreeaidev@gmail.com.',
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
      'Trang này nói gì về thanh toán trên website Nutree. Trang không cam kết email kích hoạt, deeplink hoặc việc mở khóa ứng dụng.',
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
          `Chính sách sử dụng này nói về website Nutree (${LEGAL_COMPANY.websiteDisplay}). Đơn vị cung cấp: ${LEGAL_COMPANY.legalName}. Email công ty đã công bố: ${LEGAL_COMPANY.email}.`,
          'Trang mua tiếng Việt có thể hiện chuyển khoản VietQR một lần cho gói năm. Trang mua tiếng Anh không hiện checkout VietQR đó. Mua trong ứng dụng Apple, mua trong ứng dụng Google Play và thanh toán web Paddle được nêu ở [Chính sách thanh toán](/payment). Trang này không nói ba kênh đó dùng deeplink trên website.',
          'Trang này không cam kết thanh toán trên website sẽ gửi email kích hoạt, gửi deeplink hoặc mở khóa ứng dụng.',
        ],
      },
      {
        title: 'Bước 1 — Chọn gói trên website',
        body: [
          'Trên trang mua tiếng Việt, VietQR được cung cấp cho một gói: chuyển khoản một lần theo năm. Trang này không nói checkout đó có gói tháng.',
          'Số tiền trên màn hình bạn đang dùng là số tiền của màn hình đó. Trang này không niêm yết một mức giá thứ hai.',
        ],
        images: [
          {
            src: '/images/vi/dashboard.webp',
            alt: 'Giao diện Nutree sau khi kích hoạt gói',
            caption: 'Hình minh họa ứng dụng Nutree. Hình này không phải cam kết thanh toán trên website sẽ mở khóa ứng dụng.',
          },
        ],
      },
      {
        title: 'Bước 2 — Hoàn tất thanh toán',
        body: [
          'Làm theo hướng dẫn checkout trên màn hình (ví dụ chuyển khoản VietQR đúng số tiền hiển thị).',
          'Chuyển đúng số tiền và lưu biên lai / mã giao dịch.',
          'Nếu checkout yêu cầu gửi biên lai, hãy gửi qua [Facebook Messenger](https://m.me/1019820571221637) hoặc tới nutreeaidev@gmail.com, kèm nội dung chuyển khoản hoặc mã đơn. Trang này không cam kết đối soát hoặc hạn trả lời.',
        ],
        images: [
          {
            src: '/pay/mbbank-vietqr.png',
            alt: 'Ví dụ mã VietQR thanh toán Nutree',
            caption: 'Ví dụ: quét VietQR hoặc sao chép thông tin tài khoản, rồi chuyển đúng số tiền.',
          },
        ],
      },
      {
        title: 'Bước 3 — Email và liên kết',
        body: [
          'Trang này không cam kết có email kích hoạt hoặc deeplink sau thanh toán trên website.',
          'Nếu bạn nhận tin nhắn về một giao dịch, hãy kiểm tra người gửi trước khi mở liên kết. Nutree không hỏi mật khẩu ngân hàng qua email hoặc chat.',
          'Nếu cần hỗ trợ, nhắn [Facebook Messenger](https://m.me/1019820571221637) hoặc gửi tới nutreeaidev@gmail.com, kèm bằng chứng thanh toán và địa chỉ email đã dùng. Trang này không cam kết thời gian trả lời.',
        ],
      },
      {
        title: 'Bước 4 — Dùng ứng dụng',
        body: [
          'Trang này không đưa các bước kích hoạt theo từng thiết bị và không cam kết mở một liên kết sẽ mở khóa tính năng trả phí.',
          'Mua trong ứng dụng Apple, mua trong ứng dụng Google Play và thanh toán web Paddle theo [Chính sách thanh toán](/payment). Ba kênh đó không dùng màn hình VietQR tiếng Việt.',
          'Hãy cài Nutree từ cửa hàng của thiết bị nếu bạn chưa có ứng dụng. Trang này không cam kết việc cài ứng dụng sẽ mở khóa một thanh toán trên website.',
        ],
        images: [
          {
            src: '/images/vi/meal-scanning.webp',
            alt: 'Quét món bằng AI trên Nutree sau kích hoạt',
            caption: 'Hình minh họa quét món trong ứng dụng Nutree. Hình này không phải cam kết thanh toán trên website sẽ mở khóa tính năng đó.',
          },
        ],
      },
      {
        title: 'Khớp tài khoản và bảo mật',
        body: [
          'Khi một màn hình yêu cầu đăng nhập, hãy dùng email mà màn hình đó yêu cầu. Trang này không cam kết việc trùng email sẽ mở khóa giao dịch.',
          'Nếu bạn nhận một liên kết về giao dịch, đừng chia sẻ liên kết đó. Trang này không nói liên kết tồn tại bao lâu.',
          'Nutree không yêu cầu mật khẩu ngân hàng qua email hoặc chat.',
        ],
      },
      {
        title: 'Xử lý sự cố',
        body: [
          'Không nhận email: trang này không cam kết có email. Nếu cần hỗ trợ, nhắn [Facebook Messenger](https://m.me/1019820571221637) hoặc gửi tới nutreeaidev@gmail.com kèm bằng chứng thanh toán.',
          'Liên kết mở trình duyệt: trang này không cam kết một liên kết sẽ mở ứng dụng.',
          'Đã thanh toán nhưng chưa mở khóa tính năng: trang này không cam kết thanh toán trên website sẽ mở khóa tính năng. Cách khôi phục Apple và Google Play nằm ở [Chính sách thanh toán](/payment). Hỗ trợ khác: cùng liên kết Messenger hoặc nutreeaidev@gmail.com.',
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
