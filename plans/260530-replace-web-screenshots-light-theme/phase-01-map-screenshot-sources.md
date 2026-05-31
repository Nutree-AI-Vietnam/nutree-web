---
phase: 1
title: Map screenshot sources
status: completed
effort: ''
priority: P1
dependencies: []
---

# Phase 1: Map screenshot sources

## Overview

Select source screenshots that best match existing web asset semantics while honoring the light-theme requirement.

## Implementation Steps

1. Use loose files in `/Users/tonytran/Documents/Nutree/screenshots/en` and `/Users/tonytran/Documents/Nutree/screenshots/vi` as the preferred raw app captures.
2. Use release 2.4.0 zip mockups only as content reference, not direct replacements, because they include device frames and marketing text.
3. Map each existing public asset path to a light-theme source capture where possible.
4. Preserve dimensions compatible with existing `PhoneMockup` usage.

## Success Criteria

- [ ] Asset mapping covers every referenced image under `public/images` and `public/images/vi`.
- [ ] No component source changes are required for the mapping.
- [ ] Any unavailable light-theme view is handled with the closest light-theme equivalent instead of introducing dark-theme assets.
