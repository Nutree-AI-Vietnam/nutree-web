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

Withdraw `POST /v1/account/deletion-requests/{receipt_id}/withdraw` requires `Idempotency-Key`. The route validates that header, then calls withdraw without passing the key in. The key is not stored and is not a replay key. `200` `{"receipt_id","state":"withdrawn"}` from `received` or `under_review`. A later withdraw of a row that is already `withdrawn` returns that row and does not write a second event. That repeat is the stored state, not a replay of the withdrawal key. `closed` is `409` `invalid_state`. A lost version update is `409` `version_conflict`.

Create is different. The create `Idempotency-Key` is stored. The same UID and key returns the stored row. A retry of an unknown create must send that same key. A new create key, while the first outcome is unknown, is a different claim and can open a second receipt after a terminal state.

A response that never arrives, including a timeout, is not a 500 body and is not proof that nothing was stored. Recovery is a retry of the same create key, or a status read when a receipt id is already known. Status is the check. It does not confirm that data was erased anywhere.

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
| 500 | `INTERNAL_ERROR` | The existing handler returned a body. Message: "An unexpected error occurred". A 500, a timeout, or a lost response does not prove the commit failed and does not prove that no receipt exists |

`auth_time` must be within `ACCOUNT_DELETION_AUTH_TIME_MAX_AGE_SECONDS` (default 300) after `ACCOUNT_DELETION_AUTH_TIME_CLOCK_SKEW_SECONDS` (default 60). A refresh does not move `auth_time`. Create, status, and withdraw all run this check. Those numbers are backend settings, not a public retention period.

States are human intake only: `received`, `under_review`, `withdrawn`, `closed`. No state deletes data, revokes a session, sends email, or calls the legacy delete. Operator moves `received → under_review → closed` have no public route. `apply_operator_state_change` does not authenticate the actor.

Two additive tables, migration `20261108041529440483`, are in the draft and were not run. Render's entrypoint skips migrations. This note does not authorize `migrate.yml`.

Nutree named `nutreeaidev@gmail.com` at 11:02 ICT on 2026-11-08 as the handling contact for a manual request. The same address is in the backend PR body and runbook. This note does not ask again who that contact is. How the technical operator principal is set up in the system is still a rollout check. The address is not permission to send mail automatically, read the inbox, or grant admin. This note does not say the mailbox is monitored.

## Auth feasibility

Decision pending BI approval. The factual gate is: there is no approved public auth on this website. This preparation does not implement sign-in. It does not promise that a Firebase account is never created. This repository has no public account-creation flow. Whether an existing app provider creates an account is a backend confirmation, not a fact this note can close.

What exists in nutree-web:

- `src/lib/firebase-admin-auth.ts` signs a staff user in with email and password for the meal-catalog admin, then refreshes that admin session. Tokens stay in memory in `useAdminSession`. Env names only: `NEXT_PUBLIC_FIREBASE_SIT_API_KEY`, `NEXT_PUBLIC_FIREBASE_PROD_API_KEY`, and legacy `NEXT_PUBLIC_FIREBASE_API_KEY`. No Firebase project id is in this repository.
- `package.json` has no Firebase client SDK.
- There is no Google, Apple, or other OAuth sign-in for a Nutree account on the website.
- A backend unit-test fixture uses `sign_in_provider: "phone"` and `email_verified: false`. That fixture is not a list of providers this website may add. `sign_in_provider()` records the token's provider and does not allowlist one. This website must not add email-link or phone sign-in.

The admin email-password path must not be reused for deletion intake. It is a staff login, it is the wrong principal, and using it would be an account action this run does not take.

A later web client can send a token only if all of these are true:

1. BI approves a public auth approach. Until that approval, the page does not gain a sign-in control.
2. Backend confirms which existing app providers may be used, and that the Firebase project id matches the project the API verifies. This repo cannot confirm either. Do not print key values. Do not add email-link or phone here.
3. The page does not match or link an email address to find the account.
4. The sign-in is recent enough for `auth_time`. A long-lived website session is not enough, because refresh does not move `auth_time`.

