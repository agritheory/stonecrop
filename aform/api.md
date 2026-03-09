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

## Type Aliases

### BaseSchema

Basic field structure for AForm schemas

**Definition:**

```typescript
export type BaseSchema = {
    fieldname: string;
    component?: string;
    value?: any;
};
```

### ComponentProps

Defined props for AForm components

**Definition:**

```typescript
export type ComponentProps = {
    schema?: SchemaTypes;
    label?: string;
    mask?: string;
    required?: boolean;
    readOnly?: boolean;
    uuid?: string;
    validation?: {
        errorMessage: string;
        [key: string]: any;
    };
};
```

### DoctypeSchema

Schema structure for defining nested doctype fields inside AForm

**Definition:**

```typescript
export type DoctypeSchema = BaseSchema & {
    fieldtype: 'Doctype';
    options: string;
    label?: string;
    schema?: SchemaTypes[];
    readOnly?: boolean;
};
```

### FieldsetSchema

Schema structure for defining fieldsets inside AForm

**Definition:**

```typescript
export type FieldsetSchema = BaseSchema & {
    label?: string;
    schema?: (FormSchema | TableSchema)[];
    collapsible?: boolean;
};
```

### FormSchema

Schema structure for defining forms inside AForm

**Definition:**

```typescript
export type FormSchema = BaseSchema & {
    align?: string;
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
export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema | DoctypeSchema | TableDoctypeSchema;
```

### TableDoctypeSchema

Schema structure for defining 1:many child table fields inside AForm

**Definition:**

```typescript
export type TableDoctypeSchema = BaseSchema & {
    fieldtype: 'Table';
    options: string;
    label?: string;
    columns?: TableColumn[];
    config?: TableConfig;
    rows?: TableRow[];
    readOnly?: boolean;
};
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

