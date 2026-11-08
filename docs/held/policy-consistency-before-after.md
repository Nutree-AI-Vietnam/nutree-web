# HELD approval packet — full old and new wording

Status: draft for exact Nutree approval via BI. This packet is not approval, not a merge, and not a checkout change. The sentences below are the proposed replacement text. They are not approved by being written here.

Base: `67b51cf9d69983a55fcf3bde1c95ee8e4287d359`. Each block is one user-visible string that differs from that base, copied in full. Strings that are byte-identical are not listed. That includes the 12+ sentence and the parent-consent sentence for ages 12 to under 16.

A block whose after text is `(string removed)` deletes that published sentence and does not put a substitute in the same slot. Four purchase channels, the Paddle Buyer Terms reference, and one-time VietQR stay in the strings that still name them.

When this branch is integrated with the English routing pull request, keep that pull request's `languages: languageAlternatesFor(...)` metadata. Do not replace those page files with this branch's copies.

### 1. `paymentPolicyContent.en.sections[3].body[0]`

Before:

```
Paid access usually unlocks after verification. Use Restore when changing devices or if sync is delayed.
```

After:

```
A completed purchase is the entitlement for that transaction. This page does not describe a Restore action on the website, and it does not say a Paddle web checkout or a VietQR transfer restores automatically.
```

### 2. `paymentPolicyContent.en.sections[3].body[1]`

Before:

```
If access does not appear, check the network and the status in the channel you paid with, then contact Facebook Messenger or nutreeaidev@gmail.com with your receipt.
```

After:

```
If access is missing, check the network and the status in the channel you paid with, then contact [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com with your receipt.
```

### 3. `paymentPolicyContent.vi.sections[3].body[0]`

Before:

```
Quyền trả phí thường được kích hoạt ngay sau khi xác minh. Dùng chức năng Khôi phục khi đổi thiết bị hoặc quyền chưa đồng bộ.
```

After:

```
Giao dịch đã hoàn tất là quyền dùng của giao dịch đó. Trang này không mô tả chức năng Khôi phục trên website, và không nói thanh toán web Paddle hoặc chuyển khoản VietQR tự khôi phục.
```

### 4. `paymentPolicyContent.vi.sections[3].body[1]`

Before:

```
Nếu vẫn không nhận quyền: kiểm tra kết nối và trạng thái trên kênh đã trả tiền, rồi nhắn Facebook Messenger hoặc gửi biên nhận tới nutreeaidev@gmail.com.
```

After:

```
Nếu thiếu quyền dùng, kiểm tra kết nối và trạng thái trên kênh đã trả tiền, rồi nhắn [Facebook Messenger](https://m.me/1019820571221637) hoặc gửi biên nhận tới nutreeaidev@gmail.com.
```

### 5. `pricingPolicyContent.en.sections[1].body[0]`

Before:

```
This website does not publish a fixed subscription price. Each channel shows the amount before you confirm.
```

After:

```
This policy page does not set the price. The Vietnamese VietQR checkout on this website displays the yearly amount on that screen before you transfer. Apple shows its amount on the Apple confirmation sheet. Google Play shows its amount in Google Play. Paddle shows its amount in the Paddle checkout. The amount you confirm on the screen you are using is the amount for that purchase.
```

### 6. `pricingPolicyContent.en.sections[1].body[1]`

Before:

```
Apple shows it on the Apple confirmation sheet. Google Play shows it in Google Play. Paddle shows it in the Paddle checkout. VietQR shows the one-time transfer amount. The amount you confirm on that channel is the amount for that purchase.
```

After:

```
(string removed)
```

### 7. `pricingPolicyContent.en.sections[2].body[0]`

Before:

```
Nutree offers auto-renewing subscription plans (for example monthly and yearly). The plan name, period, and price for your offer appear in the app before checkout.
```

After:

```
Apple, Google Play, and Paddle may offer auto-renewing plans. The plan name, period, and price appear on that channel before you confirm. This page does not list those prices.
```

