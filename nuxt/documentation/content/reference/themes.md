---
title: Themes
description: The Stonecrop token floor and how to restyle it
---

# Themes

`@stonecrop/themes` ships one stylesheet: the **token floor**, the single definition of every `--sc-*` CSS variable the component packages consume. There are no themes to choose between. Hosts restyle by overriding the variables in their own CSS.

```javascript
import '@stonecrop/themes/default.css'
```

Nuxt hosts get it automatically — `@stonecrop/nuxt` loads it into `nuxt.options.css`, with no option to change or disable it.

## Overriding tokens

Declare the names you want to change on `:root`:

```css
:root {
	--sc-color-primary: #6d28d9;
	--sc-font-family: 'IBM Plex Sans', sans-serif;
}
```

The floor wraps its declarations in the `stonecrop.tokens` cascade layer. An unlayered declaration always beats a layered one regardless of specificity or source order, so a plain `:root` block wins and load order does not matter.

Two rules worth keeping:

- **Keep overrides on `:root`.** Scoping to a container (`.my-app { … }`) makes an ancestor declaration that beats `:root` by inheritance proximity, which changes how the variable resolves for elements outside it.
- **Derived tokens follow their inputs.** `--sc-primary-color` aliases `--sc-color-primary`, and `--sc-badge-success-bg` is a `color-mix()` of `--sc-brand-success`, so overriding the primitive or brand token moves the rest with it.

## Token reference

The floor is primitive → semantic. Components read the semantic names; hosts usually override a primitive (`--sc-color-primary`, `--sc-gray-5`) and let aliases follow.

### Primitive colors

| Token | Default | Notes |
|---|---|---|
| `--sc-color-primary` | `var(--sc-gray-80)` | Primary action color |
| `--sc-color-on-primary` | `#ffffff` | Text paired with the primary color |
| `--sc-color-brand` | `var(--sc-gray-80)` | Brand color |
| `--sc-color-danger` | `#c02718` | |
| `--sc-color-success` | `#155724` | |
| `--sc-color-warning` | `#b99d3e` | |
| `--sc-color-gold` | `#e6a92d` | Active-cell outline |
| `--sc-color-changed` | `#d8edff` | Edited-cell highlight |

`--sc-primary-color`, `--sc-primary-text-color`, `--sc-brand-color`, `--sc-brand-danger`, `--sc-brand-success`, and `--sc-brand-warning` are aliases of those primitives.

### Grays

`--sc-gray-2` `#fafafa` · `--sc-gray-5` `#f2f2f2` · `--sc-gray-10` `#e6e6e6` · `--sc-gray-20` `#cccccc` · `--sc-gray-50` `#808080` · `--sc-gray-60` `#666666` · `--sc-gray-70` `#4d4d4d` · `--sc-gray-80` `#333333`

The ramp is `token number = 100 − lightness%`.

### Surfaces

| Token | Default |
|---|---|
| `--sc-page-background` | `var(--sc-gray-2)` |
| `--sc-form-background` | `var(--sc-gray-2)` |
| `--sc-input-field-background` | `var(--sc-gray-5)` |
| `--sc-input-addon-background` | `var(--sc-gray-10)` |
| `--sc-input-field-disabled-background` | `var(--sc-gray-2)` |
| `--sc-overlay-background` | `var(--sc-gray-2)` |
| `--sc-cell-background` | `var(--sc-form-background)` |

The sheet also sets `body` background and color from `--sc-page-background` and `--sc-cell-text-color`.

### Badges

Each variant (`neutral`, `success`, `warning`, `danger`, `brand`) defines `--sc-badge-{variant}-bg`, `-text` and `-accent`. All are derived from the brand colors and the gray ramp.

`--sc-badge-bg`, `--sc-badge-text` and `--sc-badge-accent` are **not** floor tokens — `ABadge` and `ASegmentedControl` set them per-instance as inline styles.

### Table

