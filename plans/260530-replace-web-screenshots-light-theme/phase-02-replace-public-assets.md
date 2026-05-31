---
phase: 2
title: Replace public assets
status: completed
effort: ''
priority: P1
dependencies:
  - 1
---

# Phase 2: Replace public assets

## Overview

Replace current screenshot files in-place under `public/images` and `public/images/vi`, keeping filenames and URLs stable.

## Implementation Steps

1. Back up no files in-repo; rely on git history for previous assets.
2. Convert/copy selected source images into the existing PNG targets:
   `dashboard.png`, `goals.png`, `cta-mockup.png`, `meal-scanning.png`, `meal-suggestions.png`, `cheat-day.png`, `edit-meal.png`, and VI equivalents.
3. Normalize outputs to PNG and the existing portrait screenshot shape where needed.
4. Generate a local contact sheet for visual review.

## Success Criteria

- [ ] All existing public screenshot paths still exist.
- [ ] Replacement images are light-theme app screenshots or the closest available light-theme equivalent.
- [ ] Git diff shows asset replacements only, plus plan/report documentation.
