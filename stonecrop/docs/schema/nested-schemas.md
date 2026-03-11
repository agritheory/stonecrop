# Nested Schema Support in AForm

## Overview

AForm renders nested forms when it receives a schema with embedded child schemas. The Registry handles schema resolution, embedding nested schemas before you pass them to AForm.

**Note:** This implementation supports **1:1 nested schemas only**. For managing collections of records (1:many relationships), use nested table schemas which provide proper doctype mapping and state management.

## Key Features

- **Registry-Driven Resolution**: Call `registry.resolveSchema()` to get a fully resolved schema tree
- **Recursive Embedding**: Child schemas are embedded directly into parent schema fields
- **Automatic Initialization**: Empty nested records are initialized with proper defaults
- **Two-Way Binding**: Nested field changes sync automatically with your data model
- **Visual Hierarchy**: Nested forms styled with clear visual separation
- **Framework-Agnostic**: AForm works standalone or with full Stonecrop integration

## How It Works

The nested schema workflow has two phases:

### Phase 1: Registry Resolution (Before AForm)

```typescript
const registry = new Registry()
// ... register doctypes ...
const resolvedSchema = registry.resolveSchema(parentSchema)
```

The Registry:
1. Traverses the schema looking for `fieldtype: "Doctype"` fields
2. Loads nested schemas from registered doctypes using the `options` value
3. Embeds the child schema into a `schema` property on the parent field
4. Recursively resolves any further nesting

### Phase 2: AForm Rendering

```vue
<AForm :schema="resolvedSchema" v-model:data="recordData" />
```

AForm:
1. Detects fields with a `schema` property
2. Initializes empty nested data if not provided
3. Renders nested AForms recursively with proper styling
4. Manages two-way data binding for all nested fields

## Schema Resolution Flow

```
┌────────────────────────────────────────────────────────────┐
│ 1. Schema Definition (JSON)                                │
├────────────────────────────────────────────────────────────┤
│  address_schema.json              customer_schema.json     │
│  { name, slug, fields }           { name, slug, fields }   │
│                                    ↓                       │
│                                   [fieldtype: "Doctype",   │
│                                    options: "address"]     │
└────────────────┬────────────────────────────┬──────────────┘
                 ↓                            ↓
┌────────────────────────────────────────────────────────────┐
│ 2. Registry Registration                                   │
├────────────────────────────────────────────────────────────┤
│  registry.addDoctype(addressDoctype)                       │
│  registry.addDoctype(customerDoctype)                      │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│ 3. Schema Resolution (Registry)                            │
├────────────────────────────────────────────────────────────┤
│  const resolved = registry.resolveSchema(customerSchema)   │
│                                                            │
│  Registry walks the schema tree:                           │
│  ↓ Finds field with fieldtype: "Doctype"                   │
│  ↓ Loads nested doctype using options: "address"           │
│  ↓ Embeds child schema into parent field.schema property   │
│  ↓ Recursively resolves any further nesting                │
│                                                            │
│  Result: Fully resolved schema tree with embedded schemas  │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│ 4. AForm Component Receives Resolved Schema                │
├────────────────────────────────────────────────────────────┤
│  <AForm :schema="resolved" v-model:data="recordData" />    │
│                                                            │
│  AForm detects fields with embedded schemas:               │
│  ↓ v-if="'schema' in field && field.schema.length > 0"     │
│  ↓ Initializes nested data if not provided                 │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│ 5. Recursive Rendering                                     │
├────────────────────────────────────────────────────────────┤
│  <div class="aform-nested-section">                        │
│    <h4>{{ field.label }}</h4>                              │
│    <AForm                                                  │
│      :schema="field.schema"                                │
│      v-model:data="nestedData[field.fieldname]"            │
│      :mode="field.mode ?? mode"                            │
│    />                                                      │
│  </div>                                                    │
│                                                            │
│  ↓ Two-way binding automatically syncs nested changes      │
└────────────────────────────────────────────────────────────┘
```

**Key Points:**
- **Registry resolves schemas** before passing to AForm
- **Child schemas embedded** directly into parent field's `schema` property
- **AForm is framework-agnostic** - works with or without Registry
- **Recursive rendering** allows unlimited nesting depth
- **Data binding** works seamlessly at all levels