### 8. `pricingPolicyContent.en.sections[2].body[1]`

Before:

```
Apple, Google Play, and Paddle plans can renew until you cancel that channel. VietQR is a one-time payment and does not renew automatically. How to cancel a renewing plan: [Cancellation & Refunds](/cancellation).
```

After:

```
The website VietQR checkout offers one plan: a one-time yearly transfer. It does not offer a monthly VietQR plan. VietQR does not renew automatically. How to cancel a renewing plan: [Cancellation & Refunds](/cancellation).
```

### 9. `pricingPolicyContent.vi.sections[1].body[0]`

Before:

```
Website này không niêm yết một mức giá cố định. Mỗi kênh hiển thị số tiền trước khi bạn xác nhận.
```

After:

```
Trang chính sách này không ấn định giá. Checkout VietQR tiếng Việt trên website hiển thị số tiền của gói năm trên màn hình đó trước khi bạn chuyển khoản. Apple hiển thị số tiền trên màn hình xác nhận của Apple. Google Play hiển thị số tiền trong Google Play. Paddle hiển thị số tiền trong bước thanh toán của Paddle. Số tiền bạn xác nhận trên màn hình đang dùng là số tiền của giao dịch đó.
```

### 10. `pricingPolicyContent.vi.sections[1].body[1]`

Before:

```
Apple hiển thị trên màn hình xác nhận của Apple. Google Play hiển thị trong Google Play. Paddle hiển thị trong bước thanh toán của Paddle. VietQR hiển thị số tiền chuyển một lần. Số tiền bạn xác nhận trên kênh đó là số tiền của giao dịch đó.
```

After:

```
(string removed)
```

### 11. `pricingPolicyContent.vi.sections[2].body[0]`

Before:

```
Nutree cung cấp các gói đăng ký tự động gia hạn (ví dụ gói tháng và gói năm). Tên gói, chu kỳ và mức giá của ưu đãi dành cho bạn được hiển thị trong app trước khi thanh toán.
```

After:

```
Apple, Google Play và Paddle có thể cung cấp gói tự động gia hạn. Tên gói, chu kỳ và mức giá xuất hiện trên kênh đó trước khi bạn xác nhận. Trang này không liệt kê các mức giá đó.
```

### 12. `pricingPolicyContent.vi.sections[2].body[1]`

Before:

```
Gói Apple, Google Play và Paddle có thể gia hạn cho đến khi bạn hủy đúng kênh. VietQR là thanh toán một lần và không tự động gia hạn. Hướng dẫn hủy gói có gia hạn: [Hủy & hoàn tiền](/cancellation).
```

After:

```
Checkout VietQR trên website có một gói: chuyển khoản một lần theo năm. Checkout đó không có gói tháng. VietQR không tự động gia hạn. Hướng dẫn hủy gói có gia hạn: [Hủy & hoàn tiền](/cancellation).
```

### 13. `usagePolicyContent.en.description`

Before:

```
How Nutree web payment unlocks the mobile app: choose a plan, pay, receive a deeplink by email, and start using Nutree.
```

After:

```
What this page says about the Nutree website checkout. It does not say the website sends an activation email or a deeplink.
```

### 14. `usagePolicyContent.en.sections[0].body[0]`

Before:

```
This Usage Policy explains how customers activate and use Nutree after paying on the Nutree website (nutreeai.com). Provider: NUTREE AI VIETNAM JOINT STOCK COMPANY. Support: support@nutreeai.com.
```

After:

```
This Usage Policy is about the Nutree website (nutreeai.com). Provider: NUTREE AI VIETNAM JOINT STOCK COMPANY. Published company email: support@nutreeai.com.
```

### 15. `usagePolicyContent.en.sections[0].body[1]`

Before:

