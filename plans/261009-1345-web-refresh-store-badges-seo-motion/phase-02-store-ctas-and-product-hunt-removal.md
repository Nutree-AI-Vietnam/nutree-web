# Phase 02: Store CTAs + Product Hunt removal

## Context Links
- `src/lib/constants.ts` (SITE_CONFIG.stores, productHunt, androidComingSoon, NAV_LINKS)
- `src/lib/translations.ts` (common/hero/finalCta/whyNutree/footer/faq keys)
- `src/components/analytics/TikTokEvents.tsx` (App Store click → ViewContent)

## Overview
- Priority: P1 · Status: Todo
- Replace every single "Tải Nutree / App Store" button with official App Store + Google Play badges; remove Product Hunt; fix stale "Android coming soon" copy.

## Key Insights
- CTA locations: Hero, FinalCTA, Header, MobileMenu, `why/content.tsx`, Footer (new).
- `<Link><Button/></Link>` nesting today = invalid interactive nesting; badges become plain `<a>` + `<img>`.
- Apple-only legal/payment/FAQ charge + refund copy stays (needs legal review) — flag only.
- TikTok route whitelists event names only, so a new `content_id` for Android is safe.

## Requirements
- Badges same visual height; App Store first; labelled via `alt` in the active locale.
- Header (space-limited): compact iOS + Android pills, icon-only below `xl`.
- Remove: `productHunt`, `androidComingSoon`, `productHuntLabel`, `tapToFlip`, `hero.downloadApp`, `hero.scroll`, `finalCta.downloadOnThe/appStore`, `whyNutree.cta.downloadOnThe/appStore`, `api.producthunt.com` remote pattern, dead `DownloadCTA.tsx`.
- Add: `stores.googlePlay`, `common.googlePlayDownloadLabel`, `footer.why`.
- Nav anchors work from every page: `/#how-it-works` etc.

## Architecture
```
StoreBadges ('use client', useLocale)
  ├─ <a href=appStore>   <Image unoptimized src=/badges/app-store-{locale}.svg   144×48 | 120×40>
  └─ <a href=googlePlay> <Image unoptimized src=/badges/google-play-{locale}.webp 162×48 | 135×40>
Header → StorePills (Apple glyph "iOS", Android glyph "Android")
TikTokEvents click handler → content_id nutree-ios-app | nutree-android-app
```

## Related Code Files
- Create: `src/components/ui/StoreBadges.tsx`, `src/components/ui/AndroidIcon.tsx`
- Modify: `constants.ts`, `translations.ts`, `Header.tsx`, `MobileMenu.tsx`, `Footer.tsx`, `FinalCTA.tsx` (rewrite), `why/content.tsx`, `TikTokEvents.tsx`, `AppleIcon.tsx`, `next.config.js`
- Delete: `src/components/sections/DownloadCTA.tsx`

## Implementation Steps
1. constants: add googlePlay, drop productHunt/androidComingSoon, `/#` nav hrefs
2. translations: interface + EN + VI edits; `getNavLabel` keys; FAQ cancel answers mention Google Play
3. StoreBadges + AndroidIcon; AppleIcon `aria-hidden`
4. Wire into Header (plain `<header>`), MobileMenu, Footer (+ `/why` link), why CTA, FinalCTA rewrite (no confetti/framer)
5. TikTokEvents Google Play branch; next.config remotePattern removal; delete DownloadCTA

## Todo
- [ ] constants + translations
- [ ] StoreBadges / AndroidIcon / AppleIcon
- [ ] Header, MobileMenu, Footer, why CTA, FinalCTA
- [ ] TikTokEvents, next.config, DownloadCTA delete

## Success Criteria
- `git grep -i "producthunt\|product hunt\|androidComingSoon\|sắp ra mắt" src next.config.js` → only legal copy flagged
- Badges render at equal height in VI + EN, keyboard focusable, correct hrefs

## Risk Assessment
- Apple logo glyph in header pill: existing site already did this; flag Apple guideline. Android robot is CC BY 3.0.

## Security Considerations
- External store links open same tab, no `target=_blank` → no opener risk.

## Next Steps
- Phase 4 hero consumes StoreBadges.
