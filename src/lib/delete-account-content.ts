import { SITE_CONFIG } from './constants';
import type { Locale } from './translations';

export const DELETE_ACCOUNT_PATH = { vi: '/delete-account', en: '/en/delete-account' } as const;

export const DELETE_ACCOUNT_LANGUAGES = {
  vi: DELETE_ACCOUNT_PATH.vi,
  en: DELETE_ACCOUNT_PATH.en,
  'x-default': DELETE_ACCOUNT_PATH.vi,
} as const;

interface DeleteAccountCopy {
  title: string;
  description: string;
  heading: string;
  limitation: string;
  stepsTitle: string;
  steps: string;
  subscriptionTitle: string;
  subscription: string;
  photos: string;
  contactTitle: string;
  contact: string;
  messengerLabel: string;
  cancellationLabel: string;
  cancellationHref: string;
  faqLabel: string;
  faqHref: string;
}

/**
 * Public explanation only. There is no deletion endpoint on this website.
 * Store reviewers that require a web page which itself submits a deletion request
 * are not satisfied by this guidance.
 */
export const deleteAccountContent: Record<Locale, DeleteAccountCopy> & {
  supportEmail: string;
  messengerUrl: string;
} = {
  supportEmail: SITE_CONFIG.supportEmail,
  messengerUrl: SITE_CONFIG.social.facebookMessenger,
  en: {
    title: 'Delete your Nutree account',
    description:
      'How to delete a Nutree account in the app, what this website does not do, and the fact that deletion does not cancel a store subscription.',
    heading: 'Delete your Nutree account',
    limitation:
      'This page explains the existing in-app deletion control and how to contact Nutree. It does not send a deletion request, it does not call a deletion endpoint, and it does not promise that data will be erased by a certain date. Guidance alone does not meet a store rule that requires a web page where the person can actually request account and data deletion.',
    stepsTitle: 'In the Nutree app',
    steps:
      'Open Settings, then Account Management, then Delete Account. That control inside the app is the deletion path Nutree publishes today.',
    subscriptionTitle: 'Subscriptions',
    subscription:
      'Deleting the Nutree account does not cancel a subscription charged by the Apple App Store, Google Play, or another store. Cancel that subscription with the store that charged you. Published cancellation steps are on the cancellation page.',
    photos:
      'Meal photos are stored for meal history. This page does not state a date by which those photos or other account data are erased.',
    contactTitle: 'Ask for help',
    contact:
      'This website cannot delete the account for you. You can email the published support address or message the published Facebook Messenger chat and ask for help. A reply is not a promise that data has been erased.',
    messengerLabel: 'Facebook Messenger',
    cancellationLabel: 'Cancellation',
    cancellationHref: '/en/cancellation',
    faqLabel: 'FAQ',
    faqHref: '/en/faq',
  },
  vi: {
    title: 'Xóa tài khoản Nutree',
    description:
      'Cách xóa tài khoản Nutree trong app, việc website này không làm, và việc xóa tài khoản không hủy gói đã mua trên cửa hàng.',
    heading: 'Xóa tài khoản Nutree',
    limitation:
      'Trang này giải thích thao tác xóa trong app và cách liên hệ Nutree. Trang không gửi yêu cầu xóa, không gọi endpoint xóa, và không hứa dữ liệu sẽ bị xóa trước một ngày nhất định. Chỉ hướng dẫn thì chưa đáp ứng quy tắc cửa hàng yêu cầu một trang web nơi người dùng thực sự gửi yêu cầu xóa tài khoản và dữ liệu.',
    stepsTitle: 'Trong ứng dụng Nutree',
    steps:
      'Mở Cài đặt, rồi Quản lý tài khoản, rồi Xóa tài khoản. Thao tác trong app là đường xóa tài khoản Nutree đang công bố.',
    subscriptionTitle: 'Gói đăng ký',
    subscription:
      'Xóa tài khoản Nutree không hủy gói đã thanh toán qua Apple App Store, Google Play hoặc cửa hàng khác. Hãy hủy gói với cửa hàng đã tính phí. Các bước hủy đã công bố nằm ở trang hủy gói.',
    photos:
      'Ảnh bữa ăn được lưu cho lịch sử bữa ăn. Trang này không nêu ngày mà ảnh hoặc dữ liệu tài khoản khác sẽ bị xóa.',
    contactTitle: 'Nhờ hỗ trợ',
    contact:
      'Website này không xóa tài khoản thay bạn. Bạn có thể gửi email tới địa chỉ hỗ trợ đã công bố hoặc nhắn Facebook Messenger đã công bố để nhờ hỗ trợ. Việc được trả lời không có nghĩa là dữ liệu đã bị xóa.',
    messengerLabel: 'Facebook Messenger',
    cancellationLabel: 'Hủy gói',
    cancellationHref: '/cancellation',
    faqLabel: 'Câu hỏi thường gặp',
    faqHref: '/faq',
  },
};
