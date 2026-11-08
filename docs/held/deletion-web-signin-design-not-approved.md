# HELD — deletion-only web sign-in design, not approved

Status: design for CTO review. It is not an implementation, not a public page, and not approval to turn a flag on. nutree-web does not add a sign-in button, a form, an API call, a Firebase console change, a migration, or a new service.

Nutree’s 16:58 ICT instruction on 2026-11-08 authorized this design after the copy packet, and authorized manual review of active, inactive, and unmatched Firebase UIDs. The handling contact remains `nutreeaidev@gmail.com`. That address is not mailbox access and not an admin grant. The technical operator principal is still unknown.

The user-facing sentences stay the approved packet at `docs/held/account-deletion-web-preparation-not-approved.md`, merged as `88bd79dda4a260ae69f8a1982bc1526cc89977cb` from exact head `a8ca76318da15e9cce978d1e19bdf3b159136021`. This design does not edit those sentences.

Backend pull request 936 stays a separate backend process. Head read earlier: `b9e3a3066321c31aa30853e3ffcde091575be8c7`. Flag off. This design does not merge it, deploy it, or change it.

## Decision this design asks the CTO to accept

Use one deletion-only sign-in on the public website, isolated from staff admin login. It uses the existing consumer Firebase project and only providers that project already enables for the Nutree app. The project id and the real provider list are unknown until someone proves them. This design does not invent either and does not widen the list.

The website does not mint custom tokens, does not call the staff email-password login, and does not add email-link or phone sign-in.

A first OAuth sign-in, and a first custom-token sign-in, can create a Firebase Auth user. This design does not delete that identity, does not sync a `users` row, does not finish a funnel, and does not match or link an email. Intake still accepts an active row, an inactive or soft-deleted row, and an orphan UID with no `users` row. A `202` is not proof of an active Nutree account. There is no active-only gate. A person reviews the request. The contact for that review is `nutreeaidev@gmail.com`.

No code, datastore, paid service, or new security boundary is built before this design is approved.

## What the website has today

Read from nutree-web `main` `88bd79dda4a260ae69f8a1982bc1526cc89977cb`.

- `src/lib/firebase-admin-auth.ts` signs a staff user in with email and password for the meal-catalog admin, then refreshes that session. Env names only: `NEXT_PUBLIC_FIREBASE_SIT_API_KEY`, `NEXT_PUBLIC_FIREBASE_PROD_API_KEY`, and legacy `NEXT_PUBLIC_FIREBASE_API_KEY`. No Firebase project id is in this repository. No provider id is in this repository.
- `src/hooks/useAdminSession.ts` keeps the admin token in memory. That path is the wrong principal for a customer deletion request.
- `package.json` has no Firebase client SDK. There is no `signInWithPopup`, `signInWithRedirect`, Google provider, or Apple provider in this repo.
- `/delete-account` and `/en/delete-account` explain the in-app control. They do not send a deletion request. Production after the docs merge still has no `<form>` on those pages.
- A backend unit-test fixture has used `sign_in_provider: "phone"`. That fixture is not the app’s provider list.

## Smallest boundary

One later client flow, only on the delete-account pages, and only after the gates below.

1. The person completes an interactive sign-in with a provider already enabled on the consumer Firebase project. The website does not create a second Firebase project.
2. The ID token’s `aud` is that project id and `iss` is `https://securetoken.google.com/<project id>`. The backend already checks this when the flag is on.
3. The browser keeps the ID token in memory for that tab. It sends `Authorization: Bearer` only to the existing intake routes. It does not put the token in `localStorage`, `sessionStorage`, a URL, or a cookie.
4. Create, status, and withdraw each require a recent `auth_time`. Default in the backend draft is 300 seconds, plus 60 seconds of clock skew. A refresh token does not move `auth_time`. Each of those three calls needs a fresh interactive sign-in. A long-lived website session is not enough.
5. The filing reference and the receipt id are stored only with the verified UID that owns them. They survive a refresh and a later sign-in of that same UID. A different UID must not see them or send them.

Staff admin login stays on the meal-catalog pages. It does not gain a deletion button. The deletion flow does not gain an email-password form.

### Options considered

| Option | Account-creation reality | Limit |
| --- | --- | --- |
| Client sign-in with providers the consumer project already enables. Recommended smallest boundary. | The first successful OAuth sign-in can create a Firebase Auth user if that provider is enabled. | Do not enable a new provider to make this work. Do not delete the Auth user afterward. Do not sync `users`. |
| Custom token minted by a Nutree server. Not this design. | The backend correction stands: the first custom-token sign-in can create a Firebase Auth user. | Minting tokens needs a privileged credential. That is a new security boundary and a new cost review. This design does not add it. |
| Reuse `signInAdminWithEmailPassword`. Rejected. | It can sign in a staff password user. | Wrong principal. It is not the consumer account. |
| Add email-link or phone on the web. Rejected until proof. | Either can create an Auth user on first use. | The app’s real list is unknown. A backend fixture is not proof. Adding one widens the list. |