```
This page describes the published website checkout that shows a one-time VietQR transfer and a deeplink by email. Apple in-app purchase, Google Play in-app purchase, and Paddle web checkout are described in the [Payment Policy](/payment). This page does not say those three channels use this VietQR deeplink.
```

After:

```
The Vietnamese purchase page can show a one-time yearly VietQR transfer. The English purchase page does not show that VietQR checkout. Apple in-app purchase, Google Play in-app purchase, and Paddle web checkout are described in the [Payment Policy](/payment). This page does not say those three channels use a website deeplink.
```

### 16. `usagePolicyContent.en.sections[1].body[0]`

Before:

```
Open the Nutree website and choose a plan.
```

After:

```
On the Vietnamese purchase page, VietQR is offered for one plan: a one-time yearly transfer. This page does not say that checkout offers a monthly plan.
```

### 17. `usagePolicyContent.en.sections[1].body[1]`

Before:

```
Select Monthly or Yearly. Prices and features are shown before you continue to checkout.
```

After:

```
The amount shown on the screen you are using is the amount for that screen. This page does not publish a second price.
```

### 18. `usagePolicyContent.en.sections[1].images[0].alt`

Before:

```
Nutree app preview after plan activation
```

After:

```
Nutree app preview
```

### 19. `usagePolicyContent.en.sections[1].images[0].caption`

Before:

```
Nutree mobile experience unlocked after successful activation.
```

After:

```
Illustration of the Nutree app.
```

### 20. `usagePolicyContent.en.sections[2].body[2]`

Before:

```
If the checkout asks you to send a receipt, email it to support@nutreeai.com with the transfer content or order reference so Nutree can match the payment.
```

After:

```
If the checkout asks you to send a receipt, send it through [Facebook Messenger](https://m.me/1019820571221637) or to nutreeaidev@gmail.com with the transfer content or order reference.
```

### 21. `usagePolicyContent.en.sections[3].title`

Before:

```
Step 3 — Receive the deeplink by email
```

After:

```
Step 3 — Email and links
```

### 22. `usagePolicyContent.en.sections[3].body[0]`

Before:

```
After Nutree confirms your payment, we send an activation email to the email address used for the purchase / lead.
```

After:

```
This page does not say a website payment is followed by an activation email or a deeplink.
```

### 23. `usagePolicyContent.en.sections[3].body[1]`

Before:

```
That email contains a deeplink (universal / app link) to open Nutree and unlock the paid plan. Check Inbox and Spam/Promotions if you do not see it within a reasonable time after confirmation.
```

After:

```
If you receive a message about a purchase, check who sent it before you open a link. Nutree does not ask for a banking password in email or chat.
```

### 24. `usagePolicyContent.en.sections[3].body[2]`

Before:

```
If the email does not arrive, contact support@nutreeai.com with your payment proof and the email address you used.
```

After:

```
If you need help, contact [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com with your payment proof and the email address you used.
```

### 25. `usagePolicyContent.en.sections[4].title`

Before:

```
Step 4 — Open the deeplink and use Nutree
```

After:

```
Step 4 — Using the app
```

### 26. `usagePolicyContent.en.sections[4].body[0]`

Before:

```
On your iPhone, tap the deeplink in the activation email.
```

After:

```
This page does not give device-specific activation steps.
```

### 27. `usagePolicyContent.en.sections[4].body[1]`

Before:

```
If Nutree is already installed, the app opens and continues activation (sign-in / email confirmation may be required so the purchase matches your account).
```

After:

```
Apple in-app purchase, Google Play in-app purchase, and Paddle web checkout follow the [Payment Policy](/payment). They do not use the Vietnamese VietQR screen.
```

### 28. `usagePolicyContent.en.sections[4].body[2]`

Before:

```
If Nutree is not installed yet, install Nutree from the App Store, then reopen the same activation email and tap the deeplink again.
```

After:

```
Install Nutree from the store for your device if you do not already have it.
```

### 29. `usagePolicyContent.en.sections[4].body[3]`

Before:

