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

export const paymentPolicyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Payment Policy',
    description: 'How Nutree purchases work on Apple, Google Play, Paddle, and one-time VietQR.',
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
          `Nutree is offered through Apple in-app purchase, Google Play in-app purchase, Paddle web checkout, and a one-time VietQR bank transfer. Provider: ${LEGAL_COMPANY.legalNameEn}. Address: ${LEGAL_COMPANY.addressEn}.`,
        ],
      },
      {
        title: 'Payment method',
        body: [
          'Apple in-app purchase: you pay with the payment method on the Apple account. Apple shows the amount before you confirm.',
          'Google Play in-app purchase: you pay with the payment method on the Google Play account. Google Play shows the amount before you confirm.',
          'Paddle web checkout: Paddle is the merchant of record and shows the amount in its checkout. Nutree does not publish its own refund promise for that checkout. See the [Paddle Buyer Terms](https://www.paddle.com/legal/buyer-terms). This does not waive a consumer right that applicable law does not allow to be waived.',
          'VietQR: you transfer the one-time amount shown at checkout. It does not renew automatically.',
          `${LEGAL_COMPANY.tradeName} does not store full card numbers on this website.`,
        ],
      },
      {
        title: 'Checkout flow',
        body: [
          'Choose the channel you are using. Apple, Google Play, Paddle, and the VietQR screen each show the amount before you confirm. This page does not publish that amount.',
          'Apple may ask for Face ID, Touch ID, or a password. The amount confirmed on that channel is the amount for that transaction.',
          'Access unlocks after a successful verified transaction.',
        ],
      },
      {
        title: 'Activation and restore',
        body: [
          'Paid access usually unlocks after verification. Use Restore when changing devices or if sync is delayed.',
          'If access does not appear, check the network and the status in the channel you paid with, then contact Facebook Messenger or nutreeaidev@gmail.com with your receipt.',
        ],
      },
      {
        title: 'Auto-renewal and cancellation',
        body: [
          'Apple and Google Play plans renew until cancelled in that store. Paddle web checkout renews until cancelled through Paddle. VietQR does not renew automatically.',
          'Deleting the app or a Nutree account does not cancel an Apple, Google Play, or Paddle subscription.',
        ],
      },
      {
        title: 'Failed, duplicate, or unrecognized charges',
        body: [
          'Update Apple payment methods and retry per Apple guidance for failed charges.',
          'For duplicates, check purchase history and contact us with receipts. For unrecognized charges, secure your Apple ID and Family Sharing settings and notify us if your Nutree account may be compromised.',
        ],
      },
      {
        title: 'Contact',
        body: [
          'Payment help: [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com. See also the [Cancellation & Refund policy](/cancellation).',
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách thanh toán',
    description: 'Quy trình thanh toán Nutree qua Apple, Google Play, Paddle và VietQR một lần.',
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
          `Nutree được cung cấp qua mua trong ứng dụng Apple, mua trong ứng dụng Google Play, thanh toán web Paddle, và chuyển khoản VietQR một lần. Đơn vị cung cấp: ${LEGAL_COMPANY.legalName}. Địa chỉ: ${LEGAL_COMPANY.address}.`,
        ],
      },
      {
        title: 'Phương thức thanh toán',
        body: [
          'Mua trong ứng dụng Apple: thanh toán bằng phương thức của Tài khoản Apple. Apple hiển thị số tiền trước khi bạn xác nhận.',
          'Mua trong ứng dụng Google Play: thanh toán bằng phương thức của tài khoản Google Play. Google Play hiển thị số tiền trước khi bạn xác nhận.',
          'Thanh toán web Paddle: Paddle là đơn vị bán hàng (merchant of record) và hiển thị số tiền trong bước thanh toán của Paddle. Nutree không công bố cam kết hoàn tiền riêng cho bước đó. Xem [Điều khoản người mua của Paddle](https://www.paddle.com/legal/buyer-terms). Nội dung này không từ bỏ quyền người tiêu dùng mà pháp luật áp dụng không cho phép từ bỏ.',
          'VietQR: bạn chuyển số tiền một lần được hiển thị lúc thanh toán. Giao dịch không tự động gia hạn.',
          `${LEGAL_COMPANY.tradeName} không lưu toàn bộ số thẻ trên website này.`,
        ],
      },
      {
        title: 'Quy trình thanh toán',
        body: [
          'Chọn kênh bạn đang dùng. Apple, Google Play, Paddle và màn hình VietQR đều hiển thị số tiền trước khi bạn xác nhận. Trang này không niêm yết số tiền đó.',
          'Apple có thể yêu cầu Face ID, Touch ID hoặc mật khẩu. Số tiền bạn xác nhận trên kênh đó là số tiền của giao dịch đó.',
          'Quyền sử dụng được kích hoạt sau khi giao dịch thành công và được xác minh.',
        ],
      },
      {
        title: 'Kích hoạt và khôi phục',
        body: [
          'Quyền trả phí thường được kích hoạt ngay sau khi xác minh. Dùng chức năng Khôi phục khi đổi thiết bị hoặc quyền chưa đồng bộ.',
          'Nếu vẫn không nhận quyền: kiểm tra kết nối và trạng thái trên kênh đã trả tiền, rồi nhắn Facebook Messenger hoặc gửi biên nhận tới nutreeaidev@gmail.com.',
        ],
      },
      {
        title: 'Tự động gia hạn và hủy',
        body: [
          'Gói Apple và Google Play gia hạn cho đến khi hủy trong cửa hàng đó. Thanh toán web Paddle gia hạn cho đến khi hủy qua Paddle. VietQR không tự động gia hạn.',
          'Xóa ứng dụng hoặc tài khoản Nutree không hủy gói Apple, Google Play hoặc Paddle.',
        ],
      },
      {
        title: 'Giao dịch thất bại, trùng lặp hoặc không nhận biết',
        body: [
          'Cập nhật phương thức thanh toán Apple và thử lại theo hướng dẫn của Apple nếu giao dịch thất bại.',
          'Với giao dịch trùng lặp, kiểm tra lịch sử mua hàng và gửi biên nhận. Với giao dịch không nhận biết, bảo vệ Tài khoản Apple, kiểm tra Chia sẻ trong gia đình và thông báo cho chúng tôi nếu tài khoản Nutree có dấu hiệu truy cập trái phép.',
        ],
      },
      {
        title: 'Liên hệ',
        body: [
          'Hỗ trợ thanh toán: [Facebook Messenger](https://m.me/1019820571221637) hoặc nutreeaidev@gmail.com. Xem thêm [Chính sách hủy & hoàn tiền](/cancellation).',
        ],
      },
    ],
  },
};
