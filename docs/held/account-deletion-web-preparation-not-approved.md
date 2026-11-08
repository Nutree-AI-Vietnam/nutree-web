# HELD — web deletion intake preparation, not approved

Status: preparation only. Nothing here is approved copy, a policy change, or an implementation. nutree-web does not add a form, a sign-in button, an API call, a mail send, a migration, or a feature flag. Do not merge this note into a live page.

This note does not approve backend pull request 936 and does not turn its flag on.

## Sources read

| Source | What was read | What was not done |
| --- | --- | --- |
| Backend PR [936](https://github.com/Nutree-AI-Vietnam/mealtrack_backend/pull/936) | Open draft. Head `b9e3a3066321c31aa30853e3ffcde091575be8c7`. Base `delivery` at `cd318e97666ff9d5816a6fcc12d4af73b364bc5b`. `merged: false`. `mergeable_state: blocked`. Reviews list was empty. | Not merged, not deployed, no production call, no migration. |
| `src/api/routes/v1/account_deletion_requests.py` at that SHA | Routes, status codes, and response models below. | |
| `src/api/dependencies/account_deletion_auth.py` at that SHA | Flag-off 404, token checks, `auth_time`, rate limit. | |
| `src/domain/services/account_deletion_intake.py` at that SHA | Idempotency key rules, `aud`/`iss`, states. No provider allowlist. | |
| `src/app/services/account_deletion_intake.py` at that SHA | Create replay, withdraw, no legacy delete. | |
| `src/api/exception_handlers.py` at that SHA | Unexpected errors use `error_code` `INTERNAL_ERROR`. | |
| `src/api/middleware/rate_limit.py` at that SHA | 429 body below. | |
| nutree-web `main` `abc1843a5d5d06df4b41d601ed58e78dd0c33619` | Current `/delete-account` and `/en/delete-account` copy. | Live sentences were not edited. |

`DELETE /v1/users/firebase/{firebase_uid}` is still the immediate partial delete in backend source. This website must not call it. Phase 1 intake does not call it.

## Contract the web plan assumes

Prefix: `/v1/account/deletion-requests`. No UID in the path or body. Auth is a Firebase ID token for the backend's initialized project: `aud` is that project id and `iss` is `https://securetoken.google.com/<project id>`. `email_verified` is not a gate. The verified UID is the only account key. There is no email, phone, or name match.

`ACCOUNT_DELETION_INTAKE_ENABLED` defaults to false. While false, all three routes return 404 `{"detail":{"error_code":"not_found","message":"Not found"}}` and do not check the token.

Create `POST /v1/account/deletion-requests` requires `Idempotency-Key`. Success is `202` with `receipt_id`, `state`, `received_at`. The same UID and key returns that row. A new key while a request is `received` or `under_review` returns the open receipt and does not write another event. The same key after `withdrawn` or `closed` returns that terminal row. A new key after a terminal state creates a new receipt. The response does not include `account_found`, `user_id`, or email. A UID with no `users` row still gets `202`.

Status `GET /v1/account/deletion-requests/{receipt_id}` is `200` with `receipt_id`, `state`, `received_at`, `updated_at` for the owning UID. Missing and another UID's receipt are the same 404 body.

Withdraw `POST /v1/account/deletion-requests/{receipt_id}/withdraw` requires `Idempotency-Key`. The route checks the key, then calls withdraw without storing that key. `200` `{"receipt_id","state":"withdrawn"}` from `received` or `under_review`. A repeat on an already `withdrawn` row returns that row and does not write a second event. `closed` is `409` `invalid_state`. A lost version update is `409` `version_conflict`.

| Status | `error_code` | When, from the source above |
| --- | --- | --- |
| 401 | `not_authenticated` | No bearer token |
| 401 | `invalid_token` | Invalid, expired, wrong `aud` / `iss` / project, or `uid`/`sub` mismatch |
| 401 | `token_revoked` | Revoked token |
| 401 | `reauth_required` | Missing, future, or stale `auth_time` |
| 400 | `idempotency_key_required` | Create or withdraw without the header |
| 400 | `idempotency_key_invalid` | Empty, padded, longer than 160, or control characters |
| 404 | `not_found` | Flag off, or receipt missing or not owned |
| 409 | `invalid_state` | Owner withdraws a `closed` request |
| 409 | `version_conflict` | Withdraw lost an optimistic update |
| 429 | body is `{"error":"rate_limit_exceeded","code":"preview_rate_limited"}` plus `Retry-After` | Existing limiter. Defaults `Retry-After` to 60 when the exception has none |
| 503 | `auth_unavailable` | Firebase certificate fetch failed |
| 500 | `INTERNAL_ERROR` | Uncaught failure through the existing handler. Message: "An unexpected error occurred". No receipt |

`auth_time` must be within `ACCOUNT_DELETION_AUTH_TIME_MAX_AGE_SECONDS` (default 300) after `ACCOUNT_DELETION_AUTH_TIME_CLOCK_SKEW_SECONDS` (default 60). A refresh does not move `auth_time`. Create, status, and withdraw all run this check. Those numbers are backend settings, not a public retention period.

States are human intake only: `received`, `under_review`, `withdrawn`, `closed`. No state deletes data, revokes a session, sends email, or calls the legacy delete. Operator moves `received → under_review → closed` have no public route. `apply_operator_state_change` does not authenticate the actor.

Two additive tables, migration `20261108041529440483`, are in the draft and were not run. Render's entrypoint skips migrations. This note does not authorize `migrate.yml`.

Manual processing contact named in the backend PR body and runbook: `nutreeaidev@gmail.com`. Which principal is the authorized operator, and how that is set up: unknown. That address is not permission to read the mailbox, send mail, or grant admin.

## Auth feasibility

Decision: the public website does not have a reusable end-user sign-in. Building one is a new boundary. This preparation does not implement it.

What exists in nutree-web:

- `src/lib/firebase-admin-auth.ts` signs a staff user in with email and password for the meal-catalog admin, then refreshes that admin session. Tokens stay in memory in `useAdminSession`. Env names only: `NEXT_PUBLIC_FIREBASE_SIT_API_KEY`, `NEXT_PUBLIC_FIREBASE_PROD_API_KEY`, and legacy `NEXT_PUBLIC_FIREBASE_API_KEY`. No Firebase project id is in this repository.
- `package.json` has no Firebase client SDK.
- There is no Google, Apple, or other OAuth sign-in for a Nutree account on the website.
- A backend unit-test fixture uses `sign_in_provider: "phone"` and `email_verified: false`. That fixture is not a list of providers this website may add. `sign_in_provider()` records the token's provider and does not allowlist one. This website must not add email-link or phone sign-in.

The admin email-password path must not be reused for deletion intake. It is a staff login, it is the wrong principal, and using it would be an account action this run does not take.

A later web client can send a token only if all of these are true:

1. The person already has a Nutree sign-in on an existing Firebase provider. The website must not create an account for intake and must not match or link an email.
2. Someone confirms that provider from the app, not from this website. The provider list is unknown here.
3. The Firebase project id of that sign-in is the same project the backend verifies. Unknown here, because this repo has key names and no project id. Do not print key values to compare them.
4. The sign-in is recent enough for `auth_time`. A long-lived website session is not enough, because refresh does not move `auth_time`.

Until those are decided, the live pages stay guidance only.

## Rollout gates

Do not pass a gate by editing this note.

1. Niels reviews backend PR 936. No review was on the PR when this note was written.
2. Backend stays unmerged. Flag stays off, so the routes stay 404. Migration stays unrun.
3. Operator principal and setup are decided. `nutreeaidev@gmail.com` is only the named contact until then.
4. Firebase project alignment is confirmed without printing credentials.
5. Existing app providers are confirmed. No new provider, no email-link, no phone, no account creation.
6. The sentences in the proposed copy below are approved or replaced. Approval of this file is not approval to publish them.
7. Only then, a separate nutree-web draft can call the API behind a flag that stays off. No public form and no production customer test before that draft is reviewed on its own.
8. Never call `DELETE /v1/users/firebase/{firebase_uid}` from the page.

English locale persistence on nutree-web PR 50 is a separate review. This note does not change that head and does not block it.

## Live copy today

Both `/delete-account` and `/en/delete-account` render `DeleteAccountArticle`. The same English and Vietnamese blocks are on both URLs. Document title and description are the English strings on both URLs. Canonical is the page path. `ogLocale` stays the default `vi_VN` because these pages do not pass one. Neither page passes `languages`, so neither emits hreflang.

On `main`, the English block links "Cancellation" to `/cancellation` and "FAQ" to `/faq`. Unmerged PR 50 points those two links at `/en/cancellation` and `/en/faq`. This note does not change either branch.

Support mail on the page is `support@nutreeai.com` from `SITE_CONFIG.supportEmail`. Messenger is `https://m.me/1019820571221637`. The proposed public sentences keep those. They do not add `nutreeaidev@gmail.com`, because the operator setup is unknown and the address is not a confirmed public mailbox.

### Visible English, live

- Eyebrow: Nutree
- Heading: Delete your Nutree account
- This page explains the existing in-app deletion control and how to contact Nutree. It does not send a deletion request, it does not call a deletion endpoint, and it does not promise that data will be erased by a certain date. Guidance alone does not meet a store rule that requires a web page where the person can actually request account and data deletion.
- In the Nutree app
- Open Settings, then Account Management, then Delete Account. That control inside the app is the deletion path Nutree publishes today.
- Subscriptions
- Deleting the Nutree account does not cancel a subscription charged by the Apple App Store, Google Play, or another store. Cancel that subscription with the store that charged you. Published cancellation steps are on the cancellation page.
- Meal photos are stored for meal history. This page does not state a date by which those photos or other account data are erased.
- Ask for help
- This website cannot delete the account for you. You can email the published support address or message the published Facebook Messenger chat and ask for help. A reply is not a promise that data has been erased.
- Link text: `support@nutreeai.com` · Facebook Messenger · Cancellation · FAQ

Title: `Delete your Nutree account | Nutree`

Description: `How to delete a Nutree account in the app, what this website does not do, and the fact that deletion does not cancel a store subscription.`

### Visible Vietnamese, live

- Heading: Xóa tài khoản Nutree
- Trong ứng dụng Nutree
- Mở Cài đặt, rồi Quản lý tài khoản, rồi Xóa tài khoản. Thao tác trong app là đường xóa tài khoản Nutree đang công bố.
- Gói đăng ký
- Xóa tài khoản Nutree không hủy gói đã thanh toán qua Apple App Store, Google Play hoặc cửa hàng khác. Hãy hủy gói với cửa hàng đã tính phí. Các bước hủy đã công bố nằm ở trang hủy gói.
- Ảnh bữa ăn được lưu cho lịch sử bữa ăn. Trang này không nêu ngày mà ảnh hoặc dữ liệu tài khoản khác sẽ bị xóa.
- Nhờ hỗ trợ
- Website này không xóa tài khoản thay bạn. Bạn có thể gửi email tới địa chỉ hỗ trợ đã công bố hoặc nhắn Facebook Messenger đã công bố để nhờ hỗ trợ. Việc được trả lời không có nghĩa là dữ liệu đã bị xóa.
- Link text: `support@nutreeai.com` · Facebook Messenger · Hủy gói · Câu hỏi thường gặp

The Vietnamese block has no separate document title today.

## Proposed copy, not approved and not published

Use these sentences only after the gates above. Until then, the live sentences stay.

`/delete-account` would show the Vietnamese block. `/en/delete-account` would show the English block. The sign-in control itself is not specified here, because no existing provider is confirmed. The sentences do not name Google, Apple, email-link, or phone.

A receipt means the request was received. It does not mean erased, deleted, scheduled, or completed. No sentence gives a day count.

### Proposed English, `/en/delete-account`

Title: `Delete your Nutree account | Nutree`

Description: `How to ask Nutree to receive an account-deletion request, what a receipt does not mean, and the fact that this page states no erasure date.`

- Eyebrow: Nutree
- Heading: Delete your Nutree account
- Intro: This page can file a request only after you sign in with the Nutree account you already use. This website does not create an account for that request. Nutree does not look up the account by an email address. A receipt means Nutree received the request. It does not mean the account or any data has been erased. This page does not state a date by which data is erased.
- Sign-in note: Sign in again just before you file, view, or withdraw a request. An older sign-in is not enough.
- In the Nutree app
- Open Settings, then Account Management, then Delete Account. That control inside the app remains available. This page does not replace it.
- Subscriptions
- Deleting the Nutree account does not cancel a subscription charged by the Apple App Store, Google Play, or another store. Cancel that subscription with the store that charged you. Published cancellation steps are on the cancellation page.
- Meal photos are stored for meal history. This page does not state a date by which those photos or other account data are erased.
- File a request
- Button: File a request
- After 202: Nutree received this request. Receipt: {receipt_id}. Received at: {received_at}. Received does not mean erased.
- Status heading: Request status
- `received`: Request received. Nothing shown here has been erased.
- `under_review`: A person is looking at this request. Nothing shown here has been erased.
- `withdrawn`: You withdrew this request. Withdrawing it does not restore data and does not erase data.
- `closed`: Nutree closed this request. Closed does not mean data was erased.
- Withdraw button, only for `received` or `under_review`: Withdraw this request
- After withdraw 200: This request is withdrawn. Withdrawn does not mean data was erased.
- Already withdrawn: This request is already withdrawn.
- Closed: This request is closed and cannot be withdrawn here.
- `version_conflict`: This request changed. Check the status and try again.
- `not_authenticated`: Sign in with the Nutree account you already use, then try again.
- `invalid_token`: Nutree could not confirm that sign-in. Sign in again.
- `token_revoked`: That sign-in is no longer valid. Sign in again.
- `reauth_required`: Sign in again. A recent sign-in is required before Nutree can file, show, or withdraw a request.
- `idempotency_key_required` or `idempotency_key_invalid`: Nutree did not file that attempt. Try again.
- 404: Nutree could not find a request for this sign-in.
- 429: Too many attempts. Wait and try again.
- `auth_unavailable`: Nutree could not confirm sign-in just now. Try again later.
- `INTERNAL_ERROR`: Nutree did not file a request. No receipt was issued. Try again later.
- Ask for help
- This website cannot delete the account for you from the email or chat links. You can email the published support address or message the published Facebook Messenger chat and ask for help. A reply is not a promise that data has been erased.
- Link text: `support@nutreeai.com` · Facebook Messenger · Cancellation · FAQ

Cancellation links to `/en/cancellation`. FAQ links to `/en/faq`.

### Proposed Vietnamese, `/delete-account`

Title: `Xóa tài khoản Nutree | Nutree`

Description: `Cách nhờ Nutree nhận một yêu cầu xóa tài khoản, việc biên nhận không có nghĩa là đã xóa, và trang này không nêu ngày xóa dữ liệu.`

- Eyebrow: Nutree
- Heading: Xóa tài khoản Nutree
- Intro: Trang này chỉ gửi yêu cầu sau khi bạn đăng nhập bằng tài khoản Nutree bạn đang có. Website không tạo tài khoản cho yêu cầu này. Nutree không tìm tài khoản bằng địa chỉ email. Biên nhận có nghĩa là Nutree đã nhận yêu cầu. Biên nhận không có nghĩa là tài khoản hoặc dữ liệu đã bị xóa. Trang này không nêu ngày dữ liệu sẽ bị xóa.
- Sign-in note: Hãy đăng nhập lại ngay trước khi gửi, xem hoặc rút yêu cầu. Lần đăng nhập cũ không đủ.
- Trong ứng dụng Nutree
- Mở Cài đặt, rồi Quản lý tài khoản, rồi Xóa tài khoản. Thao tác trong app vẫn dùng được. Trang này không thay thế thao tác đó.
- Gói đăng ký
- Xóa tài khoản Nutree không hủy gói đã thanh toán qua Apple App Store, Google Play hoặc cửa hàng khác. Hãy hủy gói với cửa hàng đã tính phí. Các bước hủy đã công bố nằm ở trang hủy gói.
- Ảnh bữa ăn được lưu cho lịch sử bữa ăn. Trang này không nêu ngày mà ảnh hoặc dữ liệu tài khoản khác sẽ bị xóa.
- Gửi yêu cầu
- Button: Gửi yêu cầu
- After 202: Nutree đã nhận yêu cầu này. Biên nhận: {receipt_id}. Thời điểm nhận: {received_at}. Đã nhận không có nghĩa là đã xóa.
- Status heading: Trạng thái yêu cầu
- `received`: Đã nhận yêu cầu. Phần hiển thị ở đây không nói dữ liệu đã bị xóa.
- `under_review`: Có người đang xem yêu cầu này. Phần hiển thị ở đây không nói dữ liệu đã bị xóa.
- `withdrawn`: Bạn đã rút yêu cầu này. Rút yêu cầu không khôi phục dữ liệu và không xóa dữ liệu.
- `closed`: Nutree đã đóng yêu cầu này. Đóng yêu cầu không có nghĩa là dữ liệu đã bị xóa.
- Withdraw button, only for `received` or `under_review`: Rút yêu cầu này
- After withdraw 200: Yêu cầu này đã được rút. Đã rút không có nghĩa là dữ liệu đã bị xóa.
- Already withdrawn: Yêu cầu này đã được rút từ trước.
- Closed: Yêu cầu này đã đóng và không rút được tại đây.
- `version_conflict`: Yêu cầu vừa thay đổi. Hãy xem lại trạng thái rồi thử lại.
- `not_authenticated`: Hãy đăng nhập bằng tài khoản Nutree bạn đang có, rồi thử lại.
- `invalid_token`: Nutree không xác nhận được lần đăng nhập đó. Hãy đăng nhập lại.
- `token_revoked`: Lần đăng nhập đó không còn hiệu lực. Hãy đăng nhập lại.
- `reauth_required`: Hãy đăng nhập lại. Nutree cần một lần đăng nhập gần đây trước khi gửi, xem hoặc rút yêu cầu.
- `idempotency_key_required` or `idempotency_key_invalid`: Nutree chưa ghi nhận lần thử đó. Hãy thử lại.
- 404: Nutree không thấy yêu cầu cho lần đăng nhập này.
- 429: Quá nhiều lần thử. Hãy đợi rồi thử lại.
- `auth_unavailable`: Nutree chưa xác nhận được đăng nhập lúc này. Hãy thử lại sau.
- `INTERNAL_ERROR`: Nutree chưa ghi nhận yêu cầu. Không có biên nhận. Hãy thử lại sau.
- Nhờ hỗ trợ
- Các liên kết email và chat trên trang này không xóa tài khoản thay bạn. Bạn có thể gửi email tới địa chỉ hỗ trợ đã công bố hoặc nhắn Facebook Messenger đã công bố để nhờ hỗ trợ. Việc được trả lời không có nghĩa là dữ liệu đã bị xóa.
- Link text: `support@nutreeai.com` · Facebook Messenger · Hủy gói · Câu hỏi thường gặp

Hủy gói links to `/cancellation`. Câu hỏi thường gặp links to `/faq`.

## Sentences this draft refuses

- Any wording that the account is deleted, erased, scheduled, or completed.
- Any 3, 7, 15, 30, or other day count.
- Any claim that email to `nutreeaidev@gmail.com` is monitored, or that the address grants admin.
- Any new public policy sentence outside this held note.
