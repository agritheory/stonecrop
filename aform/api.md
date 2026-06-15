# Aform API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### ACheckbox

Vue component exported from @stonecrop/aform.

```typescript
import { ACheckbox } from '@stonecrop/aform'
```

### AComboBox

Vue component exported from @stonecrop/aform.

```typescript
import { AComboBox } from '@stonecrop/aform'
```

### ADate

Vue component exported from @stonecrop/aform.

```typescript
import { ADate } from '@stonecrop/aform'
```

### ADatePicker

Vue component exported from @stonecrop/aform.

```typescript
import { ADatePicker } from '@stonecrop/aform'
```

### ADateRange

Vue component exported from @stonecrop/aform.

```typescript
import { ADateRange } from '@stonecrop/aform'
```

### ADateSelection

Vue component exported from @stonecrop/aform.

```typescript
import { ADateSelection } from '@stonecrop/aform'
```

### ADateTime

Vue component exported from @stonecrop/aform.

```typescript
import { ADateTime } from '@stonecrop/aform'
```

### ADropdown

Vue component exported from @stonecrop/aform.

```typescript
import { ADropdown } from '@stonecrop/aform'
```

### ADuration

Vue component exported from @stonecrop/aform.

```typescript
import { ADuration } from '@stonecrop/aform'
```

### AFieldset

Vue component exported from @stonecrop/aform.

```typescript
import { AFieldset } from '@stonecrop/aform'
```

### AFileAttach

Vue component exported from @stonecrop/aform.

```typescript
import { AFileAttach } from '@stonecrop/aform'
```

### AForm

Vue component exported from @stonecrop/aform.

```typescript
import { AForm } from '@stonecrop/aform'
```

### AFormLink

Vue component exported from @stonecrop/aform.

```typescript
import { AFormLink } from '@stonecrop/aform'
```

### AFormLoading

Vue component exported from @stonecrop/aform.

```typescript
import { AFormLoading } from '@stonecrop/aform'
```

### ANumericInput

Vue component exported from @stonecrop/aform.

```typescript
import { ANumericInput } from '@stonecrop/aform'
```

### ATextInput

Vue component exported from @stonecrop/aform.

```typescript
import { ATextInput } from '@stonecrop/aform'
```

### InteractionMode

Vue component exported from @stonecrop/aform.

```typescript
import { InteractionMode } from '@stonecrop/aform'
```

### Login

Vue component exported from @stonecrop/aform.

```typescript
import { Login } from '@stonecrop/aform'
```

## Functions

### deserializeFunction

Deserializes a stringified function expression into a typed callable.

Throws if the string cannot be parsed as a function (SyntaxError) or if the resulting expression is not callable (TypeError), or if the expression references an undefined variable (ReferenceError). Callers are responsible for try/catch.

**Signature:**

