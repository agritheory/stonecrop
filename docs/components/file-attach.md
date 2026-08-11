---
title: File Attach
description: A button that opens the native file picker and lists the selected files.
---

# File Attach

`AFileAttach` triggers the browser's native file picker via a button and lists the files the user selects — either standalone or as a field inside an [AForm](/reference/aform) schema. It wraps VueUse's `useFileDialog`, so selection state (the browser's native `FileList`) lives inside the component rather than being passed in.

## Import

```ts
import { AFileAttach } from '@stonecrop/aform'
```

## Basic

Click the button to open the native file picker. Selected file names are listed above the buttons, and "Reset" clears the selection.

<DemoPanel>

<ClientOnly>
	<FileAttachDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/FileAttachDemo.vue

</template>

</DemoPanel>

## Usage in a schema

`AFileAttach` is usually resolved by `AForm` from a schema field with `component: 'AFileAttach'`, rather than used directly:

```ts
const schema = [
	{
		fieldname: 'attachments',
		kind: 'field',
		component: 'AFileAttach',
		label: 'Attach Files',
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ attachments: undefined })
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

Unlike the other field components on this site, `AFileAttach` does not declare a `defineModel` — it keeps the selected `FileList` in its own internal state (from VueUse's `useFileDialog`) and never emits `update:modelValue`. `AForm` still binds `v-model` to every schema field, but for this component that binding is inert: the selection is visible in the UI (the file list rendered above the Attach/Reset buttons) but is **not** written back into the form's `data` object in the current implementation. Code that needs the actual files must integrate with `useFileDialog` directly rather than going through the schema/data flow, until this component gains a model.

## API Reference

### Props

<div class="api-table">

| Name         | Type                            | Default  | Description                                                                                             |
| ------------ | -------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| `label`      | `string`                         | —         | Text for the "Attach" button. Only rendered in `edit`/`read` mode — not shown in `display` mode.        |
| `mode`       | `'edit' \| 'read' \| 'display'`   | `'edit'`  | See [Modes](#modes) below.                                                                               |
| `required`   | `boolean`                        | `false`    | Part of the shared field prop type; not read or applied by this component's current implementation.     |
| `uuid`       | `string`                         | —         | Part of the shared field prop type; not read by this component.                                          |
| `validation` | `{ errorMessage: string }`       | —         | Part of the shared field prop type; this component never renders an error message and does not read it. |
| `errors`     | `string[]`                       | —         | Part of the shared field prop type; not read by this component.                                          |

</div>

### Modes

<div class="api-table">

| Mode      | Rendering                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------- |
| `edit`    | Attach and Reset buttons open the native file picker; selected file names are listed above them. |
| `read`    | Same layout, but both buttons are disabled.                                                     |
| `display` | Static list of selected file names with a count, or "No file selected" if none are selected.    |

</div>

## Accessibility

Attach and Reset are native `<button type="button">` elements, so their visible text is their accessible name and both participate in the normal tab order — `read` mode disables them via the native `disabled` attribute, removing them from it. The list of selected file names is plain markup with no `aria-live` region, so a screen reader user is not automatically notified when the selection changes after the native file dialog closes; they would need to navigate back to the feedback text themselves.

Source: [`aform/src/components/form/AFileAttach.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/AFileAttach.vue)