```
After successful activation you can use paid features such as AI meal scans, adaptive daily targets, and meal guidance on Home.
```

After:

```
(string removed)
```

### 30. `usagePolicyContent.en.sections[4].images[0].alt`

Before:

```
Nutree meal scanning after activation
```

After:

```
Nutree meal scanning
```

### 31. `usagePolicyContent.en.sections[4].images[0].caption`

Before:

```
After activation, use Nutree features such as AI meal scanning in the app.
```

After:

```
Illustration of meal scanning in the Nutree app.
```

### 32. `usagePolicyContent.en.sections[5].body[0]`

Before:

```
Use the same email for purchase, activation email, and app sign-in when asked. Mismatched emails can delay entitlement.
```

After:

```
When a screen asks you to sign in, use the email that screen asks for.
```

### 33. `usagePolicyContent.en.sections[5].body[1]`

Before:

```
Do not share your deeplink. Links may expire or become single-use for security.
```

After:

```
If you receive a link about a purchase, do not share it. This page does not say how long a link lasts.
```

### 34. `usagePolicyContent.en.sections[6].body[0]`

Before:

```
No email: wait a few minutes, check Spam, confirm the email spelling, then contact support with payment proof.
```

After:

```
No email from the website: this page does not say the website sends one. If you need help, contact [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com with payment proof.
```

### 35. `usagePolicyContent.en.sections[6].body[1]`

Before:

```
Link opens the browser instead of the app: install or update Nutree, then reopen the same email link on your phone.
```

After:

```
If paid access is missing, contact the same Messenger link or nutreeaidev@gmail.com with your receipt.
```

### 36. `usagePolicyContent.en.sections[6].body[2]`

Before:

```
Paid but features locked: finish the in-app email / sign-in steps from the deeplink, then restart the app. If still locked, email support with your receipt.
```

After:

```
(string removed)
```

### 37. `usagePolicyContent.vi.description`

Before:

```
Hướng dẫn kích hoạt và dùng Nutree sau khi thanh toán trên website: chọn gói, thanh toán, nhận deeplink qua email và mở app.
```

After:

```
Trang này nói gì về thanh toán trên website Nutree. Trang không nói website gửi email kích hoạt hoặc deeplink.
```

### 38. `usagePolicyContent.vi.sections[0].body[0]`

Before:

```
Chính sách này mô tả cách khách hàng kích hoạt và sử dụng Nutree sau khi thanh toán trên website (nutreeai.com). Đơn vị cung cấp: CÔNG TY CỔ PHẦN NUTREE AI VIỆT NAM. Hỗ trợ: support@nutreeai.com.
```

After:

```
Chính sách sử dụng này nói về website Nutree (nutreeai.com). Đơn vị cung cấp: CÔNG TY CỔ PHẦN NUTREE AI VIỆT NAM. Email công ty đã công bố: support@nutreeai.com.
```

### 39. `usagePolicyContent.vi.sections[0].body[1]`

Before:

```
Trang này mô tả thanh toán trên website đang công bố: chuyển khoản VietQR một lần và deeplink qua email. Mua trong ứng dụng Apple, mua trong ứng dụng Google Play và thanh toán web Paddle được nêu ở [Chính sách thanh toán](/payment). Trang này không nói ba kênh đó dùng deeplink VietQR này.
```

After:

```
Trang mua tiếng Việt có thể hiện chuyển khoản VietQR một lần cho gói năm. Trang mua tiếng Anh không hiện checkout VietQR đó. Mua trong ứng dụng Apple, mua trong ứng dụng Google Play và thanh toán web Paddle được nêu ở [Chính sách thanh toán](/payment). Trang này không nói ba kênh đó dùng deeplink trên website.
```

### 40. `usagePolicyContent.vi.sections[1].body[0]`

Before:

```
Truy cập website Nutree và chọn gói.
```

After:

```
Trên trang mua tiếng Việt, VietQR được cung cấp cho một gói: chuyển khoản một lần theo năm. Trang này không nói checkout đó có gói tháng.
```

### 41. `usagePolicyContent.vi.sections[1].body[1]`

Before:

```
Chọn gói Tháng hoặc gói Năm. Giá và quyền lợi được hiển thị trước khi tiếp tục thanh toán.
```

After:

```
Số tiền trên màn hình bạn đang dùng là số tiền của màn hình đó. Trang này không niêm yết một mức giá thứ hai.
```

### 42. `usagePolicyContent.vi.sections[1].images[0].alt`

Before:

```
Giao diện Nutree sau khi kích hoạt gói
```

After:

```
Hình xem trước ứng dụng Nutree
```

### 43. `usagePolicyContent.vi.sections[1].images[0].caption`

Before:

```
Trải nghiệm app Nutree sau khi kích hoạt thành công.
```

After:

```
Hình minh họa ứng dụng Nutree.
```

### 44. `usagePolicyContent.vi.sections[2].body[2]`

Before:

```
Nếu checkout yêu cầu gửi biên lai, hãy gửi về support@nutreeai.com kèm nội dung chuyển khoản hoặc mã đơn để Nutree đối soát.
```

After:

```
Nếu checkout yêu cầu gửi biên lai, hãy gửi qua [Facebook Messenger](https://m.me/1019820571221637) hoặc tới nutreeaidev@gmail.com, kèm nội dung chuyển khoản hoặc mã đơn.
```

### 45. `usagePolicyContent.vi.sections[3].title`

Before:

```
Bước 3 — Nhận deeplink qua email
```

After:

```
Bước 3 — Email và liên kết
```

### 46. `usagePolicyContent.vi.sections[3].body[0]`

Before:

```
Sau khi Nutree xác nhận thanh toán thành công, hệ thống gửi email kích hoạt tới địa chỉ email dùng khi mua / để lại trên website.
```

After:

```
Trang này không nói thanh toán trên website được theo sau bởi email kích hoạt hoặc deeplink.
```

### 47. `usagePolicyContent.vi.sections[3].body[1]`

Before:

```
Email này chứa deeplink (universal / app link) để mở Nutree và kích hoạt gói đã thanh toán. Nếu chưa thấy email, hãy kiểm tra Hộp thư đến và Thư rác/Quảng cáo.
```

After:

```
Nếu bạn nhận tin nhắn về một giao dịch, hãy kiểm tra người gửi trước khi mở liên kết. Nutree không hỏi mật khẩu ngân hàng qua email hoặc chat.
```

### 48. `usagePolicyContent.vi.sections[3].body[2]`

Before:

```
Nếu không nhận được email, liên hệ support@nutreeai.com kèm bằng chứng thanh toán và địa chỉ email đã dùng.
```

After:

```
Nếu cần hỗ trợ, nhắn [Facebook Messenger](https://m.me/1019820571221637) hoặc gửi tới nutreeaidev@gmail.com, kèm bằng chứng thanh toán và địa chỉ email đã dùng.
```

### 49. `usagePolicyContent.vi.sections[4].title`

Before:

```
Bước 4 — Mở deeplink và dùng Nutree
```

After:

```
Bước 4 — Dùng ứng dụng
```

### 50. `usagePolicyContent.vi.sections[4].body[0]`

Before:

```
Trên iPhone, chạm vào deeplink trong email kích hoạt.
```

After:

```
Trang này không đưa các bước kích hoạt theo từng thiết bị.
```

### 51. `usagePolicyContent.vi.sections[4].body[1]`

Before:

```
Nếu đã cài Nutree, app sẽ mở và tiếp tục bước kích hoạt (có thể cần đăng nhập / xác nhận email để khớp giao dịch với tài khoản).
```

After:

```
Mua trong ứng dụng Apple, mua trong ứng dụng Google Play và thanh toán web Paddle theo [Chính sách thanh toán](/payment). Ba kênh đó không dùng màn hình VietQR tiếng Việt.
```

