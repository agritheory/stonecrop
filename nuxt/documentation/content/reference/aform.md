---
title: AForm API Reference
description: Schema-driven form components
---

# Aform API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### ABadge

Vue component exported from @stonecrop/aform.

```typescript
import { ABadge } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | `string \| undefined` | no |  |  |
| variant | `BadgeVariant \| undefined` | no |  |  |
| color | `string \| undefined` | no |  |  |
| presentation | `BadgePresentation \| undefined` | no |  | Defaults to `cell-fill`: every call site fully determines this, so omitting it should degrade to the common case rather than rendering an unstyled badge. |
| value | `unknown` | no |  | Stored field value — used with `options` when `label` is omitted. |
| options | `string[] \| Record<string, unknown> \| undefined` | no |  |  |

### ACheckbox

Vue component exported from @stonecrop/aform.

```typescript
import { ACheckbox } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| modelValue | `any[] \| Booleanish \| Set<any> \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: any[] \| Booleanish \| Set<any> \| undefined]` |  |

### ACurrencyInput

Vue component exported from @stonecrop/aform.

```typescript
import { ACurrencyInput } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "&nbsp;" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| options | `CurrencyOptions \| undefined` | no | `{}` |  |
| currencyLabel | `string \| undefined` | no | `"Currency"` |  |
| baseCurrencyLabel | `string \| undefined` | no | `"Base Currency"` |  |
| baseAmountLabel | `string \| undefined` | no | `"Base Amount"` |  |
| exchangeRateLabel | `string \| undefined` | no | `"Exchange Rate"` |  |
| modelValue | `CurrencyValue \| undefined` | no | `{ amount: 0, currency: { id: "" }, baseAmount: 0, baseCurrency: { id: "" }, exchangeRate: 1, }` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: CurrencyValue]` |  |

### ADate

Vue component exported from @stonecrop/aform.

```typescript
import { ADate } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no | `"Date"` | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| modelValue | `string \| Date \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: string \| Date \| undefined]` |  |

### ADatePicker

Vue component exported from @stonecrop/aform.

```typescript
import { ADatePicker } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no | `false` |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| modelValue | `number \| Date \| undefined` | no | `new Date()` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: number \| Date]` |  |
| get-date | `[{ start: Date \| null; end: Date \| null; selected: Date; }]` |  |

**Exposed:**

| Name | Type |
|------|------|
| currentMonth | `number` |
| currentYear | `number` |
| selectedDate | `Date` |

### ADateRange

Vue component exported from @stonecrop/aform.

```typescript
import { ADateRange } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no | `"Date Range"` | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| modelValue | `DateRangeValue \| undefined` | no | `{ start_date: null, end_date: null }` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: DateRangeValue]` |  |

### ADateSelection

Vue component exported from @stonecrop/aform.

```typescript
import { ADateSelection } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| showDate | `boolean \| undefined` | no | `true` |  |
| showTime | `boolean \| undefined` | no | `true` |  |
| selectRange | `boolean \| undefined` | no | `true` |  |
| showEndTime | `boolean \| undefined` | no | `false` |  |
| allowMilitaryTime | `boolean \| undefined` | no | `false` |  |
| defaultHours | `number \| undefined` | no | `12` |  |
| defaultMinutes | `number \| undefined` | no | `0` |  |
| defaultSeconds | `number \| undefined` | no | `0` |  |
| defaultMeridiem | `string \| undefined` | no | `"AM"` |  |
| useSeconds | `boolean \| undefined` | no | `true` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| get-date | `[{ selected: Date; start?: Date \| null \| undefined; end?: Date \| null \| undefined; }]` |  |
| get-time | `[{ hours: number; minutes: number; seconds: number; meridiem: string; source?: "init" \| "user" \| undefined; }]` |  |
| get-range | `[{ start: Date; end: Date; source?: "init" \| "user" \| undefined; }]` |  |

### ADateTime

Vue component exported from @stonecrop/aform.

```typescript
import { ADateTime } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no | `"Date & Time"` | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| allowMilitaryTime | `boolean \| undefined` | no | `false` |  |
| useSeconds | `boolean \| undefined` | no | `true` |  |
| modelValue | `string \| Date \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: string \| Date \| undefined]` |  |

### ADateTimeInput

Vue component exported from @stonecrop/aform.

```typescript
import { ADateTimeInput } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| allowMilitaryTime | `boolean \| undefined` | no | `false` |  |
| defaultHours | `number \| undefined` | no | `12` |  |
| defaultMinutes | `number \| undefined` | no | `0` |  |
| defaultSeconds | `number \| undefined` | no | `0` |  |
| defaultMeridiem | `string \| undefined` | no | `"AM"` |  |
| useSeconds | `boolean \| undefined` | no | `true` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| get-time | `[{ hours: number; minutes: number; seconds: number; meridiem: string; militaryTime: number; source: "init" \| "user"; }]` |  |

