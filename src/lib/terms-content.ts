import type { Locale } from './translations';
import type { LegalPageContent } from './legal-content';

const dates = {
  en: { effectiveDate: 'July 13, 2026', updatedDate: 'July 13, 2026', version: '3.0' },
  vi: { effectiveDate: '13 tháng 7, 2026', updatedDate: '13 tháng 7, 2026', version: '3.0' },
};

export const termsContent: Record<Locale, LegalPageContent> = {
  en: {
    title: 'Terms of Service',
    description: 'Terms and conditions for using Nutree.',
    toc: 'Table of Contents',
    backHome: 'Back to Home',
    home: 'Home',
    copyright: 'Nutree AI. All rights reserved.',
    links: { privacy: 'Privacy Policy', terms: 'Terms of Service' },
    ...dates.en,
    sections: [
      {
        title: 'Agreement to Terms',
        body: [
          'By accessing or using Nutree (the "App"), you agree to be bound by these Terms of Service ("Terms").',
          'These Terms form a legal agreement between you and NUTREE AI VIETNAM JOINT STOCK COMPANY ("Nutree", "we", "us", or "our"). If you do not agree, do not access or use the App.',
        ],
      },
      {
        title: 'Eligibility',
        body: [
          'You must be at least 12 years old to use Nutree. If you are under 16, your account may be activated and your health, nutrition, or content data may be processed only after Nutree receives verifiable consent from your parent or legal guardian. Nutree may also request your age-appropriate assent.',
          'If you are between 16 and 18, you confirm that your parent or legal guardian has authorized your use of Nutree and any purchase where required by applicable law or the payment platform.',
          'An App Store age rating of 12+ indicates content suitability only. It does not replace consent, contractual-capacity, or data-protection requirements under applicable law. Nutree may request reasonable information to verify age and legal authority.',
        ],
      },
      {
        title: 'Account Registration',
        body: [
          'You may create a Nutree account using Google Sign-In, Apple Sign-In, or another supported method.',
          'You agree to provide accurate, current, and complete information, including age-band and guardian information where required, and to update it when needed.',
          'You may not misrepresent your age, identity, guardian authority, consent status, or eligibility. Nutree may suspend activation or request reasonable evidence of age or parent/legal guardian consent before enabling features that process health, nutrition, meal-photo, or other sensitive data.',
          'You are responsible for keeping your account credentials secure and for activity under your account.',
        ],
      },
      {
        title: 'Services Description',
        body: [
          'Nutree provides AI-powered meal photo and meal text nutrition analysis, including estimated calories, macros, ingredients, and nutrition context.',
          'Nutree supports meal logging, nutrition tracking, progress dashboards, and meal suggestions based on your goals, preferences, and restrictions.',
          'AI results are estimates and may need review, editing, or verification. Nutree does not guarantee that every estimate is accurate, complete, or appropriate for your circumstances.',
        ],
      },
      {
        title: 'Subscription Terms',
        body: [
          'Some Nutree features are provided through subscriptions or in-app purchases processed by Apple App Store, Google Play, or another relevant platform.',
          'If you are under 18, any purchase or subscription must be authorized by your parent or legal guardian where required by law or the payment platform. Prices, trial periods, billing cycles, and automatic-renewal terms are shown before you confirm a purchase.',
          'Subscriptions may renew automatically unless cancelled at least 24 hours before the current billing period ends, or as otherwise stated by the payment platform.',
          'Deleting your Nutree account does not automatically cancel a subscription purchased through Apple App Store, Google Play, or another platform. You must cancel the subscription in the payment platform’s subscription management settings to avoid future renewals.',
          'Refunds are handled under the policies of the payment platform that processed the purchase.',
        ],
      },
      {
        title: 'User Content',
        body: [
          'When you upload meal photos, meal descriptions, notes, corrections, or other content, you grant Nutree a non-exclusive, worldwide, royalty-free license to host, store, process, analyze, display, and transmit that content solely to provide, secure, support, and improve the service as described in the Privacy Policy.',
          'For child users or sensitive health-related content, Nutree processes content only within the consent, guardian authorization, and legal limits that apply.',
          'Nutree will request separate consent where required before using user content for AI training or purposes beyond providing the service.',
          'You represent that you own or have rights to uploaded content and that it does not violate intellectual property rights, privacy rights, or applicable law.',
        ],
      },
      {
        title: 'Prohibited Uses',
        body: [
          'Do not use the App for illegal, harmful, deceptive, or unauthorized purposes.',
          'Do not reverse engineer, decompile, hack, scrape, collect data without permission, bypass age or consent controls, or interfere with server infrastructure.',
          'Do not upload malware, harmful content, false information, abusive content, or content that violates third-party rights.',
          'Do not impersonate another person, parent, guardian, or legal representative.',
        ],
      },
      {
        title: 'Medical Disclaimer',
        body: [
          'Important: Nutree is not a medical service and does not provide medical advice, diagnosis, treatment, or clinical nutrition care.',
          'The App provides general nutrition information for educational and informational purposes only. It is not a substitute for advice from a physician, registered dietitian, or other qualified professional.',
          'AI nutritional estimates may be inaccurate. Verify important information with reliable sources or healthcare professionals.',
          'Minors should use Nutree with adult supervision. Do not use the App to self-direct extreme dieting, unsafe weight-loss plans, eating-disorder behavior, or nutrition choices that may affect physical development.',
          'Consult a qualified healthcare professional before making dietary changes, especially if you are a minor, pregnant, have medical conditions, have allergies, take medication, or have a history of eating disorders.',
        ],
      },
      {
        title: 'Intellectual Property',
        body: [
          'All Nutree content, features, functionality, trademarks, and intellectual property, excluding user-generated content, are owned by Nutree and protected by applicable law.',
          'We grant you a limited, non-exclusive, non-transferable, revocable license to use the App for personal, non-commercial purposes under these Terms.',
        ],
      },
      {
        title: 'Disclaimers and Limitations',
        body: [
          'The App is provided "as is" and "as available" without warranties of any kind unless required by law.',
          'We do not guarantee that AI nutrition analysis is always accurate or complete, or that service will be uninterrupted, error-free, or completely secure.',
          'To the maximum extent permitted by law, Nutree is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the App.',
        ],
      },
      {
        title: 'Termination',
        body: [
          'Nutree may suspend, restrict, or terminate access if you violate these Terms, misrepresent age or consent status, create safety or security risk, infringe rights, misuse the service, fail payment verification, or if continued access would violate law or platform requirements.',
          'Where appropriate, Nutree may provide notice and an opportunity to correct the issue before termination.',
          'A parent or legal guardian may request closure of a child account. You may delete your own account anytime in app settings. Your data will be handled under the Privacy Policy.',
          'Upon termination, your right to use the App ends immediately. Provisions that should survive termination remain effective.',
        ],
      },
      {
        title: 'Governing Law and Dispute Resolution',
        body: [
          'These Terms and related disputes are governed by Vietnamese law, without regard to conflict of law principles.',
          'Disputes will first be addressed through good-faith negotiation.',
          'If unresolved within 30 days, the parties agree to submit disputes to competent courts in Vietnam unless mandatory consumer law requires another forum.',
        ],
      },
      {
        title: 'Changes to Terms',
        body: [
          'We may modify these Terms to reflect product, legal, technology, or operational changes. Important changes will be communicated in the App or by email.',
          'If a change materially affects children, sensitive data, payment terms, or processing that requires consent, Nutree will request renewed consent where required by law instead of relying only on continued use.',
          'If you do not agree to updated Terms, stop using the App and, where applicable, cancel any active subscription through the payment platform.',
        ],
      },
      {
        title: 'Contact',
        body: [
          'For questions about these Terms, contact NUTREE AI VIETNAM JOINT STOCK COMPANY at legal@nutreeai.com.',
          'Privacy requests may be sent to privacy@nutreeai.com. Nutree may publish additional company registration details, address, and request channels in the App or on its website as they are finalized.',
        ],
      },
    ],
  },
  vi: {
    title: 'Điều khoản sử dụng',
    description: 'Các điều kiện khi sử dụng ứng dụng và dịch vụ Nutree.',
    toc: 'Mục lục',
    backHome: 'Về trang chủ',
    home: 'Trang chủ',
    copyright: 'Nutree AI. Bảo lưu mọi quyền.',
    links: { privacy: 'Chính sách bảo mật', terms: 'Điều khoản sử dụng' },
    ...dates.vi,
    sections: [
      {
        title: 'Chấp thuận điều khoản',
        body: [
          'Khi truy cập hoặc sử dụng Nutree ("Ứng dụng"), bạn đồng ý bị ràng buộc bởi các Điều khoản sử dụng này ("Điều khoản").',
          'Điều khoản này tạo thành thỏa thuận pháp lý giữa bạn và NUTREE AI VIETNAM JOINT STOCK COMPANY ("Nutree", "chúng tôi"). Nếu bạn không đồng ý, vui lòng không truy cập hoặc sử dụng Ứng dụng.',
        ],
      },
      {
        title: 'Điều kiện sử dụng',
        body: [
          'Bạn phải từ đủ 12 tuổi trở lên để sử dụng Nutree. Nếu bạn chưa đủ 16 tuổi, việc tạo tài khoản và xử lý dữ liệu sức khỏe, dinh dưỡng hoặc nội dung của bạn chỉ được thực hiện sau khi Nutree nhận được sự đồng ý có thể kiểm chứng của cha mẹ hoặc người giám hộ hợp pháp, đồng thời có thể yêu cầu sự xác nhận phù hợp của chính bạn.',
          'Nếu bạn từ đủ 16 tuổi đến dưới 18 tuổi, bạn xác nhận rằng bạn đã được cha mẹ hoặc người giám hộ cho phép sử dụng Nutree và thực hiện giao dịch mua hàng khi pháp luật hoặc nền tảng thanh toán yêu cầu.',
          'Xếp hạng 12+ trên cửa hàng ứng dụng chỉ phản ánh mức độ phù hợp của nội dung. Xếp hạng này không thay thế yêu cầu về sự đồng ý, năng lực giao kết hoặc bảo vệ dữ liệu theo pháp luật áp dụng. Nutree có thể yêu cầu thông tin hợp lý để xác minh độ tuổi và quyền đại diện.',
        ],
      },
      {
        title: 'Đăng ký tài khoản',
        body: [
          'Bạn có thể tạo tài khoản Nutree bằng Google Sign-In, Apple Sign-In hoặc phương thức được hỗ trợ khác.',
          'Bạn đồng ý cung cấp thông tin chính xác, hiện tại và đầy đủ, bao gồm nhóm tuổi và thông tin người giám hộ khi cần, đồng thời cập nhật khi có thay đổi.',
          'Bạn không được giả mạo tuổi, danh tính, quyền đại diện, trạng thái consent hoặc điều kiện sử dụng. Nutree có thể tạm dừng kích hoạt hoặc yêu cầu bằng chứng hợp lý về tuổi hoặc consent của cha mẹ/người giám hộ trước khi bật các tính năng xử lý dữ liệu sức khỏe, dinh dưỡng, ảnh bữa ăn hoặc dữ liệu nhạy cảm khác.',
          'Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình.',
        ],
      },
      {
        title: 'Mô tả dịch vụ',
        body: [
          'Nutree cung cấp phân tích dinh dưỡng từ ảnh hoặc mô tả bữa ăn bằng AI, bao gồm ước tính calo, macro, nguyên liệu và ngữ cảnh dinh dưỡng.',
          'Nutree hỗ trợ ghi nhận bữa ăn, theo dõi dinh dưỡng, trực quan hóa tiến độ và gợi ý bữa ăn dựa trên mục tiêu, sở thích và hạn chế ăn uống của bạn.',
          'Các kết quả AI là ước tính và có thể cần được bạn xem lại, chỉnh sửa hoặc xác minh. Nutree không bảo đảm mọi ước tính luôn chính xác, đầy đủ hoặc phù hợp với hoàn cảnh của bạn.',
        ],
      },
      {
        title: 'Gói đăng ký',
        body: [
          'Một số tính năng của Nutree được cung cấp thông qua gói đăng ký hoặc mua trong ứng dụng và được xử lý qua Apple App Store, Google Play hoặc nền tảng liên quan.',
          'Nếu bạn chưa đủ 18 tuổi, mọi giao dịch mua hoặc đăng ký phải được cha mẹ/người giám hộ cho phép khi pháp luật hoặc nền tảng thanh toán yêu cầu. Giá, thời gian dùng thử, chu kỳ thanh toán và điều kiện tự động gia hạn được hiển thị trước khi bạn xác nhận giao dịch.',
          'Gói đăng ký có thể tự động gia hạn trừ khi bạn hủy ít nhất 24 giờ trước khi kỳ thanh toán hiện tại kết thúc, hoặc theo điều kiện khác do nền tảng thanh toán nêu.',
          'Xóa tài khoản Nutree không tự động hủy gói đăng ký đã mua qua Apple App Store, Google Play hoặc nền tảng khác. Bạn phải hủy gói trong phần quản lý subscription của nền tảng thanh toán để tránh các lần gia hạn trong tương lai.',
          'Hoàn tiền được xử lý theo chính sách của nền tảng thanh toán đã xử lý giao dịch.',
        ],
      },
      {
        title: 'Nội dung người dùng',
        body: [
          'Khi tải ảnh bữa ăn, mô tả bữa ăn, ghi chú, nội dung chỉnh sửa hoặc nội dung khác lên Nutree, bạn cấp cho Nutree quyền không độc quyền, toàn cầu, miễn phí bản quyền để lưu trữ, xử lý, phân tích, hiển thị và truyền tải nội dung đó chỉ nhằm cung cấp, bảo mật, hỗ trợ và cải thiện dịch vụ như mô tả trong Chính sách bảo mật.',
          'Đối với người dùng là trẻ em hoặc nội dung sức khỏe nhạy cảm, Nutree chỉ xử lý nội dung trong phạm vi consent, quyền đại diện của người giám hộ và giới hạn pháp luật áp dụng.',
          'Nutree sẽ xin consent riêng khi pháp luật yêu cầu trước khi dùng nội dung người dùng cho huấn luyện AI hoặc mục đích ngoài việc cung cấp dịch vụ.',
          'Bạn cam kết mình sở hữu hoặc có quyền cần thiết đối với nội dung đã tải lên, và nội dung đó không vi phạm quyền sở hữu trí tuệ, quyền riêng tư hoặc pháp luật áp dụng.',
        ],
      },
      {
        title: 'Các hành vi bị cấm',
        body: [
          'Không sử dụng Ứng dụng cho mục đích bất hợp pháp, gây hại, lừa dối hoặc trái phép.',
          'Không cố gắng reverse engineer, decompile, hack, scrape, thu thập dữ liệu trái phép, vượt age gate hoặc consent control, hoặc can thiệp vào hạ tầng máy chủ.',
          'Không tải lên mã độc, nội dung gây hại, thông tin giả mạo, nội dung lạm dụng hoặc nội dung vi phạm quyền của bên thứ ba.',
          'Không mạo danh người khác, cha mẹ, người giám hộ hoặc người đại diện hợp pháp.',
        ],
      },
      {
        title: 'Tuyên bố miễn trừ y tế',
        body: [
          'Quan trọng: Nutree không phải dịch vụ y tế và không cung cấp tư vấn, chẩn đoán, điều trị hoặc chăm sóc dinh dưỡng lâm sàng.',
          'Ứng dụng chỉ cung cấp thông tin dinh dưỡng chung cho mục đích giáo dục và tham khảo, không thay thế lời khuyên từ bác sĩ, chuyên gia dinh dưỡng được cấp phép hoặc chuyên gia đủ điều kiện khác.',
          'Ước tính dinh dưỡng do AI tạo có thể không chính xác. Hãy xác minh thông tin quan trọng với nguồn đáng tin cậy hoặc chuyên gia y tế.',
          'Người chưa thành niên nên dùng Nutree dưới sự giám sát của người lớn. Không dùng Ứng dụng để tự đặt chế độ ăn kiêng cực đoan, kế hoạch giảm cân không an toàn, hành vi rối loạn ăn uống hoặc lựa chọn dinh dưỡng có thể ảnh hưởng đến phát triển thể chất.',
          'Luôn tham khảo chuyên gia y tế đủ điều kiện trước khi thay đổi chế độ ăn, đặc biệt nếu bạn là người chưa thành niên, đang mang thai, có bệnh nền, dị ứng, đang dùng thuốc hoặc có tiền sử rối loạn ăn uống.',
        ],
      },
      {
        title: 'Sở hữu trí tuệ',
        body: [
          'Toàn bộ nội dung, tính năng, chức năng, nhãn hiệu và tài sản trí tuệ của Nutree, trừ nội dung do người dùng tạo, thuộc sở hữu của Nutree và được bảo vệ bởi luật liên quan.',
          'Chúng tôi cấp cho bạn giấy phép giới hạn, không độc quyền, không chuyển nhượng và có thể thu hồi để sử dụng Ứng dụng cho mục đích cá nhân, phi thương mại theo Điều khoản này.',
        ],
      },
      {
        title: 'Miễn trừ và giới hạn trách nhiệm',
        body: [
          'Ứng dụng được cung cấp trên cơ sở "nguyên trạng" và "sẵn có", không có bảo đảm dưới bất kỳ hình thức nào trừ khi pháp luật bắt buộc.',
          'Chúng tôi không bảo đảm phân tích dinh dưỡng AI luôn chính xác hoặc đầy đủ, dịch vụ luôn không gián đoạn, không lỗi hoặc an toàn tuyệt đối.',
          'Trong phạm vi tối đa pháp luật cho phép, Nutree không chịu trách nhiệm đối với thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hệ quả hoặc mang tính trừng phạt phát sinh từ việc sử dụng hoặc không thể sử dụng Ứng dụng.',
        ],
      },
      {
        title: 'Chấm dứt',
        body: [
          'Nutree có thể tạm ngưng, hạn chế hoặc chấm dứt quyền truy cập nếu bạn vi phạm Điều khoản, giả mạo tuổi hoặc trạng thái consent, tạo rủi ro an toàn hoặc bảo mật, xâm phạm quyền, lạm dụng dịch vụ, không xác minh được thanh toán hoặc nếu việc tiếp tục truy cập vi phạm pháp luật hoặc yêu cầu nền tảng.',
          'Khi phù hợp, Nutree có thể thông báo và cho bạn cơ hội khắc phục trước khi chấm dứt.',
          'Cha mẹ hoặc người giám hộ hợp pháp có thể yêu cầu đóng tài khoản trẻ. Bạn có thể xóa tài khoản của mình bất cứ lúc nào trong cài đặt ứng dụng. Dữ liệu của bạn sẽ được xử lý theo Chính sách bảo mật.',
          'Khi chấm dứt, quyền sử dụng Ứng dụng của bạn dừng ngay lập tức. Các điều khoản có bản chất cần tiếp tục hiệu lực vẫn sẽ được duy trì.',
        ],
      },
      {
        title: 'Luật áp dụng và giải quyết tranh chấp',
        body: [
          'Điều khoản này và mọi tranh chấp liên quan được điều chỉnh bởi pháp luật Việt Nam, không xét đến nguyên tắc xung đột pháp luật.',
          'Mọi tranh chấp trước hết sẽ được các bên thương lượng thiện chí.',
          'Nếu không thể giải quyết trong vòng 30 ngày, các bên đồng ý đưa tranh chấp ra tòa án có thẩm quyền tại Việt Nam, trừ khi luật bảo vệ người tiêu dùng bắt buộc một cơ chế khác.',
        ],
      },
      {
        title: 'Thay đổi điều khoản',
        body: [
          'Chúng tôi có thể sửa đổi Điều khoản để phản ánh thay đổi về sản phẩm, pháp luật, công nghệ hoặc vận hành. Các thay đổi quan trọng sẽ được thông báo trong Ứng dụng hoặc qua email.',
          'Nếu thay đổi ảnh hưởng đáng kể đến trẻ em, dữ liệu nhạy cảm, điều kiện thanh toán hoặc hoạt động xử lý cần consent, Nutree sẽ xin consent mới khi pháp luật yêu cầu thay vì chỉ dựa vào việc tiếp tục sử dụng.',
          'Nếu không đồng ý với Điều khoản cập nhật, bạn phải ngừng sử dụng Ứng dụng và, khi có liên quan, hủy mọi gói đăng ký đang hoạt động qua nền tảng thanh toán.',
        ],
      },
      {
        title: 'Liên hệ',
        body: [
          'Nếu có câu hỏi về Điều khoản này, liên hệ NUTREE AI VIETNAM JOINT STOCK COMPANY tại legal@nutreeai.com.',
          'Yêu cầu về quyền riêng tư có thể gửi tới privacy@nutreeai.com. Nutree có thể công bố thêm thông tin đăng ký doanh nghiệp, địa chỉ và kênh yêu cầu trong Ứng dụng hoặc trên website khi được hoàn thiện.',
        ],
      },
    ],
  },
};
