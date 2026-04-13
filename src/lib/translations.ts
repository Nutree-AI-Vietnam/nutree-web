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
  scanningDemo: {
    title: string;
    subtitle: string;
  };
  whyNutree: {
    badge: string;
    heroTitle: string;
    heroSubtitle: string;
    problem: {
      titleLead: string;
      titleAccent: string;
      p1: string;
      p2Before: string;
      p2Emphasis: string;
      p3: string;
    };
    compound: {
      titleLead: string;
      titleAccent: string;
      p1: string;
      p2Before: string;
      p2Emphasis: string;
      stats: Array<{ stat: string; label: string }>;
    };
    friction: {
      titleLead: string;
      titleAccent: string;
      intro: string;
      stepLabel: string;
      steps: string[];
      outro: string;
    };
    truth: {
      titleLead: string;
      titleAccent: string;
      p1: string;
      p2Before: string;
      p2Emphasis: string;
      p2After: string;
    };
    solution: {
      badge: string;
      titleLead: string;
      titleAccent: string;
      intro: string;
      features: Array<{ title: string; desc: string; icon: string }>;
    };
    day: {
      titleLead: string;
      titleAccent: string;
      steps: Array<{ time: string; text: string }>;
      outro: string;
    };
    journey: {
      badge: string;
      titleLead: string;
      titleAccent: string;
      intro: string;
      weekLabel: string;
      weeks: Array<{ title: string; desc: string }>;
      outro: string;
    };
    cta: {
      title: string;
      subtext: string;
      downloadOnThe: string;
      appStore: string;
      fineprint: string;
    };
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
      headlines: ['SOLUTION FOR', 'SKINNY FAT', 'BODY TYPE.'],
      subheadline:
        'Not another calorie counter. Nutree adapts your daily targets, plans your meals, and tracks every macro — automatically.',
      downloadFree: 'Free Trial',
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
          id: 'tdee',
          title: 'TDEE Science to Build',
          description:
            'We calculate your Total Daily Energy Expenditure using science-backed formulas, then set a precise calorie target to help you build lean muscle and lose fat at the same time — the recomp sweet spot.',
        },
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
    scanningDemo: {
      title: 'See scanning in action',
      subtitle: 'One photo. Every macro. Watch how effortless logging really is.',
    },
    whyNutree: {
      badge: 'Fat Loss Guide',
      heroTitle: 'Why Nutree Is the Best Solution for People Who Want to Lose Fat',
      heroSubtitle:
        "You don't lack discipline. You lack a system that works without draining the little mental energy you have left.",
      problem: {
        titleLead: "It's not about willpower.",
        titleAccent: "It's about bandwidth.",
        p1: 'You make roughly 35,000 decisions every single day. What to wear, which emails to answer first, what to prioritize at work, how to handle traffic, what to say in that meeting. Each one chips away at your mental energy.',
        p2Before: 'By the time evening hits, your brain is running on empty. The last thing it wants is another decision — especially one as complex as ',
        p2Emphasis: '"what should I eat to stay in a calorie deficit while hitting my protein target?"',
        p3: "So you grab whatever's easy. Not because you're lazy. Because you're human.",
      },
      compound: {
        titleLead: "One bad meal doesn't matter.",
        titleAccent: 'The pattern does.',
        p1: 'A single pizza night won\'t ruin your progress. But weeks of "whatever\'s easy" compound silently — weight creeps up, energy crashes, clothes fit tighter, and the guilt cycle starts.',
        p2Before: 'You ',
        p2Emphasis: "know what you should eat. You just don't have the mental space to plan it, track it, and adjust it every single day.",
        stats: [
          { stat: '35,000', label: 'decisions per day' },
          { stat: '70%', label: 'of diets fail in the first 3 months' },
          { stat: '#1', label: 'reason: too much mental effort' },
        ],
      },
      friction: {
        titleLead: 'Calorie counters',
        titleAccent: 'add more decisions, not fewer.',
        intro:
          "Most nutrition apps ask you to weigh every portion, scan every barcode, and manually log every ingredient. That's not removing friction — that's adding it. The tool meant to help your diet becomes another source of decision fatigue.",
        stepLabel: 'Step',
        steps: [
          'Weigh 150g of chicken breast',
          'Scan the barcode on your rice',
          'Search "olive oil 1 tablespoon"',
          'Manually adjust if you ate more',
          'Repeat 3-5 times per day',
        ],
        outro:
          'No wonder people quit within two weeks. The app that was supposed to make fat loss easier made it feel like a second job.',
      },
      truth: {
        titleLead: 'Fat loss is simple math.',
        titleAccent: 'The hard part is doing it daily.',
        p1: "Consistent calorie deficit + enough protein. That's the formula. Every nutritionist, every study, every coach agrees on this. The science isn't the problem.",
        p2Before: 'The problem is ',
        p2Emphasis: 'executing it every single day',
        p2After:
          ' without burning out. You need a system that handles the math, the planning, and the adjustments — so the only thing left for you to do is eat.',
      },
      solution: {
        badge: 'The Nutree difference',
        titleLead: 'One photo. Zero decisions.',
        titleAccent: 'Fat loss on autopilot.',
        intro:
          'Nutree is an AI nutrition assistant that does the thinking for you. Snap a photo of your meal, and it handles everything — identifies every ingredient, calculates your macros, and adjusts your daily targets automatically.',
        features: [
          {
            icon: '📸',
            title: 'Snap your meal',
            desc: 'Take one photo. AI decomposes every ingredient and calculates calories, protein, carbs, and fats in seconds.',
          },
          {
            icon: '🎯',
            title: 'Targets adapt in real time',
            desc: 'Had a big lunch? Your dinner target adjusts automatically to keep you in deficit. No manual math, no guilt.',
          },
          {
            icon: '⚖️',
            title: 'Cheat days rebalance themselves',
            desc: 'Went over on Saturday? Nutree redistributes your weekly budget across the next few days. You stay on track without punishment.',
          },
          {
            icon: '🍽️',
            title: 'Know exactly what to eat',
            desc: 'Personalized meal suggestions with exact portions, based on what you need to hit your deficit today. Decision eliminated.',
          },
        ],
      },
      day: {
        titleLead: 'What your day looks like',
        titleAccent: 'with Nutree.',
        steps: [
          {
            time: 'Morning',
            text: 'Open Nutree. See exactly what to eat for breakfast to start your deficit right. No Googling, no guessing.',
          },
          {
            time: 'Lunch',
            text: 'Snap a photo of your plate. Logged in 3 seconds. Your remaining budget updates instantly.',
          },
          {
            time: 'Afternoon',
            text: 'Craving a snack? Check your remaining macros. Nutree suggests options that fit your budget.',
          },
          {
            time: 'Dinner',
            text: 'Targets already adjusted from earlier. Meal suggestions are ready. You eat, you enjoy, you stay in deficit.',
          },
        ],
        outro:
          'Zero decisions about food. Your brain stays free for what actually matters. And the fat comes off — not because you tried harder, but because the system made it effortless.',
      },
      journey: {
        badge: 'Your 3-Month Path',
        titleLead: 'Here is what the next 3 months',
        titleAccent: 'look like with Nutree.',
        intro:
          'Fat loss is not a 3-day sprint. It is a compounding system. Here is what changes, month by month, once the mental load is gone.',
        weekLabel: 'Month',
        weeks: [
          {
            title: 'Foundation',
            desc: 'Set up your profile in 90 seconds. Logging becomes a 3-second habit. You hit your deficit consistently and drop 2 to 3 kg of fat — without the mental load, without willpower fatigue.',
          },
          {
            title: 'Momentum',
            desc: 'Habits are locked in. Body composition visibly shifts. Social meals feel normal again. Cheat days rebalance themselves. You are down 4 to 6 kg total and clothes fit different.',
          },
          {
            title: 'Transformation',
            desc: 'Fat loss is a background process now. You are 6 to 10 kg down, leaner, stronger, and free from food anxiety. The question is not whether it works — it is how far you want to take it.',
          },
        ],
        outro:
          'Three months from now, you will have either spent the time or not. Nutree makes the time count — without the mental load.',
      },
      cta: {
        title: 'Lose the mental load before you lose the fat.',
        subtext:
          'Try Nutree free for 3 days. No credit card. No commitment. Just a smarter way to lose fat.',
        downloadOnThe: 'Download on the',
        appStore: 'App Store',
        fineprint: 'iOS only. 3-day free trial, then plans from $4.99/mo.',
      },
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
      headlines: ['GIẢI PHÁP CHO', 'DÁNG NGƯỜI', 'SKINNY FAT.'],
      subheadline:
        'Không phải app đếm calo bình thường. Nutree tự điều chỉnh mục tiêu mỗi ngày, gợi ý bữa ăn và track macro giúp bạn — tự động hoàn toàn.',
      downloadFree: 'Dùng thử miễn phí',
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
          id: 'tdee',
          title: 'Khoa học TDEE để tăng cơ',
          description:
            'Nutree tính TDEE của bạn bằng công thức khoa học, rồi đặt mục tiêu calo chính xác để vừa tăng cơ vừa giảm mỡ — đúng recomp.',
        },
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
    scanningDemo: {
      title: 'Xem Nutree scan thật nè',
      subtitle: 'Một tấm ảnh. Đủ hết macro. Xem ghi bữa ăn dễ cỡ nào.',
    },
    whyNutree: {
      badge: 'Hướng dẫn giảm mỡ',
      heroTitle: 'Vì sao Nutree là giải pháp tốt nhất cho người muốn giảm mỡ',
      heroSubtitle:
        'Bạn không thiếu kỷ luật. Bạn thiếu một hệ thống hoạt động mà không vắt kiệt chút năng lượng tinh thần ít ỏi còn lại của bạn.',
      problem: {
        titleLead: 'Không phải do ý chí.',
        titleAccent: 'Là do não bạn hết pin.',
        p1: 'Mỗi ngày bạn ra khoảng 35.000 quyết định. Mặc gì, trả lời email nào trước, việc nào ưu tiên ở công ty, đi đường kẹt xe xử lý sao, trong cuộc họp nói gì. Mỗi cái đều ngốn một chút năng lượng tinh thần.',
        p2Before: 'Tới chiều tối, não bạn cạn sạch pin. Thứ cuối cùng nó muốn là thêm một quyết định nữa — đặc biệt là câu hỏi phức tạp như ',
        p2Emphasis: '"tối nay ăn gì để vừa giảm mỡ vừa đủ protein?"',
        p3: 'Nên bạn chộp đại cái gì tiện nhất. Không phải vì lười. Mà vì bạn là con người.',
      },
      compound: {
        titleLead: 'Một bữa lỡ miệng không sao.',
        titleAccent: 'Thói quen mới là vấn đề.',
        p1: 'Một đêm pizza không phá tiến trình của bạn. Nhưng nhiều tuần "ăn đại cho xong" cộng dồn âm thầm — cân nặng tăng lén, năng lượng tuột dốc, quần áo chật hơn, và vòng lặp tội lỗi bắt đầu.',
        p2Before: 'Bạn ',
        p2Emphasis: 'biết mình nên ăn gì. Chỉ là bạn không có chỗ trong đầu để lên kế hoạch, track, và điều chỉnh nó mỗi ngày.',
        stats: [
          { stat: '35.000', label: 'quyết định mỗi ngày' },
          { stat: '70%', label: 'chế độ ăn thất bại trong 3 tháng đầu' },
          { stat: '#1', label: 'lý do: tốn quá nhiều công sức' },
        ],
      },
      friction: {
        titleLead: 'App đếm calo',
        titleAccent: 'thêm quyết định, chứ không bớt.',
        intro:
          'Đa số app dinh dưỡng bắt bạn cân từng phần, scan từng mã vạch, và ghi thủ công từng nguyên liệu. Đó không phải giảm ma sát — đó là thêm ma sát. Công cụ đáng lẽ giúp bạn ăn kiêng lại trở thành nguồn gốc của sự kiệt sức.',
        stepLabel: 'Bước',
        steps: [
          'Cân 150g ức gà',
          'Scan mã vạch hộp cơm',
          'Tìm "dầu oliu 1 muỗng"',
          'Chỉnh thủ công nếu ăn nhiều hơn',
          'Lặp lại 3-5 lần mỗi ngày',
        ],
        outro:
          'Không lạ gì khi ai cũng bỏ cuộc sau 2 tuần. App đáng lẽ giúp giảm mỡ lại thành một công việc thứ hai.',
      },
      truth: {
        titleLead: 'Giảm mỡ là bài toán đơn giản.',
        titleAccent: 'Phần khó là làm đều mỗi ngày.',
        p1: 'Giảm mỡ đều đặn + đủ protein. Đó là công thức. Chuyên gia dinh dưỡng, nghiên cứu, huấn luyện viên — ai cũng đồng ý. Khoa học không phải vấn đề.',
        p2Before: 'Vấn đề là ',
        p2Emphasis: 'làm nó mỗi ngày',
        p2After:
          ' mà không burnout. Bạn cần một hệ thống lo hết phần tính toán, lên kế hoạch, và điều chỉnh — để thứ duy nhất bạn phải làm là ăn.',
      },
      solution: {
        badge: 'Điểm khác biệt của Nutree',
        titleLead: 'Một tấm ảnh. Không cần quyết định.',
        titleAccent: 'Giảm mỡ tự động.',
        intro:
          'Nutree là trợ lý dinh dưỡng AI lo phần suy nghĩ cho bạn. Chụp một tấm ảnh bữa ăn, và nó xử lý hết — nhận diện từng nguyên liệu, tính macro, điều chỉnh mục tiêu ngày — tự động luôn.',
        features: [
          {
            icon: '📸',
            title: 'Chụp bữa ăn',
            desc: 'Chụp một tấm. AI phân tích từng nguyên liệu và tính calo, protein, carb, chất béo trong vài giây.',
          },
          {
            icon: '🎯',
            title: 'Mục tiêu tự điều chỉnh',
            desc: 'Trưa ăn quá? Mục tiêu bữa tối tự động giảm xuống để giảm mỡ. Không cần tính toán, không áy náy.',
          },
          {
            icon: '⚖️',
            title: 'Cheat day tự cân bằng',
            desc: 'Thứ 7 ăn quá? Nutree phân phối lại ngân sách tuần qua vài ngày kế. Không bị phạt, không cần làm lại từ đầu.',
          },
          {
            icon: '🍽️',
            title: 'Biết chính xác ăn gì',
            desc: 'Tự xây dựng bữa ăn chuẩn calo dựa trên những gì bạn thích, vừa ăn ngon, vừa đạt mục tiêu với những món ăn đơn giản dễ nấu từ Nutree',
          },
        ],
      },
      day: {
        titleLead: 'Một ngày của bạn',
        titleAccent: 'với Nutree.',
        steps: [
          {
            time: 'Buổi sáng',
            text: 'Mở Nutree. Biết ngay ăn bao nhiêu để bắt đầu ngày giảm mỡ đúng cách. Không Google, không đoán mò.',
          },
          {
            time: 'Buổi trưa',
            text: 'Chụp ảnh đĩa cơm. Log trong 3 giây. Ngân sách còn lại tự cập nhật.',
          },
          {
            time: 'Buổi chiều',
            text: 'Thèm snack? Check macro còn lại. Nutree gợi ý món vừa ngân sách của bạn.',
          },
          {
            time: 'Buổi tối',
            text: 'Mục tiêu đã tự điều chỉnh từ sáng. Gợi ý bữa tối ngon lành còn lại. Bạn cứ ăn, cứ enjoy, vẫn giảm mỡ.',
          },
        ],
        outro:
          'Không cần quyết định gì về đồ ăn. Bạn rảnh hơn để lo việc thực sự quan trọng. Và mỡ biến mất — không phải vì bạn cố hơn, mà vì hệ thống làm cho nó dễ dàng.',
      },
      journey: {
        badge: 'Lộ trình 3 tháng',
        titleLead: '3 tháng tới của bạn',
        titleAccent: 'với Nutree sẽ ra sao.',
        intro:
          'Giảm mỡ không phải sprint 3 ngày. Đó là một hệ thống cộng dồn. Đây là những gì sẽ thay đổi, từng tháng, khi gánh nặng tinh thần biến mất.',
        weekLabel: 'Tháng',
        weeks: [
          {
            title: 'Nền tảng',
            desc: 'Set up hồ sơ trong 90 giây. Log bữa ăn thành thói quen 3 giây. Gợi ý món vừa khẩu vị, giảm đều đặn. Giảm 1-2 kg mỡ đầu tiên — không còn gánh nặng tinh thần.',
          },
          {
            title: 'Đà tiến',
            desc: 'Cân nặng tiếp tục giảm, quần áo rộng hơn. Bạn có vài cheat-day — Nutree tự cân bằng lại. Bạn tin vào hệ thống, vòng lặp tội lỗi biến mất. Tổng giảm 3-5 kg mỡ.',
          },
          {
            title: 'Chuyển hóa',
            desc: 'Ngoại hình thay đổi rõ rệt, bạn bè bắt đầu hỏi bạn làm gì khác. Thói quen đã khóa chặt. Giảm 5-8 kg mỡ. Giảm mỡ trở thành quá trình nền trong khi bạn sống cuộc sống của mình.',
          },
        ],
        outro:
          '3 Tháng. Nutree giúp thời gian đó có giá trị — lấy lại tự tin với cơ thể của mình.',
      },
      cta: {
        title: 'Giảm áp lực trước, rồi tự tin sẽ trở lại.',
        subtext:
          'Dùng thử Nutree miễn phí 3 ngày. Chỉ là cách thông minh hơn để giảm mỡ.',
        downloadOnThe: 'Tải trên',
        appStore: 'App Store',
        fineprint: 'Chỉ có ở iOS. Dùng thử 3 ngày miễn phí, sau đó từ 41.000đ/tháng.',
      },
    },
  },
};
