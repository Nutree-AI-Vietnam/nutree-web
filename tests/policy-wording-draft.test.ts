import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cancellationPolicyContent } from '../src/lib/cancellation-policy-content';
import { privacyContent } from '../src/lib/legal-content';
import { paymentPolicyContent } from '../src/lib/payment-policy-content';
import { termsContent } from '../src/lib/terms-content';

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
  assert.ok(blob.includes('https://www.paddle.com/legal/buyer-terms'));
  assert.ok(blob.includes('nutreeaidev@gmail.com'));
  assert.ok(blob.includes('https://m.me/1019820571221637'));
  assert.match(blob, /VietQR is a one-time payment and does not renew automatically/);
  assert.match(blob, /VietQR là thanh toán một lần và không tự động gia hạn/);
  assert.match(JSON.stringify(privacyContent), /are estimates/);
  assert.match(JSON.stringify(privacyContent), /là ước tính/);
});
