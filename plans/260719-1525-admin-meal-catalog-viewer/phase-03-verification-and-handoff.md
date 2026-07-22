---
phase: 3
title: "Subdomain Verification And Handoff"
status: pending
priority: P2
effort: "2-3h"
dependencies: [1, 2]
---

# Phase 3: Subdomain Verification And Handoff

## Context Links

- Plan overview: `/Users/alexnguyen/Desktop/Nut/nutree-web/plans/260719-1525-admin-meal-catalog-viewer/plan.md`
- Web checks: `/Users/alexnguyen/Desktop/Nut/nutree-web/package.json`
- Backend checks: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/pyproject.toml`

## Overview

Verify the backend catalog list/generate-image API, web admin page, and `admin.nutreeai.com` hosting setup together. Document auth/setup steps and prepare a clean handoff for implementation review or PR.

## Requirements

- Functional: backend endpoint returns real catalog meal rows locally.
- Functional: web page can load all catalog meals, filter missing-image rows, paginate, preview image/name/details, and trigger image generation.
- Functional: hosting config supports `admin.nutreeai.com` separately from `nutreeai.com`.
- Non-functional: no syntax/type errors; no secret files staged; docs note env/config needed for local testing and deployment.

## Architecture

Validation must prove both layers separately and then end to end:

```text
backend unit tests -> backend local endpoint smoke -> web type/lint -> browser smoke for all/filter/generate -> admin subdomain config check
```

## Related Code Files

- Modify if needed: `/Users/alexnguyen/Desktop/Nut/nutree-web/README.md`
- Modify if needed: `/Users/alexnguyen/Desktop/Nut/nutree-web/.env.example`
- Modify/create if needed: `/Users/alexnguyen/Desktop/Nut/nutree-web/vercel.json`
- Modify if needed: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/docs/api-endpoints.md`
- Test outputs: no committed generated caches.

## Implementation Steps

1. Run backend focused tests for admin catalog list/generate-image route/query/action.
2. Run backend import/lint boundary check if new app/infra files are added.
3. Start MealTrack backend locally with correct `APP_DATABASE_URL` if endpoint smoke needs DB.
4. Run `npm run type-check` and `npm run lint` in `nutree-web`.
5. Start `nutree-web` locally and verify admin image QA route in browser.
6. Verify hosting config for `admin.nutreeai.com`: domain mapping, env vars, and public-domain route behavior.
7. Confirm git diff excludes secrets, pycache, `.env`, and unrelated generated reports.
8. Write concise handoff: endpoint path, env vars, auth behavior, subdomain deployment steps, tests run.

## Todo List

- [ ] Run backend checks.
- [ ] Run frontend checks.
- [ ] Smoke-test end to end locally.
- [ ] Verify/admin subdomain deployment config.
- [ ] Check git diff for unrelated files/secrets.
- [ ] Prepare handoff.

## Success Criteria

- [ ] Backend route tests pass.
- [ ] Web type-check and lint pass.
- [ ] Local admin page loads real backend catalog rows and generate action works.
- [ ] `admin.nutreeai.com` hosting path is documented/configured.
- [ ] No unrelated user changes reverted.
- [ ] Handoff includes exact commands and unresolved follow-ups.

## Risk Assessment

- Risk: local backend DB lacks image statuses or catalog data. Mitigation: verify endpoint shape with seeded/dev DB; document if image generation/import is separate.
- Risk: PostHog env blocks `next build`. Mitigation: use existing repo validation fallback if build is blocked by missing PostHog key.
- Risk: two-repo changes make PR packaging awkward. Mitigation: keep commits/PRs separate per repo unless user asks otherwise.
- Risk: subdomain uses same app but should not leak to public navigation. Mitigation: test host behavior and keep route unlinked from public nav/sitemap.

## Security Considerations

- Check `git status` for `.env*` and credentials before any commit.
- Do not screenshot or log admin bearer tokens.
- Keep admin route read-only until auth and audit requirements are explicit.