### 52. `usagePolicyContent.vi.sections[4].body[2]`

Before:

```
Nếu chưa cài Nutree, hãy tải Nutree trên App Store, rồi mở lại cùng email kích hoạt và chạm deeplink lần nữa.
```

After:

```
Hãy cài Nutree từ cửa hàng của thiết bị nếu bạn chưa có ứng dụng.
```

### 53. `usagePolicyContent.vi.sections[4].body[3]`

Before:

```
Sau khi kích hoạt thành công, bạn dùng được các tính năng trả phí như quét món AI, mục tiêu thích ứng và gợi ý bữa ăn trên Home.
```

After:

```
(string removed)
```

### 54. `usagePolicyContent.vi.sections[4].images[0].alt`

Before:

```
Quét món bằng AI trên Nutree sau kích hoạt
```

After:

```
Quét món trên Nutree
```

### 55. `usagePolicyContent.vi.sections[4].images[0].caption`

Before:

```
Sau kích hoạt, dùng các tính năng như quét món bằng AI trong app.
```

After:

```
Hình minh họa quét món trong ứng dụng Nutree.
```

### 56. `usagePolicyContent.vi.sections[5].body[0]`

Before:

```
Nên dùng cùng một email cho thanh toán, email kích hoạt và đăng nhập app khi được yêu cầu. Email không khớp có thể làm chậm việc nhận quyền.
```

After:

```
Khi một màn hình yêu cầu đăng nhập, hãy dùng email mà màn hình đó yêu cầu.
```

### 57. `usagePolicyContent.vi.sections[5].body[1]`

Before:

```
Không chia sẻ deeplink. Liên kết có thể hết hạn hoặc chỉ dùng một lần vì lý do bảo mật.
```

After:

```
Nếu bạn nhận một liên kết về giao dịch, đừng chia sẻ liên kết đó. Trang này không nói liên kết tồn tại bao lâu.
```

### 58. `usagePolicyContent.vi.sections[6].body[0]`

Before:

```
Không nhận email: đợi vài phút, kiểm tra Thư rác, xác nhận đúng địa chỉ email, rồi liên hệ hỗ trợ kèm biên lai.
```

After:

```
Không có email từ website: trang này không nói website gửi email đó. Nếu cần hỗ trợ, nhắn [Facebook Messenger](https://m.me/1019820571221637) hoặc gửi tới nutreeaidev@gmail.com kèm bằng chứng thanh toán.
```

### 59. `usagePolicyContent.vi.sections[6].body[1]`

Before:

```
Link mở trình duyệt thay vì app: cài hoặc cập nhật Nutree, rồi mở lại cùng liên kết trong email trên điện thoại.
```

After:

```
Nếu thiếu quyền dùng đã thanh toán, hãy liên hệ cùng liên kết Messenger hoặc nutreeaidev@gmail.com và gửi biên nhận.
```

### 60. `usagePolicyContent.vi.sections[6].body[2]`

Before:

```
Đã thanh toán nhưng chưa mở khóa tính năng: hoàn tất bước email / đăng nhập trong app từ deeplink, rồi mở lại app. Nếu vẫn lỗi, gửi biên lai tới email hỗ trợ.
```

After:

```
(string removed)
```

### 61. `usagePolicyContent.en.sections[0].body[2]`

Before:

```
(no previous string)
```

After:

```
This page does not say the website sends an activation email or a deeplink.
```

### 62. `usagePolicyContent.vi.sections[0].body[2]`

Before:

```
(no previous string)
```

After:

```
Trang này không nói website gửi email kích hoạt hoặc deeplink.
```

### 63. `complaintsPolicyContent.en.tableHeaders[2]`

Before:

```
Target time
```

After:

```
Time stated on this page
```

### 64. `complaintsPolicyContent.en.sections[1].body[0]`

Before:

