# HELD — account-deletion request design, revision 2, not approved

Status: design note only. Revision 2 of the backend design (2026-11-08, 10:29 ICT) supersedes revision 1. This file replaces the earlier note that described revision 1. Nothing here is CTO-approved, scheduled, or implemented. nutree-web adds no form, API route, database schema, migration, or other code.

Evidence the design cites: `mealtrack_backend` `main` `a2f71d8bf3c371114d911b61cfc96092c46f5049`, read from git. No live system was queried. Production configuration is unverified.

## Phase 1, as the current design describes it

Phase 1 is intake only. It uses existing Firebase sign-in providers. A signed-in user could create a request, read its status, and withdraw it. The design names three authenticated routes, and not confirm or cancel routes:

- `POST /v1/account-deletion-requests`
- `GET /v1/account-deletion-requests/current`
- `POST /v1/account-deletion-requests/current/withdraw`

The request would be stored in two new Neon tables, `deletion_requests` and an append-only `deletion_request_events` table, committed before a `202` response. The on-screen receipt would mean “request received”. It would not mean erased, deleted, scheduled, or completed. Named people would handle the request outside the automatic system, with audited status updates. States in the design are `received`, `under_review`, `withdrawn`, and `closed`. No state transition deletes data, revokes a session, sends email, or calls another service.

Phase 1 as written does not include:

- email-link sign-in, a new sign-in provider, account linking, or Firebase console changes
- Resend or any other automatic email
- a confirm route or a cancel route
- a worker, cron, queue, or any automatic processing
- a deadline, grace period, or retention period
- a path for someone who cannot sign in

Those items are not built here. Adding the routes or tables still needs a CTO decision. This repository does not add them.

## The current delete call is not this intake

`DELETE /v1/users/firebase/{firebase_uid}` remains an immediate, partial deletion in the reviewed source. It does not create a request row or a receipt. Phase 1 does not call it, relabel it, or broaden it. A web page must not call it.

## Later automation is separate

Revision 2 does not couple intake to a destructive worker. Destructive automation is written only as future documentation, not as part of phase 1 and not as a design ready to implement. It would need its own later decision. This note does not propose it and does not implement it.

## Still not a user-facing promise

Receipt and page wording need Nutree’s exact approval before any of it is shown. This note publishes none of that wording. It states no 30-day period and no claim that data was erased.