### ADropdown

Vue component exported from @stonecrop/aform.

```typescript
import { ADropdown } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| options | `string[] \| Record<string, unknown> \| undefined` | no | `[]` |  |
| format | `string \| undefined` | no |  |  |
| isAsync | `boolean \| undefined` | no | `false` |  |
| filterFunction | `((search: string) => string[] \| Promise<string[]>) \| undefined` | no | `undefined` |  |
| modelValue | `string \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: string \| undefined]` |  |

### ADuration

Vue component exported from @stonecrop/aform.

```typescript
import { ADuration } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | `string \| undefined` | no | `"Duration"` |  |
| mode | `string \| undefined` | no | `"edit"` |  |
| allowMilitaryTime | `boolean \| undefined` | no | `false` |  |
| useSeconds | `boolean \| undefined` | no | `false` |  |
| modelValue | `number \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: number \| undefined]` |  |

### AFieldset

Vue component exported from @stonecrop/aform.

```typescript
import { AFieldset } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField[]` | yes |  |  |
| label | `string \| undefined` | no | `undefined` |  |
| collapsible | `boolean \| undefined` | no |  |  |
| data | `Record<string, any> \| undefined` | no | `{}` |  |
| mode | `InteractionMode \| undefined` | no | `"edit"` | Rendering mode forwarded to the inner AForm |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `{ collapsed: boolean; }` |  |

**Exposed:**

| Name | Type |
|------|------|
| collapsed | `boolean` |

### AFileAttach

Vue component exported from @stonecrop/aform.

```typescript
import { AFileAttach } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no |  | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |

### AForm

Vue component exported from @stonecrop/aform.

```typescript
import { AForm } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField[]` | yes |  |  |
| mode | `InteractionMode \| undefined` | no | `"edit"` |  |
| errors | `Record<string, string[]> \| undefined` | no |  | Inline validation errors keyed by fieldname. Fed by the host; the form stays store-agnostic. |
| data | `Record<string, any>` | yes |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:data | `[value: Record<string, any>]` |  |

### AFormLink

Vue component exported from @stonecrop/aform.

```typescript
import { AFormLink } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no |  | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| doctype | `string \| undefined` | no | `undefined` |  |
| formatter | `((value: AFormLinkValue) => string) \| undefined` | no | `undefined` |  |
| icon | `"arrow-right" \| "chevron-right" \| undefined` | no | `"arrow-right"` |  |
| disabled | `boolean \| undefined` | no | `false` |  |
| filterFunction | `string \| ((search: string) => AFormLinkValue[] \| Promise<AFormLinkValue[]>) \| undefined` | no | `undefined` |  |
| isAsync | `boolean \| undefined` | no | `false` |  |
| embedded | `boolean \| undefined` | no | `false` |  |
| placeholder | `string \| undefined` | no | `undefined` |  |
| ariaLabel | `string \| undefined` | no | `undefined` |  |
| modelValue | `AFormLinkModelValue \| undefined` | no | `{ id: "", displayText: "" }` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: AFormLinkModelValue]` |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| option | `{ option: { [x: string]: any; id: string \| number; displayText?: string \| undefined; }; }` |  |

### AFormLoading

Vue component exported from @stonecrop/aform.

```typescript
import { AFormLoading } from '@stonecrop/aform'
```

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `{}` |  |

### ANumericInput

Vue component exported from @stonecrop/aform.

```typescript
import { ANumericInput } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| modelValue | `number \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: number \| undefined]` |  |

### AQuantityInput

Vue component exported from @stonecrop/aform.

```typescript
import { AQuantityInput } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "&nbsp;" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| options | `QuantityOptions \| undefined` | no | `{}` |  |
| uomLabel | `string \| undefined` | no | `"UOM"` |  |
| stockUomLabel | `string \| undefined` | no | `"Stock UOM"` |  |
| stockQtyLabel | `string \| undefined` | no | `"Stock Qty"` |  |
| conversionFactorLabel | `string \| undefined` | no | `"Conversion Factor"` |  |
| modelValue | `QuantityValue \| undefined` | no | `{ qty: 0, uom: "", stockQty: 0, stockUom: "", conversionFactor: 1 }` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: QuantityValue]` |  |

