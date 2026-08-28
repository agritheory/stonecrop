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
	--sc-primary-color: #6d28d9;
	--sc-font-family: 'IBM Plex Sans', sans-serif;
}
```

The floor wraps its declarations in the `stonecrop.tokens` cascade layer. An unlayered declaration always beats a layered one regardless of specificity or source order, so a plain `:root` block wins and load order does not matter.

Two rules worth keeping:

- **Keep overrides on `:root`.** Scoping to a container (`.my-app { … }`) makes an ancestor declaration that beats `:root` by inheritance proximity, which changes how the variable resolves for elements outside it.
- **Derived tokens follow their inputs.** `--sc-badge-success-bg` is a `color-mix()` of `--sc-brand-success`, so overriding the brand token moves the badge with it.

## Token reference

### Colors

| Token | Default | Notes |
|---|---|---|
| `--sc-primary-color` | `#0098c9` | Primary action color |
| `--sc-primary-text-color` | `#ffffff` | Text paired with the primary color |
| `--sc-brand-color` | `#202a44` | Brand color |
| `--sc-brand-danger` | `#e63c28` | |
| `--sc-brand-success` | `#155724` | |
| `--sc-brand-warning` | `#b99d3e` | |

### Grays

`--sc-gray-5` `#f2f2f2` · `--sc-gray-10` `#e6e6e6` · `--sc-gray-20` `#cccccc` · `--sc-gray-50` `#808080` · `--sc-gray-60` `#666666` · `--sc-gray-70` `#4d4d4d` · `--sc-gray-80` `#333333`

The ramp is `token number = 100 − lightness%`.

### Badges

Each variant (`neutral`, `success`, `warning`, `danger`, `brand`) defines `--sc-badge-{variant}-bg`, `-text` and `-accent`. All are derived from the brand colors and the gray ramp.

`--sc-badge-bg`, `--sc-badge-text` and `--sc-badge-accent` are **not** floor tokens — `ABadge` and `ASegmentedControl` set them per-instance as inline styles.

### Table

| Token | Default |
|---|---|
| `--sc-cell-text-color` | `#3a3c41` |
| `--sc-cell-changed-color` | `#d8edff` |
| `--sc-focus-cell-background` | `#ffffff` |
| `--sc-focus-cell-outline` | `#000000` |
| `--sc-header-text-color` | `var(--sc-gray-20)` |
| `--sc-row-border-color` | `var(--sc-gray-20)` |
| `--sc-row-color-zebra-dark` | `#dddddd` |
| `--sc-row-color-zebra-light` | `#eeeeee` |
| `--sc-row-hover-color` | `#f0f4f8` |
| `--sc-border-radius` | `0` |
| `--sc-atable-row-padding` | `0.125rem` |
| `--sc-atable-row-height` | `1.5em` |
| `--sc-atable-cell-border-width` | `2px` |
| `--sc-table-loading-color` | `204, 204, 204` |

### Form

| Token | Default |
|---|---|
| `--sc-form-background` | `#ffffff` |
| `--sc-form-border` | `var(--sc-gray-5)` |
| `--sc-input-active-border-color` | `#000000` |
| `--sc-input-active-label-color` | `#000000` |
| `--sc-input-border-color` | `var(--sc-gray-20)` |
| `--sc-input-label-color` | `var(--sc-gray-60)` |
| `--sc-input-field-background` | `#ffffff` |
| `--sc-input-field-disabled-background` | `var(--sc-gray-5)` |

### Buttons

`--sc-btn-border` `#cccccc` · `--sc-btn-color` `white` · `--sc-btn-hover` `#f2f2f2` · `--sc-btn-label-color` `black`

### Font

| Token | Default |
|---|---|
| `--sc-font-family` | `'Arimo', Arial, sans-serif` |
| `--sc-font-size` | `10px` |
| `--sc-table-font-size` | `16px` |
| `--sc-atable-font-family` | `'Arimo', sans-serif` |

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