Until public auth is approved, the live pages stay guidance only.

## Rollout gates

Do not pass a gate by editing this note.

1. Niels reviews backend PR 936. No review was on the PR when this note was written.
2. Backend stays unmerged. Flag stays off, so the routes stay 404. Migration stays unrun.
3. The handling contact is already `nutreeaidev@gmail.com`. Do not ask for that name again. Before the flag is turned on, verify the technical operator principal and how it is set up. That check is not permission to read the mailbox or grant admin.
4. Backend confirms the existing provider list and the Firebase project id, without printing credentials.
5. No new provider, no email-link, and no phone sign-in are added on the website. Public auth stays unapproved until BI says otherwise. This gate does not claim that Firebase never creates an account.
6. The sentences in the proposed copy below are approved or replaced. Approval of this file is not approval to publish them. The address `nutreeaidev@gmail.com` in that copy is new public text and needs that same approval.
7. Only then, a separate nutree-web draft can call the API behind a flag that stays off. No public form and no production customer test before that draft is reviewed on its own.
8. Never call `DELETE /v1/users/firebase/{firebase_uid}` from the page.

English locale persistence shipped separately as nutree-web PR 50, squash `9a4ce07db7b331251c2ca41bdb957b27577f9c27`. This note does not change that release and does not change the live deletion page.

## Live copy today

Both `/delete-account` and `/en/delete-account` render `DeleteAccountArticle`. The same English and Vietnamese blocks are on both URLs. Document title and description are the English strings on both URLs. Canonical is the page path. `ogLocale` stays the default `vi_VN` because these pages do not pass one. Neither page passes `languages`, so neither emits hreflang.

Body sentences below were read on `abc1843` and are unchanged on squash `9a4ce07`. After that squash, the English block links "Cancellation" to `/en/cancellation` and "FAQ" to `/en/faq`. The Vietnamese block still links "Hủy gói" to `/cancellation` and "Câu hỏi thường gặp" to `/faq`.

Live help contacts are `support@nutreeai.com` from `SITE_CONFIG.supportEmail` and Messenger `https://m.me/1019820571221637`. `nutreeaidev@gmail.com` is not on the live page. It appears only in the proposed copy, and that appearance needs approval.

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

Use these sentences only after the gates above. Until then, the live sentences stay. No sign-in control is included, because public auth is not approved. The sentences do not name Google, Apple, email-link, or phone.

A receipt means the request was received. It does not confirm erasure, deletion, a schedule, or completion. A status does not confirm that data was erased somewhere else. No sentence gives a day count.

`/en/delete-account` would show the English block only. `/delete-account` would show the Vietnamese block only. Both proposed pages keep canonical on their own path and do not add hreflang. English `ogLocale` would be `en_US`. Vietnamese `ogLocale` would be `vi_VN`.

While public auth is not approved, the page shows the pending sentence and does not show File, Check status, or Withdraw.

### Controls, English

