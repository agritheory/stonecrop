---
title: Action Set
description: A floating panel of button and dropdown actions.
---

# Action Set

`ActionSet` renders a collapsible panel of actions — plain buttons and button-triggered dropdowns — from a declarative `elements` array. It positions itself with `position: fixed`, anchored to the viewport by design, so it's meant to float over a host page's real content (e.g. a page-level actions panel), not sit inline in document flow.

## Import

```ts
import { ActionSet } from '@stonecrop/desktop'
import type { ActionElements } from '@stonecrop/desktop'
```

## Basic

`elements` accepts a mix of `{ type: 'button', label, action }` and `{ type: 'dropdown', label, actions }` entries. Clicking the `×` glyph collapses the panel to just that toggle.

::demo-panel
:::client-only
:action-set-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ActionSet } from '@stonecrop/desktop'
import type { ActionElements } from '@stonecrop/desktop'

const lastAction = ref('')

const elements: ActionElements[] = [
	{ type: 'button', label: 'Save', action: () => (lastAction.value = 'Save') },
	{
		type: 'dropdown',
		label: 'More',
		actions: [
			{ label: 'Duplicate', action: () => (lastAction.value = 'Duplicate') },
			{ label: 'Delete', action: () => (lastAction.value = 'Delete') },
		],
	},
]

// ActionSet never invokes an element's `action`; it emits the label alongside it and leaves the
// call to the host. Wiring this is what makes `action` above run at all.
function onActionClick(label: string, action?: () => void | Promise<void>) {
	if (action) {
		void action()
	} else {
		lastAction.value = label
	}
}
</script>

<template>
	<ActionSet :elements="elements" @action-click="onActionClick" />
</template>
```
::

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`elements`', '`ActionElements[]`', '`[]`', "The buttons/dropdowns to render. `ActionElements` is `ButtonElement | DropdownElement`."]
---
::

### Types

::api-data-table
---
headers: ['Name', 'Shape', 'Description']
rows:
  - ['`ButtonElement`', "`{ type: 'button', label, show?, disabled?, link?, action? }`", "Always renders a `<button>`. `link` is inherited from `ElementAction` and is not read here; `show` is declared but read nowhere, so neither hides nor links a button."]
  - ['`DropdownElement`', "`{ type: 'dropdown', label, show?, actions: ElementAction[] }`", 'A button that toggles a nested list of actions. `show` is not read.']
  - ['`ElementAction`', '`{ label, show?, link?, action? }`', "One entry inside a dropdown. This is the only place `link` has an effect: an entry with an `action` renders a `<button>`, one with only a `link` renders an `<a>`. `show` is not read."]
---
::

### Emits

::api-data-table
---
headers: ['Name', 'Payload', 'Description']
rows:
  - ['`actionClick`', '`[label: string, action: (() => void | Promise<void>) | undefined]`', "Fires on every button click, and on a dropdown entry that has an `action`. ActionSet never calls the callback itself: it passes it here and the host decides, so an element's `action` runs only if you invoke it."]
---
::

## Accessibility

Every interactive element is a plain `<button>` (or `<a>` for `link` entries) with only its visible label text — there's no `aria-expanded` on the collapse toggle or the dropdown triggers, and no `aria-haspopup`/`role="menu"` on the dropdown lists, so a screen reader doesn't announce their expanded/collapsed state.

Source: [`desktop/src/components/ActionSet.vue`](https://github.com/agritheory/stonecrop/blob/development/desktop/src/components/ActionSet.vue)