| Token | Default |
|---|---|
| `--sc-cell-text-color` | `#3a3c41` |
| `--sc-cell-changed-color` | `var(--sc-color-changed)` |
| `--sc-active-cell-background` | `var(--sc-input-field-background)` |
| `--sc-active-cell-outline` | `var(--sc-focus-cell-outline)` |
| `--sc-focus-cell-background` | `var(--sc-input-field-background)` |
| `--sc-focus-cell-outline` | `var(--sc-gray-80)` |
| `--sc-cell-border-color` | `var(--sc-form-background)` |
| `--sc-header-text-color` | `var(--sc-gray-60)` |
| `--sc-header-border-color` | `var(--sc-form-background)` |
| `--sc-row-border-color` | `var(--sc-gray-50)` |
| `--sc-row-color-zebra-dark` | `var(--sc-gray-5)` |
| `--sc-row-color-zebra-light` | `var(--sc-form-background)` |
| `--sc-row-number-background-color` | `var(--sc-form-background)` |
| `--sc-row-hover-color` | `var(--sc-gray-10)` |
| `--sc-border-radius` | `0` |
| `--sc-atable-row-padding` | `var(--sc-space-1)` |
| `--sc-atable-row-height` | `1.5em` |
| `--sc-atable-cell-border-width` | `2px` |
| `--sc-table-loading-color` | `204, 204, 204` |

### Form

| Token | Default |
|---|---|
| `--sc-form-border` | `var(--sc-gray-50)` |
| `--sc-form-field-max-width` | `50ch` |
| `--sc-form-label-offset` | `var(--sc-space-2)` |
| `--sc-input-active-border-color` | `var(--sc-gray-80)` |
| `--sc-input-active-label-color` | `var(--sc-gray-80)` |
| `--sc-input-border-color` | `var(--sc-gray-50)` |
| `--sc-input-label-color` | `var(--sc-gray-60)` |
| `--sc-required-border` | `var(--sc-color-danger)` |

### Buttons

`--sc-btn-border` `var(--sc-gray-50)` · `--sc-btn-color` `var(--sc-gray-2)` · `--sc-btn-hover` `var(--sc-gray-5)` · `--sc-btn-label-color` `var(--sc-gray-80)`

### Action set

| Token | Default | Notes |
|---|---|---|
| `--sc-action-set-drawer-width` | `380px` | Width of Desktop's action drawer |
| `--sc-action-set-offset-top` | `35vh` | Distance from the top of the viewport to the tile column |
| `--sc-action-set-tile-gap` | `4px` | Gap between the action rail and drawer |
| `--sc-action-set-rail-width` | `calc(2.75rem + 10px)` | Width reserved for the action tile column |

### Space and type

| Token | Default |
|---|---|
| `--sc-space-1` | `0.125rem` |
| `--sc-space-2` | `0.5rem` |
| `--sc-space-3` | `1rem` |
| `--sc-font-family` | `'Arimo', Arial, sans-serif` |
| `--sc-font-size` | `1rem` |
| `--sc-font-size-table` | `1rem` |
| `--sc-table-font-size` | `var(--sc-font-size-table)` |
| `--sc-atable-font-family` | `var(--sc-font-family)` |

The sheet also applies `--sc-font-family` to `body` and normalizes form controls and code elements to inherit it, since browsers otherwise give them their own defaults. The two go together: without the `body` rule, the reset would strip those defaults and leave the controls inheriting the browser's serif.

## Adding a token

A component may only read a name the floor defines. `var()` on an undefined name is invalid at computed-value time — it does not throw, it computes to `unset` and renders wrong silently.

`aform`, `atable` and `desktop` each carry a `tests/token-floor.spec.ts` that fails when the package consumes a name the floor does not define, so a missing declaration is caught in CI rather than in a screenshot.

Do not reach for a `var()` fallback instead. A fallback renders only when the floor is absent, which never happens in a working host, so a value that disagrees with the floor stays invisible indefinitely.

## Z-Index Hierarchy

Z-index values across Stonecrop components follow a tiered hierarchy. Each tier reserves a range of 100 values, giving components room within their layer (a dropdown might use `z-index: 100` while its active state uses `105`).

| Range | Layer |
|-------|-------|
| `-100` to `-1` | Elements behind main content |
| `0` to `99` | App-level components (forms, tables, fields) |
| `100` to `199` | Dropdowns and floating elements |
| `200` to `299` | Modals |
| `300` to `399` | Application/Desktop-level components |
| `400` to `499` | Application-level modals and errors |

When adding or modifying a component, assign a z-index from the appropriate tier rather than an arbitrary value. This prevents stacking conflicts between layers and avoids the `z-index: 9999` anti-pattern.