- Pending: Filing, status, and withdrawal are not available on this page.
- Button, only after public auth is approved: File a request
- After 202: Nutree received this request. Receipt: {receipt_id}. Received at: {received_at}. Received does not confirm that anything was erased. Keep this receipt id. You need it to check status or withdraw.
- Filing reference, shown with the attempt and kept until a status is shown: Keep this filing reference: {create_idempotency_key}. A retry of this filing must use this same reference.
- Check status button: Check status
- Status loaded: show the state sentence, the receipt id, {received_at}, and {updated_at}.
- `received`: Request received. This status does not confirm whether any data has been erased.
- `under_review`: A person is looking at this request. This status does not confirm whether any data has been erased.
- `withdrawn`: You withdrew this request. This status does not confirm whether any data has been erased, and it does not say data was restored.
- `closed`: Nutree closed this request. Closed does not confirm that data was erased.
- Withdraw button, only for `received` or `under_review`: Withdraw this request
- After withdraw 200: This request is withdrawn. Withdrawn does not confirm that data was erased.
- Already withdrawn: This request is already withdrawn.
- Closed: This request is closed and cannot be withdrawn here.
- `version_conflict`: This request changed. Check the status and try again.
- Unknown filing result, including a timeout or a lost response: Nutree did not show a result for this filing. The outcome is unknown. Keep the filing reference above and retry with that same reference. The same reference does not file a second request: a stored attempt returns its receipt, and an attempt that was not stored is stored once. Do not replace the reference while the outcome is unknown.
- Unknown withdrawal result: Nutree did not show a withdrawal result. Check the status before trying again. If the status is withdrawn, leave it. If the status is received or under review, you can withdraw again. Each withdrawal attempt sends its own check header. That header is not stored and does not replay the filing reference.
- `INTERNAL_ERROR`, when that body arrives: Nutree returned an error. That does not show whether a request was stored. Keep the filing reference and retry with that same reference, or check status if you already have a receipt id.
- 404 body shared by flag off, a missing receipt, and a receipt this sign-in cannot open: Nutree cannot show that.
- Status could not be loaded: Status could not be loaded. This does not change the request. Try again.
- `not_authenticated`: Sign in with the Nutree account you already use, then try again.
- `invalid_token`: Nutree could not confirm that sign-in. Sign in again.
- `token_revoked`: That sign-in is no longer valid. Sign in again.
- `reauth_required`: Sign in again. A recent sign-in is required before Nutree can file, show, or withdraw a request.
- `idempotency_key_required` or `idempotency_key_invalid` on filing: Nutree did not accept that filing reference. Keep the same reference and try again.
- `idempotency_key_required` or `idempotency_key_invalid` on withdrawal: Nutree did not send that withdrawal. Check the status, then try again if it is still open. This is a check of the attempt header, not a replay of a stored withdrawal key.
- 429: Too many attempts. Wait and try again.
- `auth_unavailable`: Nutree could not confirm sign-in just now. Try again later.

### Proposed English page, `/en/delete-account`

Title: `Delete your Nutree account | Nutree`

Description: `How to ask Nutree to receive an account-deletion request. A receipt does not confirm erasure, and this page states no erasure date.`

Canonical: `https://nutreeai.com/en/delete-account`

- Eyebrow: Nutree
- Heading: Delete your Nutree account
- Intro: Public sign-in on this page is not approved. When it is, this page can file a request only after you sign in with a Nutree sign-in approved for this page. This page does not ask you to make a new account for the request, and it does not look up an account by email address. A receipt means Nutree received the request. A receipt does not confirm that the account or any data has been erased. This page does not state a date by which data is erased.
- Sign-in note, only after public auth is approved: Sign in again just before you file, view, or withdraw a request. An older sign-in is not enough.
- In the Nutree app
- Open Settings, then Account Management, then Delete Account. That control inside the app remains available. This page does not replace it.
- Subscriptions
- Deleting the Nutree account does not cancel a subscription charged by the Apple App Store, Google Play, or another store. Cancel that subscription with the store that charged you. Published cancellation steps are on the cancellation page.
- Meal photos are stored for meal history. This page does not state a date by which those photos or other account data are erased.
- Then the English controls above.
- Ask for help
- For help handling an account-deletion request, email nutreeaidev@gmail.com. This contact is proposed for this page and is not on the live page until this copy is approved. A message there is not an automatic deletion, and a reply does not confirm that data was erased. This page does not say who reads that mailbox, and it does not give anyone access to it.
- You can also email support@nutreeai.com or message the published Facebook Messenger chat. Those contacts are already on the live page. A reply is not a promise that data has been erased.
- Link text: `nutreeaidev@gmail.com` · `support@nutreeai.com` · Facebook Messenger · Cancellation · FAQ

Cancellation links to `/en/cancellation`. FAQ links to `/en/faq`. Messenger remains `https://m.me/1019820571221637`.

