# Nested Schema Support in AForm

## Overview

AForm renders nested forms when it receives a schema with embedded child schemas. Doctypes declare relationships through the `links` object on `DoctypeMeta`. The Registry resolves these relationships into fully embedded schemas for rendering.

## Relationship Types

Stonecrop uses **ancestor/descendant** terminology for relationships:

- **Descendant link**: points away from the current doctype toward a related doctype (Recipe → RecipeTask via `tasks`)
- **Ancestor link**: points back toward the originating doctype (RecipeTask → Recipe via `recipe`)
- **Backlink**: the `fieldname` on the other side that names the reciprocal link

### Cardinality

| Value        | Min | Max | Meaning                               |
| ------------ | --- | --- | ------------------------------------- |
| `atMostOne`  | 0   | 1   | Optional pointer — exists or null     |
| `one`        | 1   | 1   | Required pointer — always exactly one |
| `noneOrMany` | 0   | ∞   | Optional collection — zero or more    |
| `atLeastOne` | 1   | ∞   | Required collection — one or more     |

## How It Works

### Phase 1: Schema Definition

Relationships are declared in the `links` object on `DoctypeMeta`. Link fields (`fieldtype: 'Link'`) are placed in the `fields` array at the position where they should render.

**customer_schema.json:**

```json
{
  "name": "Customer",
  "slug": "customer",
  "fields": [
    { "fieldname": "customer_name", "fieldtype": "Data", "label": "Customer Name", "component": "ATextInput" },
    { "fieldname": "email", "fieldtype": "Data", "label": "Email", "component": "ATextInput" },
    { "fieldname": "address", "fieldtype": "Link", "label": "Address", "options": "address", "component": "AForm" },
    { "fieldname": "orders", "fieldtype": "Link", "label": "Orders", "options": "sales-order", "component": "ATable" }
  ],
  "links": {
    "address": {
      "target": "address",
      "cardinality": "one",
      "backlink": "customer",
      "fieldname": "address"
    },
    "orders": {
      "target": "sales-order",
      "cardinality": "noneOrMany",
      "backlink": "customer",
      "fieldname": "orders"
    }
  }
}
```

**address_schema.json:**

```json
{
  "name": "Address",
  "slug": "address",
  "fields": [
    { "fieldname": "street", "fieldtype": "Data", "label": "Street", "component": "ATextInput" },
    { "fieldname": "city", "fieldtype": "Data", "label": "City", "component": "ATextInput" },
    { "fieldname": "state", "fieldtype": "Data", "label": "State", "component": "ATextInput" },
    { "fieldname": "zip_code", "fieldtype": "Data", "label": "Zip Code", "component": "ATextInput" },
    { "fieldname": "customer", "fieldtype": "Link", "label": "Customer", "options": "customer", "component": "AForm", "readOnly": true }
  ],
  "links": {
    "customer": {
      "target": "customer",
      "cardinality": "one",
      "backlink": "address",
      "fieldname": "customer"
    }
  }
}
```

### Phase 2: Registry Resolution

```typescript
import { Registry, Doctype } from '@stonecrop/stonecrop'

const registry = new Registry()

// Register doctypes
const addressDoctype = Doctype.fromObject(addressSchema)
const customerDoctype = Doctype.fromObject(customerSchema)
registry.addDoctype(addressDoctype)
registry.addDoctype(customerDoctype)
```

The Registry provides two accessors:

```typescript
// Get all links declared on a doctype
const links = registry.getDescendantLinks('customer')
// [{ fieldname: 'address', target: 'address', cardinality: 'one', backlink: 'customer' },
//  { fieldname: 'orders', target: 'sales-order', cardinality: 'noneOrMany', backlink: 'customer' }]

// Get links on other doctypes that target this one
const ancestors = registry.getAncestorLinks('address')
// [{ fieldname: 'customer', target: 'address', cardinality: 'one', backlink: 'address', doctype: 'customer' }]
```

### Phase 3: Schema Resolution

`registry.resolveSchema()` walks each `links` entry and embeds the target doctype's fields directly on the resolved field object. The shape depends on cardinality:

**1:1 links** (`one`, `atMostOne`) — embed child schema for an inline nested form:

```typescript
const resolvedSchema = registry.resolveSchema(customerDoctype)

// address link resolves to:
// {
//   fieldname: 'address',
//   label: 'address',
//   cardinality: 'one',
//   component: 'AForm',
//   schema: [ /* address fields */ ]
// }
// AForm detects `'schema' in field` (without kind: 'table') and renders a nested AForm.
```

**1:many links** (`noneOrMany`, `atLeastOne`) — embed child schema for an inline table:

```typescript
// orders link resolves to:
// {
//   fieldname: 'orders',
//   label: 'orders',
//   cardinality: 'noneOrMany',
//   component: 'ATable',
//   kind: 'table',
//   schema: [ /* sales-order fields as ColumnSchema[] */ ]
// }
// AForm detects `kind === 'table'` and renders an ATable with :schema bound to the embedded
// schema array. ATable calls schemaToColumns() internally — no TableColumn objects needed.
```

### Phase 4: Nested Data Loading

For new records, scaffold empty nested data:

```typescript
stonecrop.initializeNestedData('customer.new', customerDoctype)
// Sets each field at its own HST path: customer.new.customer_name, customer.new.email, etc.
```

For existing records, fetch from server:

```typescript
await stonecrop.fetchNestedData('customer.c-123', customerDoctype, 'c-123', {
  includeNested: true,
})
// Calls client.getRecord() with nested sub-selections
// Stores each field at its own HST path
```

### Phase 5: AForm Rendering

