# Aform API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### ACheckbox

Vue component exported from @stonecrop/aform.

```typescript
import { ACheckbox } from '@stonecrop/aform'
```

### ACurrencyInput

Vue component exported from @stonecrop/aform.

```typescript
import { ACurrencyInput } from '@stonecrop/aform'
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

### AQuantityInput

Vue component exported from @stonecrop/aform.

```typescript
import { AQuantityInput } from '@stonecrop/aform'
```

### ATextboxInput

Vue component exported from @stonecrop/aform.

```typescript
import { ATextboxInput } from '@stonecrop/aform'
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

### CurrencyOptions

Type-specific configuration for ACurrencyInput, passed via the field's `options` property.

**Definition:**

```typescript
export interface CurrencyOptions {
  baseCurrency?: AFormLinkValue | string;
  doctype?: string;
  exchangeRates?: Record<string, number>;
  filterFunction?: string | ((search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>);
  isAsync?: boolean;
  precision?: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| baseCurrency? | `AFormLinkValue \| string` | The record's base currency — fixed, not user-editable. A bare id resolves to displayText via `aformLinkResolver`. |
| doctype? | `string` | Currency doctype name, used for FK resolution via `aformLinkResolver`. The currency picker is embedded, so it renders no navigate button. |
| exchangeRates? | `Record<string, number>` | Exchange rate lookup for each non-base currency id, relative to `baseCurrency` (which is implicitly `1`) |
| filterFunction? | `string \| ((search: string) => AFormLinkValue[] \| Promise<AFormLinkValue[]>)` | Search function backing the `currency` autocomplete dropdown — see AFormLink's `filterFunction` |
| isAsync? | `boolean` | Whether `filterFunction` results should show a loading state — see AFormLink's `isAsync` |
| precision? | `number` | Decimal places to round the derived `baseAmount` to — the base currency's scale (JPY carries 0, most carry 2, KWD 3). Applies only to `baseAmount`; the entered `amount` is left as typed. Omit to round only enough to shed binary floating-point noise, which never discards a digit the rate actually produced. A non-integer or out-of-range value falls back to that default. |

### CurrencyValue

The value shape for ACurrencyInput — an amount paired with its currency (an `AFormLinkValue` FK reference), plus the derived base-currency-equivalent amount. `exchangeRate` is carried on the value so it round-trips with the record even though it is never directly edited by the user.

**Definition:**

```typescript
export interface CurrencyValue {
  amount: number;
  baseAmount: number;
  baseCurrency: AFormLinkValue;
  currency: AFormLinkValue;
  exchangeRate: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| amount | `number` | The entered amount, in `currency` units |
| baseAmount | `number` | `amount` converted into `baseCurrency` units — `amount * exchangeRate` |
| baseCurrency | `AFormLinkValue` | The record's base currency — fixed, not user-editable |
| currency | `AFormLinkValue` | FK reference to the Currency doctype the user entered `amount` in |
| exchangeRate | `number` | Multiplier from `currency` to `baseCurrency` — hidden from the UI, drives `baseAmount` |

### QuantityOptions

Type-specific configuration for AQuantityInput, passed via the field's `options` property.

**Definition:**

```typescript
export interface QuantityOptions {
  conversionFactors?: Record<string, number>;
  stockUom?: string;
  uoms?: string[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| conversionFactors? | `Record<string, number>` | Conversion factor lookup for each non-stock UOM, relative to `stockUom` (which is implicitly `1`) |
| stockUom? | `string` | The item's base/stock unit of measure — fixed, not user-editable |
| uoms? | `string[]` | Dropdown choices for the `uom` field |

### QuantityValue

The value shape for AQuantityInput — a quantity paired with its unit of measure, plus the derived stock-equivalent quantity/UOM. `conversionFactor` is carried on the value so it round-trips with the record even though it is never shown in the UI.

**Definition:**

```typescript
export interface QuantityValue {
  conversionFactor: number;
  qty: number;
  stockQty: number;
  stockUom: string;
  uom: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| conversionFactor | `number` | Multiplier from `uom` to `stockUom` — hidden from the UI, drives `stockQty` |
| qty | `number` | The entered quantity, in `uom` units |
| stockQty | `number` | `qty` converted into `stockUom` units — `qty * conversionFactor` |
| stockUom | `string` | The item's base/stock unit of measure — fixed, not user-editable |
| uom | `string` | Unit of measure the user entered `qty` in |

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

Note the key rename: an authoring `TableField` declares its columns under `columns`; `resolveSchema` moves them to `schema` here, because `schema` is the ATable prop that runs `schemaToColumns()` (ATable's own `columns` prop means already-converted `TableColumn[]`). A hand-authored table must therefore use `schema`, not `columns`.

Rows are never part of the schema. AForm sources them from the data model at `dataModel[fieldname]`, so a `rows` key placed on this object is ignored.

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

### AFormLinkModelValue

What AFormLink accepts as its `v-model`.

Wider than `AFormLinkValue` because a link is as often bound straight to its FK column as to a resolved reference: a record loaded from the DB carries the raw scalar, and a parent bound to that column coerces every update it receives back to a scalar. The component reads through `linkId`/`linkDisplayText`/`asLinkValue`, so all three shapes render and resolve identically.

Emitting is narrower — AFormLink always writes back an `AFormLinkValue`.

**Definition:**

```typescript
export type AFormLinkModelValue = AFormLinkValue | string | number;
```

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
    errors?: string[];
};
```

### ResolvedField

The discriminated union of all resolved field types — what AForm consumes, usually after `resolveSchema()` has transformed the authoring `DoctypeField[]`, but also valid hand-authored for view chrome with no backing doctype. Narrowed by `kind`: `'field'` | `'link'` | `'table'` | `'fieldset'`.

`kind` is required — AForm dispatches on it alone and does not infer a field's type from its structure.

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

