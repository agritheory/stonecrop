# Context
The FAB app has a custom color palette defined in THEME.md and needs it applied through Stonecrop's CSS variable system. Stonecrop uses CSS custom properties (`--sc-*`) for all component theming. A static CSS file approach fails because `@stonecrop/atable` and `@stonecrop/aform` components bundle `@stonecrop/themes/default.css` into their own JS-injected output, which re-stamps `:root` defaults after all static stylesheets load. The solution is a client-side Nuxt plugin that appends a `<style>` tag after all module-level CSS injections have executed.

---

## Bug 1: Stonecrop themes/package.json wrong exports

**File:** `/home/rohan/agritheory/stonecrop/themes/package.json`

The `exports` map was broken — all themes except `agritheory` pointed to `default.css`. **Fixed.**

```json
// WAS (broken):
"./dark.css":    "./dist/default.css",
"./verdant.css": "./dist/default.css",  // etc.

// NOW (fixed):
"./dark.css":    "./dist/dark.css",
"./verdant.css": "./dist/verdant.css",  // etc.
```

---

## Bug 2: atable/aform bundle default theme variables (Stonecrop architectural issue)

Multiple `@stonecrop/atable` Vue components (`ATable`, `ARow`, `ACell`, `ATableHeader`, `ARowActions`, `AExpansionRow`, `ATableModal`) each do `@import url('@stonecrop/themes/default.css')` in their `<style>` blocks. Same pattern in `@stonecrop/aform`. Vite bundles all of these into `dist/assets/index.css` per package, which is then injected into the DOM via `import './assets/index.css'` in the JS bundle — after all static CSS has loaded.

**Impact:** Any consuming app that tries to override `--sc-*` variables via a static CSS file will have its overrides overwritten by the JS-injected defaults.

**Proper fix (Stonecrop):** Remove `@import url('@stonecrop/themes/default.css')` from atable/aform component `<style>` blocks. Consumers import the theme once via `@stonecrop/desktop/styles`; components should not re-bundle it.

**Workaround (FAB app):** Client-side Nuxt plugin that appends a `<style>` tag in `defineNuxtPlugin` — plugins run after all module-level JS (and CSS side effects) have executed.

---

## Color Mapping

THEME.md colors → Stonecrop CSS variables:

| THEME.md     | Value     | Stonecrop Variable            | Notes |
|--------------|-----------|-------------------------------|-------|
| Primary      | `#9a968b` | `--sc-primary-color`          | White text contrast ~2.9:1 (below WCAG AA) → paired with `--sc-primary-text-color: #333333` |
| Secondary    | `#666666` | `--sc-gray-60`                | Already the default — no change needed |
| Success      | `#89af9a` | `--sc-brand-success`          | |
| Warning      | `#d6c573` | `--sc-brand-warning`          | |
| Danger       | `#e47875` | `--sc-brand-danger`           | Also synced to `--sc-required-border` |
| Info         | `#9b618a` | *(unmapped)*                  | No `--sc-info` variable in Stonecrop. TODO: discuss with team |

**Derived variables** (not in THEME.md, derived from primary/danger):

| Variable                      | Value     | Derivation |
|-------------------------------|-----------|------------|
| `--sc-input-active-border-color` | `#9a968b` | Primary — focused input border |
| `--sc-input-active-label-color`  | `#9a968b` | Primary — focused input label |
| `--sc-active-cell-outline`       | `#9a968b` | Primary — table cell selection ring |
| `--sc-focus-cell-outline`        | `#666666` | Secondary — keyboard nav focus ring |
| `--sc-row-color-zebra-dark`      | `#d5d2ce` | Warm-tinted gray |
| `--sc-row-color-zebra-light`     | `#eceae8` | Warm off-white |
| `--sc-cell-changed-color`        | `#ebeae8` | Warm tint of primary (replaces default light-blue `#d8edff`) |

---

## Implementation

### Files changed

**`/home/rohan/agritheory/stonecrop/themes/package.json`** — Fixed exports map (Bug 1)

**`/home/rohan/agritheory/fab/app/plugins/fab-theme.client.ts`** (new) — Client plugin that appends themed `:root` variables after all JS-injected CSS:
```ts
export default defineNuxtPlugin(() => {
  const style = document.createElement('style')
  style.id = 'fab-theme'
  style.textContent = `:root { ... all overrides ... }`
  document.head.appendChild(style)
})
```

**`/home/rohan/agritheory/fab/app/assets/fab-theme.css`** (new, unused) — CSS file kept for reference; not in `css` array since the plugin supersedes it.

**`/home/rohan/agritheory/fab/nuxt.config.ts`** — `css` array unchanged (static file approach dropped in favor of plugin).

---

## Verification
1. Restart `npm run dev` in the FAB app
2. Open browser → inspect `:root` in DevTools
3. Confirm `--sc-primary-color` is `#9a968b`, not `#0098c9`
4. Breadcrumb bar (bottom right) should show the muted warm gray instead of bright blue
5. Zebra rows in the table should show warm gray tints instead of cool `#dddddd`/`#eeeeee`
6. Danger color on form required fields should show `#e47875` (coral) not `#e63c28` (red)
