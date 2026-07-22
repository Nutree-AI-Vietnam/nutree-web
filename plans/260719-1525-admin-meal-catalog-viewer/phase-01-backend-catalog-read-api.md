---
phase: 1
title: "Backend Admin Meal Catalog API"
status: pending
priority: P1
effort: "4-6h"
dependencies: []
---

# Phase 1: Backend Admin Meal Catalog API

## Context Links

- Brainstorm: `plans/260719-1525-admin-meal-catalog-viewer/reports/brainstorm-admin-meal-catalog-viewer.md`
- Backend repo: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend`
- Existing auth pattern: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/api/dependencies/auth.py`
- Existing admin-protected route example: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/api/routes/v1/feature_flags.py`
- Route registration: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/api/main.py`

## Overview

Expose small protected backend endpoints for admin catalog review: list all catalog meals with image/name/details/macros, filter missing-image rows, and trigger image generation for missing rows. Keep it separate from existing meal suggestion generation and recommendation planning flows.

## Key Insights

- Current backend has catalog image fields (`meal_catalog.image_url`) and catalog image generation docs/scripts.
- `require_admin` already protects privileged endpoints via `ADMIN_EMAILS`.
- Prior catalog work should stay additive and not replace `/v1/meal-suggestions`.
- Older nightly resolver surface was intentionally removed; do not bring it back unless separately approved.

## Requirements

- Functional: admin can list all active catalog meals with pagination.
- Functional: optional `q`, `meal_type`, `cuisine`, `has_image`, and `is_active` filters.
- Functional: response includes stable recipe/catalog ID/key, meal name, cuisine, description, image URL, eligible meal types, calories, protein, carbs, fat, fiber, ingredient count/summary, active status, and created/updated timestamps.
- Functional: admin can trigger image generation for one missing-image catalog item.
- Non-functional: no catalog text/nutrition mutations, no broad background resolver, no cache unless needed after profiling.
- Security: protect endpoint with `require_admin`.

## Architecture

```text
FastAPI admin route -> app query/handler -> repository port -> infra SQLAlchemy query -> catalog list response
FastAPI admin action -> app command/handler -> image generator port -> persisted image_url update
```

First implementation should derive missing-image state from empty `image_url` and support generating an image for one selected missing row. Call the existing catalog image generation primitive instead of reintroducing the removed nightly resolver.

## Related Code Files

- Create or restore: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/api/routes/v1/admin_meal_catalog.py`
- Create: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/api/schemas/response/admin_meal_catalog_responses.py`
- Create: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/api/schemas/request/admin_meal_catalog_requests.py`
- Create if needed: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/app/queries/meal_recommendation/list_meal_catalog_query.py`
- Create if needed: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/app/handlers/query_handlers/list_meal_catalog_query_handler.py`
- Create if needed: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/app/commands/meal_recommendation/generate_meal_catalog_image_command.py`
- Create if needed: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/app/handlers/command_handlers/meal_recommendation/generate_meal_catalog_image_command_handler.py`
- Reuse: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/infra/database/models/meal_recommendation/catalog_recipe.py`
- Reuse/inspect: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/scripts/generate_catalog_meal_images.py`
- Modify: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/src/api/main.py`
- Test: `/Users/alexnguyen/Desktop/Nut/mealtrack_backend/tests/unit/api/routes/test_admin_meal_catalog_routes.py`

## Implementation Steps

1. Verify target backend branch/base and confirm catalog fields, repository support, and generation script.
2. Write route tests first: admin required, all-meals default list works, missing-image filter works, cuisine/meal-type/search filters work, pagination bounds enforced.
3. Write generation-action tests: one missing item generate, invalid ID, already-has-image behavior, no token/log leakage.
4. Add response/request schemas with explicit Pydantic types.
5. Add query/handler/repository path following backend layer rules.
6. Add generate command/handler by reusing the existing catalog image generation primitive where possible.
7. Register route in `src/api/main.py`.
8. Run focused backend tests and import boundary checks.

## Todo List

- [ ] Confirm backend branch contains intended catalog fields.
- [ ] Add tests for admin gate, catalog list, missing-image filter, and generate action.
- [ ] Add catalog list endpoint and schema.
- [ ] Add generate action endpoint.
- [ ] Register route.
- [ ] Run focused tests.

## Success Criteria

- [ ] `GET /v1/admin/meal-catalog` rejects non-admin users.
- [ ] Admin request returns paginated rows for all active catalog meals from real DB/query path.
- [ ] `has_image=false` returns only meals without image URLs.
- [ ] Search, cuisine, meal type, active, limit, and offset behavior are tested.
- [ ] Generate action is covered by tests and updates missing rows safely.
- [ ] No `/v1/meal-suggestions` behavior changes.
- [ ] Backend compile/tests pass for touched area.

## Risk Assessment

- Risk: endpoint tries to return the whole table forever. Mitigation: require pagination with a sensible max limit, even if current catalog is small.
- Risk: direct API route imports infra and violates Clean Architecture. Mitigation: keep route thin and use app query/repository boundary if feasible.
- Risk: generate action accidentally becomes a long-running bulk resolver. Mitigation: batch limits and explicit status response; defer background jobs.

## Security Considerations

- Use `require_admin`; do not expose internal catalog metadata through public route unless explicitly approved.
- Keep list response read-only; generate action must only update `image_url` and any image-generation metadata if later added.
- Avoid logging bearer tokens or sensitive admin identity details.
