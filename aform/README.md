# @stonecrop/aform

Schema-driven form components for the Stonecrop framework. Renders a `SchemaTypes[]` array into a form, wiring field values to a `data` object via `v-model:data`.

## Components

| Component | Description |
|---|---|
| `AForm` | Root form renderer — iterates schema, renders child components, handles nested forms |
| `ACheckbox` | Boolean toggle |
| `AComboBox` | Editable combo box with option list |
| `ADate` | Date text input |
| `ADatePicker` | Date picker with calendar UI |
| `ADropdown` | Single-select dropdown for string enum fields |
| `AFieldset` | Collapsible grouping container for other fields |
| `AFileAttach` | File upload and attachment |
| `AFormLink` | Linked document selector with search dropdown and navigation arrow |
| `ANumericInput` | Numeric input with type-specific formatting |
| `ATextInput` | Single-line text input |

## Installation

```typescript
import { install } from '@stonecrop/aform'

app.use(install)
```

This registers all components globally. They can also be imported individually.

---

## AFormLink

A form input for selecting and navigating to linked documents (`fieldtype: 'Link'`). Combines a searchable text input, an optional dropdown of results, and a navigation arrow button.

### Value shape

```typescript
interface AFormLinkValue {
  id: string | number      // the linked record's ID; id: 0 is valid
  displayText?: string     // shown in the input; falls back to String(id)
  [extra: string]: any     // extra fields available to formatter
}
```

When `id` is falsy, the component shows a `—` placeholder and hides the navigation arrow.

### Props

```typescript
{
  modelValue: AFormLinkValue
  label?: string
  mode?: 'edit' | 'read' | 'display'
  doctype?: string          // target doctype slug — used by the navigation arrow
  filterFunction?: (search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>
  isAsync?: boolean         // show loading indicator while filterFunction resolves
  formatter?: (value: AFormLinkValue) => string  // custom display text transform
  icon?: 'arrow-right' | 'chevron-right'         // navigation arrow icon
  disabled?: boolean
}
```

### Modes

| Mode      | Input    | Arrow                | Dropdown            |
|-----------|----------|----------------------|---------------------|
| `edit`    | Enabled  | Visible (if has id)  | Opens on focus/type |
| `read`    | Disabled | Visible (if has id)  | Never opens         |
| `display` | Hidden   | Hidden               | —                   |

### Filter function

Provide `filterFunction` to enable the search dropdown. The function receives the current input text and must return `AFormLinkValue[]` or a `Promise<AFormLinkValue[]>`.

```typescript
// Sync
const filterFunction = (search: string): AFormLinkValue[] =>
  records
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    .map(r => ({ id: r.id, displayText: r.name }))

// Async — set isAsync: true for loading indicator
const filterFunction = async (search: string): Promise<AFormLinkValue[]> => {
  const results = await api.search(search)
  return results.map(r => ({ id: r.id, displayText: r.name }))
}
```

### Navigation

AFormLink injects `aformLinkNavigator` from the app layer rather than depending on vue-router directly. Provide it once in your app plugin:

```typescript
import type { AFormLinkNavigator } from '@stonecrop/aform'

app.provide('aformLinkNavigator', {
  navigate(doctype: string, id: string | number) {
    router.push(`/${doctype}/${id}`)
  },
} satisfies AFormLinkNavigator)
```

```typescript
interface AFormLinkNavigator {
  navigate(doctype: string, id: string | number): void
}
```

If no navigator is provided, the arrow button is still rendered but navigation clicks are silent no-ops.

### Via resolveSchema

For `fieldtype: 'Link'` fields with no matching `links` declaration, `Registry.resolveSchema()` automatically assigns `component: 'AFormLink'` and sets `doctype` from `field.options`. No manual wiring required:

```typescript
const config: DoctypeConfig = {
  slug: 'sales-order',
  fields: [
    { fieldname: 'order_number', fieldtype: 'Data', component: 'ATextInput', label: 'Order Number' },
    { fieldname: 'territory', fieldtype: 'Link', options: 'territory', label: 'Territory' },
    // no 'links' entry for territory
  ],
}

registry.addDoctype(Doctype.fromObject(config))
const resolved = registry.resolveSchema(registry.registry['sales-order'])
// resolved[1] === { fieldname: 'territory', component: 'AFormLink', doctype: 'territory', label: 'Territory' }

// Pass to AForm as normal — the territory field renders as AFormLink automatically
```

Declared links (those with a `links` entry and a registered target doctype) are unaffected — they continue to resolve as embedded `AForm` (1:1) or `ATable` (1:many) entries.