```typescript
export declare function deserializeFunction<T extends (...args: any[]) => any>(source: string): T;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| source | `string` |  |

### install

Install all AForm components

**Signature:**

```typescript
declare function install(app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| app | `App` | Vue app instance |

## Interfaces

### AFormLinkNavigator

Navigation contract for AFormLink. Provide via `provide('aformLinkNavigator', ...)` in the app plugin.

**Definition:**

```typescript
export interface AFormLinkNavigator {
  navigate(doctype: string, id: string | number): void;
}
```

### AFormLinkValue

The value shape for AFormLink — a linked document reference with optional display text

**Definition:**

```typescript
export interface AFormLinkValue {
  displayText?: string;
  id: string | number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| displayText? | `string` | Display text shown in the input. Falls back to `String(id)` if omitted. |
| id | `string \| number` | The FK/linked document ID. `id: 0` is a valid ID. |

### ResolvedFieldset

A resolved fieldset — groups child fields inside an AFieldset component.

**Definition:**

```typescript
export interface ResolvedFieldset {
  collapsible?: boolean;
  component?: string;
  fieldname: string;
  kind: 'fieldset';
  label?: string;
  mode?: import('@stonecrop/schema').InteractionMode;
  schema: ResolvedField[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| collapsible? | `boolean` | Whether the fieldset can be collapsed |
| component? | `string` | Component to render; defaults to `'AFieldset'` |
| fieldname | `string` | Field identifier |
| kind | `'fieldset'` | Discriminator |
| label? | `string` | Human-readable label for the legend |
| mode? | `import('@stonecrop/schema').InteractionMode` | Interaction mode for all children |
| schema | `ResolvedField[]` | Resolved child fields |

### ResolvedLink

A resolved Link field with cardinality `one` or `atMostOne` — embedded as a nested form.

**Definition:**

```typescript
export interface ResolvedLink {
  component: string;
  default?: unknown;
  fieldname: string;
  hidden?: boolean;
  kind: 'link';
  label?: string;
  mode?: import('@stonecrop/schema').InteractionMode;
  readOnly?: boolean;
  required?: boolean;
  schema: ResolvedField[];
  validation?: FieldValidation;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| component | `string` | Component to render; defaults to `'AForm'` |
| default? | `unknown` | Preserved from the original ValueField |
| fieldname | `string` | Field identifier |
| hidden? | `boolean` | Preserved from the original ValueField |
| kind | `'link'` | Discriminator |
| label? | `string` | Human-readable label |
| mode? | `import('@stonecrop/schema').InteractionMode` | Interaction mode |
| readOnly? | `boolean` | Preserved from the original ValueField |
| required? | `boolean` | Preserved from the original ValueField |
| schema | `ResolvedField[]` | Resolved child fields |
| validation? | `FieldValidation` | Preserved from the original ValueField |

### ResolvedTable

A resolved table — either from a Link with `noneOrMany`/`atLeastOne` cardinality, or from an inline TableField. ATable receives columns via `:schema` (ColumnSchema[]) and row data via `:rows` from formData at render time.

**Definition:**

```typescript
export interface ResolvedTable {
  component: string;
  config: TableViewConfig;
  default?: unknown;
  fieldname: string;
  hidden?: boolean;
  kind: 'table';
  label?: string;
  mode?: import('@stonecrop/schema').InteractionMode;
  readOnly?: boolean;
  required?: boolean;
  schema: ColumnSchema[];
  validation?: FieldValidation;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| component | `string` | Component to render; defaults to `'ATable'` |
| config | `TableViewConfig` | View configuration — always present; defaults to `{ view: 'list' }` |
| default? | `unknown` | Preserved from the original ValueField or TableField |
| fieldname | `string` | Field identifier |
| hidden? | `boolean` | Preserved from the original ValueField or TableField |
| kind | `'table'` | Discriminator |
| label? | `string` | Human-readable label |
| mode? | `import('@stonecrop/schema').InteractionMode` | Interaction mode for all cells |
| readOnly? | `boolean` | Preserved from the original ValueField or TableField |
| required? | `boolean` | Preserved from the original ValueField or TableField |
| schema | `ColumnSchema[]` | Column definitions — passed to ATable's `:schema` prop |
| validation? | `FieldValidation` | Preserved from the original ValueField or TableField |

## Type Aliases

### ComponentProps

Defined props for AForm components

**Definition:**

```typescript
export type ComponentProps = {
    schema?: ResolvedField;
    label?: string;
    selectRange?: boolean;
    mask?: string;
    required?: boolean;
    mode?: import('@stonecrop/schema').InteractionMode;
    uuid?: string;
    validation?: {
        errorMessage: string;
        [key: string]: any;
    };
};
```

### ResolvedField

The discriminated union of all resolved field types — what AForm consumes after `resolveSchema()` has transformed the authoring `DoctypeField[]`. Narrowed by `kind`: `'field'` | `'link'` | `'table'` | `'fieldset'`.

**Definition:**

```typescript
export type ResolvedField = ResolvedScalar | ResolvedLink | ResolvedTable | ResolvedFieldset;
```

### ResolvedScalar

A resolved scalar field. Derived from ValueField with `cardinality` omitted (consumed by resolveSchema) and an optional `doctype` added for unresolved Link fields.

**Definition:**

```typescript
export type ResolvedScalar = Omit<ValueField, 'cardinality'> & {
    doctype?: string;
};
```

