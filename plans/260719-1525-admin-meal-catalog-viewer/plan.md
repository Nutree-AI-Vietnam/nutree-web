---
title: "Admin Meal Image QA Workbench"
description: "Add a MealTrack admin meal catalog API and a Nutree admin subdomain page for listing catalog meals and generating missing images."
status: pending
priority: P2
effort: "1-2d"
branch: "main"
tags: [feature, frontend, backend, api, admin]
blockedBy: []
blocks: []
created: "2026-07-19T08:25:54.649Z"
createdBy: "ck:plan"
source: skill
---

# Admin Meal Image QA Workbench

## Overview

Create a production-safe but minimal admin page for MealTrack meal catalog review. The page should list every catalog meal by default, showing each meal's image, name, cuisine, description, meal types, macros, and ingredients summary. It should also make it easy to filter meals without images and provide a button to generate images for missing rows.

Recommendation: keep this in the same `nutree-web` repo for now, but deploy or route it separately at `admin.nutreeai.com`. That keeps code reuse simple while keeping the product surface separate from public `nutreeai.com`. Use a different repo only if the admin app grows into a broader internal platform with its own auth, navigation, release cadence, and team ownership.

Primary path: all-catalog listing, missing-image filter, image previews, and generate-image actions. No separate "get images" endpoint is needed because `image_url` belongs on each catalog meal row.

## Context

- Brainstorm report: [Admin Meal Catalog Viewer Brainstorm](./reports/brainstorm-admin-meal-catalog-viewer.md)
- Web repo: `/Users/alexnguyen/Desktop/Nut/nutree-web`
- Backend repo: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend`
- Verified web stack: Next.js 14 App Router, TypeScript strict, Tailwind.
- Verified backend state: catalog image fields exist in current backend source (`meal_catalog.image_url`) and docs mention `scripts/generate_catalog_meal_images.py`; current public API still needs an admin image-status/check contract.

## Scope Challenge

- Existing code: web route/page patterns exist; backend admin auth helper `require_admin` exists; catalog image URL fields and image-generation docs exist.
- Minimum changes: backend catalog list/generate-image endpoints, typed web fetch helper, catalog admin page, admin subdomain deployment config.
- Complexity: expected 7-10 files across two repos plus hosting config, no new broad admin framework.
- Selected mode: HOLD SCOPE. User explicitly asked brainstorm then plan; defer implementation until approval.

## Recommended Approach

1. Add backend `GET /v1/admin/meal-catalog` protected by `require_admin`.
2. Return paginated rows for all active catalog meals: catalog ID/key, name, cuisine, description, image URL, eligible meal types, macros/calories, ingredient count/summary, active status, created/updated timestamps.
3. Support filters on the same GET: `q`, `cuisine`, `meal_type`, `has_image`, `is_active`, `limit`, `offset`. `has_image=false` is the missing-image filter.
4. Add backend action endpoint to generate an image for a catalog meal, recommended `POST /v1/admin/meal-catalog/{catalog_id}/generate-image`.
5. Add web page for `admin.nutreeai.com`, recommended app path `/meal-catalog` or `/admin/meal-catalog` depending hosting rewrite.
6. Fetch from `NEXT_PUBLIC_MEALTRACK_API_URL`, render a dense catalog table/grid with all meals as the default view, filters including "missing image", previews, generate buttons, and clear job/error status.
7. Configure hosting so admin routes are served from `admin.nutreeai.com` and not promoted in public navigation on `nutreeai.com`.
8. Verify backend tests, frontend type-check/lint, and a local browser smoke check when implemented.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Backend Catalog Read API](./phase-01-backend-catalog-read-api.md) | Pending |
| 2 | [Web Admin Catalog Viewer](./phase-02-web-admin-catalog-viewer.md) | Pending |
| 3 | [Verification And Handoff](./phase-03-verification-and-handoff.md) | Pending |

## Not In Scope

- Catalog create/edit/delete.
- Seed import workflow.
- Recommendation generation changes.
- Replacing `/v1/meal-suggestions`.
- Full admin dashboard shell or role-management UI.
- Full automatic image resolver resurrection. The page can trigger/check/generate through current backend primitives, but should not silently bring back the removed nightly resolver surface.

## Dependencies

- Backend branch/base must contain catalog image fields and any current generation/check service to reuse.
- Web admin auth decision needed before shipping beyond local/internal testing.
- Deployment needs DNS/hosting config for `admin.nutreeai.com`.
- No cross-plan dependency detected in `nutree-web`; existing screenshot plan is completed.

## Open Questions

- Should `admin.nutreeai.com` be a separate deployment/project pointing to this repo, or the same deployment with host-based routing? Recommended: same repo; deployment shape depends on hosting provider.
- Should generate-image support single-row only first, or selected/bulk missing rows too? Recommended: single-row plus selected batch with a small limit.
- Should the web page require real Firebase admin auth immediately, or allow a local admin bearer token input for first internal testing?
- Should admin listing include inactive catalog meals by default? Recommended: default `is_active=true`, allow `is_active=false` or `all`.

## Handoff

Implementation command after approval:

```bash
/ck:cook /Users/alexnguyen/Desktop/Nut/nutree-web/plans/260719-1525-admin-meal-catalog-viewer/plan.md --tdd
```
