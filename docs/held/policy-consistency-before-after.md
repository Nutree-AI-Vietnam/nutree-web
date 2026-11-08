# HELD — policy consistency wording for Nutree approval

Status: draft for exact approval via BI. This is not approval, not a merge, and not a change to checkout code. The 12+ sentence and the parent-consent sentence for ages 12 to under 16 are unchanged. Paddle stays the merchant of record under the Paddle Buyer Terms at `https://www.paddle.com/legal/buyer-terms`. This draft does not add a Nutree 14-day window and does not say purchases are non-refundable. No replacement response-time promise is added.

Base: `67b51cf9d69983a55fcf3bde1c95ee8e4287d359` (`origin/main` when this branch was cut).

## Payment — checkout fulfillment

English, “Checkout flow”

Before: `Access unlocks after a successful verified transaction.`

After: `This page does not promise when paid access appears. The channel you paid with shows whether that transaction completed.`

Vietnamese, “Quy trình thanh toán”

Before: `Quyền sử dụng được kích hoạt sau khi giao dịch thành công và được xác minh.`

After: `Trang này không cam kết thời điểm quyền trả phí xuất hiện. Kênh bạn đã trả tiền cho biết giao dịch đó đã hoàn tất hay chưa.`

## Payment — restore

English, “Activation and restore”

Before: `Paid access usually unlocks after verification. Use Restore when changing devices or if sync is delayed.`

After: `In the Nutree app, an Apple or Google Play purchase can be restored by signing in with the same store account. This page does not say the website has a Restore action, and it does not say a Paddle web checkout or a VietQR transfer restores automatically.`

Before: `If access does not appear, check the network and the status in the channel you paid with, then contact Facebook Messenger or nutreeaidev@gmail.com with your receipt.`

After: `If access is missing, check the network and the status in the channel you paid with, then contact [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com with your receipt. This page does not promise that access will appear.`

Vietnamese, “Kích hoạt và khôi phục”

Before: `Quyền trả phí thường được kích hoạt ngay sau khi xác minh. Dùng chức năng Khôi phục khi đổi thiết bị hoặc quyền chưa đồng bộ.`

After: `Trong app Nutree, giao dịch Apple hoặc Google Play có thể được khôi phục khi bạn đăng nhập cùng tài khoản cửa hàng đã mua. Trang này không nói website có chức năng Khôi phục, và không nói thanh toán web Paddle hoặc chuyển khoản VietQR tự khôi phục.`

Before: `Nếu vẫn không nhận quyền: kiểm tra kết nối và trạng thái trên kênh đã trả tiền, rồi nhắn Facebook Messenger hoặc gửi biên nhận tới nutreeaidev@gmail.com.`

After: `Nếu thiếu quyền dùng, kiểm tra kết nối và trạng thái trên kênh đã trả tiền, rồi nhắn [Facebook Messenger](https://m.me/1019820571221637) hoặc gửi biên nhận tới nutreeaidev@gmail.com. Trang này không cam kết quyền dùng sẽ xuất hiện.`

Vietnamese page description (`/payment` metadata)

Before: `Quy trình thanh toán gói Nutree qua Apple App Store: phương thức thanh toán, kích hoạt, khôi phục, tự động gia hạn và xử lý giao dịch lỗi.`

After: `Quy trình thanh toán Nutree qua Apple, Google Play, Paddle và VietQR một lần. Trang này không cam kết khôi phục trên website.`

## Usage — deeplink promise and plan length

English description

Before: `How Nutree web payment unlocks the mobile app: choose a plan, pay, receive a deeplink by email, and start using Nutree.`

After: `What this page says about the Nutree website checkout. It does not promise an activation email, a deeplink, or that the app unlocks.`

English, “Scope”

Before: `This Usage Policy explains how customers activate and use Nutree after paying on the Nutree website (nutreeai.com). Provider: NUTREE AI VIETNAM JOINT STOCK COMPANY. Support: support@nutreeai.com.`

After: `This Usage Policy is about the Nutree website (nutreeai.com). Provider: NUTREE AI VIETNAM JOINT STOCK COMPANY. Published company email: support@nutreeai.com.`

Before: `This page describes the published website checkout that shows a one-time VietQR transfer and a deeplink by email. Apple in-app purchase, Google Play in-app purchase, and Paddle web checkout are described in the [Payment Policy](/payment). This page does not say those three channels use this VietQR deeplink.`

After: `The Vietnamese purchase page can show a one-time yearly VietQR transfer. The English purchase page does not show that VietQR checkout. Apple in-app purchase, Google Play in-app purchase, and Paddle web checkout are described in the [Payment Policy](/payment). This page does not say those three channels use a website deeplink.`

Added: `This page does not promise that a website payment sends an activation email, a deeplink, or unlocks the app.`

