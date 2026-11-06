import { SITE_CONFIG } from './constants';

export const DELETE_ACCOUNT_PATH = '/delete-account';

/**
 * Public explanation only. There is no deletion endpoint on this website.
 * Store reviewers that require a web page which itself submits a deletion request
 * are not satisfied by this guidance.
 */
export const deleteAccountContent = {
  title: 'Delete your Nutree account',
  description:
    'How to delete a Nutree account in the app, what this website does not do, and the fact that deletion does not cancel a store subscription.',
  limitation:
    'This page explains the existing in-app deletion control and how to contact Nutree. It does not send a deletion request, it does not call a deletion endpoint, and it does not promise that data will be erased by a certain date. Guidance alone does not meet a store rule that requires a web page where the person can actually request account and data deletion.',
  en: {
    heading: 'Delete your Nutree account',
    stepsTitle: 'In the Nutree app',
    steps:
      'Open Settings, then Account Management, then Delete Account. That control inside the app is the deletion path Nutree publishes today.',
    subscription:
      'Deleting the Nutree account does not cancel a subscription charged by the Apple App Store, Google Play, or another store. Cancel that subscription with the store that charged you. Published cancellation steps are on the cancellation page.',
    photos:
      'Meal photos are stored for meal history. This page does not state a date by which those photos or other account data are erased.',
    contactTitle: 'Ask for help',
    contact:
      'This website cannot delete the account for you. You can email the published support address or message the published Facebook Messenger chat and ask for help. A reply is not a promise that data has been erased.',
  },
  vi: {
    heading: 'Xóa tài khoản Nutree',
    stepsTitle: 'Trong ứng dụng Nutree',
    steps:
      'Mở Cài đặt, rồi Quản lý tài khoản, rồi Xóa tài khoản. Thao tác trong app là đường xóa tài khoản Nutree đang công bố.',
    subscription:
      'Xóa tài khoản Nutree không hủy gói đã thanh toán qua Apple App Store, Google Play hoặc cửa hàng khác. Hãy hủy gói với cửa hàng đã tính phí. Các bước hủy đã công bố nằm ở trang hủy gói.',
    photos:
      'Ảnh bữa ăn được lưu cho lịch sử bữa ăn. Trang này không nêu ngày mà ảnh hoặc dữ liệu tài khoản khác sẽ bị xóa.',
    contactTitle: 'Nhờ hỗ trợ',
    contact:
      'Website này không xóa tài khoản thay bạn. Bạn có thể gửi email tới địa chỉ hỗ trợ đã công bố hoặc nhắn Facebook Messenger đã công bố để nhờ hỗ trợ. Việc được trả lời không có nghĩa là dữ liệu đã bị xóa.',
  },
  supportEmail: SITE_CONFIG.supportEmail,
  messengerUrl: SITE_CONFIG.social.facebookMessenger,
} as const;