```
Email: support@nutreeai.com
```

After:

```
Published company email: support@nutreeai.com.
```

### 65. `complaintsPolicyContent.en.sections[1].body[1]`

Before:

```
In-app support/feedback when available.
```

After:

```
Payment and access help uses the same contacts as the Payment Policy: [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com.
```

### 66. `complaintsPolicyContent.en.sections[1].body[2]`

Before:

```
Written mail: NUTREE AI VIETNAM JOINT STOCK COMPANY, NL1-G01, Sang Quang Residential Area, Nguyen Van Linh Street, Hamlet 6, Phu Loi Ward, Can Tho City, Vietnam.
```

After:

```
In-app support/feedback when available.
```

### 67. `complaintsPolicyContent.en.sections[1].body[3]`

Before:

```
Website: nutreeai.com.
```

After:

```
Written mail: NUTREE AI VIETNAM JOINT STOCK COMPANY, NL1-G01, Sang Quang Residential Area, Nguyen Van Linh Street, Hamlet 6, Phu Loi Ward, Can Tho City, Vietnam.
```

### 68. `complaintsPolicyContent.en.sections[1].body[4]`

Before:

```
Recommended subject: “[Nutree - Support/Complaint]” using your registered account email.
```

After:

```
Website: nutreeai.com.
```

### 69. `complaintsPolicyContent.en.sections[3].title`

Before:

```
Process and target timelines
```

After:

```
Process
```

### 70. `complaintsPolicyContent.en.sections[3].body[0]`

Before:

```
Timelines start when we have enough information and exclude waits on you, Apple, banks, partners, or authorities.
```

After:

```
This page does not publish a 3, 7, or 15 business-day commitment. No replacement deadline is stated here.
```

### 71. `complaintsPolicyContent.en.sections[3].table[0][2]`

Before:

```
Within 3 business days
```

After:

```
No deadline is published on this page
```

### 72. `complaintsPolicyContent.en.sections[3].table[1][2]`

Before:

```
Depends on the case
```

After:

```
No deadline is published on this page
```

### 73. `complaintsPolicyContent.en.sections[3].table[2][2]`

Before:

```
Usually within 7 business days after complete information
```

After:

```
No deadline is published on this page
```

### 74. `complaintsPolicyContent.en.sections[3].table[3][2]`

Before:

```
Not more than 15 business days except special cases
```

After:

```
No deadline is published on this page
```

### 75. `complaintsPolicyContent.en.sections[3].table[4][2]`

Before:

```
Per the outcome notice
```

After:

```
No deadline is published on this page
```

### 76. `complaintsPolicyContent.vi.tableHeaders[2]`

Before:

```
Thời gian mục tiêu
```

After:

```
Thời gian nêu trên trang này
```

### 77. `complaintsPolicyContent.vi.sections[1].body[0]`

Before:

```
Email: support@nutreeai.com
```

After:

```
Email công ty đã công bố: support@nutreeai.com.
```

### 78. `complaintsPolicyContent.vi.sections[1].body[1]`

Before:

```
Trong ứng dụng: mục Hỗ trợ/Phản hồi khi có.
```

After:

```
Hỗ trợ thanh toán và quyền dùng dùng cùng liên hệ với Chính sách thanh toán: [Facebook Messenger](https://m.me/1019820571221637) hoặc nutreeaidev@gmail.com.
```

### 79. `complaintsPolicyContent.vi.sections[1].body[2]`

Before:

```
Văn bản: CÔNG TY CỔ PHẦN NUTREE AI VIỆT NAM, NL1-G01, Khu dân cư Sáng Quang, đường Nguyễn Văn Linh, Khóm 6, Phường Phú Lợi, Thành phố Cần Thơ, Việt Nam.
```

After:

```
Trong ứng dụng: mục Hỗ trợ/Phản hồi khi có.
```

### 80. `complaintsPolicyContent.vi.sections[1].body[3]`

Before:

