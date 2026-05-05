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

### Login

Vue component exported from @stonecrop/aform.

```typescript
import { Login } from '@stonecrop/aform'
```

## Functions

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

### BaseSchema

Basic field structure for AForm schemas

**Definition:**

```typescript
export type BaseSchema = {
    fieldname: string;
    component?: string;
    mode?: FormMode;
};
```

### ComponentProps

Defined props for AForm components

**Definition:**

```typescript
export type ComponentProps = {
    schema?: SchemaTypes;
    label?: string;
    selectRange?: boolean;
    mask?: string;
    required?: boolean;
    mode?: FormMode;
    uuid?: string;
    validation?: {
        errorMessage: string;
        [key: string]: any;
    };
};
```

### FieldsetSchema

Schema structure for defining fieldsets inside AForm

**Definition:**

```typescript
export type FieldsetSchema = BaseSchema & {
    label?: string;
    schema?: SchemaTypes[];
    collapsible?: boolean;
};
```

### FormMode

The rendering mode for AForm components

**Definition:**

```typescript
export type FormMode = 'edit' | 'read' | 'display';
```

### FormSchema

Schema structure for defining forms inside AForm

**Definition:**

```typescript
export type FormSchema = BaseSchema & {
    align?: CanvasTextAlign;
    edit?: boolean;
    fieldtype?: string;
    label?: string;
    name?: string;
    width?: string;
    mask?: string;
};
```

### SchemaTypes

Superset of all schema types for AForm

**Definition:**

```typescript
export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema;
```

### TableSchema

Schema structure for defining tables inside AForm

**Definition:**

```typescript
export type TableSchema = BaseSchema & {
    columns?: TableColumn[];
    config?: TableConfig;
    rows?: TableRow[];
};
```

