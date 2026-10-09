# Web refresh: store badges, partners, hero motion, SEO

**Date:** 2026-10-09 · **Owner:** web · **Status:** In progress

## Request (user, verbatim intent)
1. Remove Product Hunt
2. Replace the single "Tải Nutree" button with iOS + Android download CTAs
3. Add Anthropic to "Đối tác startup"
4. Make the site more impressive
5. Improve SEO
6. Optional motion graphics; keep performance + SEO strong

## Key facts (verified)
- Android is live: `https://play.google.com/store/apps/details?id=com.nutreeai.mobile`
- iOS: `https://apps.apple.com/vn/app/nutree-eat-with-science/id6751159552`
- Deploy: Docker `output: 'standalone'`; `sharp` absent → new `next/image` uses `unoptimized`
- Server always renders `vi`; client switches locale (localStorage) → only VI is indexable, no hreflang
- Home hero renders 3× `motion.h1` with `initial={{opacity:0}}` (LCP + SEO hit)
- Screenshots are 0.7–5.6 MB PNGs, preloaded on every page; WebP copies now 35–90 KB

## Phases
| # | Phase | Status |
|---|-------|--------|
| 1 | [Assets: badges, logos, WebP, OG image](phase-01-assets-badges-logos-webp-og.md) | Done except OG image |
| 2 | [Store CTAs + Product Hunt removal](phase-02-store-ctas-and-product-hunt-removal.md) | Todo |
| 3 | [Startup partners + Anthropic](phase-03-startup-partners-anthropic.md) | Todo |
| 4 | [Hero showcase, motion, performance](phase-04-hero-showcase-motion-performance.md) | Todo |
| 5 | [SEO: metadata, sitemap, robots, JSON-LD](phase-05-seo-metadata-sitemap-structured-data.md) | Todo |
| 6 | [Verify, review, docs](phase-06-verify-review-docs.md) | Todo |

## Dependencies
- Phase 2 and 4 both touch `translations.ts` and `globals.css` → run sequentially in one session
- Phase 5 OG image depends on phase 1 WebP screenshots + badges
- Phase 6 after all others

## Out of scope (flag in report)
- Apple-only legal/payment/FAQ charge + refund copy (needs product/legal decision)
- hreflang / locale routes (needs routing redesign)
- Deleting dead components (Features, FeaturesSlider, FeatureCard, ScreenshotPlaceholder, GlassCard) and PNG originals
- QR code, `/download` route, FAQPage schema
- Commit / deploy (user did not ask)

## Success criteria
- No Product Hunt references in `src/` or `next.config.js`
- App Store + Google Play badges on every download CTA, header has iOS + Android shortcuts
- Anthropic logo in partner rail
- One h1 per page; hero h1 visible at first paint; CLS ≈ 0
- `/sitemap.xml`, `/robots.txt`, canonical, OG 1200×630, Organization/WebSite/MobileApplication JSON-LD
- `npm run type-check && npm run lint && npm run build` pass
