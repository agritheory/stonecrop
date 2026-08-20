---
title: Code Editor
description: A Monaco-based code editor with language, theming, and read-only support.
---

# Code Editor

`ACodeEditor` wraps [Monaco](https://microsoft.github.io/monaco-editor/) (the editor behind VS Code) as a `v-model`-bound Vue component, with a Stonecrop-branded theme applied by default. Monaco itself is loaded lazily via `@monaco-editor/loader`, so the first mount on a page has a brief load delay.

## Import

```ts
import { ACodeEditor } from '@stonecrop/code-editor'
```

## Basic

`v-model` binds the editor's text content; `language` selects syntax highlighting.

::demo-panel
:::client-only
:code-editor-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ACodeEditor } from '@stonecrop/code-editor'

const code = ref(`function greet(name: string): string {
	return \`Hello, \${name}!\`
}`)
</script>

<template>
	<ACodeEditor v-model="code" language="typescript" height="200px" :options="{ minimap: { enabled: false } }" />
</template>
```
::

## Modes

`mode` sets Monaco's `readOnly` option: anything other than `'edit'` (i.e. `'read'` or `'display'`) makes the editor read-only, but doesn't otherwise change its appearance.

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Editable.']
  - ['`read`', 'Read-only (`readOnly: true` passed to Monaco).']
  - ['`display`', 'Read-only, same as `read` — the current source treats both identically.']
---
::

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`v-model`', '`string | undefined`', '—', "The editor's text content."]
  - ['`height`', '`string`', "`'300px'`", 'CSS height of the editor container.']
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See Modes above.']
  - ['`language`', '`string`', '—', "Monaco language id (e.g. `'typescript'`, `'sql'`, `'python'`)."]
  - ['`schema`', '`{ language?: string; [key: string]: unknown }`', '—', 'Optional schema hint; falls back to setting `language` if `language` prop is unset.']
  - ['`options`', '`editor.IStandaloneEditorConstructionOptions`', '—', "Raw Monaco construction options, merged over this component's defaults."]
  - ['`vsPath`', '`string`', '—', 'Overrides the Monaco AMD loader path — for offline/local serving instead of the default CDN.']
  - ['`extraLibs`', '`string`', '—', 'A TypeScript declaration string added as an extra lib, for JS/TS type checking and autocomplete.']
  - ['`libs`', '`string[]`', '—', "Restricts the JS/TS language service to these lib files (e.g. `['es2020']` to drop DOM globals from type-checking). Omit to use Monaco's defaults, which include `dom`."]
---
::

## Accessibility

Monaco's own editor surface provides its native keyboard interaction and internal ARIA support (it's a full text-editing widget, not a plain `<textarea>`); `ACodeEditor` itself adds no additional labeling — there's no `aria-label` identifying what the editor is for, so a screen reader announces only Monaco's own generic editor role.

Source: [`code_editor/src/components/ACodeEditor.vue`](https://github.com/agritheory/stonecrop/blob/development/code_editor/src/components/ACodeEditor.vue)
