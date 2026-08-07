import type { Locale } from './translations';
import type { LegalPageContent } from './legal-content';
import { LEGAL_COMPANY } from './legal-company';

const { monthlyVnd, yearlyVnd } = LEGAL_COMPANY.pricing;

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
    description: 'How Nutree in-app purchases work on the Apple App Store.',
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
          `At publication, Nutree iOS purchases are processed through the Apple App Store. Provider: ${LEGAL_COMPANY.legalNameEn}. Contact: ${LEGAL_COMPANY.email}. Address: ${LEGAL_COMPANY.addressEn}.`,
        ],
      },
      {
        title: 'Payment method',
        body: [
          'You pay with the payment method linked to your Apple ID. Apple handles confirmation, charging, payment methods, and receipts.',
          `${LEGAL_COMPANY.tradeName} receives transaction status needed to verify entitlements and does not store full card numbers or Apple ID credentials.`,
        ],
      },
      {
        title: 'Checkout flow',
        body: [
          `Choose a monthly plan (${monthlyVnd} VND) or yearly plan (${yearlyVnd} VND/year), or any active promotional amount shown in the app.`,
          'Review price, period, auto-renewal, promo code (if any), Terms, and Privacy Policy before confirming.',
          'Apple may require Face ID, Touch ID, or password. Access unlocks after a successful verified transaction.',
          'Keep your Apple receipt for support or refund requests.',
        ],
      },
      {
        title: 'Activation and restore',
        body: [
          'Paid access usually unlocks after verification. Use Restore when changing devices or if sync is delayed.',
          `If access does not appear, check network, Apple subscription status, try Restore, then email ${LEGAL_COMPANY.email} with your receipt.`,
        ],
      },
      {
        title: 'Auto-renewal and cancellation',
        body: [
          'Subscriptions renew until cancelled in Apple ID → Subscriptions.',
          'Deleting the app or a Nutree account does not cancel Apple billing. After cancel, access usually continues until the paid period ends.',
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
          `Payment support: ${LEGAL_COMPANY.email}. See also the refund policy at /hoan-tien.`,
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách thanh toán',
    description: 'Quy trình thanh toán gói Nutree qua Apple App Store.',
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
          `Tại thời điểm ban hành, giao dịch trong ứng dụng Nutree trên iOS được thực hiện qua Apple App Store. Đơn vị cung cấp: ${LEGAL_COMPANY.legalName}. Liên hệ: ${LEGAL_COMPANY.email}. Địa chỉ: ${LEGAL_COMPANY.address}.`,
        ],
      },
      {
        title: 'Phương thức thanh toán',
        body: [
          'Thanh toán bằng phương thức liên kết Tài khoản Apple. Apple thực hiện xác nhận, thu tiền, quản lý phương thức và biên nhận.',
          `${LEGAL_COMPANY.tradeName} nhận trạng thái giao dịch để xác minh quyền sử dụng; không lưu toàn bộ số thẻ hoặc thông tin đăng nhập Apple.`,
        ],
      },
      {
        title: 'Quy trình thanh toán',
        body: [
          `Chọn gói tháng (${monthlyVnd} đồng) hoặc gói năm (${yearlyVnd} đồng/năm), hoặc mức ưu đãi đang áp dụng trên ứng dụng.`,
          'Kiểm tra giá, chu kỳ, tự động gia hạn, mã ưu đãi (nếu có), Điều khoản và Chính sách bảo mật trước khi xác nhận.',
          'Apple có thể yêu cầu Face ID, Touch ID hoặc mật khẩu. Quyền sử dụng được kích hoạt sau khi giao dịch thành công và xác minh hợp lệ.',
          'Nên lưu biên nhận Apple để đối soát hoặc yêu cầu hoàn tiền.',
        ],
      },
      {
        title: 'Kích hoạt và khôi phục',
        body: [
          'Quyền trả phí thường được kích hoạt ngay sau khi xác minh. Dùng chức năng Khôi phục khi đổi thiết bị hoặc quyền chưa đồng bộ.',
          `Nếu vẫn không nhận quyền: kiểm tra kết nối, trạng thái đăng ký Apple, thử Khôi phục, rồi gửi biên nhận tới ${LEGAL_COMPANY.email}.`,
        ],
      },
      {
        title: 'Tự động gia hạn và hủy',
        body: [
          'Gói tự động gia hạn đến khi hủy trong phần Đăng ký của Tài khoản Apple.',
          'Xóa ứng dụng hoặc xóa tài khoản Nutree không tự động hủy đăng ký Apple. Sau khi hủy, thông thường vẫn dùng được đến hết chu kỳ đã thanh toán.',
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
          `Hỗ trợ thanh toán: ${LEGAL_COMPANY.email}. Xem thêm chính sách hoàn tiền tại /hoan-tien.`,
        ],
      },
    ],
  },
};
