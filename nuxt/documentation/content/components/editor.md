---
title: Editor
description: An Editor.js block editor for rich-text fields, rendered by AForm and summarised in ATable.
---

# Editor

`AEditor` wraps [Editor.js](https://editorjs.io) as a `v-model`-bound field component. AForm renders it for any field whose schema names `component: 'AEditor'`; the Stonecrop Nuxt module registers it globally. It ships the Paragraph, Header, List, Quote and Delimiter blocks.

## Import

```ts
import { AEditor, install } from '@stonecrop/editor'
```

## In a form

Switch the mode to see the field mount Editor.js (`edit`) or render the saved blocks as static HTML (`read`, `display`). Type in **Notes** and watch the stored value change.

::demo-panel
:::client-only
:editor-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const schema = ref([
	{ fieldname: 'notes', kind: 'field', component: 'AEditor', label: 'Notes' },
])
const data = ref({ notes: null })
</script>

<template>
	<AForm v-model:data="data" :schema="schema" mode="edit" />
</template>
```
::

## The value

The field holds the Editor.js `OutputData` that `save()` returns: `{ time, blocks, version }`. The whole document is one field.

- On each change the editor calls `save()` and emits the new object it returns. An object is never mutated after it is emitted.
- A field the user has not edited stays `null`.
- A record loaded from a JSON column already holds the object, and the field binds it directly.

## Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Mounts Editor.js. It is imported the first time a field is edited, so a page that only shows documents never loads it.']
  - ['`read`', 'The saved blocks as static HTML, inside the field outline.']
  - ['`display`', 'The saved blocks as static HTML, without the outline.']
---
::

Static HTML is rebuilt tag by tag from the stored text: only the inline markup Editor.js writes (bold, italic, links, line breaks) survives, and a link keeps only an http(s), mailto, tel or relative target.

## In a table

A column whose component is `AEditor` shows the document's plain text, and its text filter searches that text. The cell is not editable.

::demo-panel
:::client-only
:editor-table-demo
:::

#code
```ts
const schema = [{ fieldname: 'notes', component: 'AEditor', label: 'Notes', filterable: true }]
```
::

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`v-model`', '`EditorDocument | null`', '`null`', 'The document: `{ time, blocks, version }`.']
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See Modes above.']
  - ['`label`', '`string`', "`''`", "The field's label."]
  - ['`uuid`', '`string`', '—', 'Ties the label and error message to the editor.']
  - ['`placeholder`', '`string`', "`''`", 'Shown in the first empty block.']
  - ['`required`', '`boolean`', '`false`', 'Sets `aria-required` on the editor.']
  - ['`errors`', '`string[]`', '—', 'Errors for the field, as AForm passes them.']
---
::

## Accessibility

The editor area is a `group` labelled by the field's label, with `aria-invalid` and `aria-describedby` pointing at the error message when there is one. Editor.js provides the keyboard interaction inside the blocks.

Source: [`editor/src/components/AEditor.vue`](https://github.com/agritheory/stonecrop/blob/development/editor/src/components/AEditor.vue)
