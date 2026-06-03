---
title: AForm API Reference
description: Schema-driven form components
---

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

