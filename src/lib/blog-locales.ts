/**
 * The blog's two languages. Like vinamilk.com.vn/blogs and /en/blogs, each language has its own URL
 * tree, categories, feed and sitemap entries, and a post links to its translation with hreflang.
 * Vietnamese keeps the original /blog URLs, so nothing that already ranks moves.
 */
export type BlogLocale = 'vi' | 'en';

export const BLOG_LOCALE_LIST: readonly BlogLocale[] = ['vi', 'en'];

/** Language that search engines get when no listed language matches (hreflang x-default). */
export const DEFAULT_BLOG_LOCALE: BlogLocale = 'vi';

export interface BlogLocaleConfig {
  locale: BlogLocale;
  /** URL of the blog index; posts live at <path>/<slug>. */
  path: string;
  /** Folder of this language's .mdx files, relative to the repo root. */
  contentDir: string;
  /** Route segment for category pages: <path>/<categorySegment>/<category>. */
  categorySegment: string;
  /** Route segment for numbered listing pages: <path>/<pageSegment>/<n>. */
  pageSegment: string;
  feedPath: string;
  name: string;
  /** Search title of the blog index. */
  indexTitle: string;
  description: string;
  /** BCP 47 tag for lang attributes, structured data and the feed. */
  htmlLang: string;
  ogLocale: string;
  /** Locale for Intl date formatting. */
  dateLocale: string;
  /** Language name in its own language, for the language switch. */
  nativeName: string;
  text: {
    home: string;
    blog: string;
    eyebrow: string;
    topic: string;
    allTopics: string;
    pageWord: string;
    page: (page: number) => string;
    emptyListing: string;
    pagination: string;
    newer: string;
    older: string;
    byline: string;
    published: string;
    updated: string;
    minutesRead: (minutes: number) => string;
    draftBadge: string;
    tags: string;
    toc: string;
    related: string;
    disclaimerLabel: string;
    disclaimer: string;
    disclaimerLink: string;
    opensInNewTab: string;
    footnotes: string;
    footnoteBack: string;
    callout: { tip: string; note: string; warning: string };
    appCtaTitle: string;
    appCtaBody: string;
    appCtaButton: string;
    /** Link to a post's translation, written in the language it leads to. */
    readIn: string;
    /** Points readers of the smaller English blog to the Vietnamese one. */
    otherBlogNote?: { text: string; link: string };
  };
}

