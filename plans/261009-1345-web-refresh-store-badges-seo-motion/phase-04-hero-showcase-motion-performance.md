# Phase 04: Hero showcase, motion graphics, performance

## Context Links
- `src/components/sections/Hero.tsx` (3× motion.h1, FlipPhone, emoji floaters, scroll cue)
- `src/components/ui/FlipPhone.tsx`, `FloatingIcon.tsx`, `providers/ScreenshotPreloader.tsx`
- `src/components/layout/AuroraBackground.tsx` (framer infinite blurred blobs, resize listener)
- `src/app/layout.tsx` (PNG `<link rel=preload>` on every route)

## Overview
- Priority: P1 · Status: Todo
- One orchestrated page-load moment that shows the product's core loop (snap a meal → AI logs it → daily ring fills → macros land), with zero JS animation cost and an LCP image that paints immediately.

## Design brief
- Audience: Vietnamese gym-goers 18–35 ("Tăng Cơ Giảm Mỡ", skinny fat). Job: iOS + Android downloads.
- Palette: forest `#1A4739`, teal `#29B6A1`, emerald `#2D8B70`, ground `#FAFCFB`, ink `#0F1F1A`, app card `#FFFBF8`; macro dots use the app's own colours (Calories `#6B7485`, Protein `#FD9067`, Carbs `#6FCCC1`, Fat `#FDB628`).
- Type: Be Vietnam Pro only; extrabold display at `leading-[0.9]`, `tabular-nums` for every number.
- Layout: left column type (left-aligned desktop, centred mobile) · right column phone stage with three floating app cards.
- Principles: real app data and real screenshots only; one motion moment, everything else still; no emoji, confetti, or bounce.
- Review vs generic default: rejected "big stat + gradient blob" hero and per-section fade-ins; the scan→log sequence is specific to this product.

## Key Insights
- LCP candidates (h1, dashboard screenshot) must not start at opacity 0 → CSS keyframes only on decorative cards.
- Three separate h1 elements today; collapse into one h1 with block spans (badge, 3 lines, tagline).
- `@keyframes` with only `from` animates to the inline end state, so ring offset can stay data-driven.

## Requirements
- Single h1: badge line + `IDEAS./TRACK./THRIVE.` (EN) or `GỢI Ý./THEO DÕI./ĐẠT GOAL.` (VI) + tagline.
- StoreBadges under subheadline; trust row icons `aria-hidden`.
- Cards: scan (thumbnail + teal beam → meal + kcal), ring (consumed/target), macro chips. Ring card hidden < sm.
- Timeline (once, ~2.6 s): scan card 0.2 s · beam 0.4–1.6 s · result 1.6 s · ring 1.8–2.6 s · chips 2.2/2.35/2.5 s.
- `prefers-reduced-motion`: no animation, final state shown, beam hidden.
- Remove JS work: FlipPhone, FloatingIcon, ScreenshotPreloader, PNG preloads, framer AuroraBackground, header slide-in.

## Architecture
```
Hero (client: locale copy)
├─ h1 > span.badge + span×3 gradient lines + span.tagline
├─ p.subheadline · StoreBadges · trust row
└─ HeroScanShowcase (client: locale data)
   ├─ PhoneMockup (dashboard WebP, priority)
   ├─ .hero-card-scan  (thumb + .hero-scan-beam, label → result)
   ├─ .hero-card-ring  (svg circle, stroke-dashoffset from 188.5 → inline)
   └─ .hero-card-macros (3 chips)
hero-showcase-content.ts → Record<Locale, {...}> data + labels
globals.css → @keyframes hero-card-in / hero-scan-beam / hero-ring-fill / hero-fade-swap
AuroraBackground → server component, static radial gradients (no blur filter)
```

## Related Code Files
- Create: `src/components/sections/HeroScanShowcase.tsx`, `src/lib/hero-showcase-content.ts`
- Modify: `Hero.tsx` (rewrite, keep `HeroV2` export), `globals.css`, `AuroraBackground.tsx`, `screenshot-assets.ts`, `layout.tsx` (preloads), `page.tsx`, `usage-policy-content.ts` (webp), `Header.tsx`
- Delete: `FlipPhone.tsx`, `FloatingIcon.tsx`, `ScreenshotPreloader.tsx`

## Implementation Steps
1. `screenshot-assets.ts` → WebP, `HERO_SCREENSHOT` per locale, drop preload list
2. `hero-showcase-content.ts` (VI: Chả giò 851 kcal / 3688 target; EN: Sashimi 557 / 2516)
3. `HeroScanShowcase.tsx` + keyframes + reduced-motion rules
4. Rewrite `Hero.tsx`; remove scroll cue, emoji, FlipPhone
5. AuroraBackground CSS-only; remove ScreenshotPreloader + layout preloads; delete dead files
6. `html { scroll-padding-top: 5rem }`; smooth scroll only under `no-preference`

## Todo
- [ ] screenshot-assets + content data
- [ ] HeroScanShowcase + CSS
- [ ] Hero rewrite
- [ ] Aurora + preload cleanup + deletions
- [ ] scroll-padding / smooth-scroll

## Success Criteria
- Hero h1 + screenshot visible on first paint (no opacity-0 SSR markup)
- No PNG screenshot requests on home; JS for hero has no framer animations
- Reduced motion shows final state

## Risk Assessment
- All-caps headline kept (existing brand copy). "#1" claim is existing copy — flag.

## Security Considerations
- No user input; static content only.

## Next Steps
- Phase 5 OG + metadata; phase 6 Playwright visual check.
