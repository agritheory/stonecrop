---
title: Themes
description: CSS theming system for Stonecrop
---

# Themes

Stonecrop's theming system is provided by the `@stonecrop/themes` package. Themes are composed from partial CSS files (underscore-prefixed) assembled via `@import` in each theme's entry file.

## Z-Index Hierarchy

All z-index values across Stonecrop components follow a tiered hierarchy defined in `themes/default/_zindex.css`. Each tier reserves a range of 100 values, giving components flexibility within their layer (e.g. a dropdown might use `z-index: 100` while its active state uses `z-index: 105`).

| Range | Layer |
|-------|-------|
| `-100` to `-1` | Elements behind main content |
| `0` to `99` | App-level components (forms, tables, fields) |
| `100` to `199` | Dropdowns and floating elements |
| `200` to `299` | Modals |
| `300` to `399` | Application/Desktop-level components |
| `400` to `499` | Application-level modals and errors |

When adding a new component or modifying an existing one, assign a z-index from the appropriate tier rather than using arbitrary values. This prevents stacking conflicts between layers and avoids the `z-index: 9999` anti-pattern.
