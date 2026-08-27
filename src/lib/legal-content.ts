import type { Locale } from './translations';

export interface LegalSectionImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface LegalSection {
  title: string;
  body?: string[];
  table?: string[][];
  images?: LegalSectionImage[];
}

export interface LegalPageContent {
  title: string;
  description: string;
  effectiveDate: string;
  updatedDate: string;
  version: string;
  toc: string;
  backHome: string;
  home: string;
  copyright: string;
  sections: LegalSection[];
  links: {
    privacy: string;
    terms: string;
  };
  tableHeaders?: [string, string, string];
}

const dates = {
  en: { effectiveDate: 'July 13, 2026', updatedDate: 'July 13, 2026', version: '3.0' },
  vi: { effectiveDate: '13 tháng 7, 2026', updatedDate: '13 tháng 7, 2026', version: '3.0' },
};

export const privacyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Privacy Policy',
    description: 'How Nutree collects, uses, shares, retains, and protects personal data.',
    toc: 'Table of Contents',
    backHome: 'Back to Home',
    home: 'Home',
    copyright: 'Nutree. All rights reserved.',
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
    tableHeaders: ['Recipient', 'Purpose', 'Data Involved'],
    ...dates.en,
    sections: [
      {
        title: 'Introduction',
        body: [
          'This Policy explains how NUTREE AI VIETNAM JOINT STOCK COMPANY ("Nutree", "we", "us", or "our") collects, uses, shares, retains, and protects personal data when you use Nutree.',
          'This Policy is a privacy notice and does not, by itself, constitute consent to every processing activity. Where consent is required, Nutree will request a separate, clear, and purpose-specific confirmation from you or your parent or legal guardian.',
        ],
      },
      {
        title: 'Information We Collect',
        body: [
          'Account and identity data: name, email, sign-in identifier, user ID, account status, and support communications.',
          'Age and guardian data: age band, eligibility status, parent or legal guardian contact information, relationship, consent scope, policy version, consent timestamp, verification method, and withdrawal record where required.',
          'Profile and health-related data: height, weight, activity level, health or nutrition goals, dietary preferences, restrictions, nutrition history, and progress data.',
          'Meal and content data: meal photos, food logs, ingredients, portions, timestamps, calories, macros, micronutrients, corrections, and notes you enter.',
          'Device and technical data: device type, operating system, app version, diagnostics, crash logs, push notification tokens, and limited product analytics events.',
          'Apple Health or similar platform data is collected only after you authorize access through the operating system and only for the features you choose to use.',
        ],
      },
      {
        title: 'Sensitive Personal Data',
        body: [
          'Nutree processes some data that may be considered sensitive personal data, including health information, weight, height, activity level, health goals, nutrition history, meal photos, and data inferred from these details.',
          'Before processing sensitive data where consent is required, Nutree explains the sensitive nature of the data, the purposes of use, the recipients involved, and how consent can be withdrawn.',
          'Nutree limits access to sensitive data, applies appropriate safeguards, and does not use children’s health data for behavioral advertising.',
        ],
      },
      {
        title: 'Consent and Legal Grounds',
        body: [
          'Nutree processes data to provide the service, maintain security, comply with legal obligations, respond to requests, and support legitimate product operations where permitted by law.',
          'Nutree requests separate consent when required for health data, AI and image processing, Apple Health import, optional analytics or session replay, and marketing communications.',
          'Consent is not collected through pre-ticked boxes. Where Nutree records consent, it stores the accepted policy version, scope, time, and verification method so the choice can be demonstrated and later withdrawn.',
        ],
      },
      {
        title: 'How We Use Information',
        body: [
          'Provide meal photo analysis, food logging, nutrition estimates, progress tracking, and personalized meal suggestions.',
          'Create and maintain accounts, confirm eligibility, manage guardian consent workflows, process subscriptions, and provide support.',
          'Improve app reliability, measure feature performance, diagnose errors, prevent abuse, and comply with legal and platform requirements.',
          'Send service messages, reminders, progress updates, and optional marketing only where permitted.',
          'We do not sell personal data or use health data, minor data, or sensitive nutrition data for behavioral advertising.',
        ],
      },
      {
        title: 'Third-Party Services',
        body: [
          'Nutree uses service providers only for the purposes needed to operate the App. This list must match the production SDKs, backend services, and processors actually in use.',
        ],
        table: [
          ['Authentication provider, including Firebase Auth if enabled', 'Account sign-in and identity management', 'Email, user ID, authentication identifiers'],
          ['AI provider, such as Gemini, OpenAI, or another configured provider', 'Meal image or text analysis', 'Meal photos, meal descriptions, and nutrition context needed for the request'],
          ['Object storage or image hosting, such as Cloudinary or cloud storage', 'Store meal photos and related assets', 'Meal photos, image URLs, storage metadata'],
          ['RevenueCat, Apple App Store, Google Play, or payment platform', 'Subscription management and purchase verification', 'App user ID, purchase status, transaction metadata'],
          ['PostHog or product analytics provider', 'Product analytics; session replay only where enabled and lawful', 'Usage events, device information, masked session data'],
          ['Sentry or error monitoring provider', 'Crash and error diagnostics', 'Crash logs, device information, scrubbed diagnostic data'],
          ['Apple Health or platform health APIs', 'Import user-authorized health/activity data', 'Only data types approved by the user in the OS permission screen'],
          ['Food, translation, backend, cloud, and database providers', 'Food validation, translation, core processing, storage, and delivery', 'Data required for the requested feature or infrastructure function'],
        ],
      },
      {
        title: 'AI and Image Processing',
        body: [
          'When you scan or describe a meal, Nutree may send the image, text, and relevant nutrition context to its configured AI provider to identify foods and estimate nutrition.',
          'AI results are estimates. You can review, correct, or delete meal entries in the App. Nutree does not present AI output as medical advice.',
          'Nutree will align provider settings, contracts, retention terms, and this Policy. If Nutree uses any data for model training beyond providing the service, it will request separate consent where required.',
          'Meal photos and AI logs are retained only as needed for meal history, support, safety, legal compliance, and deletion workflows described in this Policy.',
        ],
      },
      {
        title: 'Analytics and Session Replay',
        body: [
          'Nutree may use analytics to understand product usage and improve reliability. Pre-consent analytics, where used, is limited to what is necessary and should not identify a child user.',
          'Session replay is disabled for users under 18. For all users, Nutree masks sensitive fields, meal photos, weight, goals, paywall screens, and other sensitive content where replay or diagnostics tooling is used.',
          'Nutree does not use health data, children’s data, or sensitive nutrition data for behavioral ads, lookalike audiences, or similar advertising purposes.',
        ],
      },
      {
        title: 'Children’s Privacy',
        body: [
          'Nutree is intended for users aged 12 and older. Under Vietnamese law, a person under 16 is a child. Before activating an account for a user aged 12 to under 16, or processing the user’s health, nutrition, meal-photo, or related personal data, Nutree requires verifiable consent from a parent or legal guardian and obtains the child’s age-appropriate assent where required.',
          'Nutree records who consented, when consent was given, the content and policy version accepted, the applicable scope, and the verification method. A parent or legal guardian may request access, correction, export, restriction, or deletion of the child’s data; withdraw consent; or request account closure through the App or at privacy@nutreeai.com.',
          'Until the consent process is completed, Nutree processes only the minimum information necessary to determine the user’s age group and contact a parent or legal guardian. Nutree does not permit meal-photo uploads, creation of a health profile, or session replay for an account that has not completed this process.',
          'For users outside Vietnam, Nutree applies local age thresholds and parental-consent requirements. If Nutree learns that it has collected data from an ineligible user without the required authorization, Nutree will restrict or stop processing and delete the data as required by applicable law.',
        ],
      },
      {
        title: 'Data Retention',
        body: [
          'Nutree retains personal data while your account is active and as long as needed to provide the service, comply with law, resolve disputes, enforce terms, maintain security, or prove consent history.',
          'When you delete your account, Nutree deletes or de-identifies active account data, meal logs, and photos according to its deletion workflow. Backups, security logs, payment records, and provider copies may follow separate retention schedules where legally or technically necessary.',
          'Consent records may be retained when needed to demonstrate that consent was obtained, changed, or withdrawn.',
        ],
      },
      {
        title: 'Your Rights',
        body: [
          'Depending on applicable law, you may request access, correction, export, restriction, deletion, objection, or withdrawal of consent for personal data.',
          'A parent or legal guardian may exercise these rights on behalf of a child after Nutree verifies the requester’s identity and authority.',
          'You can make requests through the App or by contacting privacy@nutreeai.com. Nutree will respond within the period required by applicable law.',
        ],
      },
      {
        title: 'Data Security',
        body: [
          'Nutree uses HTTPS/TLS in transit, access controls, provider safeguards, monitoring, and operational controls designed to protect personal data.',
          'Nutree works to limit sensitive data in logs, diagnostics, analytics, and support workflows. Error monitoring should scrub emails, health values, meal descriptions, image URLs, and similar sensitive payloads where feasible.',
          'No system is completely secure. If a data incident requires notification, Nutree will notify affected users, guardians, or regulators as required by applicable law.',
        ],
      },
      {
        title: 'International Users and Transfers',
        body: [
          'Nutree is operated by NUTREE AI VIETNAM JOINT STOCK COMPANY. Data may be processed in Vietnam and in other regions where our cloud, AI, analytics, payment, support, or infrastructure providers operate.',
          'For users outside Vietnam, Nutree applies local privacy and child-consent requirements where required. EU/EEA users may have GDPR rights, and United States child users may require verifiable parental consent under COPPA where applicable.',
          'Where cross-border safeguards, subprocessors, or local notices are required, Nutree will maintain appropriate documentation and disclosures.',
        ],
      },
      {
        title: 'Policy Changes',
        body: [
          'Nutree may update this Policy to reflect product, technology, legal, or operational changes.',
          'If a change materially affects children, sensitive data, or processing that requires consent, Nutree will request renewed consent where required by law instead of relying only on continued use.',
        ],
      },
      {
        title: 'Contact',
        body: [
          'For privacy questions or requests, contact NUTREE AI VIETNAM JOINT STOCK COMPANY at privacy@nutreeai.com.',
          'Legal notices may be sent to legal@nutreeai.com. Nutree may publish additional company registration details, address, and request channels in the App or on its website as they are finalized.',
        ],
      },
    ],
  },
  vi: {
    title: 'Chính sách bảo mật',
    description: 'Cách Nutree thu thập, sử dụng, chia sẻ, lưu giữ và bảo vệ dữ liệu cá nhân.',
    toc: 'Mục lục',
    backHome: 'Về trang chủ',
    home: 'Trang chủ',
    copyright: 'Nutree. Bảo lưu mọi quyền.',
    links: { privacy: 'Chính sách bảo mật', terms: 'Điều khoản sử dụng' },
    tableHeaders: ['Bên nhận', 'Mục đích', 'Dữ liệu liên quan'],
    ...dates.vi,
    sections: [
      {
        title: 'Giới thiệu',
        body: [
          'Chính sách này giải thích cách NUTREE AI VIETNAM JOINT STOCK COMPANY ("Nutree", "chúng tôi") thu thập, sử dụng, chia sẻ, lưu giữ và bảo vệ dữ liệu cá nhân khi bạn sử dụng Nutree.',
          'Chính sách này là thông báo về quyền riêng tư và không tự nó cấu thành sự đồng ý cho mọi hoạt động xử lý dữ liệu. Khi pháp luật yêu cầu sự đồng ý, Nutree sẽ yêu cầu bạn hoặc cha mẹ/người giám hộ hợp pháp xác nhận riêng, rõ ràng và theo mục đích cụ thể.',
        ],
      },
      {
        title: 'Thông tin chúng tôi thu thập',
        body: [
          'Dữ liệu tài khoản và định danh: tên, email, định danh đăng nhập, user ID, trạng thái tài khoản và nội dung hỗ trợ.',
          'Dữ liệu tuổi và người giám hộ: nhóm tuổi, trạng thái đủ điều kiện, thông tin liên hệ của cha mẹ/người giám hộ, quan hệ đại diện, phạm vi đồng ý, phiên bản chính sách, thời điểm đồng ý, phương thức xác minh và bản ghi rút lại nếu cần.',
          'Dữ liệu hồ sơ và sức khỏe liên quan: chiều cao, cân nặng, mức độ hoạt động, mục tiêu sức khỏe hoặc dinh dưỡng, sở thích ăn uống, hạn chế ăn uống, lịch sử dinh dưỡng và tiến độ.',
          'Dữ liệu bữa ăn và nội dung: ảnh bữa ăn, nhật ký món ăn, nguyên liệu, khẩu phần, thời gian ghi nhận, calo, macro, vi chất, nội dung chỉnh sửa và ghi chú bạn nhập.',
          'Dữ liệu thiết bị và kỹ thuật: loại thiết bị, hệ điều hành, phiên bản app, dữ liệu chẩn đoán, crash log, token thông báo đẩy và sự kiện phân tích sản phẩm ở mức giới hạn.',
          'Dữ liệu từ Apple Health hoặc nền tảng tương tự chỉ được thu thập sau khi bạn cấp quyền qua hệ điều hành và chỉ cho tính năng bạn chọn sử dụng.',
        ],
      },
      {
        title: 'Dữ liệu cá nhân nhạy cảm',
        body: [
          'Nutree xử lý một số dữ liệu có thể được xem là dữ liệu cá nhân nhạy cảm, bao gồm thông tin sức khỏe, cân nặng, chiều cao, mức độ hoạt động, mục tiêu sức khỏe, lịch sử dinh dưỡng, ảnh bữa ăn và dữ liệu được suy luận từ các thông tin này.',
          'Trước khi xử lý dữ liệu nhạy cảm trong trường hợp pháp luật yêu cầu consent, Nutree thông báo rõ tính chất nhạy cảm, mục đích sử dụng, bên nhận dữ liệu và lựa chọn rút lại sự đồng ý.',
          'Nutree giới hạn quyền truy cập, áp dụng biện pháp bảo vệ phù hợp và không sử dụng dữ liệu sức khỏe của trẻ em cho quảng cáo hành vi.',
        ],
      },
      {
        title: 'Sự đồng ý và căn cứ xử lý',
        body: [
          'Nutree xử lý dữ liệu để cung cấp dịch vụ, duy trì bảo mật, tuân thủ nghĩa vụ pháp lý, phản hồi yêu cầu và hỗ trợ vận hành sản phẩm hợp pháp.',
          'Nutree yêu cầu consent riêng khi pháp luật yêu cầu đối với dữ liệu sức khỏe, AI và xử lý hình ảnh, nhập dữ liệu Apple Health, analytics hoặc session replay tùy chọn và truyền thông marketing.',
          'Nutree không thu consent bằng ô chọn được tick sẵn. Khi lưu bằng chứng consent, Nutree ghi nhận phiên bản chính sách, phạm vi, thời điểm và phương thức xác minh để có thể chứng minh và cho phép rút lại.',
        ],
      },
      {
        title: 'Cách chúng tôi sử dụng thông tin',
        body: [
          'Cung cấp phân tích ảnh bữa ăn, ghi nhận món ăn, ước tính dinh dưỡng, theo dõi tiến độ và gợi ý bữa ăn cá nhân hóa.',
          'Tạo và duy trì tài khoản, xác nhận điều kiện sử dụng, vận hành quy trình consent của người giám hộ, xử lý gói đăng ký và hỗ trợ người dùng.',
          'Cải thiện độ ổn định của app, đo lường hiệu quả tính năng, chẩn đoán lỗi, ngăn lạm dụng và tuân thủ yêu cầu pháp luật hoặc nền tảng.',
          'Gửi thông báo dịch vụ, nhắc nhở, cập nhật tiến độ và marketing tùy chọn khi được phép.',
          'Chúng tôi không bán dữ liệu cá nhân, không dùng dữ liệu sức khỏe, dữ liệu trẻ em hoặc dữ liệu dinh dưỡng nhạy cảm cho quảng cáo hành vi.',
        ],
      },
      {
        title: 'Dịch vụ bên thứ ba',
        body: [
          'Nutree chỉ dùng nhà cung cấp dịch vụ cho các mục đích cần thiết để vận hành Ứng dụng. Danh sách này phải khớp với SDK, backend service và processor thực tế đang dùng trong production.',
        ],
        table: [
          ['Nhà cung cấp xác thực, bao gồm Firebase Auth nếu được bật', 'Đăng nhập và quản lý định danh tài khoản', 'Email, user ID, định danh xác thực'],
          ['Nhà cung cấp AI như Gemini, OpenAI hoặc provider đang cấu hình', 'Phân tích ảnh hoặc mô tả bữa ăn', 'Ảnh bữa ăn, mô tả bữa ăn và ngữ cảnh dinh dưỡng cần cho yêu cầu'],
          ['Object storage hoặc image hosting như Cloudinary hoặc cloud storage', 'Lưu ảnh bữa ăn và tài sản liên quan', 'Ảnh bữa ăn, URL ảnh, metadata lưu trữ'],
          ['RevenueCat, Apple App Store, Google Play hoặc nền tảng thanh toán', 'Quản lý gói đăng ký và xác minh giao dịch', 'App user ID, trạng thái mua hàng, metadata giao dịch'],
          ['PostHog hoặc nhà cung cấp phân tích sản phẩm', 'Phân tích sản phẩm; session replay chỉ khi được bật và hợp pháp', 'Sự kiện sử dụng, thông tin thiết bị, dữ liệu phiên đã mask'],
          ['Sentry hoặc nhà cung cấp theo dõi lỗi', 'Chẩn đoán crash và lỗi', 'Crash log, thông tin thiết bị, dữ liệu chẩn đoán đã scrub'],
          ['Apple Health hoặc API sức khỏe của nền tảng', 'Nhập dữ liệu sức khỏe/hoạt động do người dùng cho phép', 'Chỉ các loại dữ liệu được người dùng cấp quyền trong màn hình OS'],
          ['Nhà cung cấp food, dịch thuật, backend, cloud và database', 'Xác minh thực phẩm, dịch thuật, xử lý lõi, lưu trữ và phân phối dịch vụ', 'Dữ liệu cần cho tính năng hoặc chức năng hạ tầng được yêu cầu'],
        ],
      },
      {
        title: 'AI và xử lý hình ảnh',
        body: [
          'Khi bạn scan hoặc mô tả bữa ăn, Nutree có thể gửi ảnh, văn bản và ngữ cảnh dinh dưỡng liên quan tới nhà cung cấp AI đang cấu hình để nhận diện món ăn và ước tính dinh dưỡng.',
          'Kết quả AI là ước tính. Bạn có thể xem lại, chỉnh sửa hoặc xóa bữa ăn trong Ứng dụng. Nutree không trình bày kết quả AI như tư vấn y tế.',
          'Nutree sẽ đồng bộ cấu hình provider, hợp đồng, điều khoản lưu giữ và Chính sách này. Nếu Nutree dùng dữ liệu cho huấn luyện mô hình ngoài mục đích cung cấp dịch vụ, Nutree sẽ xin consent riêng khi pháp luật yêu cầu.',
          'Ảnh bữa ăn và log AI chỉ được lưu khi cần cho lịch sử bữa ăn, hỗ trợ, an toàn, tuân thủ pháp luật và quy trình xóa dữ liệu nêu trong Chính sách này.',
        ],
      },
      {
        title: 'Analytics và session replay',
        body: [
          'Nutree có thể dùng analytics để hiểu cách sản phẩm được sử dụng và cải thiện độ ổn định. Analytics trước consent, nếu có, chỉ ở mức cần thiết và không nên định danh người dùng là trẻ em.',
          'Session replay bị tắt cho người dùng dưới 18 tuổi. Với mọi người dùng, Nutree mask trường nhạy cảm, ảnh bữa ăn, cân nặng, mục tiêu, màn hình paywall và nội dung nhạy cảm khác khi dùng replay hoặc công cụ chẩn đoán.',
          'Nutree không dùng dữ liệu sức khỏe, dữ liệu trẻ em hoặc dữ liệu dinh dưỡng nhạy cảm cho quảng cáo hành vi, lookalike audience hoặc mục đích quảng cáo tương tự.',
        ],
      },
      {
        title: 'Quyền riêng tư của trẻ em',
        body: [
          'Nutree dành cho người dùng từ đủ 12 tuổi trở lên. Theo pháp luật Việt Nam, người dưới 16 tuổi là trẻ em. Trước khi kích hoạt tài khoản của người dùng từ 12 đến dưới 16 tuổi hoặc xử lý dữ liệu sức khỏe, dinh dưỡng, ảnh bữa ăn và dữ liệu cá nhân liên quan, Nutree yêu cầu sự đồng ý có thể kiểm chứng của cha mẹ hoặc người giám hộ hợp pháp và ghi nhận sự xác nhận phù hợp của trẻ khi cần.',
          'Nutree lưu bằng chứng về người đã đồng ý, thời điểm, nội dung, phiên bản chính sách, phạm vi và phương thức thể hiện sự đồng ý. Cha mẹ hoặc người giám hộ có thể yêu cầu truy cập, chỉnh sửa, xuất, hạn chế xử lý hoặc xóa dữ liệu của trẻ; rút lại sự đồng ý; hoặc yêu cầu đóng tài khoản thông qua cài đặt trong ứng dụng hoặc privacy@nutreeai.com.',
          'Trước khi hoàn tất quy trình đồng ý, Nutree chỉ xử lý lượng thông tin tối thiểu cần thiết để xác định nhóm tuổi và liên hệ với cha mẹ/người giám hộ. Nutree không cho phép tải ảnh bữa ăn, tạo hồ sơ sức khỏe hoặc kích hoạt session replay cho tài khoản chưa hoàn tất quy trình này.',
          'Đối với người dùng ngoài Việt Nam, Nutree áp dụng ngưỡng tuổi và yêu cầu đồng ý của phụ huynh theo pháp luật địa phương. Nếu Nutree phát hiện đã thu thập dữ liệu của người không đủ điều kiện mà chưa có sự cho phép cần thiết, Nutree sẽ hạn chế hoặc ngừng xử lý và thực hiện xóa dữ liệu theo pháp luật áp dụng.',
        ],
      },
      {
        title: 'Lưu giữ dữ liệu',
        body: [
          'Nutree lưu dữ liệu cá nhân khi tài khoản còn hoạt động và trong thời gian cần thiết để cung cấp dịch vụ, tuân thủ pháp luật, giải quyết tranh chấp, thực thi điều khoản, duy trì bảo mật hoặc chứng minh lịch sử consent.',
          'Khi bạn xóa tài khoản, Nutree xóa hoặc phi định danh dữ liệu tài khoản đang hoạt động, nhật ký bữa ăn và ảnh theo quy trình xóa dữ liệu. Backup, log bảo mật, hồ sơ thanh toán và bản sao tại nhà cung cấp có thể có lịch lưu giữ riêng khi pháp luật hoặc kỹ thuật yêu cầu.',
          'Bản ghi consent có thể được lưu khi cần chứng minh rằng consent đã được cấp, thay đổi hoặc rút lại.',
        ],
      },
      {
        title: 'Quyền của bạn',
        body: [
          'Tùy theo pháp luật áp dụng, bạn có thể yêu cầu truy cập, chỉnh sửa, xuất, hạn chế xử lý, xóa, phản đối hoặc rút lại consent đối với dữ liệu cá nhân.',
          'Cha mẹ hoặc người giám hộ hợp pháp có thể thực hiện các quyền này thay mặt trẻ sau khi Nutree xác minh danh tính và thẩm quyền đại diện.',
          'Bạn có thể gửi yêu cầu qua Ứng dụng hoặc liên hệ privacy@nutreeai.com. Nutree sẽ phản hồi trong thời hạn pháp luật áp dụng.',
        ],
      },
      {
        title: 'Bảo mật dữ liệu',
        body: [
          'Nutree sử dụng HTTPS/TLS khi truyền dữ liệu, kiểm soát truy cập, biện pháp bảo vệ của nhà cung cấp, giám sát và kiểm soát vận hành để bảo vệ dữ liệu cá nhân.',
          'Nutree nỗ lực giới hạn dữ liệu nhạy cảm trong log, chẩn đoán, analytics và quy trình hỗ trợ. Công cụ theo dõi lỗi nên scrub email, giá trị sức khỏe, mô tả bữa ăn, URL ảnh và payload nhạy cảm tương tự khi khả thi.',
          'Không hệ thống nào an toàn tuyệt đối. Nếu sự cố dữ liệu yêu cầu thông báo, Nutree sẽ thông báo cho người dùng, người giám hộ hoặc cơ quan quản lý theo pháp luật áp dụng.',
        ],
      },
      {
        title: 'Người dùng quốc tế và chuyển dữ liệu xuyên biên giới',
        body: [
          'Nutree được vận hành bởi NUTREE AI VIETNAM JOINT STOCK COMPANY. Dữ liệu có thể được xử lý tại Việt Nam và tại các khu vực khác nơi nhà cung cấp cloud, AI, analytics, thanh toán, hỗ trợ hoặc hạ tầng hoạt động.',
          'Đối với người dùng ngoài Việt Nam, Nutree áp dụng yêu cầu địa phương về quyền riêng tư và consent của trẻ em khi pháp luật yêu cầu. Người dùng EU/EEA có thể có quyền theo GDPR, và người dùng là trẻ em tại Hoa Kỳ có thể cần verifiable parental consent theo COPPA khi áp dụng.',
          'Khi cần safeguard chuyển dữ liệu xuyên biên giới, subprocessors hoặc thông báo địa phương, Nutree sẽ duy trì tài liệu và công bố phù hợp.',
        ],
      },
      {
        title: 'Thay đổi chính sách',
        body: [
          'Nutree có thể cập nhật Chính sách này để phản ánh thay đổi về sản phẩm, công nghệ, pháp luật hoặc vận hành.',
          'Nếu thay đổi ảnh hưởng đáng kể đến trẻ em, dữ liệu nhạy cảm hoặc hoạt động xử lý cần consent, Nutree sẽ xin consent mới khi pháp luật yêu cầu thay vì chỉ dựa vào việc tiếp tục sử dụng.',
        ],
      },
      {
        title: 'Liên hệ',
        body: [
          'Nếu có câu hỏi hoặc yêu cầu về quyền riêng tư, liên hệ NUTREE AI VIETNAM JOINT STOCK COMPANY tại privacy@nutreeai.com.',
          'Thông báo pháp lý có thể gửi tới legal@nutreeai.com. Nutree có thể công bố thêm thông tin đăng ký doanh nghiệp, địa chỉ và kênh yêu cầu trong Ứng dụng hoặc trên website khi được hoàn thiện.',
        ],
      },
    ],
  },
};
