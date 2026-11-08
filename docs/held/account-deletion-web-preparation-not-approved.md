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

Create `POST /v1/account/deletion-requests` requires `Idempotency-Key`. Success is `202` with `receipt_id`, `state`, `received_at`. `state` is the row's current state. The same UID and key returns that row, whose state may be `received`, `under_review`, `withdrawn`, or `closed`. The page shows the returned state. It does not relabel every replay as received. A new key while a request is `received` or `under_review` returns the open receipt and does not write another event. The same key after `withdrawn` or `closed` returns that terminal row. A new key after a terminal state creates a new receipt. The response does not include `account_found`, `user_id`, or email. A `202` does not prove an active Nutree account. The draft accepts an active user row, an inactive or soft-deleted row, and an orphan Firebase UID with no `users` row. The first two are linked to a user id. The third stores `user_id` null. Who may file is a pending CTO decision. This note does not add an active-only gate.

Status `GET /v1/account/deletion-requests/{receipt_id}` is `200` with `receipt_id`, `state`, `received_at`, `updated_at` for the owning UID. Missing and another UID's receipt are the same 404 body.

Withdraw `POST /v1/account/deletion-requests/{receipt_id}/withdraw` requires `Idempotency-Key`. The route validates that header, then calls withdraw without passing the key in. The key is not stored and is not a replay key. `200` `{"receipt_id","state":"withdrawn"}` from `received` or `under_review`. A later withdraw of a row that is already `withdrawn` returns that row and does not write a second event. That repeat is the stored state, not a replay of the withdrawal key. `closed` is `409` `invalid_state`. A lost version update is `409` `version_conflict`.

Create is different. The create `Idempotency-Key` is stored. The same UID and key returns the stored row in whatever state it is in now.

The page chooses that create reference and retains it before the request is sent. The same value stays retained across a refresh and a new sign-in until the attempt is resolved. Status uses a known receipt id. If both the receipt id and the retained create reference are unavailable, the outcome stays unknown. The page does not infer that the filing failed, and it does not start a new filing.

A response that never arrives, including a timeout, is not a 500 body and is not proof that nothing was stored. Recovery is a retry of the retained create reference, or a status read when a receipt id is already known. Status is the check. It does not confirm that data was erased anywhere.

`idempotency_key_required` on create means the header was missing. Recovery resends the original valid reference. `idempotency_key_invalid` means the sent value was rejected. Sending that rejected value again cannot succeed. Recovery does not discard a different valid reference that is still unresolved, and it does not replace a key while an attempt is unresolved or while both the receipt and a valid reference are missing. The withdrawal header is still only a per-attempt check. It is not this stored create reference.

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

Decision pending BI approval. The factual gate is: there is no approved public auth on this website. This preparation does not implement sign-in. The sign-in sentences below are not an implementation-ready auth UI.

Identity evidence, corrected:

- The Firebase project id and the app's real sign-in providers are unknown. Names a backend test or enum accepts are not proof of the app.
- A first sign-in with a custom token can create a Firebase Auth user. This note does not delete that identity, and it does not run account sync or funnel finalize.
- Earlier wording that a Firebase account is never created is withdrawn. This repository still has no public account-creation flow. That is not a guarantee about the app or about custom-token sign-in.
- A `202` from intake is not proof of an active Nutree account, as the contract section says. Eligibility remains a pending CTO decision.

What exists in nutree-web:

- `src/lib/firebase-admin-auth.ts` signs a staff user in with email and password for the meal-catalog admin, then refreshes that admin session. Tokens stay in memory in `useAdminSession`. Env names only: `NEXT_PUBLIC_FIREBASE_SIT_API_KEY`, `NEXT_PUBLIC_FIREBASE_PROD_API_KEY`, and legacy `NEXT_PUBLIC_FIREBASE_API_KEY`. No Firebase project id is in this repository.
- `package.json` has no Firebase client SDK.
- There is no Google, Apple, or other OAuth sign-in for a Nutree account on the website.
- A backend unit-test fixture uses `sign_in_provider: "phone"` and `email_verified: false`. That fixture is not a list of providers this website may add. `sign_in_provider()` records the token's provider and does not allowlist one. This website must not add email-link or phone sign-in.

