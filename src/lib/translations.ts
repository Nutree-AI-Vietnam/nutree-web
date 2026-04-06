export type Locale = 'en' | 'vi';

/** Map nav link href to translated label */
export function getNavLabel(href: string, nav: { howItWorks: string; features: string; download: string }): string {
  if (href === '#how-it-works') return nav.howItWorks;
  if (href === '#features') return nav.features;
  if (href === '#download') return nav.download;
  return '';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  title: string;
  items: FaqItem[];
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
    faq: string;
  };
  faq: {
    pageTitle: string;
    pageDescription: string;
    sections: FaqSection[];
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
      faq: 'FAQ',
    },
    faq: {
      pageTitle: 'Frequently Asked Questions',
      pageDescription: 'Find answers to common questions about Nutree.',
      sections: [
        {
          title: 'Getting Started',
          items: [
            {
              question: 'What is Nutree AI?',
              answer: 'Nutree is an AI nutrition assistant that tracks your macros, plans meals, and adapts your daily targets automatically. It is not just a calorie counter — it understands your goals and adjusts your weekly budget so you stay on track even on cheat days.',
            },
            {
              question: 'How do I create an account?',
              answer: 'Download the Nutree app, then sign in with your Google or Apple account. No email or password required.',
            },
            {
              question: 'What languages does Nutree support?',
              answer: 'Nutree supports 7 languages: English, Vietnamese, Spanish, French, German, Japanese, and Chinese.',
            },
          ],
        },
        {
          title: 'Meal Tracking',
          items: [
            {
              question: 'How do I log a meal?',
              answer: 'You can log a meal by taking a photo, scanning a barcode, or describing your meal in plain text. The AI decomposes ingredients and calculates macros automatically.',
            },
            {
              question: 'How accurate is the AI meal scan?',
              answer: 'The AI analyzes each ingredient separately for high accuracy. You can always review and edit the results after scanning.',
            },
            {
              question: 'Can I edit a meal after scanning?',
              answer: 'Yes. Tap any logged meal to edit ingredients, adjust portions, or add missing items.',
            },
            {
              question: "What if the AI doesn't recognize my food?",
              answer: 'Use manual text entry to describe your meal. The AI handles most food descriptions in all 7 supported languages.',
            },
            {
              question: 'How many meals can I scan per day?',
              answer: 'Free plan: 3 AI scans per day. Premium plan: unlimited scans.',
            },
          ],
        },
        {
          title: 'Nutrition & Goals',
          items: [
            {
              question: 'How are my daily targets calculated?',
              answer: 'Daily targets are based on your body metrics, activity level, and goal using TDEE (Total Daily Energy Expenditure) with evidence-based formulas.',
            },
            {
              question: 'What is the weekly budget feature?',
              answer: 'Your weekly nutrition budget rebalances automatically. If you eat more one day, tomorrow\'s target adjusts so you stay on track without guilt.',
            },
            {
              question: 'Can I adjust my nutrition goals?',
              answer: 'Yes. Update your goal (cut, bulk, or recomposition) and body metrics anytime in Settings → My Plan.',
            },
            {
              question: 'How does Nutree handle cheat days?',
              answer: 'Automatically. Your weekly budget absorbs the overshoot and redistributes the difference across your remaining days.',
            },
          ],
        },
        {
          title: 'Meal Suggestions',
          items: [
            {
              question: 'How do AI meal suggestions work?',
              answer: 'Suggestions are generated based on your remaining daily macros, cooking time preference, and available ingredients. Each suggestion includes portions and step-by-step recipes.',
            },
            {
              question: 'Can I get suggestions in my language?',
              answer: 'Yes. Meal names, descriptions, and recipes are generated in your selected app language.',
            },
            {
              question: 'Can I filter by cooking time or ingredients?',
              answer: 'Yes. Set your available cooking time and list ingredients you have on hand before generating suggestions.',
            },
          ],
        },
        {
          title: 'Subscription & Pricing',
          items: [
            {
              question: 'Is Nutree free to use?',
              answer: 'Yes, with limits. The free plan includes 3 AI scans per day. Premium unlocks unlimited scans, meal suggestions, and full features.',
            },
            {
              question: "What's included in the free trial?",
              answer: 'A 3-day free trial with full premium access. Cancel anytime before the trial ends.',
            },
            {
              question: 'How do I cancel my subscription?',
              answer: 'iOS: Settings → Apple ID → Subscriptions → Nutree → Cancel. Android: Play Store → Subscriptions → Nutree → Cancel.',
            },
            {
              question: 'Will I be charged after the trial?',
              answer: 'Only if you do not cancel before the 3-day trial ends. You will receive a reminder before any charges begin.',
            },
            {
              question: 'How do I restore my purchase on a new device?',
              answer: 'Sign in with the same Google or Apple account. Your subscription restores automatically.',
            },
          ],
        },
        {
          title: 'Privacy & Data',
          items: [
            {
              question: 'Is my food data private?',
              answer: 'Yes. Your data is stored securely on our cloud servers and never shared with third parties.',
            },
            {
              question: 'Do you store my meal photos?',
              answer: 'Yes, meal photos are saved to our cloud for your meal history and re-analysis. They are deleted when you delete your account.',
            },
            {
              question: 'How do I delete my account?',
              answer: 'Go to Settings → Account Management → Delete Account. All your data is permanently removed.',
            },
          ],
        },
        {
          title: 'Troubleshooting',
          items: [
            {
              question: "The meal scan isn't working — what should I do?",
              answer: 'Ensure good lighting, hold your phone steady, and keep the full plate in frame. If it still fails, try manual text entry.',
            },
            {
              question: 'My daily targets seem wrong.',
              answer: 'Check your body metrics and goal in Settings → My Plan. Targets update automatically when you make changes.',
            },
            {
              question: 'How do I contact support?',
              answer: 'Email us at nutreeaidev@gmail.com, message us on Facebook Messenger, or follow us on TikTok @nutree.ai.',
            },
          ],
        },
      ],
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
      faq: 'Câu hỏi thường gặp',
    },
    faq: {
      pageTitle: 'Câu hỏi thường gặp',
      pageDescription: 'Giải đáp các câu hỏi phổ biến về Nutree.',
      sections: [
        {
          title: 'Bắt đầu',
          items: [
            {
              question: 'Nutree AI là gì?',
              answer: 'Nutree là trợ lý dinh dưỡng AI giúp theo dõi macro, gợi ý bữa ăn và tự điều chỉnh mục tiêu hằng ngày. Không chỉ đếm calo — Nutree hiểu mục tiêu của bạn và cân bằng lại ngân sách tuần kể cả khi có cheat day.',
            },
            {
              question: 'Làm sao để tạo tài khoản?',
              answer: 'Tải app Nutree, sau đó đăng nhập bằng tài khoản Google hoặc Apple. Không cần email hay mật khẩu.',
            },
            {
              question: 'Nutree hỗ trợ những ngôn ngữ nào?',
              answer: 'Nutree hỗ trợ 7 ngôn ngữ: Tiếng Anh, Tiếng Việt, Tiếng Tây Ban Nha, Tiếng Pháp, Tiếng Đức, Tiếng Nhật và Tiếng Trung.',
            },
          ],
        },
        {
          title: 'Ghi bữa ăn',
          items: [
            {
              question: 'Làm sao để ghi một bữa ăn?',
              answer: 'Bạn có thể chụp ảnh, scan mã vạch, hoặc mô tả bữa ăn bằng văn bản. AI sẽ tự phân tích thành phần và tính macro.',
            },
            {
              question: 'AI scan bữa ăn có chính xác không?',
              answer: 'AI phân tích từng nguyên liệu riêng biệt để đảm bảo độ chính xác. Bạn có thể xem lại và chỉnh sửa kết quả sau khi scan.',
            },
            {
              question: 'Tôi có thể chỉnh sửa bữa ăn sau khi đã scan không?',
              answer: 'Được. Nhấn vào bữa ăn đã ghi để chỉnh sửa nguyên liệu, khẩu phần, hoặc thêm món còn thiếu.',
            },
            {
              question: 'AI không nhận ra món ăn của tôi thì sao?',
              answer: 'Dùng chức năng nhập văn bản thủ công để mô tả bữa ăn. AI xử lý được hầu hết các mô tả thức ăn trong 7 ngôn ngữ được hỗ trợ.',
            },
            {
              question: 'Mỗi ngày tôi có thể scan bao nhiêu bữa?',
              answer: 'Gói miễn phí: 3 lần scan AI mỗi ngày. Gói Premium: không giới hạn.',
            },
          ],
        },
        {
          title: 'Dinh dưỡng & Mục tiêu',
          items: [
            {
              question: 'Mục tiêu hằng ngày của tôi được tính như thế nào?',
              answer: 'Mục tiêu được tính dựa trên chỉ số cơ thể, mức độ hoạt động và mục tiêu của bạn thông qua công thức TDEE (Tổng năng lượng tiêu hao mỗi ngày) theo bằng chứng khoa học.',
            },
            {
              question: 'Tính năng ngân sách tuần là gì?',
              answer: 'Ngân sách dinh dưỡng tuần tự cân bằng lại. Hôm nay ăn nhiều hơn, ngày mai mục tiêu tự điều chỉnh để bạn vẫn đi đúng hướng.',
            },
            {
              question: 'Tôi có thể thay đổi mục tiêu dinh dưỡng không?',
              answer: 'Được. Cập nhật mục tiêu (giảm mỡ, tăng cơ hay recomp) và chỉ số cơ thể bất cứ lúc nào trong Cài đặt → Kế hoạch của tôi.',
            },
            {
              question: 'Nutree xử lý cheat day như thế nào?',
              answer: 'Tự động. Ngân sách tuần sẽ hấp thụ lượng ăn vượt và phân bổ lại cho các ngày còn lại.',
            },
          ],
        },
        {
          title: 'Gợi ý bữa ăn',
          items: [
            {
              question: 'Gợi ý bữa ăn AI hoạt động thế nào?',
              answer: 'Gợi ý được tạo dựa trên macro còn lại trong ngày, thời gian nấu và nguyên liệu bạn có. Mỗi gợi ý bao gồm khẩu phần và hướng dẫn nấu từng bước.',
            },
            {
              question: 'Tôi có thể nhận gợi ý bằng tiếng Việt không?',
              answer: 'Được. Tên món, mô tả và công thức nấu ăn được tạo bằng ngôn ngữ bạn đang dùng trong app.',
            },
            {
              question: 'Có thể lọc theo thời gian nấu hoặc nguyên liệu không?',
              answer: 'Được. Đặt thời gian nấu và liệt kê nguyên liệu bạn có trước khi tạo gợi ý.',
            },
          ],
        },
        {
          title: 'Gói đăng ký & Giá',
          items: [
            {
              question: 'Nutree có miễn phí không?',
              answer: 'Có, nhưng có giới hạn. Gói miễn phí gồm 3 lần scan AI mỗi ngày. Premium mở khóa scan không giới hạn, gợi ý bữa ăn và toàn bộ tính năng.',
            },
            {
              question: 'Dùng thử miễn phí bao gồm gì?',
              answer: 'Dùng thử 3 ngày với toàn bộ tính năng Premium. Hủy bất cứ lúc nào trước khi hết hạn.',
            },
            {
              question: 'Làm sao để hủy gói đăng ký?',
              answer: 'iOS: Cài đặt → Apple ID → Đăng ký → Nutree → Hủy. Android: Play Store → Đăng ký → Nutree → Hủy.',
            },
            {
              question: 'Tôi có bị tính tiền sau khi hết dùng thử không?',
              answer: 'Chỉ khi bạn không hủy trước khi hết 3 ngày dùng thử. Bạn sẽ nhận thông báo nhắc trước khi bị tính phí.',
            },
            {
              question: 'Làm sao khôi phục gói đăng ký trên thiết bị mới?',
              answer: 'Đăng nhập bằng cùng tài khoản Google hoặc Apple. Gói đăng ký sẽ tự động khôi phục.',
            },
          ],
        },
        {
          title: 'Quyền riêng tư & Dữ liệu',
          items: [
            {
              question: 'Dữ liệu bữa ăn của tôi có được bảo mật không?',
              answer: 'Có. Dữ liệu của bạn được lưu trữ an toàn trên máy chủ đám mây và không bao giờ được chia sẻ với bên thứ ba.',
            },
            {
              question: 'Nutree có lưu ảnh bữa ăn của tôi không?',
              answer: 'Có, ảnh bữa ăn được lưu trên đám mây để phục vụ lịch sử và phân tích lại. Ảnh sẽ bị xóa khi bạn xóa tài khoản.',
            },
            {
              question: 'Làm sao để xóa tài khoản?',
              answer: 'Vào Cài đặt → Quản lý tài khoản → Xóa tài khoản. Toàn bộ dữ liệu của bạn sẽ bị xóa vĩnh viễn.',
            },
          ],
        },
        {
          title: 'Xử lý sự cố',
          items: [
            {
              question: 'Scan bữa ăn không hoạt động — phải làm gì?',
              answer: 'Đảm bảo đủ ánh sáng, giữ điện thoại thẳng, và chụp toàn bộ đĩa ăn trong khung hình. Nếu vẫn không được, thử nhập văn bản thủ công.',
            },
            {
              question: 'Mục tiêu hằng ngày của tôi có vẻ sai.',
              answer: 'Kiểm tra chỉ số cơ thể và mục tiêu trong Cài đặt → Kế hoạch của tôi. Mục tiêu sẽ tự cập nhật khi bạn thay đổi thông tin.',
            },
            {
              question: 'Làm sao để liên hệ hỗ trợ?',
              answer: 'Gửi email đến nutreeaidev@gmail.com, nhắn tin qua Facebook Messenger, hoặc theo dõi chúng tôi trên TikTok @nutree.ai.',
            },
          ],
        },
      ],
    },
  },
};
