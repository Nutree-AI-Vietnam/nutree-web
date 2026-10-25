import type { BlogLocale } from './blog-locales';

export interface BlogCategory {
  /** Shared key that pairs a category with its counterpart in the other language. */
  id: string;
  /** URL segment and frontmatter value in this category's language. */
  slug: string;
  label: string;
  description: string;
}

/**
 * Blog categories per language. A post's `category` frontmatter must be one of its language's
 * slugs, and each slug becomes a page at /blog/chu-de/<slug> (Vietnamese) or /en/blog/topic/<slug>
 * (English). They mirror the topic areas of the daily content routine.
 */
export const BLOG_CATEGORIES: Record<BlogLocale, readonly BlogCategory[]> = {
  vi: [
    {
      id: 'calo-mon-viet',
      slug: 'calo-mon-viet',
      label: 'Calo món Việt',
      description:
        'Một tô phở, ổ bánh mì hay đĩa cơm tấm có bao nhiêu calo? Bảng calo và dinh dưỡng của các món ăn Việt quen thuộc.',
    },
    {
      id: 'giam-can-tang-co',
      slug: 'giam-can-tang-co',
      label: 'Giảm cân & tăng cơ',
      description:
        'Thâm hụt calo, giảm mỡ, tăng cơ và giữ cân bền vững, giải thích bằng số liệu thay vì mẹo truyền miệng.',
    },
    {
      id: 'dinh-duong',
      slug: 'dinh-duong',
      label: 'Dinh dưỡng & đếm calo',
      description:
        'Kiến thức nền về calo, macro, TDEE và cách theo dõi bữa ăn hằng ngày cho người mới bắt đầu.',
    },
    {
      id: 'thuc-don',
      slug: 'thuc-don',
      label: 'Thực đơn & ăn lành mạnh',
      description: 'Thực đơn mẫu, bữa sáng giàu protein, meal prep và mẹo ăn lành mạnh với món Việt.',
    },
    {
      id: 'ung-dung-ai',
      slug: 'ung-dung-ai',
      label: 'App & công nghệ AI',
      description:
        'Ứng dụng đếm calo, chụp ảnh món ăn bằng AI và cách công nghệ giúp theo dõi dinh dưỡng dễ hơn.',
    },
  ],
  en: [
    {
      id: 'calo-mon-viet',
      slug: 'vietnamese-food-calories',
      label: 'Vietnamese food calories',
      description:
        'How many calories are in a bowl of pho, a bánh mì or a plate of cơm tấm? Calories and nutrition of everyday Vietnamese dishes.',
    },
    {
      id: 'giam-can-tang-co',
      slug: 'weight-loss-muscle-gain',
      label: 'Weight loss & muscle gain',
      description:
        'Calorie deficits, fat loss, muscle gain and keeping weight off, explained with numbers instead of word-of-mouth tips.',
    },
    {
      id: 'dinh-duong',
      slug: 'nutrition-basics',
      label: 'Nutrition & calorie counting',
      description: 'The basics of calories, macros and TDEE, and how to track your meals day to day.',
    },
    {
      id: 'thuc-don',
      slug: 'meal-plans',
      label: 'Meal plans & healthy eating',
      description: 'Sample meal plans, high-protein breakfasts, meal prep and healthy swaps with Vietnamese food.',
    },
    {
      id: 'ung-dung-ai',
      slug: 'ai-calorie-tracking',
      label: 'Apps & AI',
      description:
        'Calorie-counting apps, AI food recognition from photos, and how technology makes tracking nutrition easier.',
    },
  ],
};

export function getCategory(locale: BlogLocale, slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES[locale].find((category) => category.slug === slug);
}

/** The same topic in another language, matched by `id`. */
export function getCategoryById(locale: BlogLocale, id: string): BlogCategory | undefined {
  return BLOG_CATEGORIES[locale].find((category) => category.id === id);
}
