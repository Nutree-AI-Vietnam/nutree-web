# Code Review: TikTok Link-in-Bio Page

## Scope
- **Files**: 8 (5 new, 3 modified)
- **LOC**: ~200 new
- **Focus**: New `/links` route + route group refactor

## Overall Assessment

Clean, well-structured implementation. Build, type-check, and lint all pass. The route group separation is the right pattern for standalone pages. A few type safety and accessibility improvements recommended below.

## High Priority

### 1. SOCIAL_LINKS lacks a typed interface — `'description' in link` is a code smell

`LinksContent.tsx:48-49` uses property-existence checks (`'description' in link`, `'isAppStore' in link`) because `SOCIAL_LINKS` items have inconsistent shapes. This is fragile — a typo in the property name silently fails.

**Fix**: Define a `SocialLink` type in `types/index.ts` and type the array explicitly:

```ts
// types/index.ts
export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  description?: string;
  isAppStore?: boolean;
}

// constants.ts
export const SOCIAL_LINKS: readonly SocialLink[] = [ ... ] as const;
```

Then replace `'description' in link ? link.description : undefined` with just `link.description`.

### 2. LinkIcon `type` prop should be a union, not `string`

`LinkIcon.tsx:2` accepts `type: string` but only handles 4 cases + default. A typo passes silently.

**Fix**:
```ts
type LinkIconType = 'globe' | 'apple' | 'facebook' | 'tiktok';
export function LinkIcon({ type }: { type: LinkIconType }) { ... }
```

### 3. SVG icons missing `aria-hidden="true"`

All SVGs in `LinkIcon.tsx` and `LinkCard.tsx` are decorative but lack `aria-hidden="true"`. Screen readers will try to announce them.

**Fix**: Add `aria-hidden="true"` to every `<svg>` element in both files.

## Medium Priority

### 4. `metadataBase` not set — OG images resolve to `localhost:3000`

Build warnings confirm OG image URLs (e.g., `/logo-512.png` in `page.tsx:15`) resolve against localhost. This affects social sharing for the `/links` page specifically.

**Fix** in root `layout.tsx` metadata:
```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://nutreeai.com'),
  // ...
};
```

This is a pre-existing issue but directly impacts this feature since `/links` is a social-sharing entry point.

### 5. Copyright year rendered at runtime on a static page

`LinksContent.tsx:58` uses `new Date().getFullYear()` inside a `'use client'` component. Since the page is statically generated at build time, this creates a hydration mismatch risk if the build year differs from the client year (e.g., built Dec 31, viewed Jan 1).

**Fix**: Move the copyright to the server component (`page.tsx`) or accept the minor risk since it only matters at year boundaries.

### 6. `LinkCard` is `'use client'` solely for Framer Motion

The entire `LinkCard` component tree is client-rendered just for the stagger animation. For a link-in-bio page that should load fast on mobile WebViews, consider whether the animation justifies the JS cost.

The `/links` page ships 148KB first-load JS (vs 96KB for `/privacy`). Roughly 50KB is attributable to Framer Motion. For a page primarily viewed in TikTok's constrained WebView, this is worth noting. Not blocking — just a tradeoff to be aware of.

## Low Priority

### 7. `index` prop default of `0` means single-card usage has no delay

Not a bug, but `index` defaulting to `0` means the animation `delay: 0 * 0.08 = 0`. This is correct behavior but could be documented in the JSDoc.

### 8. Duplicate App Store URL

`SITE_CONFIG.stores.appStore` and `SOCIAL_LINKS[1].url` both hardcode the same App Store URL. If one changes, the other won't. Consider referencing `SITE_CONFIG.stores.appStore` in the social links array.

## Positive Observations

- **Route group pattern** is the correct Next.js idiom for separating layouts
- **WebView detection** is solid — covers TikTok, Trill, Musical.ly, and BytedanceWebview variants
- **Graceful degradation** — search guidance for blocked App Store links is good UX
- **`noopener noreferrer`** on external links is correct
- **Server/client split** is clean — metadata in server component, interactivity in client
- **`as const`** on SOCIAL_LINKS preserves literal types at the data level
- **Stagger animation** is subtle and performant (0.3s duration, 80ms offset)

## Recommended Actions (prioritized)

1. Add `SocialLink` interface and type `SOCIAL_LINKS` explicitly
2. Narrow `LinkIcon` type prop to a union
3. Add `aria-hidden="true"` to all decorative SVGs
4. Set `metadataBase` in root layout
5. DRY the App Store URL by referencing `SITE_CONFIG`

## Metrics

| Metric | Result |
|--------|--------|
| Type check | Pass |
| Lint | Pass (0 issues) |
| Build | Pass (static, 7 pages) |
| Bundle: /links | 148KB first load |

## Unresolved Questions

- Is Google Play Store link planned? The guidance text says "App Store or Google Play" but only App Store is listed.
- Should PostHog track link clicks on this page? Currently no analytics events are fired.