The admin email-password path must not be reused for deletion intake. It is a staff login, it is the wrong principal, and using it would be an account action this run does not take.

A later web client can send a token only if all of these are true:

1. BI approves a public auth approach. Until that approval, the page does not gain a sign-in control.
2. Backend confirms the app's real providers and that the Firebase project id matches the project the API verifies. This repo cannot confirm either, and a backend provider name is not that confirmation. Do not print key values. Do not add email-link or phone here.
3. The page does not match or link an email address to find the account.
4. The sign-in is recent enough for `auth_time`. A long-lived website session is not enough, because refresh does not move `auth_time`.

Until public auth is approved, the live pages stay guidance only.

## Rollout gates

Do not pass a gate by editing this note.

1. Niels reviews backend PR 936. No review was on the PR when this note was written.
2. Backend stays unmerged. Flag stays off, so the routes stay 404. Migration stays unrun.
3. The handling contact is already `nutreeaidev@gmail.com`. Do not ask for that name again. Before the flag is turned on, verify the technical operator principal and how it is set up. That check is not permission to read the mailbox or grant admin.
4. Backend confirms the app's real provider list and the Firebase project id, without printing credentials. A backend enum is not that list.
5. No new provider, no email-link, and no phone sign-in are added on the website. Public auth stays unapproved until BI says otherwise. A custom-token first sign-in may create a Firebase Auth user. This note does not auto-delete that user and does not claim accounts are never created. Who may file waits on the CTO.
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

A returned filing shows the state Nutree returned. That state is not always received. It does not confirm an active Nutree account, erasure, a schedule, or completion. A status does not confirm that data was erased somewhere else. No sentence gives a day count.

`/en/delete-account` would show the English block only. `/delete-account` would show the Vietnamese block only. Both proposed pages keep canonical on their own path and do not add hreflang. English `ogLocale` would be `en_US`. Vietnamese `ogLocale` would be `vi_VN`.

While public auth is not approved, the controls are disabled. That disabled sentence is not a loading state, and it is not the words "pending approval". The in-flight sentences are specified for a later UI. They are not shown while the controls are disabled. No sign-in control is implementation-ready.

### Controls, English

