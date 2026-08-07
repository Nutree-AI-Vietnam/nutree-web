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

/**
 * Cancellation & refund policy — structure inspired by clear store-based
 * subscription pages (e.g. cancel-through-the-store steps, access until period end).
 * Nutree is Apple App Store first; Android is not a live store channel yet.
 */
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
          `Nutree subscriptions are digital and auto-renewing. At publication, purchases are processed through the Apple App Store. Provider: ${LEGAL_COMPANY.legalNameEn}. Contact: ${LEGAL_COMPANY.email}. Address: ${LEGAL_COMPANY.addressEn}.`,
          'You must cancel through the store where you purchased the subscription. Cancelling stops future renewals. It does not automatically refund the current paid period unless the store approves a refund under its rules or applicable law requires otherwise.',
          'Deleting the Nutree app or deleting your Nutree account does not cancel Apple billing by itself.',
        ],
      },
      {
        title: 'How to cancel on Apple (iOS)',
        body: [
          'Open the Settings app on your iPhone or iPad.',
          'Tap your name at the top, then tap Subscriptions.',
          'Select Nutree, then tap Cancel Subscription (or the equivalent label on your iOS version).',
          'Confirm the cancellation when prompted. Apple will show when your access ends.',
          'If you cannot find the subscription, make sure you are signed in with the same Apple ID used for the purchase, and check Family Sharing if someone else manages subscriptions on the account.',
        ],
      },
      {
        title: 'What happens after you cancel',
        body: [
          'After a successful cancellation, auto-renewal stops. You typically keep paid features until the end of the current billing period that was already paid.',
          'When the period ends, paid access ends unless you resubscribe. Free or limited features (if any) may remain available depending on product design.',
          'You can resubscribe later from the Nutree app using the same or another eligible Apple ID, subject to store and offer rules.',
        ],
      },
      {
        title: 'Refunds',
        body: [
          'For App Store purchases, Apple decides refund requests. Nutree cannot send App Store payments back to your payment method on its own.',
          'Canceling auto-renewal is not the same as requesting a refund for the current period.',
          'To request a refund from Apple, visit reportaproblem.apple.com, sign in with the Apple ID used for the purchase, select the Nutree transaction, and follow Apple’s instructions.',
          `For Nutree support (activation issues, missing access after payment, or help gathering details), email ${LEGAL_COMPANY.email} with your Nutree account email, Apple receipt or transaction ID, date, amount, and a short description. We can help verify entitlement status and point you to the correct store process.`,
          'This policy does not limit non-waivable consumer rights under Vietnamese law.',
        ],
      },
      {
        title: 'Account deletion vs cancellation',
        body: [
          'Cancel subscription = stop future Apple charges (done in Apple Settings).',
          'Delete Nutree account = remove your Nutree profile and related data under the Privacy Policy (done in the app or by support request).',
          'These are separate actions. If you delete your account but leave the Apple subscription active, Apple may still charge renewals until you cancel in Subscriptions.',
        ],
      },
      {
        title: 'Other platforms',
        body: [
          'If Nutree later sells subscriptions on another store (for example Google Play), you must cancel through that store’s subscription management tools using the account that purchased the plan.',
          'Until another store is live, treat Apple App Store steps as the applicable cancellation path for in-app purchases.',
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
          `Gói Nutree là dịch vụ số tự động gia hạn. Tại thời điểm ban hành, giao dịch được xử lý qua Apple App Store. Đơn vị cung cấp: ${LEGAL_COMPANY.legalName}. Liên hệ: ${LEGAL_COMPANY.email}. Địa chỉ: ${LEGAL_COMPANY.address}.`,
          'Bạn phải hủy gói qua cửa hàng nơi đã mua. Hủy nhằm dừng gia hạn tương lai; không tự động hoàn tiền cho chu kỳ đã thanh toán, trừ khi cửa hàng chấp thuận hoàn tiền theo chính sách của họ hoặc pháp luật bắt buộc khác.',
          'Xóa ứng dụng Nutree hoặc xóa tài khoản Nutree không tự động hủy thanh toán Apple.',
        ],
      },
      {
        title: 'Cách hủy trên Apple (iOS)',
        body: [
          'Mở ứng dụng Cài đặt trên iPhone hoặc iPad.',
          'Chạm vào tên của bạn ở phía trên, sau đó chọn Đăng ký (Subscriptions).',
          'Chọn Nutree, rồi chọn Hủy đăng ký (hoặc nhãn tương đương trên phiên bản iOS của bạn).',
          'Xác nhận hủy khi được hỏi. Apple sẽ hiển thị thời điểm quyền truy cập kết thúc.',
          'Nếu không thấy gói, hãy đảm bảo đang đăng nhập đúng Tài khoản Apple đã dùng để mua, và kiểm tra Chia sẻ trong gia đình nếu người khác quản lý đăng ký.',
        ],
      },
      {
        title: 'Sau khi hủy',
        body: [
          'Sau khi hủy thành công, gói không còn tự động gia hạn. Thông thường bạn vẫn dùng được tính năng trả phí đến hết chu kỳ đã thanh toán.',
          'Khi hết chu kỳ, quyền trả phí kết thúc trừ khi bạn đăng ký lại. Một số tính năng miễn phí/hạn chế (nếu có) có thể vẫn dùng được tùy thiết kế sản phẩm.',
          'Bạn có thể đăng ký lại sau trong ứng dụng Nutree, theo điều kiện của cửa hàng và ưu đãi (nếu có).',
        ],
      },
      {
        title: 'Hoàn tiền',
        body: [
          'Đối với giao dịch App Store, Apple quyết định yêu cầu hoàn tiền. Nutree không thể tự chuyển tiền từ hệ thống Apple về phương thức thanh toán của bạn.',
          'Hủy gia hạn không đồng nghĩa với yêu cầu hoàn tiền cho chu kỳ hiện tại.',
          'Để yêu cầu hoàn tiền từ Apple: truy cập reportaproblem.apple.com, đăng nhập Tài khoản Apple đã mua, chọn giao dịch Nutree và làm theo hướng dẫn của Apple.',
          `Hỗ trợ Nutree (không kích hoạt sau thanh toán, thiếu quyền truy cập, hoặc cần trợ giúp): gửi ${LEGAL_COMPANY.email} kèm email tài khoản Nutree, biên nhận/mã giao dịch Apple, ngày, số tiền và mô tả ngắn. Chúng tôi có thể đối soát quyền và hướng dẫn đúng quy trình cửa hàng.`,
          'Chính sách này không hạn chế quyền bắt buộc của người tiêu dùng theo pháp luật Việt Nam.',
        ],
      },
      {
        title: 'Xóa tài khoản và hủy gói là hai việc khác nhau',
        body: [
          'Hủy gói = dừng các lần tính phí Apple trong tương lai (thao tác trong Cài đặt Apple).',
          'Xóa tài khoản Nutree = xóa hồ sơ và dữ liệu liên quan theo Chính sách bảo mật (trong app hoặc qua hỗ trợ).',
          'Nếu bạn xóa tài khoản nhưng vẫn để đăng ký Apple hoạt động, Apple có thể tiếp tục gia hạn cho đến khi bạn hủy trong mục Đăng ký.',
        ],
      },
      {
        title: 'Nền tảng khác',
        body: [
          'Nếu sau này Nutree bán gói trên cửa hàng khác (ví dụ Google Play), bạn phải hủy qua công cụ quản lý đăng ký của cửa hàng đó với tài khoản đã mua.',
          'Khi chưa có cửa hàng khác, các bước Apple App Store là đường hủy áp dụng cho mua hàng trong ứng dụng.',
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