## Basic Usage

### 1. Define Your Schemas

**address_schema.json:**
```json
{
  "name": "Address",
  "slug": "address",
  "fields": [
    { "fieldname": "street", "fieldtype": "Data", "label": "Street", "component": "ATextInput" },
    { "fieldname": "city", "fieldtype": "Data", "label": "City", "component": "ATextInput" },
    { "fieldname": "state", "fieldtype": "Data", "label": "State", "component": "ATextInput" },
    { "fieldname": "zip_code", "fieldtype": "Data", "label": "Zip Code", "component": "ATextInput" }
  ]
}
```

**customer_schema.json:**
```json
{
  "name": "Customer",
  "slug": "customer",
  "fields": [
    { "fieldname": "customer_name", "fieldtype": "Data", "label": "Customer Name", "component": "ATextInput" },
    { "fieldname": "email", "fieldtype": "Data", "label": "Email", "component": "ATextInput" },
    { "fieldname": "phone", "fieldtype": "Data", "label": "Phone", "component": "ATextInput" },
    {
      "fieldname": "address",
      "fieldtype": "Doctype",
      "options": "address",
      "label": "Address"
    }
  ]
}
```

The `options` field must match the slug of a registered doctype in your registry.

### 2. Register Doctypes

```typescript
import { Registry, DoctypeMeta } from '@stonecrop/stonecrop'
import { List } from 'immutable'
import addressSchema from './address_schema.json'
import customerSchema from './customer_schema.json'

const registry = new Registry()

// Register the nested doctype first
const addressDoctype = new DoctypeMeta('Address', List(addressSchema.fields), undefined, undefined)
registry.addDoctype(addressDoctype)

// Register the parent doctype
const customerDoctype = new DoctypeMeta('Customer', List(customerSchema.fields), undefined, undefined)
registry.addDoctype(customerDoctype)
```

### 3. Resolve Schema with Registry

```typescript
// Convert Immutable schema to array
const schemaArray = Array.from(customerDoctype.schema)

// Resolve schema - this embeds nested schemas recursively
const resolvedSchema = registry.resolveSchema(schemaArray)

// resolvedSchema now has the address field with embedded schema:
// {
//   fieldname: 'address',
//   fieldtype: 'Doctype',
//   options: 'address',
//   label: 'Address',
//   schema: [ /* address fields here */ ]
// }
```

### 4. Use AForm with Resolved Schema

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'
import { registry, customerDoctype } from './registry'

const customerData = ref({
  customer_name: 'John Doe',
  email: 'john@example.com',
  phone: '555-0123',
  address: {
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip_code: '62701',
  },
})

// Resolve schema before passing to AForm
const schemaArray = Array.from(customerDoctype.schema)
const resolvedSchema = registry.resolveSchema(schemaArray)
</script>

<template>
  <AForm :schema="resolvedSchema" v-model:data="customerData" />
  <!-- The address form renders automatically inside! ✨ -->
</template>
```

The nested address form appears automatically with proper styling and two-way binding.

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
  { fieldname: 'state', fieldtype: 'Data', label: 'State', component: 'ATextInput' },
  { fieldname: 'zip_code', fieldtype: 'Data', label: 'Zip Code', component: 'ATextInput' },
]

const customerSchema: SchemaTypes[] = [
  { fieldname: 'customer_name', fieldtype: 'Data', label: 'Customer Name', component: 'ATextInput' },
  { fieldname: 'email', fieldtype: 'Data', label: 'Email', component: 'ATextInput' },
  { fieldname: 'phone', fieldtype: 'Data', label: 'Phone', component: 'ATextInput' },
  {
    fieldname: 'address',
    fieldtype: 'Doctype',
    label: 'Address',
    schema: addressSchema, // ← Manually embed the schema
  },
]

const customerData = ref({
  customer_name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '555-9876',
  address: {
    street: '456 Oak Ave',
    city: 'Portland',
    state: 'OR',
    zip_code: '97201',
  },
})
</script>

<template>
  <AForm :schema="customerSchema" v-model:data="customerData" />
</template>
```