### Controls, Vietnamese

- Pending: Việc gửi, xem trạng thái và rút yêu cầu chưa có trên trang này.
- Button, only after public auth is approved: Gửi yêu cầu
- After 202: Nutree đã nhận yêu cầu này. Biên nhận: {receipt_id}. Thời điểm nhận: {received_at}. Đã nhận không xác nhận dữ liệu đã bị xóa. Hãy giữ mã biên nhận này. Bạn cần mã đó để xem trạng thái hoặc rút yêu cầu.
- Filing reference: Hãy giữ mã lần gửi này: {create_idempotency_key}. Gửi lại lần này phải dùng đúng mã đó.
- Check status button: Xem trạng thái
- Status loaded: hiện câu trạng thái, mã biên nhận, {received_at}, và {updated_at}.
- `received`: Đã nhận yêu cầu. Trạng thái này không xác nhận dữ liệu đã bị xóa hay chưa.
- `under_review`: Có người đang xem yêu cầu này. Trạng thái này không xác nhận dữ liệu đã bị xóa hay chưa.
- `withdrawn`: Bạn đã rút yêu cầu này. Trạng thái này không xác nhận dữ liệu đã bị xóa hay chưa, và không nói dữ liệu đã được khôi phục.
- `closed`: Nutree đã đóng yêu cầu này. Việc đóng không xác nhận dữ liệu đã bị xóa.
- Withdraw button, only for `received` or `under_review`: Rút yêu cầu này
- After withdraw 200: Yêu cầu này đã được rút. Việc đã rút không xác nhận dữ liệu đã bị xóa.
- Already withdrawn: Yêu cầu này đã được rút từ trước.
- Closed: Yêu cầu này đã đóng và không rút được tại đây.
- `version_conflict`: Yêu cầu vừa thay đổi. Hãy xem lại trạng thái rồi thử lại.
- Unknown filing result: Nutree chưa hiện kết quả cho lần gửi này. Kết quả chưa rõ. Hãy giữ mã lần gửi ở trên và gửi lại bằng đúng mã đó. Cùng một mã không tạo yêu cầu thứ hai: lần đã được lưu sẽ trả lại biên nhận của lần đó, và lần chưa được lưu sẽ được lưu một lần. Đừng đổi mã khi kết quả còn chưa rõ.
- Unknown withdrawal result: Nutree chưa hiện kết quả rút yêu cầu. Hãy xem trạng thái trước khi thử lại. Nếu trạng thái là đã rút, hãy dừng. Nếu trạng thái vẫn là đã nhận hoặc đang được xem, bạn có thể rút lại. Mỗi lần rút gửi một mã kiểm tra riêng. Mã đó không được lưu và không phát lại mã lần gửi.
- `INTERNAL_ERROR`: Nutree trả về một lỗi. Điều đó không cho thấy yêu cầu đã được lưu hay chưa. Hãy giữ mã lần gửi và gửi lại bằng đúng mã đó, hoặc xem trạng thái nếu bạn đã có mã biên nhận.
- 404: Nutree không hiển thị được mục này.
- Status could not be loaded: Chưa tải được trạng thái. Việc này không đổi yêu cầu. Hãy thử lại.
- `not_authenticated`: Hãy đăng nhập bằng tài khoản Nutree bạn đang có, rồi thử lại.
- `invalid_token`: Nutree không xác nhận được lần đăng nhập đó. Hãy đăng nhập lại.
- `token_revoked`: Lần đăng nhập đó không còn hiệu lực. Hãy đăng nhập lại.
- `reauth_required`: Hãy đăng nhập lại. Nutree cần một lần đăng nhập gần đây trước khi gửi, xem hoặc rút yêu cầu.
- Bad filing reference: Nutree chưa nhận mã lần gửi đó. Hãy giữ đúng mã đó rồi thử lại.
- Bad withdrawal header: Nutree chưa gửi lần rút đó. Hãy xem trạng thái, rồi thử lại nếu yêu cầu vẫn đang mở. Đây là bước kiểm tra của lần thử, không phải phát lại một mã rút đã lưu.
- 429: Quá nhiều lần thử. Hãy đợi rồi thử lại.
- `auth_unavailable`: Nutree chưa xác nhận được đăng nhập lúc này. Hãy thử lại sau.

