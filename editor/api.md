# Editor API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### AEditor

Vue component exported from @stonecrop/editor.

```typescript
import { AEditor } from '@stonecrop/editor'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | `string \| undefined` | no | `""` | The field's label |
| mode | `"edit" \| "read" \| "display" \| undefined` | no | `"edit"` | `edit` mounts Editor.js; `read` and `display` render the saved blocks as static HTML. |
| uuid | `string \| undefined` | no | `undefined` | The id that ties the label and error message to the editor |
| required | `boolean \| undefined` | no | `false` | Whether the field must hold a document |
| errors | `string[] \| undefined` | no | `undefined` | Errors for this field, as AForm passes them |
| placeholder | `string \| undefined` | no | `""` | Shown in the first empty block |
| validation | `{ errorMessage?: string \| undefined; } \| undefined` | no | `undefined` | A static error message from the schema, shown when there are no `errors` |
| modelValue | `EditorDocument \| null \| undefined` | no | `null` | The document: Editor.js `OutputData` (`time`, `blocks`, `version`), or `null` for a field never edited. Each change is emitted as the new object `save()` returns, and nothing here mutates an object once it is emitted. |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: EditorDocument \| null]` |  |

## Functions

### install

Install all Editor components

**Signature:**

```typescript
declare function install(app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| app | `App` | Vue app instance |

### renderBlocks

An Editor.js document as static HTML, for a field that is not being edited. Every piece of stored text passes through `sanitizeInline`, so the result is safe to bind with `v-html`. Empty for a field never edited.

**Signature:**

```typescript
export declare function renderBlocks(value: EditorDocument | null | undefined): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| value | `EditorDocument \| null \| undefined` |  |

## Type Aliases

### EditorBlock

One block of an `EditorDocument`: its tool's name and that tool's data.

**Definition:**

```typescript
export type EditorBlock = {
    id?: string;
    type: string;
    data: Record<string, unknown>;
    tunes?: Record<string, unknown>;
};
```

### EditorDocument

The value an `AEditor` field holds: the `OutputData` Editor.js's `save()` returns. Declared here rather than re-exported, so the package's types do not reach into Editor.js's own.

**Definition:**

```typescript
export type EditorDocument = {
    time?: number;
    blocks: EditorBlock[];
    version?: string;
};
```

## Variables

### AEditor

**Type:**

```typescript
export const AEditor: typeof __VLS_export
```