This approach is useful for:
- Prototyping without full framework setup
- Simple forms that don't need doctype reuse
- Apps that manage schemas differently

## Data Structure

Your data should have nested objects matching the schema structure:

```typescript
{
  customer_name: 'John Doe',
  email: 'john@example.com',
  phone: '555-0123',
  address: {  // ← Nested object for Doctype field
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip_code: '62701',
  },
}
```

If the nested object doesn't exist, AForm will initialize it automatically with default values.

## Examples

See [examples/aform/nested.story.vue](../../../examples/aform/nested.story.vue) for complete working examples demonstrating:

1. **Resolved Schema** — Using `registry.resolveSchema()` with single AForm instance
2. **Standalone (No Framework)** — Manual schema embedding without Registry
3. **HST Integration** — Resolved schema with HST state tree visualization

## Under the Hood

### Registry Resolution (`registry.resolveSchema()`)

The Registry recursively walks your schema tree:

```typescript
// Pseudo-code showing resolution logic
function resolveSchema(schema: SchemaTypes[]): SchemaTypes[] {
  return schema.map(field => {
    if (field.fieldtype === 'Doctype' && field.options) {
      // Load the nested doctype from the registry
      const childDoctype = registry.getDoctype(field.options)

      // Recursively resolve the child schema
      const childSchema = resolveSchema(Array.from(childDoctype.schema))

      // Embed the resolved schema into the parent field
      return { ...field, schema: childSchema }
    }
    return field
  })
}
```

### Registry Initialization (`registry.initializeRecord()`)

The Registry can also initialize nested record structures with proper defaults:

```typescript
// Initialize a customer record with nested address
const initialData = registry.initializeRecord(customerDoctype)

// Result:
// {
//   customer_name: '',
//   email: '',
//   phone: '',
//   address: {
//     street: '',
//     city: '',
//     state: '',
//     zip_code: ''
//   }
// }
```

This ensures nested objects have proper structure based on their schema field types.

### AForm Rendering

AForm detects nested schemas and renders recursively:

```vue
<!-- Simplified rendering logic -->
<template v-for="field in schema">
  <!-- Nested form when schema property exists -->
  <div v-if="'schema' in field && field.schema.length > 0" class="aform-nested-section">
    <h4>{{ field.label }}</h4>
    <AForm
      v-model:data="nestedData[field.fieldname]"
      :schema="field.schema"
      :mode="field.mode ?? mode"
    />
  </div>

  <!-- Regular field -->
  <component :is="field.component" v-else ... />
</template>
```

This separation means:
- **Registry** is responsible for schema structure and relationships
- **AForm** is responsible for rendering and user interaction
- Both can be tested independently

## HST Integration with useStonecrop

When using the `useStonecrop` composable with a doctype, schema resolution happens automatically:

```vue
<script setup lang="ts">
import { useStonecrop } from '@stonecrop/stonecrop'
import { AForm } from '@stonecrop/aform'
import { registry, customerDoctype } from './registry'

// Schema is automatically resolved and available as resolvedSchema
const { formData, resolvedSchema, handleHSTChange, provideHSTPath } = useStonecrop({
  registry,
  doctype: customerDoctype,
  recordId: 'customer-123'
})
</script>

<template>
  <AForm
    :schema="resolvedSchema"
    v-model:data="formData"
  />
</template>
```

The composable:
- Automatically calls `registry.resolveSchema()` on mount
- Provides `resolvedSchema` ref with fully embedded schemas
- Manages HST state synchronization for nested data
- Handles `provideHSTPath` for proper nested field paths

This provides the best developer experience when using full Stonecrop integration.

## Nested Table Schemas

For **1:many relationships** (collections of records), use ATable with a `Table` fieldtype instead:

```json
{
  "fieldname": "line_items",
  "fieldtype": "Table",
  "options": "sales_order_item",
  "label": "Line Items"
}
```

ATable provides:
- Grid-based editing with Excel-like navigation
- Add/remove rows
- Bulk operations
- Better performance for collections
