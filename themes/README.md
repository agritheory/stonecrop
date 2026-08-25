# Themes

The Stonecrop token floor: one stylesheet defining every `--sc-*` CSS variable the component packages consume.

This is not a theme system with themes to pick between. There is a single sheet, and hosts restyle by overriding the variables in their own CSS.

## Usage

```javascript
import '@stonecrop/themes/default.css'
```

Nuxt hosts get it automatically — `@stonecrop/nuxt` loads it into `nuxt.options.css`, so there is nothing to import and no option to set.

## Restyling

Override any `--sc-*` name in your own stylesheet. The floor wraps its declarations in the `stonecrop.tokens` cascade layer, and an unlayered declaration always beats a layered one regardless of specificity or source order — so a plain `:root` block wins, and it does not matter which stylesheet loads first.

```css
:root {
	--sc-primary-color: #6d28d9;
	--sc-font-family: 'IBM Plex Sans', sans-serif;
}
```

Keep overrides on `:root`. Scoping them to a container (`.my-app { --sc-primary-color: … }`) works for elements inside that container but changes how the variable resolves elsewhere, because an ancestor declaration beats `:root` by inheritance proximity.

Derived tokens follow their inputs: overriding `--sc-brand-success` moves `--sc-badge-success-bg`, which is a `color-mix()` of it.

## What the sheet contains

- The `--sc-*` variables, declared on `:root`.
- A font-inheritance reset, so form controls and code elements inherit the document font instead of their browser defaults.
- The document font rule, applied to `body` from `--sc-font-family`. It pairs with the reset above — without it, the reset would strip the controls' sensible defaults and leave them inheriting the browser's serif.
- A webfont `@import` for Arimo, the default `--sc-font-family`. It must stay the first rule in the file; CSS requires `@import` before all other rules.

## Adding a token

A component may only read a `--sc-*` name this sheet defines. A `var()` on an undefined name is invalid at computed-value time — it does not throw, it computes to `unset` and renders wrong silently.

`aform`, `atable` and `desktop` each carry a `tests/token-floor.spec.ts` that fails if they consume a name the floor does not define, so adding the `var()` without adding the declaration is caught in CI.

Do not add a `var()` fallback (`var(--sc-x, #fff)`) as a substitute. A fallback only renders when the floor is absent, which never happens in a working host, so a wrong value there stays invisible indefinitely — that is how several tokens drifted from the floor before being removed.