- Disabled, not a loading state: Filing, status, and withdrawal are not available on this page.
- Submitting: Sending this filing.
- Loading status: Loading this status.
- Withdrawing: Sending this withdrawal.
- Button, only after public auth is approved: File a request
- Before send: Save this filing reference before you send: {create_idempotency_key}. Keep it after you refresh this page or sign in again, until Nutree shows a result.
- After 202: Nutree returned this request. Receipt: {receipt_id}. Received at: {received_at}. The state is the returned state, which may be received, under review, withdrawn, or closed. Show that state's sentence. This result does not show whether an active Nutree account exists, and it does not confirm that anything was erased. Keep this receipt id. Status uses it.
- Check status button, when a receipt id is known: Check status
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
- Unknown filing result, including a timeout or a lost response, while the reference or the receipt is still kept: Nutree did not show a result for this filing. The outcome is unknown. Keep the filing reference you saved before sending, and retry with that same reference. The same reference returns the stored request in its current state. It does not file a second request. Do not replace the reference while the outcome is unknown.
- Both receipt and filing reference unavailable: Nutree cannot tell the outcome of that attempt. This page will not start a new filing.
- Missing filing reference on the request: The filing reference was not sent. Send the reference you saved before this attempt.
- Rejected filing reference: That filing reference was not accepted. Sending it again will not work. If you saved a reference before sending, keep that one and send it. If you have no saved reference and no receipt, Nutree cannot tell the outcome, and this page will not start another filing.
- Unknown withdrawal result: Nutree did not show a withdrawal result. Check the status before trying again. If the status is withdrawn, leave it. If the status is received or under review, you can withdraw again. Each withdrawal attempt sends its own check header. That header is not stored and does not replay the filing reference.
- `INTERNAL_ERROR`, when that body arrives: Nutree returned an error. That does not show whether a request was stored. Keep the filing reference and retry with that same reference, or check status if you already have a receipt id.
- 404 body shared by flag off, a missing receipt, and a receipt this sign-in cannot open: Nutree cannot show that.
- Status could not be loaded: Status could not be loaded. This does not change the request. Try again.
- `not_authenticated`: Sign in with the Nutree account you already use, then try again.
- `invalid_token`: Nutree could not confirm that sign-in. Sign in again.
- `token_revoked`: That sign-in is no longer valid. Sign in again.
- `reauth_required`: Sign in again. A recent sign-in is required before Nutree can file, show, or withdraw a request.
- Missing withdrawal check: Nutree did not send that withdrawal. Check the status, then try again if it is still open. This check is not the saved filing reference.
- Rejected withdrawal check: Nutree did not accept that withdrawal check. Check the status. Trying again uses a new check for that attempt. It does not replace the saved filing reference.
- 429: Too many attempts. Wait and try again.
- `auth_unavailable`: Nutree could not confirm sign-in just now. Try again later.

### Proposed English page, `/en/delete-account`

Title: `Delete your Nutree account | Nutree`

Description: `How to ask Nutree to receive an account-deletion request. A receipt does not confirm erasure, and this page states no erasure date.`

Canonical: `https://nutreeai.com/en/delete-account`

- Eyebrow: Nutree
- Heading: Delete your Nutree account
- Intro: Public sign-in on this page is not approved, and no sign-in control is ready to build. When sign-in is approved, this page can file a request only after you sign in with a Nutree sign-in approved for this page. This page does not ask you to make a new account for the request, and it does not look up an account by email address. A returned filing shows the state Nutree returned. It does not confirm an active Nutree account, and it does not confirm that any data has been erased. This page does not state a date by which data is erased.
- Sign-in note, only after public auth is approved: Sign in again just before you file, view, or withdraw a request. An older sign-in is not enough.
- In the Nutree app
- Open Settings, then Account Management, then Delete Account. That control inside the app remains available. This page does not replace it.
- Subscriptions
- Quoted from the published cancellation page, not new wording: "Apple, Google Play, and Paddle purchases can renew until cancelled in that channel. VietQR is one-time and does not renew automatically."
- Quoted: "VietQR: there is no renewal to cancel. The transfer is one-time."
- Quoted: "Deleting the Nutree app or your Nutree account does not cancel an Apple, Google Play, or Paddle subscription."
- Quoted: "Cancel an Apple, Google Play, or Paddle subscription in that channel, using the steps above. VietQR does not renew, so there is no renewal to cancel."
- Quoted: "Nutree does not publish its own refund promise for Paddle checkout. Paddle is the merchant of record. See the Paddle Buyer Terms (https://www.paddle.com/legal/buyer-terms). This does not waive a consumer right that applicable law does not allow to be waived."
- The steps named above are the published cancellation page, linked as Cancellation.
- Meal photos are stored for meal history. This page does not state a date by which those photos or other account data are erased.
- Then the English controls above.
- Ask for help
- For help handling an account-deletion request, email nutreeaidev@gmail.com. This contact is proposed for this page and is not on the live page until this copy is approved. A message there is not an automatic deletion, and a reply does not confirm that data was erased. This page does not say who reads that mailbox, and it does not give anyone access to it.
- You can also email support@nutreeai.com or message the published Facebook Messenger chat. Those contacts are already on the live page. A reply is not a promise that data has been erased.
- Link text: `nutreeaidev@gmail.com` · `support@nutreeai.com` · Facebook Messenger · Cancellation · FAQ

