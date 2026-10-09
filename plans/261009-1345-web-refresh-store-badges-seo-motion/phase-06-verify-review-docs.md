# Phase 06: Verify, review, docs

## Context Links
- `CLAUDE.md` critical commands · `docs/codebase-summary.md`, `docs/system-architecture.md`, `docs/code-standards.md`
- Reports dir: `plans/reports/`

## Overview
- Priority: P1 · Status: Todo
- Prove the change works (build, visuals, SEO output), get an independent review, sync docs.

## Key Insights
- No unit test suite in repo for UI; verification = type-check, lint, production build, browser checks.
- README / CLAUDE.md / AGENTS.md list Plus Jakarta Sans + DM Sans, but `tailwind.config.ts` maps both to Be Vietnam Pro.

## Requirements
- `npm run type-check && npm run lint && npm run build` green.
- Playwright: desktop 1440, mobile 390, reduced motion; VI + EN; badges equal height; no console errors.
- Network: no Product Hunt / simpleicons / large PNG requests on home.
- SEO output: canonical, OG, JSON-LD, `/sitemap.xml`, `/robots.txt`.

## Architecture
n/a

## Related Code Files
- Modify: `docs/codebase-summary.md`, `docs/system-architecture.md`, `README.md`, `CLAUDE.md`, `AGENTS.md` (font fact)
- Create: `plans/reports/code-reviewer-261009-1345-web-refresh-report.md` (by reviewer)

## Implementation Steps
1. Static checks + build
2. `npm run dev` → Playwright screenshots + DOM/SEO assertions
3. code-reviewer agent on the diff; fix confirmed issues
4. Docs sync; final report

## Todo
- [ ] type-check / lint / build
- [ ] Visual + network + SEO checks
- [ ] Code review + fixes
- [ ] Docs

## Success Criteria
- All checks pass; reviewer has no unresolved critical/high issue.

## Risk Assessment
- Dev server port collision → use free port.

## Security Considerations
- Don't read `.env*`; nothing committed.

## Next Steps
- User: review diff, commit, deploy, submit sitemap in Search Console.
