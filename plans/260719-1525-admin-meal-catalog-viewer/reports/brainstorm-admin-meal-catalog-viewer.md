# Admin Meal Image QA Workbench Brainstorm

---
type: brainstorm
status: complete
created: 2026-07-19
source: ck:brainstorm
---

## Summary

Build a minimal admin page to review MealTrack catalog meals. The page should list all catalog meals by default with image, name, cuisine, description, meal types, macros, and ingredient summary. It should also filter meals with no image and provide a button to generate images for missing rows. It should be hosted separately at `admin.nutreeai.com`, not as part of public `nutreeai.com` navigation.

## Scout Findings

- `nutree-web` is a Next.js 14 App Router app with TypeScript strict mode, Tailwind, Framer Motion, and no existing admin route.
- Existing pages live under `src/app/{route}/page.tsx`; client-heavy pages use `{route}-page-client.tsx`.
- `mealtrack_backend` has current route patterns under `src/api/routes/v1`; admin authorization helper exists as `require_admin`.
- Current backend source has catalog image fields and docs for catalog image generation, but still needs a protected admin image-status/check API.
- Memory from prior catalog work says the intended simplified backend shape was four tables: `meal_catalog`, `meal_catalog_ingredients`, `meal_recommendations`, and `meal_recommendation_operations`.
- Memory from older image-cache work says not to conflate this page with the removed nightly/background meal-image resolver; reuse current backend image primitives deliberately.

## Requirements

- Expected output: admin web page hosted at `admin.nutreeai.com`, showing all catalog meals from MealTrack backend.
- Acceptance criteria: page fetches live backend data, lists every catalog meal by default, shows image plus name/details/macros/ingredients summary, filters missing-image rows, previews existing images, supports search/filtering/pagination, can trigger image generation for missing rows, and compiles with strict TypeScript.
- Scope boundary: image QA workbench only. No catalog create/edit/delete/import workflow. No broad admin dashboard shell. No silent resurrection of the removed background resolver.
- Constraints: keep existing `nutree-web` patterns, avoid large files, do not invent fake catalog data as the primary implementation, and protect backend endpoint with admin auth if it exposes internal catalog data.
- Touchpoints: `nutree-web/src/app/admin/meal-catalog/*` or host-routed admin path, `nutree-web/src/lib/*`, hosting config for `admin.nutreeai.com`, `mealtrack_backend/src/api/routes/v1/*`, backend schema/handler/repository layer as needed.

## Options

### Option A: Frontend-only viewer against assumed endpoint

Pros:
- Fastest web-only change.
- No backend churn.

Cons:
- Not production ready because the endpoint is not verified in current backend source.
- Risks hardcoding response shape and building UI against a ghost contract.

Verdict: reject unless user confirms endpoint exists on deployed backend outside this checkout.

### Option B: Backend catalog-list/generate-image endpoint plus web admin page

Pros:
- Verifiable end to end.
- Keeps backend as source of truth.
- Smallest production-safe feature slice.
- Can reuse backend `require_admin` and `nutree-web` App Router patterns.
- Directly supports the real operation: list all catalog meals, find missing images, and generate them.

Cons:
- Touches two repos.
- Needs auth token flow decision in web.

Verdict: recommended.

### Option C: Full catalog admin console

Pros:
- Covers eventual operational needs: edits, imports, validation, status.

Cons:
- Too much for first pass.
- Higher risk around permissions, audit trail, and data integrity.

Verdict: defer. Viewer first.

## Recommended Design

Use Option B.

Backend:
- Add `GET /v1/admin/meal-catalog` protected by `require_admin`.
- Return paginated catalog rows for every active catalog meal with `id`, `catalog_key`, `name`, `cuisine`, `description`, `image_url`, `meal_types`, `calories`, macros, `ingredient_count`, optional ingredient summary, and timestamps.
- Add a narrow generate action, recommended `POST /v1/admin/meal-catalog/{catalog_id}/generate-image`, for one missing-image meal. Selected/bulk generation can come after single-row works.
- Keep query simple: `limit`, `offset`, optional `q`, optional `meal_type`, optional `cuisine`, optional `has_image`, optional `is_active`.

Web:
- Keep code in the same repo initially; host under `admin.nutreeai.com`. Route can be `/meal-catalog` or `/admin/meal-catalog` depending deployment rewrites.
- Fetch through a typed helper using `NEXT_PUBLIC_MEALTRACK_API_URL`.
- Accept an admin bearer token from existing auth state if available; otherwise plan a local admin-token input as a temporary developer-only fallback only if no auth integration exists.
- Render compact operational table/grid with all meals as default, missing-image filter, image previews, name/details/macros, generate buttons, refresh, loading, empty, and error states.

## Risks

- Backend catalog/image source may differ by branch. Verify branch/base before implementation.
- Admin auth flow in `nutree-web` may not be wired to MealTrack Firebase tokens. Do not hide this under fake auth.
- Response shape must follow actual database schema once source files are restored or created.
- Hosting `admin.nutreeai.com` may require separate deployment/project or host-based routing config; confirm before implementation.

## Next Step

Create `ck:plan` artifact for the recommended path. Implementation should start only after plan approval.

## Unresolved Questions

- Should the web page require real Firebase admin login now, or is a local admin bearer token field acceptable for first internal testing?
- Should `admin.nutreeai.com` be a separate deployment/project pointing to this repo, or the same deployment with host-based routing?
- Should generate image support single-row only first, or selected/bulk missing rows too?
