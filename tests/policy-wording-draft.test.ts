import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cancellationPolicyContent } from '../src/lib/cancellation-policy-content';
import { complaintsPolicyContent } from '../src/lib/complaints-policy-content';
import { privacyContent } from '../src/lib/legal-content';
import { paymentPolicyContent } from '../src/lib/payment-policy-content';
import { pricingPolicyContent } from '../src/lib/pricing-policy-content';
import { termsContent } from '../src/lib/terms-content';
import { translations } from '../src/lib/translations';
import { usagePolicyContent } from '../src/lib/usage-policy-content';

const AGE_EN =
  'Nutree is intended for users aged 12 and older. Under Vietnamese law, a person under 16 is a child. Before activating an account for a user aged 12 to under 16, or processing the user’s health, nutrition, meal-photo, or related personal data, Nutree requires verifiable consent from a parent or legal guardian and obtains the child’s age-appropriate assent where required.';
const AGE_VI =
  'Nutree dành cho người dùng từ đủ 12 tuổi trở lên. Theo pháp luật Việt Nam, người dưới 16 tuổi là trẻ em. Trước khi kích hoạt tài khoản của người dùng từ 12 đến dưới 16 tuổi hoặc xử lý dữ liệu sức khỏe, dinh dưỡng, ảnh bữa ăn và dữ liệu cá nhân liên quan, Nutree yêu cầu sự đồng ý có thể kiểm chứng của cha mẹ hoặc người giám hộ hợp pháp và ghi nhận sự xác nhận phù hợp của trẻ khi cần.';
const TERMS_AGE_EN =
  'You must be at least 12 years old to use Nutree. If you are under 16, your account may be activated and your health, nutrition, or content data may be processed only after Nutree receives verifiable consent from your parent or legal guardian. Nutree may also request your age-appropriate assent.';
const TERMS_AGE_VI =
  'Bạn phải từ đủ 12 tuổi trở lên để sử dụng Nutree. Nếu bạn chưa đủ 16 tuổi, việc tạo tài khoản và xử lý dữ liệu sức khỏe, dinh dưỡng hoặc nội dung của bạn chỉ được thực hiện sau khi Nutree nhận được sự đồng ý có thể kiểm chứng của cha mẹ hoặc người giám hộ hợp pháp, đồng thời có thể yêu cầu sự xác nhận phù hợp của chính bạn.';

test('age and parent-consent sentences stay exact', () => {
  const privacyEn = privacyContent.en.sections.flatMap((section) => section.body ?? []).join('\n');
  const privacyVi = privacyContent.vi.sections.flatMap((section) => section.body ?? []).join('\n');
  const termsEn = termsContent.en.sections.flatMap((section) => section.body ?? []).join('\n');
  const termsVi = termsContent.vi.sections.flatMap((section) => section.body ?? []).join('\n');
  assert.ok(privacyEn.includes(AGE_EN));
  assert.ok(privacyVi.includes(AGE_VI));
  assert.ok(termsEn.includes(TERMS_AGE_EN));
  assert.ok(termsVi.includes(TERMS_AGE_VI));
});

