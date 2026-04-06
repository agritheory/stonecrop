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

Relationships are declared in the `links` object on `DoctypeMeta`. Render order is controlled by an optional `layout` array.

**customer_schema.json:**

```json
{
  "name": "Customer",
  "slug": "customer",
  "tableName": "customer",
  "fields": [
    { "fieldname": "customer_name", "fieldtype": "Data", "label": "Customer Name", "component": "ATextInput" },
    { "fieldname": "email", "fieldtype": "Data", "label": "Email", "component": "ATextInput" }
  ],
  "links": {
    "address": {
      "target": "address",
      "cardinality": "one",
      "backlink": "customer"
    },
    "orders": {
      "target": "sales-order",
      "cardinality": "noneOrMany",
      "backlink": "customer"
    }
  },
  "layout": ["customer_name", "email", "address", "orders"]
}
```

**address_schema.json:**

```json
{
  "name": "Address",
  "slug": "address",
  "tableName": "address",
  "fields": [
    { "fieldname": "street", "fieldtype": "Data", "label": "Street", "component": "ATextInput" },
    { "fieldname": "city", "fieldtype": "Data", "label": "City", "component": "ATextInput" },
    { "fieldname": "state", "fieldtype": "Data", "label": "State", "component": "ATextInput" },
    { "fieldname": "zip_code", "fieldtype": "Data", "label": "Zip Code", "component": "ATextInput" }
  ],
  "links": {
    "customer": {
      "target": "customer",
      "cardinality": "one",
      "backlink": "address"
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

### Phase 3: Schema Resolution (for 1:1 nested forms)

The Registry resolves `links` entries (1:1 cardinality) by embedding child schemas:

```typescript
const resolvedSchema = registry.resolveSchema(customerDoctype)

// resolvedSchema now has the address link resolved as an embedded schema entry:
// {
//   fieldname: 'address',
//   label: 'address',
//   cardinality: 'one',
//   component: 'AForm',
//   schema: [ /* address fields here */ ]
// }
```

### Phase 4: Nested Data Loading

For new records, scaffold empty nested data:

```typescript
stonecrop.initializeNestedData('customer.new', customerDoctype, {
  includeNested: true,
})
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

For 1:many relationships (`cardinality: 'noneOrMany'` or `'atLeastOne'`), the resolved schema entry has `component: 'ATable'`. AForm detects this and renders an ATable component inline, with columns derived from the target doctype's schema and an empty `rows` array.

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
import type { SchemaTypes } from '@stonecrop/aform'

// Manually embed the child schema
const addressSchema: SchemaTypes[] = [
  { fieldname: 'street', fieldtype: 'Data', label: 'Street', component: 'ATextInput' },
  { fieldname: 'city', fieldtype: 'Data', label: 'City', component: 'ATextInput' },
]

const customerSchema: SchemaTypes[] = [
  { fieldname: 'customer_name', fieldtype: 'Data', label: 'Customer Name', component: 'ATextInput' },
  {
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
  initializeNestedData('customer.new', customerDoctype, { includeNested: true })
}
</script>

<template>
  <AForm :schema="resolvedSchema" v-model:data="formData" />
</template>
```

## Examples

See [examples/aform/nested.story.vue](../../../examples/aform/nested.story.vue) for complete working examples.
