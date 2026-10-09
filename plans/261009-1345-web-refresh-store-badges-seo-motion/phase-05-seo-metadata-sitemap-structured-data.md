# Phase 05: SEO (metadata, sitemap, robots, structured data)

## Context Links
- `src/app/layout.tsx` metadata · every `src/app/**/page.tsx`
- `src/lib/legal-company.ts` (legal name, tax ID, address)
- Next.js Metadata API: `metadataBase`, `alternates.canonical`, `app/sitemap.ts`, `app/robots.ts`

## Overview
- Priority: P1 · Status: Todo
- Technical SEO baseline: canonical URLs, crawl files, share previews, entity markup.

## Key Insights
- Page titles already end in "| Nutree" → no title template (would double the brand).
- Next merges `openGraph` shallowly → each page must pass a complete OG object (helper).
- Server HTML is always VI; EN is client-only → single-language index, no hreflang.
- Legacy VI slugs 301 in `next.config.js` → sitemap lists English slugs only.
- No public ratings → MobileApplication rich result unlikely; never fabricate `aggregateRating`.

## Requirements
- `metadataBase = https://nutreeai.com`; default OG `/og-image.png` 1200×630.
- `createPageMetadata({ title, description, path, ogType })` → title, description, canonical, full OG, Twitter card.
- Home title "Nutree – Trợ lý dinh dưỡng AI, đếm calo & track macro".
- `sitemap.xml`: 13 public routes. `robots.txt`: allow `/`, disallow `/admin`, `/api/`.
- JSON-LD: Organization + WebSite (layout), MobileApplication (home). Escape `<`.
- Footer links `/why` (was orphaned).

## Architecture
```
src/lib/seo.ts               createPageMetadata()
src/lib/structured-data.ts   organizationSchema, websiteSchema, mobileApplicationSchema
src/components/seo/JsonLd.tsx  <script type="application/ld+json">
src/app/sitemap.ts           MetadataRoute.Sitemap
src/app/robots.ts            MetadataRoute.Robots
```

## Related Code Files
- Create: the five files above
- Modify: `layout.tsx`, `page.tsx`, `why`, `faq`, `research`, `contact`, `pay`, `privacy`, `terms`, `pricing`, `payment`, `usage`, `cancellation`, `complaints` pages

## Implementation Steps
1. seo.ts + structured-data.ts + JsonLd
2. Layout: metadataBase, default OG/Twitter, Organization + WebSite JSON-LD
3. Pages: replace hand-written metadata with helper (keep existing titles/descriptions)
4. sitemap.ts + robots.ts
5. Verify rendered head tags, `/sitemap.xml`, `/robots.txt`

## Todo
- [ ] Helpers + JsonLd
- [ ] Layout + home metadata
- [ ] 12 page metadata migrations
- [ ] sitemap + robots

## Success Criteria
- Each page: one canonical, `og:image` absolute, `twitter:card=summary_large_image`
- JSON-LD parses; Rich Results Test shows Organization/WebSite (manual, post-deploy)

## Risk Assessment
- `dangerouslySetInnerHTML` for JSON-LD: static server data, `<` escaped → no injection path (flag exception).

## Security Considerations
- No user data in structured data; email is the public support address already on the site.

## Next Steps
- Submit sitemap in Google Search Console after deploy (user action).