English, “Step 1”

Before: `Open the Nutree website and choose a plan.` / `Select Monthly or Yearly. Prices and features are shown before you continue to checkout.`

After: `On the Vietnamese purchase page, VietQR is offered for one plan: a one-time yearly transfer. This page does not say that checkout offers a monthly plan.` / `The amount shown on the screen you are using is the amount for that screen. This page does not publish a second price.`

English, “Step 2” receipt line

Before: `If the checkout asks you to send a receipt, email it to support@nutreeai.com with the transfer content or order reference so Nutree can match the payment.`

After: `If the checkout asks you to send a receipt, send it through [Facebook Messenger](https://m.me/1019820571221637) or to nutreeaidev@gmail.com with the transfer content or order reference. This page does not promise a match or a deadline.`

English, step 3 title

Before: `Step 3 — Receive the deeplink by email`

After: `Step 3 — Email and links`

Before body: `After Nutree confirms your payment, we send an activation email to the email address used for the purchase / lead.` / `That email contains a deeplink (universal / app link) to open Nutree and unlock the paid plan. Check Inbox and Spam/Promotions if you do not see it within a reasonable time after confirmation.` / `If the email does not arrive, contact support@nutreeai.com with your payment proof and the email address you used.`

After body: `This page does not promise an activation email or a deeplink after a website payment.` / `If you receive a message about a purchase, check who sent it before you open a link. Nutree does not ask for a banking password in email or chat.` / `If you need help, contact [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com with your payment proof and the email address you used. This page does not promise a reply time.`

English, step 4 title

Before: `Step 4 — Open the deeplink and use Nutree`

After: `Step 4 — Using the app`

Before body promised an iPhone deeplink, App Store install, and that successful activation unlocks paid features.

After body: `This page does not give device-specific activation steps and does not promise that opening a link unlocks paid features.` / `Apple in-app purchase, Google Play in-app purchase, and Paddle web checkout follow the [Payment Policy](/payment). They do not use the Vietnamese VietQR screen.` / `Install Nutree from the store for your device if you do not already have it. This page does not promise that installing the app unlocks a website payment.`

English captions

Before: `Nutree mobile experience unlocked after successful activation.`

After: `Illustration of the Nutree app. This image is not a promise that a website payment unlocks the app.`

Before: `After activation, use Nutree features such as AI meal scanning in the app.`

After: `Illustration of meal scanning in the Nutree app. This image is not a promise that a website payment unlocks that feature.`

English, “Account matching and security”

Before: `Use the same email for purchase, activation email, and app sign-in when asked. Mismatched emails can delay entitlement.` / `Do not share your deeplink. Links may expire or become single-use for security.`

After: `When a screen asks you to sign in, use the email that screen asks for. This page does not promise that matching an email unlocks a purchase.` / `If you receive a link about a purchase, do not share it. This page does not say how long a link lasts.`

English, “Troubleshooting”

Before promised a wait, a browser-link retry, and deeplink sign-in to unlock features.

After: `No email: this page does not promise an email. If you need help, contact [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com with payment proof.` / `A link opens the browser: this page does not promise that a link opens the app.` / `Paid but features locked: this page does not promise that a website payment unlocks features. Apple and Google Play restore is described in the [Payment Policy](/payment). Other help: the same Messenger link or nutreeaidev@gmail.com.`

Vietnamese description

Before: `Hướng dẫn kích hoạt và dùng Nutree sau khi thanh toán trên website: chọn gói, thanh toán, nhận deeplink qua email và mở app.`

After: `Trang này nói gì về thanh toán trên website Nutree. Trang không cam kết email kích hoạt, deeplink hoặc việc mở khóa ứng dụng.`

The same sentence is the `/usage` metadata description, with this after text: `Trang này mô tả thanh toán trên website Nutree. Trang không cam kết email kích hoạt, deeplink hoặc mở khóa ứng dụng.`

Vietnamese, “Phạm vi áp dụng”

Before: `Chính sách này mô tả cách khách hàng kích hoạt và sử dụng Nutree sau khi thanh toán trên website (nutreeai.com). Đơn vị cung cấp: CÔNG TY CỔ PHẦN NUTREE AI VIỆT NAM. Hỗ trợ: support@nutreeai.com.`

After: `Chính sách sử dụng này nói về website Nutree (nutreeai.com). Đơn vị cung cấp: CÔNG TY CỔ PHẦN NUTREE AI VIỆT NAM. Email công ty đã công bố: support@nutreeai.com.`

Before: `Trang này mô tả thanh toán trên website đang công bố: chuyển khoản VietQR một lần và deeplink qua email. Mua trong ứng dụng Apple, mua trong ứng dụng Google Play và thanh toán web Paddle được nêu ở [Chính sách thanh toán](/payment). Trang này không nói ba kênh đó dùng deeplink VietQR này.`

