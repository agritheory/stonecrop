# Nested Schema Support in AForm

## Overview

AForm automatically renders nested forms when it encounters a `Doctype` field in your schema. No manual configuration required!

**Note:** This implementation supports **1:1 nested schemas only**. For managing collections of records (1:many relationships), use nested table schemas which provide proper doctype mapping and state management.

## Key Features

- **Zero Configuration**: Pass your schema to AForm - nested forms render automatically
- **Automatic Schema Loading**: AForm loads nested schemas from the registry automatically
- **Automatic Initialization**: Empty nested records are initialized with proper defaults
- **Two-Way Binding**: Nested field changes sync automatically with your data model
- **Visual Hierarchy**: Nested forms styled with clear visual separation

## How It Works

When AForm encounters a field with `fieldtype: "Doctype"`, it automatically:

1. Loads the nested schema from the registry using the `options` value (the nested doctype slug)
2. Initializes empty nested data if not provided
3. Renders a nested AForm recursively with proper styling
4. Manages two-way data binding for all nested fields

## Loading Flow Diagram

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
│  registry.addDoctype('Address', ...)                       │
│  registry.addDoctype('Customer', ...)                      │
│  app.provide('$registry', registry)                        │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│ 3. AForm Component Receives Parent Schema                  │
├────────────────────────────────────────────────────────────┤
│  <AForm :schema="customerSchema.fields" ... />             │
│                                                            │
│  ↓ watchEffect monitors schema                             │
│  ↓ Detects field with fieldtype: "Doctype"                 │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│ 4. Automatic Nested Schema Loading                         │
├────────────────────────────────────────────────────────────┤
│  const registry = inject('$registry')                      │
│  const nestedDoctype = field.options  // "address"         │
│  const nestedSchema = registry.getDoctype(nestedDoctype)   │
│  nestedSchemas[fieldname] = nestedSchema                   │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│ 5. Recursive Rendering                                     │
├────────────────────────────────────────────────────────────┤
│  <div class="aform-nested-section">                        │
│    <label>Address</label>                                  │
│    <AForm                                                  │
│      :schema="nestedSchemas['address']"                    │
│      v-model:data="nestedData['address']"                  │
│    />                                                      │
│  </div>                                                    │
│                                                            │
│  ↓ Two-way binding automatically syncs nested changes      │
└────────────────────────────────────────────────────────────┘
```

**Key Points:**
- **Zero configuration required** - AForm handles everything automatically
- **Registry is injected** via Vue's provide/inject system
- **Detection happens reactively** through watchEffect
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
    { "fieldname": "street", "fieldtype": "Data", "label": "Street" },
    { "fieldname": "city", "fieldtype": "Data", "label": "City" },
    { "fieldname": "state", "fieldtype": "Data", "label": "State" },
    { "fieldname": "zip_code", "fieldtype": "Data", "label": "Zip Code" }
  ]
}
```

**customer_schema.json:**
```json
{
  "name": "Customer",
  "slug": "customer",
  "fields": [
    { "fieldname": "customer_name", "fieldtype": "Data", "label": "Customer Name" },
    { "fieldname": "email", "fieldtype": "Data", "label": "Email" },
    { "fieldname": "phone", "fieldtype": "Data", "label": "Phone" },
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

// Provide registry to your Vue app
app.provide('$registry', registry)
```

### 3. Use AForm - That's It!

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'
import customerSchema from './customer_schema.json'

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
</script>

<template>
  <AForm :schema="customerSchema.fields" v-model:data="customerData" />
  <!-- The address form renders automatically inside! ✨ -->
</template>
```

That's it! The nested address form appears automatically with proper styling and two-way binding.

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

## Benefits

- **Developer Experience**: No boilerplate code, no manual schema loading, no separate rendering
- **Type Safety**: Schema validation happens automatically via Zod validators
- **Maintainability**: Change your schema in one place - the UI updates automatically
- **Consistency**: Nested forms inherit the same styling and behavior as parent forms
- **Reactivity**: Vue's two-way binding works seamlessly with nested data

## Examples

See `/examples/aform/nested.story.vue` for complete working examples demonstrating:

1. Automatic nested form rendering (standard variant)
2. HST integration with nested schemas
3. Real-time state visualization

## Under the Hood

AForm automatically handles nested schema rendering by:

- Injecting the registry from Vue's provide/inject system
- Detecting fields with `fieldtype: "Doctype"`
- Loading nested schemas using the `options` value as the doctype slug
- Initializing nested data with proper defaults based on field types
- Recursively rendering nested AForms with proper data binding

This is all handled automatically - no manual configuration required.

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