No option in this design calls `accounts:signUp` itself, links providers, matches an email, writes the `users` table, runs funnel finalize, or deletes a Firebase identity.

## UID, reference, and receipt

The server already keys the row by the verified UID. The client must not work around that.

- Choose the create `Idempotency-Key` and retain it before `POST`. Retain means the original valid value, not a value the server rejected.
- Keep that value across refresh and across a new sign-in of the same UID, until the attempt is resolved.
- Status uses a known `receipt_id` with `GET /v1/account/deletion-requests/{receipt_id}`.
- If both the receipt id and the valid reference are gone, the outcome stays unknown. The page does not infer failure and does not start a new filing.
- A replay returns the row’s current state. That state may be `received`, `under_review`, `withdrawn`, or `closed`. The page shows the returned state. It does not relabel every replay as received.
- A missing create header (`idempotency_key_required`) resends the saved valid reference.
- A rejected create value (`idempotency_key_invalid`) is not sent again. If a different valid reference is still unresolved, keep it. Do not replace it. If no valid reference and no receipt remain, do not mint a key.
- The withdrawal header is checked per attempt and is not stored. It is not the create reference. A missing or rejected withdrawal check does not tell the person to file a new request.
- Account switch: if the new ID token’s UID differs, drop the previous reference and receipt from the page. Do not send them. Reauth of the same UID may reuse them after a fresh interactive sign-in.

Storage shape, if this is later built: `sessionStorage` may hold `{ uid, reference, receiptId }` and nothing else. The ID token stays in memory. Do not put the receipt or the reference in a query string. Do not send either to analytics.

## Failures stay on the operation that failed

The approved packet sentences are the words. This table is which sentence applies. A status or withdrawal failure does not use the create-retry sentence.

| What happened | What the person is told | What the client does |
| --- | --- | --- |
| Create timeout, lost response, or `INTERNAL_ERROR`, and the valid reference or receipt is still kept | The outcome is unknown. Keep the saved reference and retry that filing, or check status if a receipt is known. | Same valid reference, or `GET` with the receipt. No new key. |
| Create `INTERNAL_ERROR` is not proof that nothing was stored | The packet’s error sentence. | Do not say “no receipt was issued.” |
| Status `INTERNAL_ERROR` or status could not be loaded | Status could not be loaded. This does not change the request. | Retry `GET` only. Do not `POST` a new filing. |
| Withdraw `INTERNAL_ERROR` or no withdrawal result | Check status. If it is withdrawn, stop. If it is still open, withdraw again. | New withdrawal check header. Do not replace the create reference. Do not file a new request. |
| Create header missing | The filing reference was not sent. Send the reference saved before the attempt. | Resend the original valid reference. |
| Create value rejected | That value was not accepted. Sending it again will not work. | Keep any still-valid saved reference. Do not start another filing when both are missing. |
| 404, flag off, missing receipt, or another UID’s receipt | Nutree cannot show that. | Do not say the account or the request is absent. |
| 401 `reauth_required`, invalid, revoked, or missing token | Sign in again. | Fresh interactive sign-in of the same UID before retry. |
| 429 | Too many attempts. Wait and try again. | No new key. |
| 503 `auth_unavailable` | Sign-in could not be confirmed just now. | Retry later. No new key. |

`202` still does not prove an active Nutree account. The disabled sentence (“Filing, status, and withdrawal are not available on this page.” / “Việc gửi, xem trạng thái và rút yêu cầu chưa có trên trang này.”) is the state while public auth is not approved. It is not a loading label. In-flight labels stay the packet’s “Sending this filing.”, “Loading this status.”, and “Sending this withdrawal.”, and the Vietnamese lines already in the packet.

## UI

Build no screen in this pull request. A later implementation uses the approved packet verbatim:

- English page `/en/delete-account`, Vietnamese page `/delete-account`.
- No sign-in control until public auth is approved. The packet already says the control is not ready.
- Subscription text stays the quoted cancellation-page sentences, including Paddle and one-time VietQR. Do not rewrite them.
- Help contact on the proposed page remains `nutreeaidev@gmail.com` plus the already published `support@nutreeai.com` and Messenger. Do not send mail. Do not read the inbox.

## Threat model

