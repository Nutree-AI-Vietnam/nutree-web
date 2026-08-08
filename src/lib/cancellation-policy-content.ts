import type { Locale } from './translations';
import type { LegalPageContent } from './legal-content';
import { LEGAL_COMPANY } from './legal-company';

const dates = {
  en: {
    effectiveDate: LEGAL_COMPANY.effectiveDate,
    updatedDate: '08/08/2026',
    version: '1.1',
  },
  vi: {
    effectiveDate: LEGAL_COMPANY.effectiveDate,
    updatedDate: '08/08/2026',
    version: '1.1',
  },
};

export const cancellationPolicyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Cancellation & Refund Policy',
    description:
      'How to cancel your Nutree subscription, what happens after you cancel, and how refunds work.',
    toc: 'Table of Contents',
    backHome: 'Back to Home',
    home: 'Home',
    copyright: 'Nutree. All rights reserved.',
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
    ...dates.en,
    sections: [
      {
        title: 'Overview',
        body: [
          `Nutree subscriptions are digital and auto-renewing. Purchases made through Nutree’s web checkout are processed by Paddle. Purchases made inside the iOS app are processed by the Apple App Store. Provider: ${LEGAL_COMPANY.legalNameEn}. Contact: ${LEGAL_COMPANY.email}. Address: ${LEGAL_COMPANY.addressEn}.`,
          'Every Nutree web-checkout purchase processed by Paddle is eligible for a full refund when the request is made within 14 calendar days of the transaction date. This applies to the initial subscription payment and every renewal payment.',
          'You must cancel through the payment provider that processed your purchase. Cancelling stops future renewals. Deleting the Nutree app or your Nutree account does not cancel billing.',
        ],
      },
      {
        title: 'How to cancel',
        body: [
          'Nutree web-checkout purchase (Paddle): use the “Manage subscription” link in your Paddle transaction email or visit [paddle.net](https://paddle.net) to cancel the subscription.',
          'Nutree iOS in-app purchase (Apple App Store): open Settings on your iPhone or iPad, tap your name, then tap Subscriptions.',
          'Select Nutree, tap Cancel Subscription, and confirm. Apple will show when your access ends.',
          'If you cannot find the subscription, make sure you are signed in with the same Apple ID used for the purchase, and check Family Sharing if someone else manages subscriptions on the account.',
        ],
      },
      {
        title: 'What happens after you cancel',
        body: [
          'After a successful cancellation, auto-renewal stops. You keep paid features until the end of the current billing period that was already paid.',
          'When the period ends, paid access ends unless you resubscribe. Free or limited features (if any) may remain available depending on product design.',
          'You can resubscribe later through an available Nutree purchase channel.',
        ],
      },
      {
        title: 'Web-checkout refunds (Paddle): 14-day window',
        body: [
          'Every Nutree web-checkout purchase processed by Paddle qualifies for a full refund when requested within 14 calendar days of the transaction date. The 14-day window applies to the initial subscription payment and every renewal payment.',
          'No reason is required. Product usage and account status do not create exceptions to this 14-day refund policy.',
          'Request the refund using the “View receipt” or “Manage subscription” link in your Paddle transaction email, or visit [paddle.net](https://paddle.net) and choose “Request a refund.”',
          'Paddle is the Merchant of Record and processes the refund to the original payment method. Access covered by the refunded payment ends when the refund is issued.',
          `For help locating a Paddle transaction, email ${LEGAL_COMPANY.email} with your Nutree account email, transaction ID, date, and amount.`,
          'This policy does not limit non-waivable consumer rights under Vietnamese law.',
        ],
      },
      {
        title: 'iOS in-app refunds (Apple App Store)',
        body: [
          'For purchases processed by the Apple App Store, Apple processes refund requests.',
          'Visit [reportaproblem.apple.com](https://reportaproblem.apple.com), sign in with the Apple ID used for the purchase, select the Nutree transaction, and submit the refund request.',
          `For help with activation or missing access after an App Store payment, email ${LEGAL_COMPANY.email} with your Nutree account email and Apple receipt or transaction ID.`,
        ],
      },
      {
        title: 'Account deletion vs cancellation',
        body: [
          'Cancel subscription = stop future web-checkout charges through Paddle or future iOS in-app charges through Apple, using the cancellation steps above.',
          'Delete Nutree account = remove your Nutree profile and related data under the Privacy Policy (done in the app or by support request).',
          'These are separate actions. If you delete your account but leave a subscription active, the payment provider may continue renewals until you cancel the subscription.',
        ],
      },
      {
        title: 'Contact and complaints',
        body: [
          `Support: ${LEGAL_COMPANY.email}. Website: ${LEGAL_COMPANY.websiteDisplay}.`,
          'For formal complaints or escalations, see our [Complaints policy](/complaints).',
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách hủy & hoàn tiền',
    description:
      'Cách hủy gói đăng ký Nutree, điều gì xảy ra sau khi hủy, và hoàn tiền xử lý như thế nào.',
    toc: 'Mục lục',
    backHome: 'Về trang chủ',
    home: 'Trang chủ',
    copyright: 'Nutree. Bảo lưu mọi quyền.',
    links: { privacy: 'Chính sách bảo mật', terms: 'Điều khoản sử dụng' },
    ...dates.vi,
    sections: [
      {
        title: 'Tổng quan',
        body: [
          `Gói Nutree là dịch vụ số tự động gia hạn. Giao dịch thực hiện qua trang thanh toán web của Nutree được Paddle xử lý. Giao dịch thực hiện trong ứng dụng iOS được Apple App Store xử lý. Đơn vị cung cấp: ${LEGAL_COMPANY.legalName}. Liên hệ: ${LEGAL_COMPANY.email}. Địa chỉ: ${LEGAL_COMPANY.address}.`,
          'Mọi giao dịch thực hiện qua trang thanh toán web của Nutree và do Paddle xử lý đều được hoàn tiền toàn bộ nếu yêu cầu được gửi trong vòng chính xác 14 ngày theo lịch kể từ ngày giao dịch. Chính sách này áp dụng cho lần thanh toán đăng ký đầu tiên và mọi lần thanh toán gia hạn.',
          'Bạn phải hủy gói qua đơn vị thanh toán đã xử lý giao dịch. Việc hủy sẽ dừng các lần gia hạn trong tương lai. Xóa ứng dụng hoặc tài khoản Nutree không tự động hủy thanh toán.',
        ],
      },
      {
        title: 'Cách hủy gói',
        body: [
          'Giao dịch qua trang thanh toán web Nutree (Paddle): dùng liên kết “Manage subscription” trong email giao dịch Paddle hoặc truy cập [paddle.net](https://paddle.net) để hủy gói.',
          'Giao dịch trong ứng dụng Nutree trên iOS (Apple App Store): mở Cài đặt trên iPhone hoặc iPad, chạm vào tên của bạn, rồi chọn Đăng ký (Subscriptions).',
          'Chọn Nutree, chọn Hủy đăng ký và xác nhận. Apple sẽ hiển thị thời điểm quyền truy cập kết thúc.',
          'Nếu không thấy gói, hãy đảm bảo đang đăng nhập đúng Tài khoản Apple đã dùng để mua, và kiểm tra Chia sẻ trong gia đình nếu người khác quản lý đăng ký.',
        ],
      },
      {
        title: 'Sau khi hủy',
        body: [
          'Sau khi hủy thành công, gói không còn tự động gia hạn. Bạn vẫn dùng được tính năng trả phí đến hết chu kỳ đã thanh toán.',
          'Khi hết chu kỳ, quyền trả phí kết thúc trừ khi bạn đăng ký lại. Một số tính năng miễn phí/hạn chế (nếu có) có thể vẫn dùng được tùy thiết kế sản phẩm.',
          'Bạn có thể đăng ký lại sau qua kênh mua Nutree đang được cung cấp.',
        ],
      },
      {
        title: 'Hoàn tiền qua web (Paddle): thời hạn 14 ngày',
        body: [
          'Mọi giao dịch thực hiện qua trang thanh toán web của Nutree và do Paddle xử lý đều được hoàn tiền toàn bộ nếu yêu cầu được gửi trong vòng chính xác 14 ngày theo lịch kể từ ngày giao dịch. Thời hạn 14 ngày áp dụng cho lần thanh toán đăng ký đầu tiên và mọi lần thanh toán gia hạn.',
          'Bạn không cần nêu lý do. Việc đã sử dụng sản phẩm hoặc trạng thái tài khoản không tạo ra ngoại lệ đối với chính sách hoàn tiền 14 ngày này.',
          'Gửi yêu cầu bằng liên kết “View receipt” hoặc “Manage subscription” trong email giao dịch Paddle, hoặc truy cập [paddle.net](https://paddle.net) và chọn “Request a refund”.',
          'Paddle là đơn vị bán hàng chính thức (Merchant of Record) và xử lý hoàn tiền về phương thức thanh toán ban đầu. Quyền truy cập tương ứng sẽ kết thúc khi khoản tiền được hoàn.',
          `Nếu cần tìm giao dịch Paddle, gửi email tới ${LEGAL_COMPANY.email} kèm email tài khoản Nutree, mã giao dịch, ngày và số tiền.`,
          'Chính sách này không hạn chế quyền bắt buộc của người tiêu dùng theo pháp luật Việt Nam.',
        ],
      },
      {
        title: 'Hoàn tiền trong ứng dụng iOS (Apple App Store)',
        body: [
          'Đối với giao dịch do Apple App Store xử lý, Apple tiếp nhận và xử lý yêu cầu hoàn tiền.',
          'Truy cập [reportaproblem.apple.com](https://reportaproblem.apple.com), đăng nhập Tài khoản Apple đã mua, chọn giao dịch Nutree và gửi yêu cầu hoàn tiền.',
          `Nếu cần hỗ trợ kích hoạt hoặc thiếu quyền truy cập sau thanh toán App Store, gửi ${LEGAL_COMPANY.email} kèm email tài khoản Nutree và biên nhận hoặc mã giao dịch Apple.`,
        ],
      },
      {
        title: 'Xóa tài khoản và hủy gói là hai việc khác nhau',
        body: [
          'Hủy gói = dừng các lần tính phí web tương lai qua Paddle hoặc các lần tính phí trong ứng dụng iOS qua Apple bằng các bước nêu trên.',
          'Xóa tài khoản Nutree = xóa hồ sơ và dữ liệu liên quan theo Chính sách bảo mật (trong app hoặc qua hỗ trợ).',
          'Đây là hai thao tác riêng biệt. Nếu xóa tài khoản nhưng vẫn để gói hoạt động, đơn vị thanh toán có thể tiếp tục gia hạn cho đến khi bạn hủy gói.',
        ],
      },
      {
        title: 'Liên hệ và khiếu nại',
        body: [
          `Hỗ trợ: ${LEGAL_COMPANY.email}. Website: ${LEGAL_COMPANY.websiteDisplay}.`,
          'Khiếu nại chính thức: xem [Chính sách khiếu nại](/complaints).',
        ],
      },
    ],
  },
};
