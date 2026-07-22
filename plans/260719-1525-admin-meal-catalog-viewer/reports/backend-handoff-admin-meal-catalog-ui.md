# Backend Handoff: Admin Meal Catalog UI

---
type: handoff
status: ready-for-backend
created: 2026-07-22
source: ui-first-implementation
---

## Summary

Frontend UI is implemented first in `nutree-web` at `/admin/meal-catalog`. It is ready to call MealTrack once backend exposes a protected admin catalog endpoint.

## Frontend Route

- Source route: `/Users/alexnguyen/Desktop/Nut/nutree-web/src/app/admin/meal-catalog/page.tsx`
- Intended host: `admin.nutreeai.com`
- Runtime env: `NEXT_PUBLIC_MEALTRACK_API_URL`
- Public marketing nav: not linked

## Required Backend Endpoints

### List Catalog Meals

```http
GET /v1/admin/meal-catalog
Authorization: Bearer <admin-token>
```

Query params:

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `limit` | int | yes | UI sends `25`; backend should enforce max, recommended `100`. |
| `offset` | int | yes | Zero-based offset. |
| `q` | string | no | Search name, catalog key, cuisine. |
| `cuisine` | string | no | Exact cuisine filter. |
| `meal_type` | string | no | `breakfast`, `lunch`, `dinner`, `snack`. |
| `has_image` | bool | no | `false` means `image_url IS NULL OR image_url = ''`. |
| `is_active` | bool | no | UI defaults to `true`; allow omitted/all if desired. |

Response shape:

```json
{
  "items": [
    {
      "id": "uuid",
      "catalog_key": "vietnamese-chicken-rice",
      "name": "Vietnamese Chicken Rice",
      "cuisine": "vietnamese",
      "description": "Lean chicken, jasmine rice, herbs...",
      "image_url": "https://...",
      "meal_types": ["lunch", "dinner"],
      "calories": 520,
      "protein_g": 38,
      "carbs_g": 58,
      "fat_g": 14,
      "fiber_g": 5,
      "ingredient_count": 7,
      "ingredients": [
        { "display_name": "Chicken breast", "quantity": 120, "unit": "g" }
      ],
      "is_active": true,
      "created_at": "2026-07-22T00:00:00Z",
      "updated_at": "2026-07-22T00:00:00Z"
    }
  ],
  "total": 100,
  "limit": 25,
  "offset": 0
}
```

### Generate Catalog Meal Image

```http
POST /v1/admin/meal-catalog/{catalog_id}/generate-image
Authorization: Bearer <admin-token>
```

Expected behavior:

- Reject non-admin.
- Reject unknown catalog ID with `404`.
- For first backend slice, only generate for rows with missing `image_url`.
- Reuse the existing catalog image generator path in `scripts/generate_catalog_meal_images.py`.
- Persist generated URL to `meal_catalog.image_url`.
- Return updated item in the same shape used by list rows.

Response shape:

```json
{
  "item": { "...same shape as list item": true },
  "image_url": "https://..."
}
```

## Backend Evidence From Current Repo

- `meal_catalog` already has `name`, `cuisine`, `description`, `image_url`, meal-type eligibility flags, active flag, timestamps, and ingredients.
- Domain `CatalogMeal` already exposes `image_url`, macros, meal types, ingredients, and derived calories.
- `scripts/generate_catalog_meal_images.py` already generates Cloudflare image URLs and writes them to `meal_catalog.image_url`; by default it targets missing-image rows.

## Frontend Behavior Already Implemented

- Lists all meals by default.
- Missing-image filter maps to `has_image=false`.
- Search, cuisine, meal type, active status, pagination.
- Image preview/open link.
- Generate-image button only enabled for missing-image rows when backend URL is configured.
- Preview mode appears when `NEXT_PUBLIC_MEALTRACK_API_URL` is absent.
- Admin bearer token input is present until real auth handoff is decided.

## Open Backend Questions

- Should list include inactive meals only when `is_active=all`, or should omitted `is_active` mean all?
- Should generate action support selected batch in v1, or single-row only first? UI currently calls single-row.
- What exact admin token source should web use long term: Firebase ID token, backend-issued admin token, or another internal auth gate?
