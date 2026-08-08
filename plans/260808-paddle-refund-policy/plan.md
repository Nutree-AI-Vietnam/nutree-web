---
title: "Align Refund Policy With Paddle"
status: completed
priority: P1
branch: "main"
tags: [legal, paddle, compliance]
blockedBy: []
blocks: []
created: "2026-08-08"
createdBy: "ck:plan"
source: skill
---

# Align Refund Policy With Paddle

## Scope

Update the bilingual cancellation and refund policy so purchases made through Nutree's Paddle web checkout have an exact, unconditional 14-calendar-day full-refund window. Keep iOS in-app purchases through the Apple App Store clearly separated by purchase channel.

## Tasks

- [x] Replace conditional refund wording with the Paddle 14-day commitment in English and Vietnamese.
- [x] Add Paddle cancellation and refund request paths while retaining Apple-specific instructions.
- [x] Update the policy revision date and version.
- [x] Run type-check, lint, and production build.
- [x] Review the final diff for contradictory qualifiers or exceptions.
- [x] Clarify that Paddle applies only to Nutree web-checkout purchases and Apple applies to iOS in-app purchases.
- [x] Re-run validation and review the channel-specific wording.

## Success Criteria

- Policy states `14 calendar days` / `14 ngày theo lịch` exactly.
- Paddle web-checkout refund wording has no reason, usage, account-status, or case-by-case exceptions.
- Paddle and Apple request instructions are unambiguous.
- Repository checks pass.