test('payment draft names four channels and does not promise a Paddle refund window', () => {
  const blob = JSON.stringify({
    cancellation: cancellationPolicyContent,
    payment: paymentPolicyContent,
    terms: termsContent,
  });
  assert.equal(blob.includes('14 calendar days'), false);
  assert.equal(blob.includes('14 ngày'), false);
  assert.equal(blob.includes('no refunds'), false);
  assert.equal(blob.includes('không hoàn tiền'), false);
  const urlsInBlob = (blob.match(/https?:\/\/[^\s"']+/g) ?? []).flatMap((rawUrl) => {
    try {
      return [new URL(rawUrl)];
    } catch {
      return [];
    }
  });
  assert.ok(
    urlsInBlob.some(
      (url) =>
        url.protocol === 'https:' &&
        url.hostname === 'www.paddle.com' &&
        url.pathname === '/legal/buyer-terms',
    ),
  );
  assert.ok(blob.includes('nutreeaidev@gmail.com'));
  assert.ok(blob.includes('https://m.me/1019820571221637'));
  assert.match(blob, /VietQR is a one-time payment and does not renew automatically/);
  assert.match(blob, /VietQR là thanh toán một lần và không tự động gia hạn/);
  assert.match(JSON.stringify(privacyContent), /are estimates/);
  assert.match(JSON.stringify(privacyContent), /là ước tính/);
});

const CHANNELS = ['Apple', 'Google Play', 'Paddle', 'VietQR'];

function sectionText(page: { sections: Array<{ title: string; body?: string[]; table?: string[][] }> }, title: string) {
  const section = page.sections.find((item) => item.title === title);
  assert.ok(section, `missing section ${title}`);
  return [...(section.body ?? []), ...(section.table ?? []).flat()].join('\n');
}

function expectChannels(text: string, label: string) {
  const missing = CHANNELS.filter((name) => !text.includes(name));
  assert.deepEqual(missing, [], `${label} is missing ${missing.join(', ')}`);
}

test('later pricing, payment, usage, and complaint sections name the same four channels', () => {
  const cases: Array<[object, 'en' | 'vi', string]> = [
    [pricingPolicyContent.en, 'en', 'Displayed price and final charge'],
    [pricingPolicyContent.en, 'en', 'Promo codes, referrals, and special offers'],
    [pricingPolicyContent.en, 'en', 'Auto-renewal and price changes'],
    [pricingPolicyContent.en, 'en', 'If a price looks wrong'],
    [pricingPolicyContent.vi, 'vi', 'Giá hiển thị và giá thanh toán cuối cùng'],
    [pricingPolicyContent.vi, 'vi', 'Mã ưu đãi, mã giới thiệu và khuyến mại'],
    [pricingPolicyContent.vi, 'vi', 'Tự động gia hạn và thay đổi giá'],
    [pricingPolicyContent.vi, 'vi', 'Lỗi hiển thị hoặc sai lệch giá'],
    [paymentPolicyContent.en, 'en', 'Failed, duplicate, or unrecognized charges'],
    [paymentPolicyContent.vi, 'vi', 'Giao dịch thất bại, trùng lặp hoặc không nhận biết'],
    [usagePolicyContent.en, 'en', 'Scope'],
    [usagePolicyContent.vi, 'vi', 'Phạm vi áp dụng'],
    [complaintsPolicyContent.en, 'en', 'Information to provide'],
    [complaintsPolicyContent.vi, 'vi', 'Thông tin cần cung cấp'],
  ];
  for (const [page, , title] of cases) {
    expectChannels(sectionText(page as { sections: Array<{ title: string; body?: string[]; table?: string[][] }> }, title), title);
  }
  const usageEn = sectionText(usagePolicyContent.en, 'Scope');
  const usageVi = sectionText(usagePolicyContent.vi, 'Phạm vi áp dụng');
  assert.match(usageEn, /does not say those three channels use this VietQR deeplink/);
  assert.match(usageVi, /không nói ba kênh đó dùng deeplink VietQR này/);
});

test('store refunds, restore, and the privacy processor row stay channel-specific', () => {
  const google = sectionText(cancellationPolicyContent.en, 'Google Play in-app refunds');
  const googleVi = sectionText(cancellationPolicyContent.vi, 'Hoàn tiền trong ứng dụng Google Play');
  assert.match(google, /request a refund in Google Play/);
  assert.match(google, /does not publish its own refund promise/);
  assert.equal(google.includes('14 calendar'), false);
  assert.match(googleVi, /trong Google Play/);
  assert.equal(googleVi.includes('14 ngày'), false);

  const cancel = translations.en.faq.sections.flatMap((section) => section.items).find((item) => item.question === 'How do I cancel my subscription?');
  const cancelVi = translations.vi.faq.sections.flatMap((section) => section.items).find((item) => item.question === 'Làm sao để hủy gói đăng ký?');
  assert.ok(cancel && cancelVi);
  expectChannels(cancel.answer, 'faq cancel');
  expectChannels(cancelVi.answer, 'faq cancel vi');
  assert.match(cancel.answer, /paddle\.net/);
  assert.match(cancel.answer, /no renewal to cancel/);

  const restore = translations.en.faq.sections.flatMap((section) => section.items).find((item) => item.question === 'How do I restore my purchase on a new device?');
  const restoreVi = translations.vi.faq.sections.flatMap((section) => section.items).find((item) => item.question === 'Làm sao khôi phục gói đăng ký trên thiết bị mới?');
  assert.ok(restore && restoreVi);
  assert.match(restore.answer, /Apple or Google Play subscription can be restored/);
  assert.match(restore.answer, /does not say that a Paddle web checkout or a VietQR transfer restores automatically/);
  assert.equal(restore.answer.includes('Your subscription restores automatically.'), false);
  assert.match(restoreVi.answer, /không nói rằng thanh toán web Paddle hoặc chuyển khoản VietQR tự khôi phục/);
  assert.equal(restoreVi.answer.includes('Gói đăng ký sẽ tự động khôi phục.'), false);

  const processor = (privacyContent.en.sections.find((section) => section.title === 'Third-Party Services')?.table ?? []).find((row) => row[0].includes('Paddle'));
  const processorVi = (privacyContent.vi.sections.find((section) => section.title === 'Dịch vụ bên thứ ba')?.table ?? []).find((row) => row[0].includes('Paddle'));
  assert.ok(processor && processorVi);
  assert.match(processor[0], /merchant of record for Nutree web checkout/);
  assert.match(processorVi[0], /đơn vị bán hàng cho thanh toán web Nutree/);
  assert.equal(processor.join(' ').includes('VietQR'), false);
  assert.equal(processorVi.join(' ').includes('VietQR'), false);

  const deletion = translations.en.faq.sections.flatMap((section) => section.items).find((item) => item.question === 'How do I delete my account?');
  assert.match(deletion?.answer ?? '', /nutreeai.com\/delete-account/);
  assert.equal((deletion?.answer ?? '').includes('permanently removed'), false);
});
