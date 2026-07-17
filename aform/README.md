# @stonecrop/aform

Schema-driven form components for the Stonecrop framework. Renders a `ResolvedField[]` array into a form, wiring field values to a `data` object via `v-model:data`. The array usually comes from `registry.resolveSchema()`, but may also be hand-authored for view chrome that has no backing doctype — see [Authoring space vs rendering space](#authoring-space-vs-rendering-space).

## Components

| Component | Description |
|---|---|
| `AForm` | Root form renderer — iterates schema, renders child components, handles nested forms |
| `ACheckbox` | Boolean toggle |
| `ADate` | Date text input |
| `ADatePicker` | Date picker with calendar UI |
| `ADateTime` | Combined date and time input |
| `ADateRange` | Date-range input (start and end) |
| `ADateSelection` | Wrapper combining a date picker and time input |
| `ADuration` | Duration input |
| `ADropdown` | Single-select dropdown for string enum fields |
| `AFieldset` | Collapsible grouping container for other fields |
| `AFileAttach` | File upload and attachment |
| `AFormLink` | Linked document selector with search dropdown and navigation arrow |
| `ANumericInput` | Numeric input with type-specific formatting |
| `ATextInput` | Single-line text input |
| `ATextarea` | Multi-line text input |

## Installation

```typescript
import { install } from '@stonecrop/aform'

app.use(install)
```

This registers all components globally. They can also be imported individually.

---

## AForm

### Authoring space vs rendering space

Stonecrop has two field shapes, and AForm consumes only the second:

| | Type | Produced by | Table columns live under |
|---|---|---|---|
| **Authoring space** | `DoctypeField[]` (`@stonecrop/schema`) | hand-authored doctype JSON, the docbuilder, the GraphQL converter | `columns` |
| **Rendering space** | `ResolvedField[]` (this package) | `registry.resolveSchema()` | `schema` |

`resolveSchema()` renames a table's `columns` to `schema` because `schema` is the ATable prop that runs
`schemaToColumns()`; ATable's own `columns` prop means already-converted `TableColumn[]`. Passing an
authoring-space field straight to AForm therefore does **not** render a table.

`kind` is required and is the only thing AForm dispatches on — it does not infer a field's type from its
structure. Every path into rendering space sets it: Zod's preprocess, `Doctype.fromObject`, and the
registry. When hand-authoring, declare it yourself and use `satisfies` to stay checked:

```typescript
import type { ResolvedField, ResolvedTable } from '@stonecrop/aform/types'

const schema: ResolvedField[] = [
  {
    kind: 'table',
    fieldname: 'line_items',
    component: 'ATable',
    schema: [{ fieldname: 'item_code', label: 'SKU', component: 'ATextInput' }],
    config: { view: 'list' },
  } satisfies ResolvedTable,
]
```

Each column needs a `component`: `schemaToColumns()` drops entries without one, since absence is what
marks a non-scalar entry.

### Table rows come from the data model

A table's rows are never part of its schema. AForm reads them from `dataModel[fieldname]`, so a `rows`
key on the schema field is ignored, and a table whose `fieldname` has no matching data key renders empty:

```typescript
// schema declares fieldname: 'line_items' → rows are read from here
const data = ref({ line_items: [{ item_code: 'LAPTOP-PRO-15', quantity: 2 }] })
```

For a table nested in a fieldset, the rows nest the same way — `data[fieldsetFieldname][tableFieldname]`.

### Field width

Set `width` on any schema field to control its share of the form row. The value is any valid CSS size and is applied as `flex-basis` + `width` directly on the field's flex item:

```json
{ "fieldname": "notes", "component": "ATextInput", "label": "Notes", "width": "100%" }
```

| Value | Effect |
|---|---|
| `"100%"` | Field spans the full form row (forces a line-break before and after) |
| `"50%"` | Field takes half the row; neighbouring fields fill the rest |
| `"40ch"` | Field starts at 40 characters wide and grows with available space |

Fields without `width` continue to share space equally (`flex-grow: 1; min-width: 20ch`).

---

## AFormLink

A form input for selecting and navigating to linked documents (fields carrying a `doctype` marker). Combines a searchable text input, an optional dropdown of results, and a navigation arrow button.

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

Provide `filterFunction` to enable the search dropdown. The function receives a search string and must return `AFormLinkValue[]` or a `Promise<AFormLinkValue[]>`.

The function is called in two distinct situations:

1. **On user interaction** — when the user focuses or types into the field, the current input text is passed as the search string.
2. **On mount (and on id change)** — when the field has an `id` but no `displayText`, the function is called automatically with the existing `id` string so the display name can be resolved without user interaction. The first result whose `id` matches is used.

Because of case 2, implementations should handle both name-based searches (partial strings typed by the user) and exact id lookups (full id strings passed on mount). A common pattern is to attempt both:

```typescript
// Sync
const filterFunction = (search: string): AFormLinkValue[] =>
  records
    .filter(r =>
      r.id === search ||                                  // exact id match (mount-time resolution)
      r.name.toLowerCase().includes(search.toLowerCase()) // name search (user typing)
    )
    .map(r => ({ id: r.id, displayText: r.name }))

// Async — set isAsync: true for loading indicator
const filterFunction = async (search: string): Promise<AFormLinkValue[]> => {
  const results = await api.search(search)  // API should handle both id and name queries
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

For fields carrying a `doctype` marker with no matching `links` declaration and no `component`, `Registry.resolveSchema()` automatically assigns `component: 'AFormLink'`. No manual wiring required:

```typescript
const config: DoctypeConfig = {
  name: 'Sales Order',
  fields: [
    { fieldname: 'order_number', component: 'ATextInput', label: 'Order Number' },
    { fieldname: 'territory', doctype: 'territory', label: 'Territory' },
    // no 'links' entry for territory
  ],
}

registry.addDoctype(Doctype.fromObject(config))
const resolved = registry.resolveSchema(registry.registry['sales-order'])
// resolved[1] === { kind: 'field', fieldname: 'territory', component: 'AFormLink', doctype: 'territory', label: 'Territory' }

// Pass to AForm as normal — the territory field renders as AFormLink automatically
```

Declared links (those with a `links` entry and a registered target doctype) are unaffected — they continue to resolve as embedded `AForm` (1:1) or `ATable` (1:many) entries.