export const BLOG_LOCALES: Record<BlogLocale, BlogLocaleConfig> = {
  vi: {
    locale: 'vi',
    path: '/blog',
    contentDir: 'content/blog',
    categorySegment: 'chu-de',
    pageSegment: 'trang',
    feedPath: '/blog/feed.xml',
    name: 'Blog dinh dưỡng Nutree',
    indexTitle: 'Blog dinh dưỡng Nutree: calo món Việt, giảm cân & thực đơn',
    description:
      'Kiến thức dinh dưỡng dễ áp dụng: calo món Việt, giảm cân và tăng cơ, macro, TDEE và thực đơn lành mạnh, kèm nguồn tham khảo.',
    htmlLang: 'vi',
    ogLocale: 'vi_VN',
    dateLocale: 'vi-VN',
    nativeName: 'Tiếng Việt',
    text: {
      home: 'Trang chủ',
      blog: 'Blog',
      eyebrow: 'Kiến thức dinh dưỡng',
      topic: 'Chủ đề',
      allTopics: 'Tất cả',
      pageWord: 'Trang',
      page: (page) => `Trang ${page}`,
      emptyListing: 'Bài viết đầu tiên sắp lên sóng. Bạn quay lại sau nhé!',
      pagination: 'Phân trang',
      newer: 'Mới hơn',
      older: 'Cũ hơn',
      byline: 'Đội ngũ Nutree',
      published: 'Đăng',
      updated: 'Cập nhật',
      minutesRead: (minutes) => `${minutes} phút đọc`,
      draftBadge: 'Bản nháp: chỉ hiện khi chạy dev, không lên production',
      tags: 'Từ khoá',
      toc: 'Nội dung bài viết',
      related: 'Bài viết liên quan',
      disclaimerLabel: 'Lưu ý về nội dung sức khoẻ',
      disclaimer:
        'Bài viết chỉ nhằm cung cấp thông tin tham khảo, không thay thế chẩn đoán hay tư vấn của bác sĩ hoặc chuyên gia dinh dưỡng. Nếu bạn đang mang thai, cho con bú, có bệnh lý nền hoặc đang dùng thuốc, hãy hỏi ý kiến chuyên gia trước khi thay đổi chế độ ăn. Xem cách Nutree chọn',
      disclaimerLink: 'nguồn khoa học',
      opensInNewTab: '(mở tab mới)',
      footnotes: 'Chú thích',
      footnoteBack: 'Quay lại nội dung',
      callout: { tip: 'Mẹo', note: 'Lưu ý', warning: 'Cảnh báo' },
      appCtaTitle: 'Muốn biết bữa ăn của bạn có bao nhiêu calo?',
      appCtaBody:
        'Chụp ảnh, scan mã vạch hoặc gõ tên món: Nutree tính calo và macro cho bạn, rồi tự điều chỉnh mục tiêu theo tiến độ.',
      appCtaButton: 'Tạo kế hoạch cho tôi',
      readIn: 'Read this article in English',
    },
  },
  en: {
    locale: 'en',
    path: '/en/blog',
    contentDir: 'content/blog/en',
    categorySegment: 'topic',
    pageSegment: 'page',
    feedPath: '/en/blog/feed.xml',
    name: 'Nutree Nutrition Blog',
    indexTitle: 'Nutree Nutrition Blog: Vietnamese food calories, weight loss & meal plans',
    description:
      'Practical nutrition you can use: calories in Vietnamese dishes, weight loss and muscle gain, macros, TDEE and healthy meal plans, with sources.',
    htmlLang: 'en',
    ogLocale: 'en_US',
    dateLocale: 'en-US',
    nativeName: 'English',
    text: {
      home: 'Home',
      blog: 'Blog',
      eyebrow: 'Nutrition know-how',
      topic: 'Topic',
      allTopics: 'All',
      pageWord: 'Page',
      page: (page) => `Page ${page}`,
      emptyListing: 'Our first English article is on its way. Check back soon!',
      pagination: 'Pagination',
      newer: 'Newer',
      older: 'Older',
      byline: 'The Nutree team',
      published: 'Published',
      updated: 'Updated',
      minutesRead: (minutes) => `${minutes} min read`,
      draftBadge: 'Draft: shows in dev only, never in production',
      tags: 'Tags',
      toc: 'In this article',
      related: 'Related articles',
      disclaimerLabel: 'About health content',
      disclaimer:
        'This article is for general information only and does not replace diagnosis or advice from a doctor or dietitian. If you are pregnant, breastfeeding, have a medical condition or take medication, ask a professional before changing your diet. See how Nutree picks its',
      disclaimerLink: 'scientific sources',
      opensInNewTab: '(opens in a new tab)',
      footnotes: 'Footnotes',
      footnoteBack: 'Back to content',
      callout: { tip: 'Tip', note: 'Note', warning: 'Warning' },
      appCtaTitle: 'Want to know how many calories are in your meal?',
      appCtaBody:
        'Snap a photo, scan a barcode or type the dish: Nutree estimates the calories and macros for you, then adjusts your targets as you progress.',
      appCtaButton: 'Build my plan',
      readIn: 'Đọc bài này bằng tiếng Việt',
      otherBlogNote: {
        text: 'More articles are available in Vietnamese.',
        link: 'Read the Vietnamese blog',
      },
    },
  },
};

export function otherLocale(locale: BlogLocale): BlogLocale {
  return locale === 'vi' ? 'en' : 'vi';
}
