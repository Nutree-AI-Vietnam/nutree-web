export type Locale = 'en' | 'vi';

/** Map nav link href to translated label */
export function getNavLabel(href: string, nav: { howItWorks: string; features: string; download: string }): string {
  if (href === '#how-it-works') return nav.howItWorks;
  if (href === '#features') return nav.features;
  if (href === '#download') return nav.download;
  return '';
}

interface TranslationStrings {
  nav: { howItWorks: string; features: string; download: string };
  hero: {
    badge: string;
    headlines: string[];
    subheadline: string;
    downloadFree: string;
    tagline?: string;
    scroll: string;
    trustBadges: { rating: string; freeTrial: string; languages: string };
  };
  socialProof: {
    mealsTracked: string;
    rating: string;
    accuracy: string;
    languages: string;
  };
  howItWorks: {
    title: string;
    steps: Array<{ title: string; description: string }>;
  };
  features: {
    title: string;
    swipeHint: string;
    items: Array<{ id: string; title: string; description: string }>;
  };
  testimonials: {
    title: string;
    items: Array<{
      id: string;
      quote: string;
      author: string;
      role: string;
      achievement?: string;
    }>;
  };
  finalCta: {
    badge: string;
    headline: string;
    subtext: string;
    trustMessage: string;
    downloadOnThe: string;
    appStore: string;
    stats: { daysFree: string; languages: string; aiPowered: string; rating: string };
  };
  footer: {
    quickLinks: string;
    getInTouch: string;
    contactPrompt: string;
    contactSupport: string;
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
  };
}

