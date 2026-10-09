# Phase 01: Assets (badges, partner logos, WebP screenshots, OG image)

## Context Links
- Apple badge API: `toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/black/{vi-vn|en-us}`
- Google Play badge guidelines: partnermarketinghub.withgoogle.com
- Anthropic startups: `https://www.anthropic.com/startups` (redirects to claude.com/programs/startups)

## Overview
- Priority: P1 (blocks phases 2–5)
- Status: Done except OG image
- Self-host every third-party image so the page has no remote image hosts and no layout shift.

## Key Insights
- `sharp` not installed → convert once offline (cwebp) instead of runtime optimization.
- App Store VI and EN SVGs share viewBox 119.66407×40; Google Play WebP is 323×96 (VI) and 322×96 (EN), no built-in padding.
- Screenshot WebP at 720×1561 (`q≈80`): dashboard 735 KB → 35 KB, meal-scanning 5.6 MB → 89 KB.

## Requirements
- Official, unmodified store badges (black) per locale.
- Partner logos local, sized, single colour where possible.
- OG image 1200×630 PNG < 300 KB, VI copy, brand gradient.

## Architecture
```
public/
├── badges/        app-store-{vi,en}.svg, google-play-{vi,en}.webp
├── partners/      anthropic.svg, sentry.svg, render.svg, neon.svg, posthog.svg, elevenlabs-grants.webp
├── images/        *.webp (EN) + vi/*.webp (VI) + hero/meal-{cha-gio,sashimi}.webp
└── og-image.png   (new)
```

## Related Code Files
- Create: `public/og-image.png` (HTML source kept in job tmp dir, not committed)
- Keep: PNG originals (referenced nowhere after phase 4; deletion flagged as follow-up)

## Implementation Steps
1. ~~Download badges, partner logos~~ (done)
2. ~~Convert screenshots + hero thumbnails to WebP~~ (done)
3. Build OG HTML (brand gradient, logo, VI headline, phone with `vi/dashboard.webp`, both badges)
4. Render with headless Chrome at 1200×630, strip metadata with `magick -strip`, write `public/og-image.png`

## Todo
- [x] Badges
- [x] Partner logos
- [x] WebP screenshots + hero thumbnails
- [ ] OG image

## Success Criteria
- All files load locally; OG image renders correctly at 1200×630.

## Risk Assessment
- Badge/logo usage rules: badges unmodified; Anthropic logo use needs partner-program confirmation (flag).

## Security Considerations
- Downloaded files treated as untrusted data; only images, no scripts executed.

## Next Steps
- Phase 2 consumes badges; phase 5 consumes OG image.
