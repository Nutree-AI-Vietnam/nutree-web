---
phase: 3
title: Verify web build
status: completed
effort: ''
priority: P1
dependencies:
  - 2
---

# Phase 3: Verify web build

## Overview

Verify the web project still compiles and renders with stable image paths after asset replacement.

## Implementation Steps

1. Run TypeScript checks.
2. Run ESLint.
3. Run the production build.
4. Inspect git diff and public image inventory.

## Success Criteria

- [ ] `npm run type-check` passes.
- [ ] `npm run lint` passes or only reports pre-existing warnings.
- [ ] `npm run build` passes.
- [ ] No public route, config, or API contract changed.
