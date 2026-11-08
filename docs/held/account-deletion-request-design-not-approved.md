# HELD — account-deletion request design is not approved

Status: design note only. Nothing in this file is implemented in nutree-web, and nothing here authorizes a backend change. The attached backend package is a design for review through BI. It is not a CTO-approved architecture and it is not an implementation contract.

No new endpoint, table, auth boundary, email-link sign-in, worker, flag, or web form is added by this note. `/delete-account` and `/en/delete-account` stay the existing guidance pages. They do not submit a deletion request, and this note does not change their wording.

## What must not be called

`DELETE /v1/users/firebase/{firebase_uid}` in `mealtrack_backend` `main` `a2f71d8bf3c371114d911b61cfc96092c46f5049` is an immediate, irreversible, partial deletion. Source review of that SHA (no production query) describes it as:

- It does not create a deletion-request row, a receipt id, or a 30-day job.
- It anonymizes some account fields and leaves profile and health data (including allergies, conditions, date of birth, height, and weight), meals, photos, nutrition, many child tables, and vendor data.
- Firebase Auth deletion is an in-process best-effort task. The response says tokens are not revoked.
- There is no email OTP. The legacy Resend claim mailer is disabled by default.
- Production CORS for a future web origin is unknown.

A new web form must not call that route and must not relabel it as a request. The route’s own docstring is not evidence that all user data is erased. This web repository does not change that backend route.

That SHA was not compared with a deployed build. Production may differ.

## Two phases, both unapproved

The backend design couples a durable intake with an automatic destructive worker. This note keeps those as separate phases. Neither phase is approved. Neither phase is promised to users.

### Phase 1 — intake, durable receipt, human handling

A later decision could accept a signed-in deletion *request* that stores a durable row and shows a receipt id, and that a person handles. Until that decision exists:

- nutree-web will not file a request.
- The page will not show success unless a durable receipt was actually stored and returned.
- An upstream failure must not be shown as success.
- Email alone, including a `mailto:` link, is not that mechanism.
- No retention period, including 30 days, is stated.
- No wording says the account or all personal data was erased.

Human handling in this phase means an operator can see the stored request and act under an approved runbook. It does not mean the existing `DELETE` route runs when the form is submitted.

### Phase 2 — automatic destructive worker

An automatic worker that erases data, deletes objects, calls vendors, revokes sessions, or deletes the Firebase user is a separate phase. It needs its own CTO decision after retention exceptions are decided. It does not block the English routing pull request or the held wording draft. This repository does not add `DELETION_WORKER_ENABLED`, a cron, or a queue.

The backend design’s proposed routes (`POST /v1/account-deletion-requests` and the confirm, cancel, and status routes), the `deletion_requests` and `deletion_request_events` tables, Firebase email-link sign-in, and Resend receipt mail are all inside that unapproved package. They are listed here so the scope is visible. They are not built.

## Ownership and abuse, without a new boundary

Any future intake still has to prove the requester owns the account with the existing Firebase ID-token verification, including revocation checking that the current delete route does not use. A form that accepts only an email and no Firebase session would be a new public auth boundary and needs a CTO decision. This note does not add one.

Source review of `src/api/middleware/rate_limit.py` at the same backend SHA says the default limiter key base64-decodes the JWT `sub` without verification. That is a source-review finding. It is not an independently confirmed production exploit, and this repository does not change backend rate limiting.

## Open until BI and CTO decide

- Whether phase 1 is wanted at all.
- Receipt text, in English and Vietnamese, approved exactly before it is published.
- Whether any retention period is operationally true. None is claimed here.
- Which data a later phase 2 may delete, anonymize, or must keep. Payments, tax records, backups, and vendor copies are undecided.
- Production CORS, email-link settings, and whether the legacy mailer is enabled. Those are not in the reviewed source defaults as enabled.

This note is not a legal or Play-compliance certification. End-to-end deletion is not verified.