### ASegmentedControl

Vue component exported from @stonecrop/aform.

```typescript
import { ASegmentedControl } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| options | `string[] \| Record<string, unknown> \| undefined` | no | `undefined` |  |
| size | `"xs" \| "sm" \| undefined` | no | `"sm"` |  |
| equal | `boolean \| undefined` | no | `false` |  |
| hideLabel | `boolean \| undefined` | no | `false` |  |
| ariaLabel | `string \| undefined` | no | `undefined` |  |
| busy | `boolean \| undefined` | no | `false` |  |
| multiple | `boolean \| undefined` | no | `false` |  |
| modelValue | `string \| string[] \| undefined` | no | `""` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: string \| string[]]` |  |

### ATextboxInput

Vue component exported from @stonecrop/aform.

```typescript
import { ATextboxInput } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| placeholder | `string \| undefined` | no | `""` | Placeholder shown when the field is empty |
| rows | `number \| undefined` | no | `4` | Visible number of text lines (maps to the textarea `rows` attribute) |
| maxlength | `number \| undefined` | no |  | Maximum number of characters the field will accept |
| modelValue | `string \| null \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: string \| null \| undefined]` |  |

### ATextInput

Vue component exported from @stonecrop/aform.

```typescript
import { ATextInput } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| schema | `ResolvedField \| undefined` | no |  | The schema object to pass to the component |
| label | `string \| undefined` | no |  | The label to display in the component |
| selectRange | `boolean \| undefined` | no |  |  |
| mask | `string \| undefined` | no |  | The mask to apply to inputs inside the component. Accepts either a plain mask string (e.g. `"(###) ###-####"`) or a stringified arrow function that receives `locale` and returns a mask string (e.g. `"(locale) => locale === 'en-US' ? '(###) ###-####' : '####-######'"`). |
| required | `boolean \| undefined` | no |  | Indicate whether input is required for text and/or select elements inside the component |
| mode | `InteractionMode \| undefined` | no |  | The rendering mode for the component |
| uuid | `string \| undefined` | no |  | Set a unique identifier for elements inside the component |
| validation | `{ [key: string]: any; errorMessage: string; } \| undefined` | no | `{ errorMessage: "" }` | Validation options for elements inside the component |
| errors | `string[] \| undefined` | no |  | Inline validation error messages to display on this field. Fed by the host (e.g. mapped from the core validation store) — the renderer stays dumb and just shows what it is given. Takes precedence over the static `validation.errorMessage`. |
| modelValue | `string \| number \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: string \| number \| undefined]` |  |

### ExpandButton

Vue component exported from @stonecrop/aform.

```typescript
import { ExpandButton } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| expanded | `boolean` | yes |  |  |

### Login

Vue component exported from @stonecrop/aform.

```typescript
import { Login } from '@stonecrop/aform'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| headerTitle | `string \| undefined` | no | `"Login"` |  |
| headerSubtitle | `string \| undefined` | no | `"Enter your email and password to login"` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| loginFailed | `any[]` |  |
| loginSuccess | `any[]` |  |

## Functions

### badgeInputAccentStyle

CSS custom properties for input-accent styling on a native input.

**Signature:**

```typescript
export declare function badgeInputAccentStyle(descriptor: BadgeDescriptor | undefined): Record<string, string> | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| descriptor | `BadgeDescriptor \| undefined` |  |

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

### resolvedFieldsToColumns

The resolved fields that can be columns in a list or table view, in declaration order.

A cell renders one value, so only `kind: 'field'` qualifies. The other three kinds are containers: a `fieldset` groups fields for layout and has no value of its own, while a `link` and a `table` hold a nested record and an array of them. Neither has a `cellComponent`, so a container reaching `ACell` falls through to plain-text rendering and stringifies its children — no error and no log, just a wrong column.

A fieldset's *children* are real columns, so it is flattened rather than dropped; losing them is the same silent defect in the other direction.

One definition, called by both consumers: `Registry.buildTableConfig` (a child table's columns, from its target's resolved schema) and Desktop's records list. Re-deriving it at either call site produced exactly one of the two failures above at each.

**Signature:**

```typescript
export declare function resolvedFieldsToColumns(fields: readonly ResolvedField[]): ColumnSchema[];
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| fields | `readonly ResolvedField[]` | resolved fields, as produced by `resolveSchema` |

