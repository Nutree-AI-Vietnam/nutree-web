export type Locale = 'en' | 'vi';

/** Map nav link href to translated label */
export function getNavLabel(
  href: string,
  nav: { howItWorks: string; features: string; pricing: string; download: string; pay: string },
): string {
  if (href === '#how-it-works') return nav.howItWorks;
  if (href === '#features') return nav.features;
  if (href === '#pricing') return nav.pricing;
  if (href === '#download') return nav.download;
  if (href === '/pay') return nav.pay;
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
  common: {
    backHome: string;
    home: string;
    appStoreDownloadLabel: string;
    productHuntLabel: string;
    startupPartners: string;
    partnerWebsiteLabel: (name: string) => string;
    goToFeature: (index: number) => string;
    tapToFlip: string;
    previousTestimonial: string;
    nextTestimonial: string;
    goToTestimonial: (index: number) => string;
    dashboardScreenshotAlt: string;
    onboardingScreenshotAlt: string;
    featureScreenshotAlt: (title: string) => string;
    ctaScreenshotAlt: string;
  };
  nav: { howItWorks: string; features: string; pricing: string; download: string; pay: string };
  hero: {
    badge: string;
    headlines: string[];
    subheadline: string;
    downloadApp: string;
    tagline?: string;
    scroll: string;
    trustBadges: { rating: string; personalizedPlan: string; languages: string };
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
    stats: { planValue: string; planLabel: string; languages: string; aiPowered: string; rating: string };
  };
  footer: {
    description: string;
    quickLinks: string;
    getInTouch: string;
    contactPrompt: string;
    contactSupport: string;
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
    research: string;
    faq: string;
    contact: string;
    companyInfo: string;
    companyName: string;
    taxId: string;
    taxIssuedDate: string;
    taxIssuedPlace: string;
    address: string;
    email: string;
  };
  homePricing: {
    title: string;
    subtitle: string;
    footnote: string;
    badge: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    responseNote: string;
    backHome: string;
    languageLabel: string;
    email: { name: string; description: string; action: string };
    messenger: { name: string; description: string; action: string };
    tiktok: { name: string; description: string; action: string };
  };
  faq: {
    pageTitle: string;
    pageDescription: string;
    sections: FaqSection[];
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
    common: {
      backHome: 'Back to Home',
      home: 'Home',
      appStoreDownloadLabel: 'Download on App Store',
      productHuntLabel: 'View Nutree on Product Hunt',
      startupPartners: 'Startup partners',
      partnerWebsiteLabel: (name) => `${name} partner website`,
      goToFeature: (index) => `Go to feature ${index}`,
      tapToFlip: 'Tap to flip',
      previousTestimonial: 'Previous testimonial',
      nextTestimonial: 'Next testimonial',
      goToTestimonial: (index) => `Go to testimonial ${index}`,
      dashboardScreenshotAlt: 'Nutree daily dashboard screenshot',
      onboardingScreenshotAlt: 'Nutree onboarding screenshot',
      featureScreenshotAlt: (title) => `${title} screenshot`,
      ctaScreenshotAlt: 'Nutree app onboarding screenshot',
    },
    nav: {
      howItWorks: 'How it works',
      features: 'Features',
      pricing: 'Plans',
      download: 'Download',
      pay: 'Pay',
    },
    hero: {
      badge: 'AI Nutrition Assistant',
      headlines: ['IDEAS.', 'TRACK.', 'THRIVE.'],
      subheadline:
        'Not another calorie counter. Nutree adapts your daily targets, plans your meals, and tracks every macro — automatically.',
      downloadApp: 'Download Nutree',
      scroll: 'Scroll',
      trustBadges: {
        rating: '#1 Health & Fitness',
        personalizedPlan: 'Personalized Premium plans',
        languages: '7 Languages',
      },
    },
    socialProof: {
      mealsTracked: 'Meals Tracked',
      rating: 'Health & Fitness App',
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
          description: 'Cut, bulk, or recomp — hit your goals with adaptive daily targets',
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
          title: 'Adaptive Daily Targets',
          description:
            "Nutree rebalances your weekly nutrition budget and adjusts tomorrow's target automatically.",
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
      headline: 'Life gets busy. Nutree keeps your nutrition targets on track.',
      downloadOnThe: 'Download on the',
      appStore: 'App Store',
      subtext:
        'Download Nutree for nutrition guidance that adapts to real life — so you never have to start over.',
      trustMessage: 'Built around your goals',
      stats: {
        planValue: 'AI',
        planLabel: 'Personalized Plans',
        languages: 'Languages',
        aiPowered: 'Powered',
        rating: 'Health & Fitness',
      },
    },
    footer: {
      description:
        'Not another calorie counter. Nutree is an AI Nutrition Assistant that adapts your daily targets, plans meals, and tracks every macro automatically.',
      quickLinks: 'Quick Links',
      getInTouch: 'Get in Touch',
      contactPrompt:
        "Have questions or feedback? We'd love to hear from you.",
      contactSupport: 'Contact Support',
      copyright: 'Nutree. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      research: 'Science & Sources',
      faq: 'FAQ',
      contact: 'Contact Us',
      companyInfo: 'Company contact',
      companyName: 'Company name',
      taxId: 'Tax ID (MST)',
      taxIssuedDate: 'Issue date',
      taxIssuedPlace: 'Issuing authority',
      address: 'Registered address',
      email: 'Email',
    },
    homePricing: {
      badge: 'Plans',
      title: 'Choose your Nutree plan',
      subtitle: 'Monthly or yearly — pay on the website, then activate Nutree with the email deeplink.',
      footnote: '* Amounts are confirmed at checkout. After payment, we email a deeplink to open the app.',
    },
    contact: {
      eyebrow: 'Talk to a real person',
      title: 'How can we help?',
      description: 'Questions, feedback, or something not working as expected? Choose the channel that suits you best and reach the Nutree team directly.',
      responseNote: 'Email and Messenger are best for support requests. We usually reply as soon as we can.',
      backHome: 'Back to home',
      languageLabel: 'Switch language',
      email: {
        name: 'Email',
        description: 'Best for account questions, detailed feedback, and technical support.',
        action: 'Send an email',
      },
      messenger: {
        name: 'Messenger',
        description: 'Send us a quick message and chat with the Nutree team on Facebook.',
        action: 'Open Messenger',
      },
      tiktok: {
        name: 'TikTok',
        description: 'Follow Nutree for nutrition tips, product updates, and short tutorials.',
        action: 'Visit TikTok',
      },
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
              answer: 'Nutree is an AI nutrition assistant that tracks your macros, plans meals, and adapts your daily targets automatically. It is not just a calorie counter — it understands your goals and adjusts your weekly budget so you stay on track through real life.',
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
              question: 'How many meals can I scan?',
              answer: 'Your personalized plan includes unlimited AI scans, meal suggestions, and full features.',
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
              answer: 'Your weekly nutrition budget rebalances automatically. If you eat more one day, tomorrow\'s target adjusts so you stay aligned with your plan.',
            },
            {
              question: 'Can I adjust my nutrition goals?',
              answer: 'Yes. Update your goal (cut, bulk, or recomposition) and body metrics anytime in Settings → My Plan.',
            },
            {
              question: 'How does Nutree adjust when my day changes?',
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
              question: 'Does Nutree have a free plan?',
              answer: 'Nutree is available through personalized Premium plans. Your price and billing terms are shown before you subscribe.',
            },
            {
              question: 'What is included in a personalized plan?',
              answer: 'Your plan includes unlimited AI scans, meal suggestions, and the full Nutree experience tailored to your goals.',
            },
            {
              question: 'How do I cancel my subscription?',
              answer: 'iOS: Settings → Apple ID → Subscriptions → Nutree → Cancel. Deleting the app does not cancel billing. Android is coming soon.',
            },
            {
              question: 'When will I be charged for Premium?',
              answer: 'Only after you confirm a Premium purchase through the Apple App Store. The exact price, billing period, and any offer are shown in the app and on the Apple confirmation sheet before you subscribe.',
            },
            {
              question: 'How do I request a refund?',
              answer: 'Cancel auto-renewal in Apple Settings → Subscriptions → Nutree. For refunds, Apple decides at reportaproblem.apple.com. You can also email nutreeaidev@gmail.com with your receipt. Full steps: nutreeai.com/cancellation.',
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
    scanningDemo: {
      title: 'See scanning in action',
      subtitle: 'One photo. Every macro. Watch how effortless logging really is.',
    },
    whyNutree: {
      badge: 'Escape Skinny Fat',
      heroTitle: 'Why Nutree Is the Best Solution for People Who Want to Escape Skinny Fat',
      heroSubtitle:
        "You don't lack discipline. You lack a system built for body recomposition — where fat goes down AND muscle goes up at the same time.",
      problem: {
        titleLead: "Skinny fat isn't your fault.",
        titleAccent: "It's a bandwidth problem.",
        p1: 'You make roughly 35,000 decisions every single day. What to wear, which emails to answer first, what to prioritize at work, how to handle traffic, what to say in that meeting. Each one chips away at your mental energy.',
        p2Before: 'By the time evening hits, your brain is running on empty. The last thing it wants is another decision — especially one as complex as ',
        p2Emphasis: '"what should I eat tonight to stay in a slight deficit, hit my protein target, AND still progress at the gym tomorrow?"',
        p3: "So you grab whatever's easy. You skip the gym. The scale stays the same but you still look soft in a t-shirt. That's the skinny fat trap.",
      },
      compound: {
        titleLead: "One skipped lift doesn't matter.",
        titleAccent: 'The pattern does.',
        p1: 'One missed workout, one snacky week — not the end of the world. But months of "whatever\'s easy" is exactly how skinny fat gets locked in. The scale barely moves. Your body stays soft. Your reflection stays the same.',
        p2Before: 'You ',
        p2Emphasis: "know what you should eat and how you should train. You just don't have the mental space to run both systems, every single day.",
        stats: [
          { stat: '35,000', label: 'decisions per day' },
          { stat: '70%', label: 'of recomp attempts stall in the first 3 months' },
          { stat: '#1', label: 'reason: too much mental effort' },
        ],
      },
      friction: {
        titleLead: 'Calorie counters',
        titleAccent: "don't solve skinny fat.",
        intro:
          "Most nutrition apps just count calories. But skinny fat isn't a calorie problem — it's a composition problem. You need enough protein to build muscle, a slight deficit to lose fat, and consistent training to actually see change. That's three systems running at once — and traditional apps add friction instead of removing it.",
        stepLabel: 'Step',
        steps: [
          'Weigh 150g of chicken breast',
          'Scan the barcode on your rice',
          'Search "olive oil 1 tablespoon"',
          'Manually adjust if you ate more',
          'Repeat 3-5 times per day',
        ],
        outro:
          "No wonder most people quit within two weeks. The app that was supposed to help you escape skinny fat ends up feeling like a second job.",
      },
      truth: {
        titleLead: 'Escaping skinny fat has a formula.',
        titleAccent: 'Running it daily is the hard part.',
        p1: "Slight calorie deficit + enough protein + consistent resistance training. That's recomp. Every coach, every study, every nutritionist agrees on this. The science isn't the problem.",
        p2Before: 'The problem is ',
        p2Emphasis: 'running all three at once, every single day',
        p2After:
          ' without burning out. You need a system that handles the math, planning, and adjustments — so the only thing left for you to do is eat and lift.',
      },
      solution: {
        badge: 'The Nutree difference',
        titleLead: 'One photo. Zero decisions.',
        titleAccent: 'Recomposition on autopilot.',
        intro:
          'Nutree is an AI nutrition assistant that does the thinking for you. Snap a photo of your meal and it handles everything — identifies every ingredient, calculates protein and deficit, and adjusts your daily targets automatically so recomp actually happens.',
        features: [
          {
            icon: '📸',
            title: 'Snap your meal',
            desc: 'Take one photo. AI decomposes every ingredient and calculates calories, protein, carbs, and fats in seconds.',
          },
          {
            icon: '🎯',
            title: 'Targets adapt in real time',
            desc: 'Ate lighter at lunch? Your dinner protein target scales up. Nutree keeps you in recomp range without manual math.',
          },
          {
            icon: '⚖️',
            title: 'Weekly balance adjusts itself',
            desc: 'A day runs higher than planned? Nutree redistributes your weekly budget so the deficit holds. You stay on recomp track without punishment.',
          },
          {
            icon: '🍽️',
            title: 'Know exactly what to eat',
            desc: 'Personalized meal suggestions with exact portions — protein-prioritized, deficit-aware, built for recomp. Decision eliminated.',
          },
        ],
      },
      day: {
        titleLead: 'What your day looks like',
        titleAccent: 'with Nutree.',
        steps: [
          {
            time: 'Morning',
            text: 'Open Nutree. See exactly what to eat for breakfast — enough protein, the right start to your deficit. No Googling, no guessing.',
          },
          {
            time: 'Lunch',
            text: 'Snap a photo of your plate. Logged in 3 seconds. Protein count and remaining macros update instantly.',
          },
          {
            time: 'Afternoon',
            text: 'Craving a snack? Check your remaining protein gap. Nutree suggests options that fit the budget and push recomp forward.',
          },
          {
            time: 'Dinner',
            text: 'Targets already adjusted from earlier. Meal suggestions are ready. You eat, you enjoy, you stay on recomp.',
          },
        ],
        outro:
          'Zero decisions about food. Your brain stays free for what actually matters — including showing up at the gym. And body composition shifts not because you tried harder, but because the system made it effortless.',
      },
      journey: {
        badge: 'Your 3-Month Path',
        titleLead: 'Here is what the next 3 months',
        titleAccent: 'escaping skinny fat look like.',
        intro:
          'Escaping skinny fat is not a sprint. It is recomposition — slow, compounding, relentless. Here is what changes, month by month, once the mental load is gone.',
        weekLabel: 'Month',
        weeks: [
          {
            title: 'Foundation',
            desc: 'Set up your profile in 90 seconds. Logging becomes a 3-second habit. You hit your protein target daily, stay in a slight deficit, and start training with structure. The scale barely moves — but composition is already shifting under the surface.',
          },
          {
            title: 'Visible change',
            desc: 'Clothes fit different, especially shoulders and arms. Your face looks sharper. You see your first real muscle definition. Body fat is down, lean mass is up. The scale might be exactly where it started — that is exactly how recomp works.',
          },
          {
            title: 'No longer skinny fat',
            desc: 'Muscle shape is obvious in a t-shirt. Body fat sits in the lean range. You look strong, not soft. The mental load is gone, the habits are locked, and you finally understand your body.',
          },
        ],
        outro:
          'Three months from now you will have either spent the time or not. Nutree makes sure the time actually builds the body you want — not just a smaller version of the old one.',
      },
      cta: {
        title: 'Escape skinny fat without losing your mind.',
        subtext:
          'Build a personalized nutrition plan and get smarter guidance for every meal.',
        downloadOnThe: 'Download on the',
        appStore: 'App Store',
        fineprint: 'iOS available now. Android coming soon. Prices shown in the App Store before you subscribe.',
      },
    },
  },
  vi: {
    common: {
      backHome: 'Về trang chủ',
      home: 'Trang chủ',
      appStoreDownloadLabel: 'Tải trên App Store',
      productHuntLabel: 'Xem Nutree trên Product Hunt',
      startupPartners: 'Đối tác startup',
      partnerWebsiteLabel: (name) => `Trang đối tác ${name}`,
      goToFeature: (index) => `Đi đến tính năng ${index}`,
      tapToFlip: 'Chạm để lật',
      previousTestimonial: 'Đánh giá trước',
      nextTestimonial: 'Đánh giá tiếp theo',
      goToTestimonial: (index) => `Đi đến đánh giá ${index}`,
      dashboardScreenshotAlt: 'Ảnh màn hình dashboard hằng ngày của Nutree',
      onboardingScreenshotAlt: 'Ảnh màn hình onboarding Nutree',
      featureScreenshotAlt: (title) => `Ảnh màn hình ${title}`,
      ctaScreenshotAlt: 'Ảnh màn hình onboarding app Nutree',
    },
    nav: {
      howItWorks: 'Cách dùng',
      features: 'Tính năng',
      pricing: 'Các gói',
      download: 'Tải app',
      pay: 'Thanh toán',
    },
    hero: {
      badge: 'Trợ lý dinh dưỡng AI',
      headlines: ['GỢI Ý.', 'THEO DÕI.', 'ĐẠT GOAL.'],
      subheadline:
        'Không phải app đếm calo bình thường. Nutree tự điều chỉnh mục tiêu mỗi ngày, gợi ý bữa ăn và track macro giúp bạn — tự động hoàn toàn.',
      downloadApp: 'Tải Nutree',
      scroll: 'Kéo xuống',
      tagline: 'Tăng Cơ Giảm Mỡ',
      trustBadges: {
        rating: '#1 Sức khỏe & Thể hình',
        personalizedPlan: 'Gói Premium cá nhân hóa',
        languages: '7 ngôn ngữ',
      },
    },
    socialProof: {
      mealsTracked: 'Bữa ăn đã track',
      rating: 'App Sức khỏe & Thể hình',
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
          title: 'Mục tiêu tự điều chỉnh',
          description:
            'Nutree tự cân bằng ngân sách dinh dưỡng tuần và chỉnh mục tiêu ngày mai.',
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
      headline: 'Ngày bận rộn vẫn theo đúng plan. Nutree lo phần mục tiêu.',
      downloadOnThe: 'Tải trên',
      appStore: 'App Store',
      subtext:
        'Tải Nutree để có hướng dẫn dinh dưỡng thích nghi với nhịp sống của bạn — không cần bắt đầu lại từ đầu.',
      trustMessage: 'Thiết kế theo mục tiêu của bạn',
      stats: {
        planValue: 'AI',
        planLabel: 'Gói cá nhân hóa',
        languages: 'Ngôn ngữ',
        aiPowered: 'AI',
        rating: 'Sức khỏe & Thể hình',
      },
    },
    footer: {
      description:
        'Không phải app đếm calo bình thường. Nutree là trợ lý dinh dưỡng AI tự điều chỉnh mục tiêu hằng ngày, gợi ý bữa ăn và track macro cho bạn.',
      quickLinks: 'Liên kết',
      getInTouch: 'Liên hệ',
      contactPrompt:
        'Có thắc mắc hay góp ý gì không? Inbox mình nhé!',
      contactSupport: 'Liên hệ hỗ trợ',
      copyright: 'Nutree. Bảo lưu mọi quyền.',
      privacyPolicy: 'Chính sách bảo mật',
      termsOfService: 'Điều khoản sử dụng',
      research: 'Khoa học & nguồn',
      faq: 'Câu hỏi thường gặp',
      contact: 'Liên hệ',
      companyInfo: 'Thông tin liên hệ',
      companyName: 'Tên công ty',
      taxId: 'Mã số thuế',
      taxIssuedDate: 'Ngày cấp',
      taxIssuedPlace: 'Nơi cấp',
      address: 'Địa chỉ',
      email: 'Email',
    },
    homePricing: {
      badge: 'Gói dịch vụ',
      title: 'Các gói Nutree',
      subtitle: 'Gói tháng hoặc gói năm — thanh toán trên website, nhận deeplink qua email để mở app.',
      footnote: '* Số tiền được xác nhận lúc checkout. Sau thanh toán, Nutree gửi deeplink kích hoạt qua email.',
    },
    contact: {
      eyebrow: 'Trò chuyện trực tiếp với Nutree',
      title: 'Nutree có thể giúp gì cho bạn?',
      description: 'Bạn có câu hỏi, góp ý hoặc gặp vấn đề khi sử dụng? Chọn kênh phù hợp nhất để liên hệ trực tiếp với đội ngũ Nutree.',
      responseNote: 'Email và Messenger là hai kênh phù hợp nhất để được hỗ trợ. Nutree sẽ phản hồi sớm nhất có thể.',
      backHome: 'Về trang chủ',
      languageLabel: 'Đổi ngôn ngữ',
      email: {
        name: 'Email',
        description: 'Phù hợp với câu hỏi về tài khoản, góp ý chi tiết và hỗ trợ kỹ thuật.',
        action: 'Gửi email',
      },
      messenger: {
        name: 'Messenger',
        description: 'Nhắn tin nhanh và trò chuyện với đội ngũ Nutree qua Facebook.',
        action: 'Mở Messenger',
      },
      tiktok: {
        name: 'TikTok',
        description: 'Theo dõi Nutree để xem mẹo dinh dưỡng, cập nhật sản phẩm và hướng dẫn ngắn.',
        action: 'Xem TikTok',
      },
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
              answer: 'Nutree là trợ lý dinh dưỡng AI giúp theo dõi macro, gợi ý bữa ăn và tự điều chỉnh mục tiêu hằng ngày. Không chỉ đếm calo — Nutree hiểu mục tiêu của bạn và cân bằng lại ngân sách tuần theo nhịp sống thực tế.',
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
              question: 'Tôi có thể scan bao nhiêu bữa?',
              answer: 'Gói cá nhân hóa của bạn bao gồm scan AI không giới hạn, gợi ý bữa ăn và toàn bộ tính năng.',
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
              question: 'Nutree điều chỉnh khi lịch ăn thay đổi thế nào?',
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
              question: 'Nutree có gói miễn phí không?',
              answer: 'Nutree cung cấp các gói Premium được cá nhân hóa. Giá và điều khoản thanh toán được hiển thị trước khi bạn đăng ký.',
            },
            {
              question: 'Gói cá nhân hóa bao gồm gì?',
              answer: 'Gói của bạn bao gồm scan AI không giới hạn, gợi ý bữa ăn và trải nghiệm Nutree đầy đủ, được điều chỉnh theo mục tiêu của bạn.',
            },
            {
              question: 'Làm sao để hủy gói đăng ký?',
              answer: 'iOS: Cài đặt → Apple ID → Đăng ký → Nutree → Hủy. Xóa app không hủy thanh toán. Android sắp ra mắt.',
            },
            {
              question: 'Khi nào tôi bị tính phí Premium?',
              answer: 'Chỉ sau khi bạn xác nhận mua Premium qua Apple App Store. Mức giá, chu kỳ và ưu đãi (nếu có) được hiển thị trong app và trên màn hình xác nhận của Apple trước khi đăng ký.',
            },
            {
              question: 'Làm sao yêu cầu hoàn tiền?',
              answer: 'Hủy gia hạn trong Cài đặt Apple → Đăng ký → Nutree. Hoàn tiền do Apple xem xét tại reportaproblem.apple.com. Có thể gửi biên nhận tới nutreeaidev@gmail.com. Hướng dẫn đầy đủ: nutreeai.com/cancellation.',
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
    scanningDemo: {
      title: 'Xem Nutree scan thật nè',
      subtitle: 'Một tấm ảnh. Đủ hết macro. Xem ghi bữa ăn dễ cỡ nào.',
    },
    whyNutree: {
      badge: 'Thoát Skinny Fat',
      heroTitle: 'Vì sao Nutree là giải pháp tốt nhất cho người bận rộn muốn thoát khỏi skinny fat',
      heroSubtitle:
        'Bạn không thiếu kỷ luật. Bạn thiếu một hệ thống được xây dựa trên giải pháp body recomposition, nơi mỡ giảm VÀ cơ tăng cùng lúc, mà không vắt kiệt năng lượng tinh thần còn lại của bạn.',
      problem: {
        titleLead: 'Skinny fat không phải lỗi của bạn.',
        titleAccent: 'Là vấn đề về năng lượng tinh thần.',
        p1: 'Mỗi ngày một người trưởng thành ra khoảng 35.000 quyết định. Mặc gì, trả lời email nào trước, việc nào ưu tiên ở công ty, đi đường kẹt xe xử lý sao, trong cuộc họp nói gì. Mỗi cái đều ngốn một chút năng lượng tinh thần.',
        p2Before: 'Tới chiều tối, não cạn sạch năng lượng. Thứ cuối cùng nó muốn là thêm một quyết định nữa, đặc biệt là câu hỏi phức tạp như ',
        p2Emphasis: '"tối nay ăn gì để vừa thâm hụt calo nhẹ, vừa đủ protein, VÀ mai vẫn tập được ở phòng gym?"',
        p3: 'Nên bạn chộp đại cái gì tiện nhất. Bỏ tập. Cân không đổi nhưng mặc áo thun nhìn vẫn mềm. Đó chính là cái bẫy skinny fat.',
      },
      compound: {
        titleLead: 'Một buổi bỏ tập không là vấn đề.',
        titleAccent: 'Thói quen mới là vấn đề.',
        p1: 'Một buổi bỏ tập, một tuần ăn vặt, không phải tận thế. Nhưng nhiều tháng "tiện gì làm nấy" chính là cách skinny fat khóa chặt vào cơ thể bạn. Cân không đổi. Người vẫn mềm. Nhìn gương vẫn y nguyên.',
        p2Before: 'Bạn ',
        p2Emphasis: 'biết mình nên ăn gì và nên tập gì. Chỉ là bạn không có chỗ trong đầu để chạy cả hai hệ thống, mỗi ngày.',
        stats: [
          { stat: '35.000', label: 'quyết định mỗi ngày' },
          { stat: '70%', label: 'nỗ lực recomp chững lại trong 3 tháng đầu' },
          { stat: '#1', label: 'lý do: tốn quá nhiều công sức' },
        ],
      },
      friction: {
        titleLead: 'App đếm calo',
        titleAccent: 'không chữa được skinny fat.',
        intro:
          'Đa số app dinh dưỡng chỉ đếm calo. Nhưng skinny fat không phải vấn đề calo, mà là vấn đề cấu tạo cơ thể. Bạn cần đủ protein để tăng cơ, thâm hụt calo nhẹ để giảm mỡ, và tập đều để thấy kết quả. Đó là 3 hệ thống cùng lúc, và app truyền thống không được tạo ra để giải quyết vấn đề này.',
        stepLabel: 'Cách truyền thống',
        steps: [
          'Cân 150g ức gà',
          'Scan mã vạch hộp cơm',
          'Tìm "dầu oliu 1 muỗng"',
          'Chỉnh thủ công nếu ăn nhiều hơn',
          'Lặp lại 3-5 lần mỗi ngày',
        ],
        outro:
          'Không lạ gì khi ai cũng bỏ cuộc sau 2 tuần. App đáng lẽ giúp bạn thoát skinny fat lại thành một công việc thứ hai.',
      },
      truth: {
        titleLead: 'Thoát skinny fat có công thức rõ ràng.',
        titleAccent: 'Phần khó là làm mỗi ngày.',
        p1: 'Thâm hụt calo nhẹ + đủ protein + tập tạ đều đặn. Đó là recomp. Huấn luyện viên, nghiên cứu, chuyên gia, ai cũng đồng ý. Khoa học không phải vấn đề.',
        p2Before: 'Vấn đề là ',
        p2Emphasis: 'chạy cả 3 cùng lúc, mỗi ngày',
        p2After:
          ' mà không burnout. Bạn cần một hệ thống lo phần tính toán, lên kế hoạch, và điều chỉnh, để việc duy nhất bạn làm là ăn và tập.',
      },
      solution: {
        badge: 'Điểm khác biệt của Nutree',
        titleLead: 'Một tấm ảnh. Không cần quyết định.',
        titleAccent: 'Recomp tự động.',
        intro:
          'Nutree là trợ lý dinh dưỡng AI lo phần suy nghĩ cho bạn. Chụp một tấm ảnh bữa ăn, Nutree nhận diện nguyên liệu, tính protein + deficit, điều chỉnh mục tiêu tự động để recomp thực sự xảy ra.',
        features: [
          {
            icon: '📸',
            title: 'Chụp bữa ăn',
            desc: 'Chụp một tấm. AI phân tích từng nguyên liệu và tính calo, protein, carb, chất béo trong vài giây.',
          },
          {
            icon: '🎯',
            title: 'Mục tiêu tự điều chỉnh',
            desc: 'Trưa ăn nhẹ? Mục tiêu protein bữa tối tự động tăng lên. Nutree giữ bạn đúng nhịp recomp mà không cần tính toán.',
          },
          {
            icon: '⚖️',
            title: 'Ngân sách tuần tự cân bằng',
            desc: 'Một ngày ăn nhiều hơn dự tính? Nutree phân phối lại ngân sách tuần để deficit vẫn được giữ. Không bị phạt, không cần làm lại từ đầu.',
          },
          {
            icon: '🍽️',
            title: 'Tự xây dựng bữa ăn healthy',
            desc: 'Tự xây dựng bữa ăn chuẩn calo dựa trên những gì bạn thích, ưu tiên protein, nhận thức deficit, xây cho recomp. Không cần nghĩ nữa.',
          },
        ],
      },
      day: {
        titleLead: 'Một ngày của bạn',
        titleAccent: 'với Nutree.',
        steps: [
          {
            time: 'Buổi sáng',
            text: 'Mở Nutree. Biết ngay ăn gì để bắt đầu ngày, đủ protein, deficit đúng cách. Không Google, không đoán mò.',
          },
          {
            time: 'Buổi trưa',
            text: 'Chụp ảnh đĩa cơm. Log trong 3 giây. Protein và macro còn lại tự cập nhật ngay.',
          },
          {
            time: 'Buổi chiều',
            text: 'Thèm snack? Check protein còn thiếu. Nutree gợi ý món vừa ngân sách và đẩy recomp tiến thêm.',
          },
          {
            time: 'Buổi tối',
            text: 'Mục tiêu đã tự điều chỉnh từ sáng. Gợi ý bữa tối ngon lành sẵn rồi. Bạn cứ ăn, cứ enjoy, vẫn đúng nhịp recomp.',
          },
        ],
        outro:
          'Không cần quyết định gì về đồ ăn. Não rảnh hơn để lo việc thực sự quan trọng, kể cả việc đi tập. Và cấu tạo cơ thể thay đổi không phải vì bạn cố hơn, mà vì hệ thống làm cho nó dễ dàng.',
      },
      journey: {
        badge: 'Lộ trình 3 tháng',
        titleLead: '3 tháng tới của bạn',
        titleAccent: 'thoát khỏi skinny fat sẽ ra sao.',
        intro:
          'Thoát skinny fat không phải sprint. Đó là recomposition chậm, cộng dồn, bền bỉ. Đây là những gì sẽ thay đổi, từng tháng, khi gánh nặng tinh thần biến mất.',
        weekLabel: 'Tháng',
        weeks: [
          {
            title: 'Nền tảng',
            desc: 'Set up hồ sơ trong 90 giây. Log bữa ăn thành thói quen 3 giây. Bạn đạt protein target mỗi ngày, giữ thâm hụt nhẹ, bắt đầu tập có cấu trúc. Cân ít đổi — nhưng cấu tạo cơ thể đã chuyển.',
          },
          {
            title: 'Thay đổi thấy rõ',
            desc: 'Quần áo vừa khác, đặc biệt ở vai và tay. Mặt sắc nét hơn. Bạn thấy đường nét cơ đầu tiên. Mỡ giảm, cơ tăng. Cân có thể y nguyên, đúng cách recomp hoạt động.',
          },
          {
            title: 'Hết skinny fat',
            desc: 'Hình dáng cơ rõ ràng trong áo thun. Mỡ ở mức lean. Nhìn khỏe, không còn mềm. Gánh nặng tinh thần biến mất, thói quen đã khóa, và bạn cuối cùng hiểu cơ thể mình.',
          },
        ],
        outro:
          '3 tháng nữa bạn sẽ hoặc đã dùng thời gian đó, hoặc chưa. Nutree đảm bảo thời gian đó thực sự xây nên cơ thể bạn muốn, không phải chỉ là phiên bản nhỏ hơn của cơ thể cũ.',
      },
      cta: {
        title: 'Thoát skinny fat mà không cần mất trí.',
        subtext:
          'Xây dựng kế hoạch dinh dưỡng cá nhân hóa và có hướng dẫn thông minh hơn cho từng bữa ăn.',
        downloadOnThe: 'Tải trên',
        appStore: 'App Store',
        fineprint: 'iOS có sẵn. Android sắp ra mắt. Giá hiển thị trên App Store trước khi đăng ký.',
      },
    },
  },
};