export const translations: Record<Locale, TranslationStrings> = {
  en: {
    nav: {
      howItWorks: 'How it works',
      features: 'Features',
      download: 'Download',
    },
    hero: {
      badge: 'AI Nutrition Assistant',
      headlines: ['IDEAS.', 'TRACK.', 'THRIVE.'],
      subheadline:
        'Not another calorie counter. Nutree adapts your daily targets, plans your meals, and tracks every macro — automatically.',
      downloadFree: 'Download Free',
      scroll: 'Scroll',
      trustBadges: {
        rating: '4.9 Rating',
        freeTrial: '3-Day Free Trial',
        languages: '7 Languages',
      },
    },
    socialProof: {
      mealsTracked: 'Meals Tracked',
      rating: 'App Store Rating',
      accuracy: 'AI Accuracy',
      languages: 'Languages Supported',
    },
    howItWorks: {
      title: 'How {Nutree} works',
      steps: [
        {
          title: 'Log',
          description: 'Snap a photo, scan a barcode, or describe your meal in plain text',
        },
        {
          title: 'Adapt',
          description: 'AI breaks down macros and rebalances your weekly budget automatically',
        },
        {
          title: 'Achieve',
          description: 'Cut, bulk, or recomp — hit your goals without guilt',
        },
      ],
    },
    features: {
      title: 'What does {Nutree} include?',
      swipeHint: 'Swipe to browse features',
      items: [
        {
          id: 'ai-scanning',
          title: 'Effortless Food Logging',
          description:
            'Snap a photo, scan a barcode, or type what you ate. AI does the rest.',
        },
        {
          id: 'meal-suggestions',
          title: 'Daily Meal Guidance',
          description:
            'Personalized meals with exact portions and step-by-step recipes tailored to your goals.',
        },
        {
          id: 'dashboard',
          title: 'No Guilt. Ever.',
          description:
            "Cheat day? Nutree rebalances your weekly budget and adjusts tomorrow's target automatically.",
        },
        {
          id: 'edit',
          title: 'Science-Based Goals',
          description:
            'Cut, bulk, or recomp — weight-based macros (g/kg) with TDEE personalized to your body.',
        },
        {
          id: 'languages',
          title: '7 Languages',
          description:
            'EN, VI, ES, FR, DE, JA, ZH — with dark/light themes and metric/imperial support.',
        },
      ],
    },
    testimonials: {
      title: 'Why choose {Nutree}?',
      items: [
        {
          id: '1',
          quote:
            'Nutree completely changed how I track my food. The AI is incredibly accurate and saves me so much time every day. I finally hit my protein goals consistently!',
          author: 'Sarah M.',
          role: 'Fitness Enthusiast',
          achievement: 'Lost 15 lbs in 3 months',
        },
        {
          id: '2',
          quote:
            'As a busy professional, I never had time to manually log meals. Now I just snap a photo and I am done. The meal planning feature is a game changer for my weekly prep.',
          author: 'David K.',
          role: 'Software Engineer',
          achievement: 'Gained 10 lbs muscle',
        },
        {
          id: '3',
          quote:
            'I have tried every nutrition app out there. Nutree is by far the most accurate and easiest to use. The Vietnamese language support is perfect for my family.',
          author: 'Linh T.',
          role: 'Working Mom',
          achievement: 'Whole family tracking',
        },
        {
          id: '4',
          quote:
            'The AI meal suggestions are spot on. It learned my preferences quickly and now suggests meals I actually want to eat. Down 20 lbs and counting!',
          author: 'Marcus J.',
          role: 'Personal Trainer',
          achievement: 'Recommends to clients',
        },
      ],
    },
    finalCta: {
      badge: 'Start Your Transformation',
      headline: "Life happens. Cheat days happen. Nutree makes sure they don't matter.",
      downloadOnThe: 'Download on the',
      appStore: 'App Store',
      subtext:
        'Start your 3-day free trial. Your AI Nutrition Assistant adapts, so you never have to start over.',
      trustMessage: '3-Day Free Trial',
      stats: {
        daysFree: 'Days Free',
        languages: 'Languages',
        aiPowered: 'Powered',
        rating: 'Rating',
      },
    },
    footer: {
      quickLinks: 'Quick Links',
      getInTouch: 'Get in Touch',
      contactPrompt:
        "Have questions or feedback? We'd love to hear from you.",
      contactSupport: 'Contact Support',
      copyright: 'Nutree. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
    },
  },
  vi: {
    nav: {
      howItWorks: 'Cách dùng',
      features: 'Tính năng',
      download: 'Tải app',
    },
    hero: {
      badge: 'Trợ lý dinh dưỡng AI',
      headlines: ['GỢI Ý.', 'THEO DÕI.', 'ĐẠT GOAL.'],
      subheadline:
        'Không phải app đếm calo bình thường. Nutree tự điều chỉnh mục tiêu mỗi ngày, gợi ý bữa ăn và track macro giúp bạn — tự động hoàn toàn.',
      downloadFree: 'Tải miễn phí',
      scroll: 'Kéo xuống',
      tagline: 'Tăng Cơ Giảm Mỡ',
      trustBadges: {
        rating: '4.9 sao',
        freeTrial: 'Dùng thử 3 ngày',
        languages: '7 ngôn ngữ',
      },
    },
    socialProof: {
      mealsTracked: 'Bữa ăn đã track',
      rating: 'Đánh giá App Store',
      accuracy: 'Độ chính xác AI',
      languages: 'Ngôn ngữ hỗ trợ',
    },
    howItWorks: {
      title: '{Nutree} dùng thế nào',
      steps: [
        {
          title: 'Chụp',
          description: 'Chụp ảnh, scan mã vạch, hoặc gõ tên món — tuỳ bạn',
        },
        {
          title: 'Tự động',
          description: 'AI tính macro, cân bằng lại ngân sách tuần cho bạn luôn',
        },
        {
          title: 'Đạt goal',
          description: 'Giảm mỡ, tăng cơ hay recomp — cứ ăn, Nutree lo',
        },
      ],
    },
    features: {
      title: '{Nutree} có gì?',
      swipeHint: 'Vuốt để xem thêm',
      items: [
        {
          id: 'ai-scanning',
          title: 'Ghi bữa ăn siêu nhanh',
          description:
            'Chụp ảnh, scan mã vạch hoặc gõ tên món. AI lo phần còn lại.',
        },
        {
          id: 'meal-suggestions',
          title: 'Gợi ý bữa ăn mỗi ngày',
          description:
            'Món ăn phù hợp mục tiêu, khẩu phần cụ thể và hướng dẫn nấu từng bước.',
        },
        {
          id: 'dashboard',
          title: 'Cheat day? Kệ đi.',
          description:
            'Ăn quá? Nutree tự cân bằng ngân sách tuần và chỉnh mục tiêu ngày mai.',
        },
        {
          id: 'edit',
          title: 'Mục tiêu theo khoa học',
          description:
            'Cut, bulk hay recomp — macro theo cân nặng (g/kg), TDEE riêng cho cơ thể bạn.',
        },
        {
          id: 'languages',
          title: '7 ngôn ngữ',
          description:
            'EN, VI, ES, FR, DE, JA, ZH — giao diện tối/sáng, đơn vị tùy chọn.',
        },
      ],
    },
    testimonials: {
      title: 'Sao mọi người chọn {Nutree}?',
      items: [
        {
          id: '1',
          quote:
            'Nutree thay đổi hoàn toàn cách mình track đồ ăn. AI chính xác cực kỳ, tiết kiệm bao nhiêu thời gian. Giờ mình hit protein target đều đều!',
          author: 'Sarah M.',
          role: 'Gymer',
          achievement: 'Giảm 7kg trong 3 tháng',
        },
        {
          id: '2',
          quote:
            'Bận rộn nên trước giờ lười ghi bữa ăn lắm. Giờ chỉ cần chụp ảnh là xong. Tính năng gợi ý món ăn cứu mình mỗi tuần meal prep.',
          author: 'David K.',
          role: 'Dân IT',
          achievement: 'Tăng 5kg cơ',
        },
        {
          id: '3',
          quote:
            'Thử đủ app dinh dưỡng rồi. Nutree chính xác nhất mà dùng lại dễ nhất. Có tiếng Việt nên cả nhà mình xài chung luôn.',
          author: 'Linh T.',
          role: 'Mẹ bỉm sữa',
          achievement: 'Cả nhà cùng dùng',
        },
        {
          id: '4',
          quote:
            'Gợi ý bữa ăn chuẩn xỉu. Nó học sở thích mình nhanh lắm, toàn gợi ý mấy món mình thích ăn thiệt. Giảm 9kg rồi nè!',
          author: 'Marcus J.',
          role: 'PT cá nhân',
          achievement: 'Recommend cho học viên',
        },
      ],
    },
    finalCta: {
      badge: 'Bắt đầu ngay',
      headline: 'Cheat day? Bận rộn? Kệ hết. Nutree lo cho bạn.',
      downloadOnThe: 'Tải trên',
      appStore: 'App Store',
      subtext:
        'Dùng thử 3 ngày miễn phí. Nutree tự thích nghi theo bạn, không cần bắt đầu lại từ đầu.',
      trustMessage: 'Dùng thử 3 ngày miễn phí',
      stats: {
        daysFree: 'Ngày free',
        languages: 'Ngôn ngữ',
        aiPowered: 'AI',
        rating: 'Đánh giá',
      },
    },
    footer: {
      quickLinks: 'Liên kết',
      getInTouch: 'Liên hệ',
      contactPrompt:
        'Có thắc mắc hay góp ý gì không? Inbox mình nhé!',
      contactSupport: 'Liên hệ hỗ trợ',
      copyright: 'Nutree. Bảo lưu mọi quyền.',
      privacyPolicy: 'Chính sách bảo mật',
      termsOfService: 'Điều khoản sử dụng',
    },
  },
};