```vue
<AForm :schema="resolvedSchema" v-model:data="customerData" />
```

AForm:

1. Detects fields with a `schema` property (1:1 nested)
2. Initializes empty nested data if not provided
3. Renders nested AForms recursively with proper styling
4. Manages two-way data binding for all nested fields

For 1:many relationships (`cardinality: 'noneOrMany'` or `'atLeastOne'`), the resolved schema entry has `component: 'ATable'` and `kind: 'table'`. AForm detects `kind === 'table'` and renders an ATable with `:schema` bound to the embedded `ColumnSchema[]` array. ATable derives its own columns via `schemaToColumns()` — no `TableColumn` objects are required.

## Fetch Strategies

The `fetch` property on a `LinkDeclaration` controls when and how linked data is loaded.

### Sync Fetch

Data is fetched in the initial query along with the parent record. Use for data that is:
- Small and always needed
- Required for workflow actions
- Cheap to include in every query

```typescript
links: {
  tasks: {
    target: 'task',
    cardinality: 'noneOrMany',
    fetch: { method: 'sync' },  // Included in initial query
  },
}
```

### Lazy Fetch

Data is fetched on demand in a separate query. Use for data that is:
- Large or expensive to load
- Rarely needed
- User-initiated

```typescript
links: {
  tasks: {
    target: 'task',
    cardinality: 'noneOrMany',
    fetch: { method: 'lazy' },  // Loaded on demand
  },
}
```

### Cardinality Defaults

When `fetch` is not specified, defaults are applied based on cardinality:

| Cardinality   | Default Fetch | Notes                          |
|--------------|---------------|--------------------------------|
| `noneOrMany` | `sync`        | Lists typically needed immediately |
| `atLeastOne` | `sync`        | Required lists                 |
| `one`        | `lazy`        | Typically loaded on navigation |
| `atMostOne`  | `lazy`        | Optional single records        |

## blockWorkflows

The `blockWorkflows` property controls whether workflow actions (submit, approve, etc.) are blocked until the linked data is loaded into HST.

### Default Behavior

- **Sync links**: `blockWorkflows` defaults to `true` — workflow actions are blocked until data is loaded
- **Lazy links**: `blockWorkflows` defaults to `false` — workflow actions proceed without waiting

### Overriding the Default

```typescript
links: {
  // Explicitly don't block — sync but workflow proceeds anyway
  optionalData: {
    target: 'task',
    cardinality: 'noneOrMany',
    fetch: { method: 'sync' },
    blockWorkflows: false,
  },
  // Force blocking even for lazy data
  criticalData: {
    target: 'task',
    cardinality: 'noneOrMany',
    fetch: { method: 'lazy' },
    blockWorkflows: true,
  },
}
```

### How It Works

`stonecrop.isWorkflowReady(doctype, recordId)` checks if all links with `blockWorkflows: true` have their data loaded in HST at the path `slug.recordId.linkname`. If any blocking link's data is missing, workflow actions are prevented.

Use with `useStonecrop().isWorkflowReady` to automatically disable action buttons:

```vue
<button :disabled="!isWorkflowReady" @click="submit">
  Submit
</button>
```

### Custom Fetch Handlers

The `custom` fetch strategy invokes a serialized handler function for complete control over data loading. Custom handlers receive `(stonecrop, path, hst)` and can load data from any source. Note that `blockWorkflows: true` with custom fetch will still include the link in the GraphQL query (bypassing the custom handler) — see [useLazyLink](/reference/stonecrop#uselazylink) for details.

## Data Structure

Your data should have nested objects matching the schema structure:

```typescript
{
  customer_name: 'John Doe',
  email: 'john@example.com',
  address: {               // ← Nested object for 1:1 link
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip_code: '62701',
  },
  orders: [                // ← Array for noneOrMany link
    { id: 'o1', total: 100 },
    { id: 'o2', total: 250 },
  ],
}
```

## Standalone Mode (Without Registry)

AForm can also work without the Registry by manually embedding schemas:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'
import type { ResolvedField } from '@stonecrop/aform'

// Manually embed the child schema (use ResolvedField[] for AForm's :schema prop)
const addressSchema: ResolvedField[] = [
  { kind: 'field', fieldname: 'street', fieldtype: 'Data', label: 'Street', component: 'ATextInput' },
  { kind: 'field', fieldname: 'city', fieldtype: 'Data', label: 'City', component: 'ATextInput' },
]

const customerSchema: ResolvedField[] = [
  { kind: 'field', fieldname: 'customer_name', fieldtype: 'Data', label: 'Customer Name', component: 'ATextInput' },
  {
    kind: 'link',
    fieldname: 'address',
    component: 'AForm',
    label: 'Address',
    schema: addressSchema, // ← Manually embed the schema
  },
]
</script>

<template>
  <AForm :schema="customerSchema" v-model:data="customerData" />
</template>
```

## HST Integration with useStonecrop

```vue
<script setup lang="ts">
import { useStonecrop } from '@stonecrop/stonecrop'
import { AForm } from '@stonecrop/aform'
import { registry, customerDoctype } from './registry'

const { formData, resolvedSchema, initializeNestedData } = useStonecrop({
  registry,
  doctype: customerDoctype,
  recordId: 'customer-123',
})

// Scaffold nested data for new records
// initializeNestedData uses resolveSchema internally, so it works even before resolvedSchema is populated
if (formData.value && !formData.value.address) {
  initializeNestedData('customer.new', customerDoctype)
}
</script>

<template>
  <AForm :schema="resolvedSchema" v-model:data="formData" />
</template>
```

## Examples

See [examples/aform/nested.story.vue](../../../examples/aform/nested.story.vue) for complete working examples.
