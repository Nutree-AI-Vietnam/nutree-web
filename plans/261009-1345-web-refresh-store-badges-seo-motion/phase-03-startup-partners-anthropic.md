# Phase 03: Startup partners + Anthropic

## Context Links
- `src/components/sections/StartupPartners.tsx`
- `public/partners/*`, `public/cloudflare-for-startups-logo.png`

## Overview
- Priority: P2 · Status: Todo
- Add Anthropic to the "Đối tác startup" rail and serve every partner logo locally with intrinsic size.

## Key Insights
- Current logos load from simpleicons / third-party CDNs → extra DNS + no width/height (CLS risk).
- Rail duplicates the list for a seamless marquee; duplicates are `aria-hidden` + `tabIndex=-1`.

## Requirements
- Anthropic first: `https://www.anthropic.com/startups`, `/partners/anthropic.svg`, glyph + wordmark text.
- Glyph logos 56×56; wide logos (Cloudflare 512×173, ElevenLabs 1496×132) `w-64 h-auto`.
- Marquee respects reduced motion (existing CSS rule).

## Architecture
`PARTNERS[] → logoRail = [...PARTNERS, ...PARTNERS]` (unchanged pattern); `img` gains `width`/`height`/`loading="lazy"`/`decoding="async"`.

## Related Code Files
- Modify: `StartupPartners.tsx`, `next.config.js` (remove partner CDN remotePatterns if unused elsewhere)

## Implementation Steps
1. Re-read component; swap logo URLs to `/partners/*`
2. Add Anthropic entry; add intrinsic sizes
3. Grep for remaining remote hosts; prune `remotePatterns`

## Todo
- [ ] Anthropic entry
- [ ] Local logos with sizes
- [ ] remotePatterns cleanup

## Success Criteria
- Network panel: zero partner-logo requests to third-party hosts.

## Risk Assessment
- Anthropic logo/name usage: confirm Nutree is in the Claude for Startups program and may display the mark (flag to user).

## Security Considerations
- Outbound links keep `rel="noopener noreferrer"` if `target=_blank`.

## Next Steps
- Phase 6 visual check of rail at mobile + desktop.