| Risk | Constraint |
| --- | --- |
| XSS steals a bearer token | ID token is memory-only. A refresh clears it, which matches the short `auth_time` window. |
| XSS reads the receipt id | The receipt is unguessable (`DR-` plus 128 random bits in the backend draft). Do not put it in the URL or analytics. This does not make XSS acceptable. The page still must not render untrusted HTML. |
| CSRF on a cookie session | Do not authenticate the intake calls with a cookie the browser sends automatically. Use an `Authorization` header from memory. |
| Open redirect after provider login | Return URL allowlist is only `/delete-account` and `/en/delete-account` on `https://nutreeai.com`. Reject absolute URLs and other paths. |
| Provider callback | The OAuth redirect URI, if one is required, is an exact URL on `nutreeai.com` for those two paths. No wildcard. Adding it to the existing Firebase project is a console change and waits for CTO approval. This design does not perform it. |
| Email enumeration | The page does not look up an account by email. Sign-in errors stay generic. 404 stays “Nutree cannot show that.” |
| Token in logs | Do not log the ID token, refresh token, email, or raw Firebase UID in the browser console or analytics. |
| Cross-account replay | Client drops reference and receipt when the UID changes. Server returns the same 404 for a foreign receipt. |
| Staff token used as the customer | Admin email-password is not wired to these routes. |

## Flag, migration, and staging

`ACCOUNT_DELETION_INTAKE_ENABLED` stays false until a separate decision after this design and after backend review. While false, the three routes return 404 and do not check the token. The public page keeps the disabled sentence and does not call them.

Migration `20261108041529440483` is in the backend draft and was not run. This design does not authorize `migrate.yml`. There is no new table in nutree-web.

Synthetic staging, only after the flag is explicitly allowed on a non-production environment and only with synthetic Firebase users in the confirmed project:

| Case | Expected |
| --- | --- |
| Flag off, with or without a token | 404, no receipt |
| Active `users` row | `202`, state shown as returned |
| Inactive or soft-deleted row | `202`, not rejected for inactivity |
| UID with no `users` row | `202`, and the page does not say an active account exists |
| Same UID and same valid key | Same receipt, current state, including withdrawn or closed |
| New key while one request is open | The open receipt, no second event |
| Missing create header | Resend the saved valid key |
| Rejected create value | Do not resend that value; do not mint a replacement while unresolved |
| Stale `auth_time` | `reauth_required`, then fresh sign-in of the same UID |
| Different UID | Previous reference and receipt are not sent |
| Status or withdraw `INTERNAL_ERROR` | No create instruction |
| `sec-fetch` prefetch or a crawler | Must not be required for this design; deletion sign-in is a deliberate action |

No customer account is used in that matrix. No production test of a real deletion.

## Operator

Contact: `nutreeaidev@gmail.com`, already named. Do not ask for the contact again.

Unknown: which technical principal performs `received → under_review → closed`, and how that principal is set up. The backend function does not authenticate the actor. There is no public operator route. This design does not add one.

Manual workflow: a person reads the request outside the website and changes state with the operator function. Closing a request does not erase data. If nobody is available, the row stays `received` or `under_review`. The page states no day count. The website does not send mail when a request is filed or when it sits.

## Known and unknown

Known:

- Public nutree-web has no consumer sign-in.
- Staff admin auth is email and password, memory token, separate from this flow.
- Backend draft 936, flag off, checks `auth_time`, scopes by verified UID, accepts active, inactive, and orphan UIDs, and does not delete data.
- First OAuth or custom-token sign-in can create a Firebase Auth user.
- Approved UI packet is merged as a document. The live delete pages are still guidance.

Unknown until a named check:

- Consumer Firebase project id, and whether it equals the backend app’s project id.
- Providers actually enabled for the Nutree app.
- Whether `nutreeai.com` is already an authorized redirect domain.
- The operator principal and how it is audited.
- Whether Niels has approved backend 936. Reviews were empty when last read. This design does not re-check that as a merge of 936.

## Tasks before any implementation

1. Backend records the initialized Firebase project id and the app’s enabled providers, without pasting private keys into git or chat.
2. Compare that project id to the app. Mismatch stops the work.
3. CTO accepts this boundary, including no new provider, no custom-token minter, no active-only gate, and no automatic Auth-user deletion.
4. CTO decides the operator principal. The contact name is already set.
5. Only then may a separate nutree-web change add the client sign-in and the calls, still behind the flag defaulting off, with the approved sentences unchanged.

## Rollout gates

1. This design is approved or replaced by the CTO. Approval of the copy packet was not approval of this design.
2. Backend 936 is reviewed on its own. Flag stays off. Migration stays unrun until that process says otherwise.
3. Project id and provider list are proved. No invented provider.
4. Redirect URI, if needed, is an exact `nutreeai.com` delete-account URL approved before anyone edits the Firebase console.
5. Public sentences remain the approved packet.
6. A later implementation PR is reviewed by itself. It does not enable the flag and does not run a customer test.
7. Enabling the flag is another decision, after the synthetic matrix and after the operator principal exists.

## Out of scope

- Editing live delete-account copy or adding a form now.
- Calling the intake API, Firebase Auth, or the admin login.
- `DELETE /v1/users/firebase/{firebase_uid}`.
- Email, phone, or name matching, account linking, user sync, funnel finalize, and automatic deletion of a new Auth user.
- A new database, queue, worker, or paid vendor.
- Reading `nutreeaidev@gmail.com` or granting admin from that address.