```
Website: nutreeai.com.
```

After:

```
Văn bản: CÔNG TY CỔ PHẦN NUTREE AI VIỆT NAM, NL1-G01, Khu dân cư Sáng Quang, đường Nguyễn Văn Linh, Khóm 6, Phường Phú Lợi, Thành phố Cần Thơ, Việt Nam.
```

### 81. `complaintsPolicyContent.vi.sections[1].body[4]`

Before:

```
Khuyến nghị tiêu đề “[Nutree - Hỗ trợ/Khiếu nại]” và dùng email đăng ký tài khoản.
```

After:

```
Website: nutreeai.com.
```

### 82. `complaintsPolicyContent.vi.sections[3].title`

Before:

```
Quy trình và thời gian mục tiêu
```

After:

```
Quy trình
```

### 83. `complaintsPolicyContent.vi.sections[3].body[0]`

Before:

```
Thời gian tính từ khi nhận đủ thông tin; không gồm thời gian chờ phản hồi của người dùng, Apple, ngân hàng, đối tác hoặc cơ quan nhà nước.
```

After:

```
Trang này không công bố cam kết 3, 7 hoặc 15 ngày làm việc. Không có hạn thay thế trên trang này.
```

### 84. `complaintsPolicyContent.vi.sections[3].table[0][2]`

Before:

```
Tối đa 03 ngày làm việc
```

After:

```
Trang này không công bố hạn
```

### 85. `complaintsPolicyContent.vi.sections[3].table[1][2]`

Before:

```
Theo tính chất vụ việc
```

After:

```
Trang này không công bố hạn
```

### 86. `complaintsPolicyContent.vi.sections[3].table[2][2]`

Before:

```
Thông thường trong 07 ngày làm việc sau khi đủ thông tin
```

After:

```
Trang này không công bố hạn
```

### 87. `complaintsPolicyContent.vi.sections[3].table[3][2]`

Before:

```
Không quá 15 ngày làm việc, trừ trường hợp đặc biệt
```

After:

```
Trang này không công bố hạn
```

### 88. `complaintsPolicyContent.vi.sections[3].table[4][2]`

Before:

```
Theo thông báo kết quả
```

After:

```
Trang này không công bố hạn
```

### 89. `complaintsPolicyContent.en.sections[1].body[5]`

Before:

```
(no previous string)
```

After:

```
This page does not rank these contacts or publish a reply deadline.
```

### 90. `complaintsPolicyContent.vi.sections[1].body[5]`

Before:

```
(no previous string)
```

After:

```
Trang này không xếp hạng các liên hệ này và không công bố hạn trả lời.
```

### 91. `src/app/(vi)/payment/page.tsx description`

Before:

```
Quy trình thanh toán gói Nutree qua Apple App Store: phương thức thanh toán, kích hoạt, khôi phục, tự động gia hạn và xử lý giao dịch lỗi.
```

After:

```
Quy trình thanh toán Nutree qua Apple, Google Play, Paddle và VietQR một lần. Trang này không cam kết khôi phục trên website.
```

### 92. `src/app/(vi)/pricing/page.tsx description`

Before:

```
Cách Nutree công bố và xác nhận giá gói đăng ký. Mức giá cụ thể được cung cấp trong ứng dụng trước khi bạn thanh toán.
```

After:

```
Trang chính sách này không ấn định giá. Checkout VietQR tiếng Việt hiển thị số tiền của gói năm trước khi chuyển khoản. Apple, Google Play và Paddle hiển thị số tiền trên kênh của họ.
```

### 93. `src/app/(vi)/usage/page.tsx description`

Before:

```
Hướng dẫn kích hoạt và dùng Nutree sau khi thanh toán trên website: chọn gói, thanh toán, nhận deeplink qua email và mở app.
```

After:

```
Trang này mô tả thanh toán trên website Nutree. Trang không nói website gửi email kích hoạt hoặc deeplink.
```

