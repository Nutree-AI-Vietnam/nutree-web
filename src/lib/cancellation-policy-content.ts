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
          `Nutree sells through four channels: Apple in-app purchase, Google Play in-app purchase, Paddle web checkout, and a one-time VietQR bank transfer. Provider: ${LEGAL_COMPANY.legalNameEn}. Address: ${LEGAL_COMPANY.addressEn}. Cancellation help: Facebook Messenger or nutreeaidev@gmail.com.`,
          'Apple, Google Play, and Paddle purchases can renew until cancelled in that channel. VietQR is one-time and does not renew automatically.',
          'Nutree does not publish its own refund promise for Paddle checkout. Paddle is the merchant of record. See the [Paddle Buyer Terms](https://www.paddle.com/legal/buyer-terms). This does not waive a consumer right that applicable law does not allow to be waived.',
        ],
      },
      {
        title: 'How to cancel',
        body: [
          'Nutree web checkout (Paddle): use the “Manage subscription” link in your Paddle transaction email or visit [paddle.net](https://paddle.net).',
          'Apple in-app purchase: open Settings on your iPhone or iPad, tap your name, then tap Subscriptions. Select Nutree, tap Cancel Subscription, and confirm.',
          'Google Play in-app purchase: Google Play → Profile → Payments & subscriptions → Subscriptions → Nutree → Cancel.',
          'VietQR: there is no renewal to cancel. The transfer is one-time.',
          'Deleting the Nutree app or your Nutree account does not cancel an Apple, Google Play, or Paddle subscription.',
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
        title: 'Paddle web checkout',
        body: [
          'Purchases through Nutree’s web checkout are processed by Paddle. Paddle is the merchant of record for those purchases.',
          'Nutree does not publish its own refund promise for that checkout, and this page does not say that those purchases are non-refundable. Whether a refund is available is covered by the [Paddle Buyer Terms](https://www.paddle.com/legal/buyer-terms).',
          'This does not waive a consumer right that applicable law does not allow to be waived.',
          'For help finding a Paddle transaction, use Facebook Messenger or email nutreeaidev@gmail.com with your Nutree account email, transaction ID, date, and amount.',
        ],
      },
      {
        title: 'iOS in-app refunds (Apple App Store)',
        body: [
          'For purchases processed by the Apple App Store, Apple processes refund requests.',
          'Visit [reportaproblem.apple.com](https://reportaproblem.apple.com), sign in with the Apple ID used for the purchase, select the Nutree transaction, and submit the refund request.',
          'For help with activation or missing access after an App Store payment, use Facebook Messenger or email nutreeaidev@gmail.com with your Nutree account email and Apple receipt or transaction ID.',
        ],
      },
      {
        title: 'Account deletion vs cancellation',
        body: [
          'Cancel an Apple, Google Play, or Paddle subscription in that channel, using the steps above. VietQR does not renew, so there is no renewal to cancel.',
          'Delete Nutree account = the in-app account control described on the public deletion page. This policy does not promise a date by which data is erased.',
          'These are separate actions. Deleting the account does not cancel an Apple, Google Play, or Paddle subscription.',
        ],
      },
      {
        title: 'Contact and complaints',
        body: [
          'Cancellation help: [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com.',
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
          `Nutree bán qua bốn kênh: mua trong ứng dụng Apple, mua trong ứng dụng Google Play, thanh toán web Paddle, và chuyển khoản VietQR một lần. Đơn vị cung cấp: ${LEGAL_COMPANY.legalName}. Địa chỉ: ${LEGAL_COMPANY.address}. Hỗ trợ hủy gói: Facebook Messenger hoặc nutreeaidev@gmail.com.`,
          'Giao dịch Apple, Google Play và Paddle có thể gia hạn cho đến khi hủy đúng kênh đó. VietQR là thanh toán một lần và không tự động gia hạn.',
          'Nutree không công bố cam kết hoàn tiền riêng cho thanh toán Paddle. Paddle là đơn vị bán hàng (merchant of record). Xem [Điều khoản người mua của Paddle](https://www.paddle.com/legal/buyer-terms). Nội dung này không từ bỏ quyền người tiêu dùng mà pháp luật áp dụng không cho phép từ bỏ.',
        ],
      },
      {
        title: 'Cách hủy gói',
        body: [
          'Thanh toán web Paddle: dùng liên kết “Manage subscription” trong email giao dịch Paddle hoặc truy cập [paddle.net](https://paddle.net).',
          'Mua trong ứng dụng Apple: mở Cài đặt trên iPhone hoặc iPad, chạm vào tên của bạn, rồi chọn Đăng ký. Chọn Nutree, chọn Hủy đăng ký và xác nhận. Nếu không thấy gói, dùng đúng Tài khoản Apple đã trả tiền, và kiểm tra Chia sẻ trong gia đình nếu người khác quản lý đăng ký.',
          'Mua trong ứng dụng Google Play: Google Play → Ảnh hồ sơ → Thanh toán và gói thuê bao → Gói thuê bao → Nutree → Hủy.',
          'VietQR: không có lần gia hạn để hủy. Chuyển khoản là một lần.',
          'Xóa ứng dụng hoặc tài khoản Nutree không hủy gói Apple, Google Play hoặc Paddle.',
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
        title: 'Thanh toán web Paddle',
        body: [
          'Giao dịch qua thanh toán web của Nutree do Paddle xử lý. Paddle là đơn vị bán hàng (merchant of record) của các giao dịch đó.',
          'Nutree không công bố cam kết hoàn tiền riêng cho thanh toán này, và trang này không nói rằng các giao dịch đó không được hoàn tiền. Việc có hoàn tiền hay không nằm ở [Điều khoản người mua của Paddle](https://www.paddle.com/legal/buyer-terms).',
          'Nội dung này không từ bỏ quyền người tiêu dùng mà pháp luật áp dụng không cho phép từ bỏ.',
          'Nếu cần tìm giao dịch Paddle, dùng Facebook Messenger hoặc gửi nutreeaidev@gmail.com kèm email tài khoản Nutree, mã giao dịch, ngày và số tiền.',
        ],
      },
      {
        title: 'Hoàn tiền trong ứng dụng iOS (Apple App Store)',
        body: [
          'Đối với giao dịch do Apple App Store xử lý, Apple tiếp nhận và xử lý yêu cầu hoàn tiền.',
          'Truy cập [reportaproblem.apple.com](https://reportaproblem.apple.com), đăng nhập Tài khoản Apple đã mua, chọn giao dịch Nutree và gửi yêu cầu hoàn tiền.',
          `Nếu cần hỗ trợ kích hoạt hoặc thiếu quyền truy cập sau thanh toán App Store, nhắn Facebook Messenger hoặc gửi nutreeaidev@gmail.com kèm email tài khoản Nutree và biên nhận hoặc mã giao dịch Apple.`,
        ],
      },
      {
        title: 'Xóa tài khoản và hủy gói là hai việc khác nhau',
        body: [
          'Hủy gói Apple, Google Play hoặc Paddle trên đúng kênh, theo các bước ở trên. VietQR không gia hạn, nên không có lần gia hạn để hủy.',
          'Xóa tài khoản Nutree là thao tác trong app. Chính sách này không hứa một ngày mà dữ liệu sẽ bị xóa.',
          'Đây là hai thao tác riêng biệt. Xóa tài khoản không hủy gói Apple, Google Play hoặc Paddle.',
        ],
      },
      {
        title: 'Liên hệ và khiếu nại',
        body: [
          'Hỗ trợ hủy gói: [Facebook Messenger](https://m.me/1019820571221637) hoặc nutreeaidev@gmail.com.',
          'Khiếu nại chính thức: xem [Chính sách khiếu nại](/complaints).',
        ],
      },
    ],
  },
};
