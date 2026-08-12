---
title: Collapse Button
description: The rotating toggle glyph used by AFieldset's collapsible fieldsets.
---

# Collapse Button

`CollapseButton` is an internal building block used by [AFieldset](/reference/aform)'s collapsible fieldsets — a small `×`-glyph button that rotates 45° when its `collapsed` prop is `true`. It isn't part of `@stonecrop/aform`'s public API (it isn't exported from the package's entry point), but is documented here for completeness. `CollapseButton` itself carries no click handler — in `AFieldset`, the surrounding `<legend>` owns the click listener that flips `collapsed` and passes it back down as a prop.

## Import

`CollapseButton` has no supported import path for consumers of the published package — it's reachable only internally. This page's demo reaches it with a relative import directly into the package's source tree, which only works inside this monorepo:

```ts
import CollapseButton from '../../../../aform/src/components/base/CollapseButton.vue'
```

(Path shown relative to the demo file below; there is no `@stonecrop/aform` subpath that resolves to it.)

## Basic

`collapsed` controls the rotation only — there's no built-in click handler, so the demo's own wrapper element toggles it, mirroring how `AFieldset`'s `<legend>` does the same for the real component.

<DemoPanel>

<ClientOnly>
	<CollapseButtonDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/CollapseButtonDemo.vue

</template>

</DemoPanel>

## API Reference

### Props

<ApiTable>

| Name        | Type      | Default        | Description                                                                                    |
| ----------- | --------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| `collapsed` | `boolean` | — (required)     | Whether the button is rendered in its rotated (45°) or unrotated state. Purely visual — `CollapseButton` never changes this itself. |

</ApiTable>

## Accessibility

`CollapseButton` renders a bare `<button>` containing only the glyph `×`, with no `aria-label`, `aria-expanded`, or other accessible name — screen reader users hear just "×, button". In `AFieldset`, the click handler that actually toggles collapse state lives on the surrounding `<legend>`, which has no keyboard handler of its own either, so the collapse/expand interaction is mouse-only in the current source.

Source: [`aform/src/components/base/CollapseButton.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/base/CollapseButton.vue)