After: `Trang mua tiếng Việt có thể hiện chuyển khoản VietQR một lần cho gói năm. Trang mua tiếng Anh không hiện checkout VietQR đó. Mua trong ứng dụng Apple, mua trong ứng dụng Google Play và thanh toán web Paddle được nêu ở [Chính sách thanh toán](/payment). Trang này không nói ba kênh đó dùng deeplink trên website.`

Added: `Trang này không cam kết thanh toán trên website sẽ gửi email kích hoạt, gửi deeplink hoặc mở khóa ứng dụng.`

Vietnamese, “Bước 1”

Before: `Truy cập website Nutree và chọn gói.` / `Chọn gói Tháng hoặc gói Năm. Giá và quyền lợi được hiển thị trước khi tiếp tục thanh toán.`

After: `Trên trang mua tiếng Việt, VietQR được cung cấp cho một gói: chuyển khoản một lần theo năm. Trang này không nói checkout đó có gói tháng.` / `Số tiền trên màn hình bạn đang dùng là số tiền của màn hình đó. Trang này không niêm yết một mức giá thứ hai.`

Vietnamese, “Bước 2” receipt line

Before: `Nếu checkout yêu cầu gửi biên lai, hãy gửi về support@nutreeai.com kèm nội dung chuyển khoản hoặc mã đơn để Nutree đối soát.`

After: `Nếu checkout yêu cầu gửi biên lai, hãy gửi qua [Facebook Messenger](https://m.me/1019820571221637) hoặc tới nutreeaidev@gmail.com, kèm nội dung chuyển khoản hoặc mã đơn. Trang này không cam kết đối soát hoặc hạn trả lời.`

Vietnamese, step 3 title

Before: `Bước 3 — Nhận deeplink qua email`

After: `Bước 3 — Email và liên kết`

Before body promised a confirmation email containing a deeplink and told the reader to contact `support@nutreeai.com` if it did not arrive.

After body: `Trang này không cam kết có email kích hoạt hoặc deeplink sau thanh toán trên website.` / `Nếu bạn nhận tin nhắn về một giao dịch, hãy kiểm tra người gửi trước khi mở liên kết. Nutree không hỏi mật khẩu ngân hàng qua email hoặc chat.` / `Nếu cần hỗ trợ, nhắn [Facebook Messenger](https://m.me/1019820571221637) hoặc gửi tới nutreeaidev@gmail.com, kèm bằng chứng thanh toán và địa chỉ email đã dùng. Trang này không cam kết thời gian trả lời.`

Vietnamese, step 4 title

Before: `Bước 4 — Mở deeplink và dùng Nutree`

After: `Bước 4 — Dùng ứng dụng`

Before body promised an iPhone tap, App Store install, and unlocked paid features.

After body: `Trang này không đưa các bước kích hoạt theo từng thiết bị và không cam kết mở một liên kết sẽ mở khóa tính năng trả phí.` / `Mua trong ứng dụng Apple, mua trong ứng dụng Google Play và thanh toán web Paddle theo [Chính sách thanh toán](/payment). Ba kênh đó không dùng màn hình VietQR tiếng Việt.` / `Hãy cài Nutree từ cửa hàng của thiết bị nếu bạn chưa có ứng dụng. Trang này không cam kết việc cài ứng dụng sẽ mở khóa một thanh toán trên website.`

Vietnamese captions and the “Khớp tài khoản và bảo mật” / “Xử lý sự cố” sections follow the same removal of the deeplink, monthly-plan, and unlock promises. The Vietnamese source file is the exact text.

## Pricing — website price vs “no fixed price”

English, “Where prices are provided”

Before: `This website does not publish a fixed subscription price. Each channel shows the amount before you confirm.` plus a second sentence that listed Apple, Google Play, Paddle, and VietQR.

After: `This policy page does not set the price. The Vietnamese VietQR checkout on this website displays the yearly amount on that screen before you transfer. Apple shows its amount on the Apple confirmation sheet. Google Play shows its amount in Google Play. Paddle shows its amount in the Paddle checkout. The amount you confirm on the screen you are using is the amount for that purchase.`

English, “Plan types”

Before: `Nutree offers auto-renewing subscription plans (for example monthly and yearly). The plan name, period, and price for your offer appear in the app before checkout.` / `Apple, Google Play, and Paddle plans can renew until you cancel that channel. VietQR is a one-time payment and does not renew automatically. How to cancel a renewing plan: [Cancellation & Refunds](/cancellation).`

After: `Apple, Google Play, and Paddle may offer auto-renewing plans. The plan name, period, and price appear on that channel before you confirm. This page does not list those prices.` / `The website VietQR checkout offers one plan: a one-time yearly transfer. It does not offer a monthly VietQR plan. VietQR does not renew automatically. How to cancel a renewing plan: [Cancellation & Refunds](/cancellation).`