Cancellation links to `/en/cancellation`. FAQ links to `/en/faq`. Messenger remains `https://m.me/1019820571221637`.

### Controls, Vietnamese

- Disabled, not a loading state: Việc gửi, xem trạng thái và rút yêu cầu chưa có trên trang này.
- Submitting: Đang gửi yêu cầu.
- Loading status: Đang tải trạng thái.
- Withdrawing: Đang gửi yêu cầu rút.
- Button, only after public auth is approved: Gửi yêu cầu
- Before send: Hãy lưu mã lần gửi này trước khi gửi: {create_idempotency_key}. Hãy giữ mã đó sau khi tải lại trang hoặc đăng nhập lại, cho đến khi Nutree hiện kết quả.
- After 202: Nutree đã trả về yêu cầu này. Biên nhận: {receipt_id}. Thời điểm nhận: {received_at}. Trạng thái là trạng thái được trả về, có thể là đã nhận, đang xem, đã rút hoặc đã đóng. Hãy hiện đúng câu của trạng thái đó. Kết quả này không cho thấy có tài khoản Nutree đang hoạt động hay không, và không xác nhận dữ liệu đã bị xóa. Hãy giữ mã biên nhận này. Xem trạng thái dùng mã đó.
- Check status button, when a receipt id is known: Xem trạng thái
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
- Unknown filing result, while the reference or the receipt is still kept: Nutree chưa hiện kết quả cho lần gửi này. Kết quả chưa rõ. Hãy giữ mã bạn đã lưu trước khi gửi và gửi lại bằng đúng mã đó. Cùng một mã trả về yêu cầu đã lưu ở trạng thái hiện tại. Mã đó không tạo yêu cầu thứ hai. Đừng đổi mã khi kết quả còn chưa rõ.
- Both missing: Nutree không biết kết quả của lần đó. Trang này sẽ không bắt đầu một lần gửi mới.
- Missing filing reference: Mã lần gửi chưa được gửi đi. Hãy gửi mã bạn đã lưu trước lần này.
- Rejected filing reference: Mã lần gửi đó không được chấp nhận. Gửi lại đúng mã đó sẽ không được. Nếu bạn đã lưu một mã trước khi gửi, hãy giữ mã đó và gửi nó. Nếu bạn không có mã đã lưu và không có biên nhận, Nutree không biết kết quả, và trang này sẽ không bắt đầu lần gửi khác.
- Unknown withdrawal result: Nutree chưa hiện kết quả rút yêu cầu. Hãy xem trạng thái trước khi thử lại. Nếu trạng thái là đã rút, hãy dừng. Nếu trạng thái vẫn là đã nhận hoặc đang được xem, bạn có thể rút lại. Mỗi lần rút gửi một mã kiểm tra riêng. Mã đó không được lưu và không phát lại mã lần gửi.
- `INTERNAL_ERROR`: Nutree trả về một lỗi. Điều đó không cho thấy yêu cầu đã được lưu hay chưa. Hãy giữ mã lần gửi và gửi lại bằng đúng mã đó, hoặc xem trạng thái nếu bạn đã có mã biên nhận.
- 404: Nutree không hiển thị được mục này.
- Status could not be loaded: Chưa tải được trạng thái. Việc này không đổi yêu cầu. Hãy thử lại.
- `not_authenticated`: Hãy đăng nhập bằng tài khoản Nutree bạn đang có, rồi thử lại.
- `invalid_token`: Nutree không xác nhận được lần đăng nhập đó. Hãy đăng nhập lại.
- `token_revoked`: Lần đăng nhập đó không còn hiệu lực. Hãy đăng nhập lại.
- `reauth_required`: Hãy đăng nhập lại. Nutree cần một lần đăng nhập gần đây trước khi gửi, xem hoặc rút yêu cầu.
- Missing withdrawal check: Nutree chưa gửi lần rút đó. Hãy xem trạng thái, rồi thử lại nếu yêu cầu vẫn đang mở. Bước kiểm tra này không phải mã lần gửi đã lưu.
- Rejected withdrawal check: Nutree không chấp nhận bước kiểm tra lần rút đó. Hãy xem trạng thái. Thử lại dùng một bước kiểm tra mới cho lần đó. Việc này không thay mã lần gửi đã lưu.
- 429: Quá nhiều lần thử. Hãy đợi rồi thử lại.
- `auth_unavailable`: Nutree chưa xác nhận được đăng nhập lúc này. Hãy thử lại sau.