### resolveFieldBadge

Resolve a field value to a badge descriptor using format (if present) then options map.

**Signature:**

```typescript
export declare function resolveFieldBadge(value: unknown, options: FieldOptions | undefined, format: string | BadgeFormatFn | undefined, context?: BadgeFormatContext): BadgeDescriptor | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| value | `unknown` |  |
| options | `FieldOptions \| undefined` |  |
| format | `string \| BadgeFormatFn \| undefined` |  |
| context | `BadgeFormatContext` |  |

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
  getRecords?: (options?: GetRecordsOptions) => Promise<GetRecordsResult>;
  hidden?: boolean;
  kind: 'table';
  label?: string;
  mode?: import('@stonecrop/schema').InteractionMode;
  readOnly?: boolean;
  required?: boolean;
  schema: ColumnSchema[];
  sourceKey?: string;
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
| getRecords? | `(options?: GetRecordsOptions) => Promise<GetRecordsResult>` | When set, ATable fetches list pages through this callback (server paging). |
| hidden? | `boolean` | Preserved from the original ValueField or TableField |
| kind | `'table'` | Discriminator |
| label? | `string` | Human-readable label |
| mode? | `import('@stonecrop/schema').InteractionMode` | Interaction mode for all cells |
| readOnly? | `boolean` | Preserved from the original ValueField or TableField |
| required? | `boolean` | Preserved from the original ValueField or TableField |
| schema | `ColumnSchema[]` | Column definitions — passed to ATable's `:schema` prop |
| sourceKey? | `string` | When this changes, ATable refetches from offset 0. |
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

### BadgeFormatContext

Row context passed to badge `format` functions in form fields.

**Definition:**

```typescript
export type BadgeFormatContext = {
    record?: Record<string, unknown>;
    row?: Record<string, unknown>;
};
```

### BadgeFormatFn

Badge-aware field `format` function signature.

**Definition:**

```typescript
export type BadgeFormatFn = (value: unknown, context: BadgeFormatContext) => string | BadgeDescriptor;
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

## Variables

### ABadge

**Type:**

```typescript
export const ABadge: typeof __VLS_export
```

### ACheckbox

**Type:**

```typescript
export const ACheckbox: typeof __VLS_export
```

### ACurrencyInput

**Type:**

```typescript
export const ACurrencyInput: typeof __VLS_export
```

### ADate

**Type:**

```typescript
export const ADate: typeof __VLS_export
```

### ADatePicker

**Type:**

```typescript
export const ADatePicker: typeof __VLS_export
```

### ADateRange

**Type:**

```typescript
export const ADateRange: typeof __VLS_export
```

### ADateSelection

**Type:**

```typescript
export const ADateSelection: typeof __VLS_export
```

### ADateTime

**Type:**

```typescript
export const ADateTime: typeof __VLS_export
```

### ADateTimeInput

**Type:**

```typescript
export const ADateTimeInput: typeof __VLS_export
```

### ADropdown

**Type:**

```typescript
export const ADropdown: typeof __VLS_export
```

### ADuration

**Type:**

```typescript
export const ADuration: typeof __VLS_export
```

### AFieldset

**Type:**

```typescript
export const AFieldset: typeof __VLS_export
```

### AFileAttach

**Type:**

```typescript
export const AFileAttach: typeof __VLS_export
```

### AForm

**Type:**

```typescript
export const AForm: typeof __VLS_export
```

### AFormLink

**Type:**

```typescript
export const AFormLink: typeof __VLS_export
```

### AFormLoading

**Type:**

```typescript
export const AFormLoading: typeof __VLS_export
```

### ANumericInput

**Type:**

```typescript
export const ANumericInput: typeof __VLS_export
```

### AQuantityInput

**Type:**

```typescript
export const AQuantityInput: typeof __VLS_export
```

### ASegmentedControl

**Type:**

```typescript
export const ASegmentedControl: typeof __VLS_export
```

### ATextboxInput

**Type:**

```typescript
export const ATextboxInput: typeof __VLS_export
```

### ATextInput

**Type:**

```typescript
export const ATextInput: typeof __VLS_export
```

### ExpandButton

**Type:**

```typescript
export const ExpandButton: typeof __VLS_export
```

### Login

**Type:**

```typescript
export const Login: typeof __VLS_export
```

## Re-exported

Declared elsewhere and re-exported by this package.

| Name | From |
|------|------|
| InteractionMode | `@stonecrop/schema` |

