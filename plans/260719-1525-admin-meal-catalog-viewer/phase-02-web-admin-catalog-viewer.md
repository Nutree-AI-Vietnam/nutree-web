---
phase: 2
title: "Web Admin Meal Catalog Page"
status: pending
priority: P1
effort: "4-6h"
dependencies: [1]
---

# Phase 2: Web Admin Meal Catalog Page

## Context Links

- Web repo: `/Users/alexnguyen/Desktop/Nut/nutree-web`
- Existing route pattern: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/app/contact/page.tsx`
- Existing client page pattern: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/app/contact/contact-page-client.tsx`
- Styling utility: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/lib/cn.ts`
- Locale/provider layout: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/app/layout.tsx`

## Overview

Add a compact meal catalog page for `admin.nutreeai.com` that fetches the backend catalog-list/generate-image endpoints, lists all catalog meals with their image/name/details, filters missing-image rows, and lets operators generate images for them.

## Key Insights

- `nutree-web` is currently public marketing/legal content, so admin route should be isolated and not added to the public nav or public sitemap.
- App has `useUser`, PostHog, and locale context, but no confirmed admin-auth flow for MealTrack backend tokens.
- Operational UI should be dense and scannable, not marketing-style.
- The target host is `admin.nutreeai.com`, so route structure and deployment config should make that clear.

## Requirements

- Functional: page loads all catalog meal rows from backend endpoint by default.
- Functional: filters for all, missing image, has image, cuisine, meal type, active status, and search.
- Functional: search input, meal type/cuisine filters, refresh button, pagination controls.
- Functional: image preview, open-image link, name, cuisine, description, meal types, macros, ingredient summary, generate-image button for missing rows, and per-row generation result.
- Functional: loading, empty, unauthorized, and generic error states.
- Functional: display key columns: name, meal type, cuisine, image status, image URL/source, last checked, error reason, and compact nutrition metadata only if useful.
- Non-functional: TypeScript strict, no fake primary data, responsive table layout.

## Architecture

```text
/meal-catalog/page.tsx or /admin/meal-catalog/page.tsx
  -> AdminMealCatalogPageClient
    -> src/lib/mealtrack-admin-api.ts
      -> GET ${NEXT_PUBLIC_MEALTRACK_API_URL}/v1/admin/meal-catalog
      -> POST ${NEXT_PUBLIC_MEALTRACK_API_URL}/v1/admin/meal-catalog/{catalog_id}/generate-image
```

Use a server or client fetch depending on auth decision:
- Real Firebase token available: client fetch with bearer token.
- No auth integration yet: local-only token input, stored in component state, clearly not persisted.

## Related Code Files

- Create: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/app/admin/meal-catalog/page.tsx`
- Create: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/app/admin/meal-catalog/admin-meal-catalog-page-client.tsx`
- Create: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/lib/mealtrack-admin-api.ts`
- Create: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/types/meal-catalog.ts`
- Optional create: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/components/admin/MealCatalogTable.tsx`
- Optional create: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/components/admin/MealCatalogFilters.tsx`
- Optional modify/create: `/Users/alexnguyen/Desktop/Nut/nutree-web/vercel.json` or hosting config for `admin.nutreeai.com`
- Modify only if needed: `/Users/alexnguyen/Desktop/Nut/nutree-web/.env.example`

## Implementation Steps

1. Decide auth token source before coding.
2. Define TypeScript response/request types matching Phase 1 schema.
3. Add API helper with URL normalization, query params, typed errors, and no token logging.
4. Build admin meal catalog page with isolated layout and no public nav entry.
5. Add all/missing-image filters plus cuisine/meal-type/search/pagination state using URL params or local state; prefer URL params if implementation stays simple.
6. Render responsive table/cards with fixed preview dimensions and readable empty/error states.
7. Add generate-image action with pending/complete/error states per row.
8. Add host/subdomain config or document deployment steps for `admin.nutreeai.com`.
9. Run `npm run type-check` and `npm run lint`.

## Todo List

- [ ] Decide auth behavior.
- [ ] Add response types and fetch helper.
- [ ] Build admin meal catalog route and page client.
- [ ] Add all/missing-image filters, table, responsive fallback.
- [ ] Add generate-image action handling.
- [ ] Add or document admin subdomain hosting config.
- [ ] Run frontend checks.

## Success Criteria

- [ ] Admin meal catalog page renders without adding public navigation.
- [ ] Page fetches live backend catalog endpoint using configured base URL.
- [ ] All meals are visible by default.
- [ ] Missing-image filter is obvious and works.
- [ ] Generate-image action updates row image/status or shows actionable failure.
- [ ] Unauthorized and network errors are clear.
- [ ] Search/filter/pagination work without layout shift.
- [ ] TypeScript and lint checks pass.

## Risk Assessment

- Risk: admin auth unavailable in web. Mitigation: choose explicit temporary token input or wire Firebase token before implementation.
- Risk: frontend hardcodes unstable backend fields. Mitigation: keep required fields focused on image QA and optionalize metadata.
- Risk: table unreadable on mobile. Mitigation: switch to compact row cards under small breakpoint.
- Risk: same repo also serves public domain. Mitigation: no public nav/sitemap link and host-based routing or separate deployment target for `admin.nutreeai.com`.

## Security Considerations

- Do not persist admin tokens in localStorage unless explicitly approved.
- Do not expose admin route in public marketing navigation.
- Avoid shipping fallback mock data as production behavior.