### Proposed Vietnamese page, `/delete-account`

Title: `Xóa tài khoản Nutree | Nutree`

Description: `Cách nhờ Nutree nhận một yêu cầu xóa tài khoản. Biên nhận không xác nhận dữ liệu đã bị xóa, và trang này không nêu ngày xóa dữ liệu.`

Canonical: `https://nutreeai.com/delete-account`

- Eyebrow: Nutree
- Heading: Xóa tài khoản Nutree
- Intro: Việc đăng nhập công khai trên trang này chưa được duyệt, và chưa có phần đăng nhập sẵn sàng để làm. Khi đăng nhập được duyệt, trang này chỉ gửi yêu cầu sau khi bạn đăng nhập bằng cách đăng nhập Nutree đã được duyệt cho trang này. Trang này không bảo bạn tạo tài khoản mới cho yêu cầu, và không tìm tài khoản bằng địa chỉ email. Kết quả trả về cho thấy trạng thái Nutree trả về. Kết quả đó không xác nhận có tài khoản Nutree đang hoạt động, và không xác nhận dữ liệu đã bị xóa. Trang này không nêu ngày dữ liệu sẽ bị xóa.
- Sign-in note, only after public auth is approved: Hãy đăng nhập lại ngay trước khi gửi, xem hoặc rút yêu cầu. Lần đăng nhập cũ không đủ.
- Trong ứng dụng Nutree
- Mở Cài đặt, rồi Quản lý tài khoản, rồi Xóa tài khoản. Thao tác trong app vẫn dùng được. Trang này không thay thế thao tác đó.
- Gói đăng ký
- Trích từ trang hủy gói đang công bố, không phải câu mới: "Giao dịch Apple, Google Play và Paddle có thể gia hạn cho đến khi hủy đúng kênh đó. VietQR là thanh toán một lần và không tự động gia hạn."
- Trích: "VietQR: không có lần gia hạn để hủy. Chuyển khoản là một lần."
- Trích: "Xóa ứng dụng hoặc tài khoản Nutree không hủy gói Apple, Google Play hoặc Paddle."
- Trích: "Hủy gói Apple, Google Play hoặc Paddle trên đúng kênh, theo các bước ở trên. VietQR không gia hạn, nên không có lần gia hạn để hủy."
- Trích: "Nutree không công bố cam kết hoàn tiền riêng cho thanh toán Paddle. Paddle là đơn vị bán hàng (merchant of record). Xem Điều khoản người mua của Paddle (https://www.paddle.com/legal/buyer-terms). Nội dung này không từ bỏ quyền người tiêu dùng mà pháp luật áp dụng không cho phép từ bỏ."
- Các bước nói ở trên là trang hủy gói đã công bố, liên kết Hủy gói.
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
- Any wording that every returned filing is received, or that a 202 proves an active Nutree account.
- Any automatic new filing when both the receipt and the filing reference are unavailable.
- Any retry of a rejected filing reference as if that same value could succeed.
- The words "pending approval" as the label while a filing, status read, or withdrawal is in progress.
- Any 3, 7, 15, 30, or other day count.
- Any claim that email to `nutreeaidev@gmail.com` is monitored, read by this website, sent automatically, or grants admin.
- Any new public policy sentence outside this held note.
