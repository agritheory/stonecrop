---
title: Code Editor API Reference
description: Monaco-based code editor
---

# Code_editor API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### ACodeEditor

Vue component exported from @stonecrop/code-editor.

```typescript
import { ACodeEditor } from '@stonecrop/code-editor'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| height | `string \| undefined` | no | `"300px"` |  |
| mode | `"edit" \| "read" \| "display" \| undefined` | no | `"edit"` |  |
| schema | `EditorSchema \| undefined` | no | `undefined` |  |
| language | `string \| undefined` | no | `undefined` |  |
| options | `editor.IStandaloneEditorConstructionOptions \| undefined` | no | `undefined` |  |
| vsPath | `string \| undefined` | no | `undefined` | Override the Monaco AMD loader path (e.g. for offline/local serving) |
| extraLibs | `string \| undefined` | no | `undefined` | TypeScript declaration string added as extra libs for JS type checking |
| libs | `string[] \| undefined` | no | `undefined` | Restrict the JS/TS language service to these lib files (e.g. `['es2020']` to keep the JS built-ins but drop the DOM/browser globals from type-checking and autocomplete). When omitted, Monaco's default libs apply — which include `dom`. |
| modelValue | `string \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: string \| undefined]` |  |

## Functions

### install

Install all Code Editor components

**Signature:**

```typescript
declare function install(app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| app | `App` | Vue app instance |

## Variables

### ACodeEditor

**Type:**

```typescript
export const ACodeEditor: typeof __VLS_export
```