Vietnamese, “Nơi cung cấp mức giá”

Before: `Website này không niêm yết một mức giá cố định. Mỗi kênh hiển thị số tiền trước khi bạn xác nhận.` plus the channel sentence.

After: `Trang chính sách này không ấn định giá. Checkout VietQR tiếng Việt trên website hiển thị số tiền của gói năm trên màn hình đó trước khi bạn chuyển khoản. Apple hiển thị số tiền trên màn hình xác nhận của Apple. Google Play hiển thị số tiền trong Google Play. Paddle hiển thị số tiền trong bước thanh toán của Paddle. Số tiền bạn xác nhận trên màn hình đang dùng là số tiền của giao dịch đó.`

Vietnamese, “Các loại gói”

Before: `Nutree cung cấp các gói đăng ký tự động gia hạn (ví dụ gói tháng và gói năm). Tên gói, chu kỳ và mức giá của ưu đãi dành cho bạn được hiển thị trong app trước khi thanh toán.` / `Gói Apple, Google Play và Paddle có thể gia hạn cho đến khi bạn hủy đúng kênh. VietQR là thanh toán một lần và không tự động gia hạn. Hướng dẫn hủy gói có gia hạn: [Hủy & hoàn tiền](/cancellation).`

After: `Apple, Google Play và Paddle có thể cung cấp gói tự động gia hạn. Tên gói, chu kỳ và mức giá xuất hiện trên kênh đó trước khi bạn xác nhận. Trang này không liệt kê các mức giá đó.` / `Checkout VietQR trên website có một gói: chuyển khoản một lần theo năm. Checkout đó không có gói tháng. VietQR không tự động gia hạn. Hướng dẫn hủy gói có gia hạn: [Hủy & hoàn tiền](/cancellation).`

Vietnamese `/pricing` metadata

Before: `Cách Nutree công bố và xác nhận giá gói đăng ký. Mức giá cụ thể được cung cấp trong ứng dụng trước khi bạn thanh toán.`

After: `Trang chính sách này không ấn định giá. Checkout VietQR tiếng Việt hiển thị số tiền của gói năm trước khi chuyển khoản. Apple, Google Play và Paddle hiển thị số tiền trên kênh của họ.`

The numeric amount shown by checkout code is not copied into this policy. Checkout code is not edited.

## Complaints — unpublished 3/7/15-day targets and support contacts

English, “Intake channels”

The published company email line remains, now labeled `Published company email`. Added: `Payment and access help uses the same contacts as the Payment Policy: [Facebook Messenger](https://m.me/1019820571221637) or nutreeaidev@gmail.com.` Added: `This page does not rank these contacts or publish a reply deadline.` The recommended subject line is removed. In-app support, written mail, and the website line stay.

English, “Process and target timelines”

Before: `Timelines start when we have enough information and exclude waits on you, Apple, banks, partners, or authorities.`

After: `This page does not publish a 3, 7, or 15 business-day commitment. No replacement deadline is stated here.`

Every target-time cell that said `Within 3 business days`, `Depends on the case`, `Usually within 7 business days after complete information`, `Not more than 15 business days except special cases`, or `Per the outcome notice` now says `No deadline is published on this page`.

Vietnamese, “Kênh tiếp nhận”

`Email` is now `Email công ty đã công bố`. Added: `Hỗ trợ thanh toán và quyền dùng dùng cùng liên hệ với Chính sách thanh toán: [Facebook Messenger](https://m.me/1019820571221637) hoặc nutreeaidev@gmail.com.` Added: `Trang này không xếp hạng các liên hệ này và không công bố hạn trả lời.`

Vietnamese, “Quy trình và thời gian mục tiêu”

Before: `Thời gian tính từ khi nhận đủ thông tin; không gồm thời gian chờ phản hồi của người dùng, Apple, ngân hàng, đối tác hoặc cơ quan nhà nước.`

After: `Trang này không công bố cam kết 3, 7 hoặc 15 ngày làm việc. Không có hạn thay thế trên trang này.`

The cells `Tối đa 03 ngày làm việc`, `Theo tính chất vụ việc`, `Thông thường trong 07 ngày làm việc sau khi đủ thông tin`, `Không quá 15 ngày làm việc, trừ trường hợp đặc biệt`, and `Theo thông báo kết quả` now say `Trang này không công bố hạn`.

## Not changed

- Checkout implementation, prices, and the yearly-only VietQR screen.
- The exact 12+ and parent-consent paragraphs.
- Paddle Buyer Terms references and the refusal to publish a Nutree refund window or a blanket denial.
- FAQ cancel, restore, and deletion answers already on main.
- Account-deletion pages. They stay guidance. They do not submit a request.
