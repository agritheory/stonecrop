# @stonecrop/schema

Schema definitions and validation for Stonecrop doctypes, fields, and workflows.

## Overview

`@stonecrop/schema` provides the foundational type system for Stonecrop applications. It defines strongly-typed schemas using [Zod](https://zod.dev/) for:

- **Field definitions** (`FieldMeta`) - Unified field configuration for forms and tables
- **Doctype definitions** (`DoctypeMeta`) - Complete document type schemas
- **Workflows** (`WorkflowMeta`) - State machines and action definitions
- **Validation** - Runtime schema validation with detailed error reporting
- **DDL Conversion** - PostgreSQL DDL to Stonecrop schema transformation

This package is schema-only and has no UI dependencies - it can be used in both frontend and backend contexts.

## Installation

```bash
# From the monorepo root
rush update

# Or with pnpm
pnpm add @stonecrop/schema
```

## Core Concepts

### Field Types

Stonecrop uses semantic field types that remain consistent whether rendered in a form or table:

```typescript
import { StonecropFieldType, FieldMeta } from '@stonecrop/schema'

// Field types include:
// Text: Data, Text
// Numeric: Int, Float, Decimal, Currency, Quantity
// Boolean: Check
// Date/Time: Date, Time, Datetime, Duration, DateRange
// Structured: JSON, Code
// Relational: Link, Doctype
// Files: Attach
// Selection: Select
```

### Field Metadata

`FieldMeta` is the single source of truth for field definitions:

```typescript
import { FieldMeta } from '@stonecrop/schema'

const field: FieldMeta = {
  fieldname: 'customer_name',
  fieldtype: 'Data',
  label: 'Customer Name',
  required: true,
  readOnly: false,
  width: '40ch',
  align: 'left',
}

// Type-specific options
const linkField: FieldMeta = {
  fieldname: 'customer',
  fieldtype: 'Link',
  label: 'Customer',
  options: 'customer', // Target doctype slug
}

const selectField: FieldMeta = {
  fieldname: 'status',
  fieldtype: 'Select',
  label: 'Status',
  options: ['Draft', 'Submitted', 'Cancelled'], // Choices array
}

const decimalField: FieldMeta = {
  fieldname: 'price',
  fieldtype: 'Decimal',
  label: 'Price',
  options: { precision: 10, scale: 2 }, // Config object
}
```

### Doctype Metadata

`DoctypeMeta` defines a complete doctype with fields, workflow, and inheritance:

```typescript
import { DoctypeMeta } from '@stonecrop/schema'

const doctype: DoctypeMeta = {
  name: 'Sales Order',
  slug: 'sales-order',
  tableName: 'sales_order',
  fields: [
    {
      fieldname: 'customer',
      fieldtype: 'Link',
      label: 'Customer',
      options: 'customer',
      required: true,
    },
    {
      fieldname: 'items',
      fieldtype: 'Doctype',
      label: 'Order Items',
      options: 'sales-order-item', // Child doctype
    },
  ],
  workflow: {
    states: ['Draft', 'Submitted', 'Cancelled'],
    actions: {
      submit: {
        label: 'Submit',
        handler: 'submitOrder',
        requiredFields: ['customer', 'items'],
        allowedStates: ['Draft'],
      },
    },
  },
}
```

### Workflow and Actions

Define state machines and actions for doctypes:

```typescript
import { WorkflowMeta, ActionDefinition } from '@stonecrop/schema'

const workflow: WorkflowMeta = {
  states: ['Draft', 'Pending Approval', 'Approved', 'Rejected'],
  actions: {
    submit: {
      label: 'Submit for Approval',
      handler: 'handleSubmit',
      requiredFields: ['title', 'description'],
      allowedStates: ['Draft'],
      confirm: true,
    },
    approve: {
      label: 'Approve',
      handler: 'handleApprove',
      allowedStates: ['Pending Approval'],
      args: { notifyUser: true },
    },
  },
}
```

## Validation

Runtime validation with detailed error reporting:

```typescript
import { validateField, validateDoctype } from '@stonecrop/schema'

// Validate a field definition
const fieldResult = validateField({
  fieldname: 'email',
  fieldtype: 'Data',
  label: 'Email',
})

if (!fieldResult.success) {
  console.error('Validation errors:', fieldResult.errors)
  // errors: [{ path: ['fieldname'], message: 'Required' }]
}

// Validate a doctype definition
const doctypeResult = validateDoctype(doctypeData)

if (doctypeResult.success) {
  console.log('Doctype is valid!')
}
```

### Parse and Validate

Use Zod's parse methods for type-safe validation:

```typescript
import { parseField, parseDoctype } from '@stonecrop/schema'

try {
  const field = parseField(untrustedData)
  // TypeScript knows field is FieldMeta
} catch (error) {
  console.error('Invalid field:', error)
}

try {
  const doctype = parseDoctype(untrustedData)
  // TypeScript knows doctype is DoctypeMeta
} catch (error) {
  console.error('Invalid doctype:', error)
}
```

## GraphQL to Doctype CLI

The `stonecrop-schema generate` command converts a GraphQL schema into Stonecrop doctype JSON files.

### Basic usage

```bash
# From a live GraphQL endpoint
stonecrop-schema generate -e http://localhost:3000/graphql -o ./app/doctypes

# From a saved introspection JSON file
stonecrop-schema generate -i introspection.json -o ./app/doctypes

# From an SDL file
stonecrop-schema generate -s schema.graphql -o ./app/doctypes
```

### Filtering types

GraphQL schemas (especially PostGraphile) expose many internal types. Use `--include` to
allowlist exactly the types you need, rather than having to `--exclude` everything you don't:

```bash
# Only generate doctypes for these three types
stonecrop-schema generate -e http://localhost:3000/graphql -o ./app/doctypes \
  --include 'SalesOrder,Customer,Item'

# Alternatively, exclude specific types
stonecrop-schema generate -e http://localhost:3000/graphql -o ./app/doctypes \
  --exclude 'PageInfo,StonecropActionDefinition'
```

`--include` and `--exclude` can be combined: `--include` is applied first (narrowing the set),
then `--exclude` removes any remaining unwanted names.

### All options

| Flag | Short | Description |
|------|-------|-------------|
| `--endpoint <url>` | `-e` | Fetch introspection from a live GraphQL endpoint |
| `--introspection <file>` | `-i` | Read from a saved introspection JSON file |
| `--sdl <file>` | `-s` | Read from a GraphQL SDL (`.graphql`) file |
| `--output <dir>` | `-o` | Directory to write doctype JSON files (required) |
| `--include <types>` | | Comma-separated allowlist of type names to generate |
| `--exclude <types>` | | Comma-separated list of type names to skip |
| `--overrides <file>` | | JSON file with per-type, per-field overrides |
| `--custom-scalars <file>` | | JSON file mapping custom scalar names to field templates |
| `--include-unmapped` | | Retain `_graphqlType` metadata on fields with no mapping |
| `--help` | `-h` | Show help |

### Custom scalars

For servers that use non-standard scalars (e.g. PostGraphile's `BigFloat`, `Datetime`), provide
a JSON mapping file:

```json
{
  "BigFloat": { "component": "ADecimalInput", "fieldtype": "Decimal" },
  "Datetime":  { "component": "ADatetimeInput", "fieldtype": "Datetime" }
}
```

```bash
stonecrop-schema generate -e http://localhost:3000/graphql -o ./app/doctypes \
  --custom-scalars custom-scalars.json
```

### Per-field overrides

Override the generated field definition for specific types and fields:

```json
{
  "SalesOrder": {
    "totalAmount": { "fieldtype": "Currency", "component": "ACurrencyInput" }
  }
}
```

```bash
stonecrop-schema generate -e http://localhost:3000/graphql -o ./app/doctypes \
  --overrides overrides.json
```

## DDL Conversion

Convert PostgreSQL DDL statements to Stonecrop doctype schemas:

```typescript
import { convertSchema, type ConversionOptions } from '@stonecrop/schema'

const ddl = `
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sales_orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  status VARCHAR(20) DEFAULT 'Draft',
  total_amount DECIMAL(10, 2)
);
`

const options: ConversionOptions = {
  inheritanceMode: 'flatten', // or 'reference'
  useCamelCase: true, // Convert snake_case to camelCase
  includeUnmappedMeta: false, // Include unmapped metadata
  schema: 'public', // Filter by schema
  exclude: ['migrations'], // Exclude tables
  typeOverrides: {
    status: { fieldtype: 'Select', options: ['Draft', 'Submitted'] },
  },
}

const doctypes = convertSchema(ddl, options)

doctypes.forEach(doctype => {
  console.log(`Doctype: ${doctype.name}`)
  console.log(`Table: ${doctype.tableName}`)
  console.log(`Fields: ${doctype.fields.length}`)
})
```

### Naming Utilities

Convert between different naming conventions:

```typescript
import {
  snakeToCamel,
  camelToSnake,
  snakeToLabel,
  camelToLabel,
  toPascalCase,
  toSlug,
} from '@stonecrop/schema'

snakeToCamel('customer_name') // 'customerName'
camelToSnake('customerName') // 'customer_name'
snakeToLabel('customer_name') // 'Customer Name'
camelToLabel('customerName') // 'Customer Name'
toPascalCase('customer_name') // 'CustomerName'
toSlug('Customer Name') // 'customer-name'
```

## API

### Field Type Mapping

```typescript
import { TYPE_MAP, getDefaultComponent } from '@stonecrop/schema'

// Get default component for a field type
const component = getDefaultComponent('Data') // 'ATextInput'

// Access full type map
console.log(TYPE_MAP['Link']) // { component: 'ALink', fieldtype: 'Link' }
```

## Usage in Stonecrop

This package provides the type system used throughout Stonecrop:

- **`@stonecrop/stonecrop`** - Registry uses `DoctypeMeta` for schema storage
- **`@stonecrop/aform`** - Renders fields based on `FieldMeta` definitions
- **`@stonecrop/atable`** - Uses `FieldMeta` for column configuration
- **Backend APIs** - Validates and stores doctypes using these schemas

## Development

```bash
# Install dependencies
rush update

# Build
rushx build

# Run tests
rushx test

# Watch mode
rushx test:watch

# Generate API documentation
rushx docs
```

## TypeScript Support

This package is written in TypeScript with strict mode enabled and provides full type definitions:

```typescript
import type { FieldMeta, DoctypeMeta } from '@stonecrop/schema'

// Types are inferred from Zod schemas
const field: FieldMeta = {
  fieldname: 'title',
  fieldtype: 'Data',
  // TypeScript will catch typos and missing required fields
}

// Use Zod's infer utility for derived types
import { z } from 'zod'
import { FieldMeta as FieldMetaSchema } from '@stonecrop/schema'

type FieldMetaType = z.infer<typeof FieldMetaSchema>
```