### Proposed Vietnamese page, `/delete-account`

Title: `Xóa tài khoản Nutree | Nutree`

Description: `Cách nhờ Nutree nhận một yêu cầu xóa tài khoản. Biên nhận không xác nhận dữ liệu đã bị xóa, và trang này không nêu ngày xóa dữ liệu.`

Canonical: `https://nutreeai.com/delete-account`

- Eyebrow: Nutree
- Heading: Xóa tài khoản Nutree
- Intro: Việc đăng nhập công khai trên trang này chưa được duyệt. Khi được duyệt, trang này chỉ gửi yêu cầu sau khi bạn đăng nhập bằng cách đăng nhập Nutree đã được duyệt cho trang này. Trang này không bảo bạn tạo tài khoản mới cho yêu cầu, và không tìm tài khoản bằng địa chỉ email. Biên nhận có nghĩa là Nutree đã nhận yêu cầu. Biên nhận không xác nhận tài khoản hoặc dữ liệu đã bị xóa. Trang này không nêu ngày dữ liệu sẽ bị xóa.
- Sign-in note, only after public auth is approved: Hãy đăng nhập lại ngay trước khi gửi, xem hoặc rút yêu cầu. Lần đăng nhập cũ không đủ.
- Trong ứng dụng Nutree
- Mở Cài đặt, rồi Quản lý tài khoản, rồi Xóa tài khoản. Thao tác trong app vẫn dùng được. Trang này không thay thế thao tác đó.
- Gói đăng ký
- Xóa tài khoản Nutree không hủy gói đã thanh toán qua Apple App Store, Google Play hoặc cửa hàng khác. Hãy hủy gói với cửa hàng đã tính phí. Các bước hủy đã công bố nằm ở trang hủy gói.
- Ảnh bữa ăn được lưu cho lịch sử bữa ăn. Trang này không nêu ngày mà ảnh hoặc dữ liệu tài khoản khác sẽ bị xóa.
- Then the Vietnamese controls above.
- Nhờ hỗ trợ
- Để nhờ xử lý yêu cầu xóa tài khoản, hãy gửi email tới nutreeaidev@gmail.com. Địa chỉ này là câu chữ mới đề xuất cho trang này và chưa có trên trang đang công bố cho đến khi câu chữ được duyệt. Tin nhắn tới địa chỉ đó không phải là xóa tự động, và thư trả lời không xác nhận dữ liệu đã bị xóa. Trang này không nói ai đọc hộp thư đó, và không cấp quyền truy cập hộp thư.
- Bạn vẫn có thể gửi email tới support@nutreeai.com hoặc nhắn Facebook Messenger đã công bố. Đó là liên hệ đang có trên trang. Việc được trả lời không có nghĩa là dữ liệu đã bị xóa.
- Link text: `nutreeaidev@gmail.com` · `support@nutreeai.com` · Facebook Messenger · Hủy gói · Câu hỏi thường gặp

Hủy gói links to `/cancellation`. Câu hỏi thường gặp links to `/faq`. Messenger remains `https://m.me/1019820571221637`.

## Sentences this draft refuses

- Any wording that the account is deleted, erased, scheduled, or completed.
- Any wording that a status proves nothing was erased anywhere.
- Any wording that a 500, a timeout, or a lost response proves no receipt was stored.
- Any wording that a 404 means the account or the request does not exist.
- Any wording that the withdrawal header is a stored replay key.
- Any 3, 7, 15, 30, or other day count.
- Any claim that email to `nutreeaidev@gmail.com` is monitored, read by this website, sent automatically, or grants admin.
- Any new public policy sentence outside this held note.
