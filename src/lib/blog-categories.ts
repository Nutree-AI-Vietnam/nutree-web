/**
 * Blog categories. A post's `category` frontmatter must be one of these slugs, and each slug
 * becomes a page at /blog/chu-de/<slug>. They mirror the topic areas of the daily content routine.
 */
export const BLOG_CATEGORIES = [
  {
    slug: 'calo-mon-viet',
    label: 'Calo món Việt',
    description:
      'Một tô phở, ổ bánh mì hay đĩa cơm tấm có bao nhiêu calo? Bảng calo và dinh dưỡng của các món ăn Việt quen thuộc.',
  },
  {
    slug: 'giam-can-tang-co',
    label: 'Giảm cân & tăng cơ',
    description:
      'Thâm hụt calo, giảm mỡ, tăng cơ và giữ cân bền vững, giải thích bằng số liệu thay vì mẹo truyền miệng.',
  },
  {
    slug: 'dinh-duong',
    label: 'Dinh dưỡng & đếm calo',
    description:
      'Kiến thức nền về calo, macro, TDEE và cách theo dõi bữa ăn hằng ngày cho người mới bắt đầu.',
  },
  {
    slug: 'thuc-don',
    label: 'Thực đơn & ăn lành mạnh',
    description:
      'Thực đơn mẫu, bữa sáng giàu protein, meal prep và mẹo ăn lành mạnh với món Việt.',
  },
  {
    slug: 'ung-dung-ai',
    label: 'App & công nghệ AI',
    description:
      'Ứng dụng đếm calo, chụp ảnh món ăn bằng AI và cách công nghệ giúp theo dõi dinh dưỡng dễ hơn.',
  },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogCategorySlug = BlogCategory['slug'];

export function getCategory(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((category) => category.slug === slug);
}

export function isCategorySlug(value: string): value is BlogCategorySlug {
  return BLOG_CATEGORIES.some((category) => category.slug === value);
}
