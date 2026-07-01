# @stonecrop/schema

Schema definitions and validation for Stonecrop doctypes, fields, and workflows.

## Overview

`@stonecrop/schema` provides the foundational type system for Stonecrop applications. It defines strongly-typed schemas using [Zod](https://zod.dev/) for:

- **Field definitions** (`DoctypeField`) - Discriminated union of field variants (`ValueField | FieldsetField | TableField`)
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
import { StonecropFieldType } from '@stonecrop/schema'

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

### Field Definitions

`DoctypeField` is a discriminated union of three structural variants:

- **`ValueField`** — a scalar or link field; has `fieldtype`
- **`FieldsetField`** — a layout container grouping other fields; has `schema: DoctypeField[]`
- **`TableField`** — an inline table with column definitions; has `columns: ColumnSchema[]`

**In authored JSON** (doctype files), `kind` is inferred from structure automatically — you only write the properties that define what the field is:

```json
{ "fieldname": "customer_name", "fieldtype": "Data", "label": "Customer Name", "required": true }
{ "fieldname": "details", "label": "Details", "schema": [...] }
{ "fieldname": "line_items", "label": "Line Items", "columns": [...] }
```

**In TypeScript code** that constructs `DoctypeField` objects directly, `kind` is required:

```typescript
import type { ValueField, FieldsetField, DoctypeField } from '@stonecrop/schema'

const field: ValueField = {
  kind: 'field',
  fieldname: 'customer_name',
  fieldtype: 'Data',
  label: 'Customer Name',
  required: true,
  readOnly: false,
  width: '40ch',
  align: 'left',
}

// Type-specific options
const linkField: ValueField = {
  kind: 'field',
  fieldname: 'customer',
  fieldtype: 'Link',
  label: 'Customer',
  options: 'customer', // Target doctype slug
}

const selectField: ValueField = {
  kind: 'field',
  fieldname: 'status',
  fieldtype: 'Select',
  label: 'Status',
  options: ['Draft', 'Submitted', 'Cancelled'], // Choices array
}

const decimalField: ValueField = {
  kind: 'field',
  fieldname: 'price',
  fieldtype: 'Decimal',
  label: 'Price',
  options: { precision: 10, scale: 2 }, // Config object
}
```

### Doctype Metadata

`DoctypeMeta` defines a complete doctype with fields, links, workflow, and inheritance:

```typescript
import { DoctypeMeta } from '@stonecrop/schema'

const doctype: DoctypeMeta = {
  name: 'Sales Order',
  slug: 'sales-order',
  fields: [
    {
      kind: 'field',
      fieldname: 'customer',
      fieldtype: 'Link',
      label: 'Customer',
      options: 'customer',
      required: true,
    },
    {
      kind: 'field',
      fieldname: 'items',
      fieldtype: 'Link',
      label: 'Items',
      options: 'sales-order-item',
    },
  ],
  links: {
    items: {
      target: 'sales-order-item',
      cardinality: 'noneOrMany',
      backlink: 'sales_order',
      fieldname: 'items',
    },
  },
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

### Link Declarations

`links` on `DoctypeMeta` declares relationships to other doctypes. Each link has a `target`, `cardinality`, and optional `backlink`:

```typescript
import { LinkDeclaration, Cardinality } from '@stonecrop/schema'

// Cardinality values:
// 'one'         — exactly 1 (required pointer)
// 'atMostOne'   — 0 or 1 (optional pointer)
// 'noneOrMany'  — 0 or more (optional collection)
// 'atLeastOne'  — 1 or more (required collection)

const links: Record<string, LinkDeclaration> = {
  // 1:many — ancestor has descendants
  tasks: {
    target: 'recipe-task',
    cardinality: 'noneOrMany',
    backlink: 'recipe', // fieldname on recipe-task that points back
  },
  // Self-referential — version lineage
  supersededBy: {
    target: 'recipe',
    cardinality: 'atMostOne',
    backlink: 'supersededBy',
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

## Client Interfaces

`DataClient` is the interface that any data transport must implement. `GetRecordOptions` and `GetRecordsOptions` are the option types:

```typescript
import type { DataClient, GetRecordOptions, GetRecordsOptions } from '@stonecrop/schema'

// Fetch a record — with optional nested link sub-selections
const record = await client.getRecord({ name: 'Recipe' }, 'r1', {
  includeNested: true, // fetch all descendant links
  maxDepth: 2, // limit recursion depth
})

// Fetch only specific links
const record = await client.getRecord({ name: 'Recipe' }, 'r1', {
  includeNested: ['tasks'], // fetch only the tasks link
})

// Fetch multiple records
const records = await client.getRecords(
  { name: 'Recipe' },
  {
    filters: { status: 'Active' },
    orderBy: 'name',
    limit: 20,
    offset: 0,
  }
)
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
  // TypeScript knows field is DoctypeField (ValueField | FieldsetField | TableField)
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

| Flag                      | Short | Description                                              |
| ------------------------- | ----- | -------------------------------------------------------- |
| `--endpoint <url>`        | `-e`  | Fetch introspection from a live GraphQL endpoint         |
| `--introspection <file>`  | `-i`  | Read from a saved introspection JSON file                |
| `--sdl <file>`            | `-s`  | Read from a GraphQL SDL (`.graphql`) file                |
| `--output <dir>`          | `-o`  | Directory to write doctype JSON files (required)         |
| `--include <types>`       |       | Comma-separated allowlist of type names to generate      |
| `--exclude <types>`       |       | Comma-separated list of type names to skip               |
| `--overrides <file>`      |       | JSON file with per-type, per-field overrides             |
| `--custom-scalars <file>` |       | JSON file mapping custom scalar names to field templates |
| `--include-unmapped`      |       | Retain `_graphqlType` metadata on fields with no mapping |
| `--help`                  | `-h`  | Show help                                                |

### Custom scalars

For servers that use non-standard scalars (e.g. PostGraphile's `BigFloat`, `Datetime`), provide
a JSON mapping file:

```json
{
  "BigFloat": { "component": "ADecimalInput", "fieldtype": "Decimal" },
  "Datetime": { "component": "ADatetimeInput", "fieldtype": "Datetime" }
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
  console.log(`Fields: ${doctype.fields.length}`)
})
```

### Naming Utilities

Convert between different naming conventions:

```typescript
import { snakeToCamel, camelToSnake, snakeToLabel, camelToLabel, toPascalCase, toSlug } from '@stonecrop/schema'

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

- **`@stonecrop/stonecrop`** - Registry uses `DoctypeMeta` for schema storage; `getDescendantLinks()` / `getAncestorLinks()` for relationship traversal
- **`@stonecrop/graphql-client`** - `StonecropClient` implements `DataClient`; uses `GetRecordOptions` / `GetRecordsOptions` for fetch parameters
- **`@stonecrop/aform`** - Renders fields based on `DoctypeField` definitions
- **`@stonecrop/atable`** - Uses `ColumnSchema` for schema-driven column derivation; `TableColumn` (ATable's runtime column type) extends `ColumnSchema`, widening `format`/`modalComponent` to accept live functions and adding `mask`/`originalIndex`
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
import type { ValueField, DoctypeField, DoctypeMeta } from '@stonecrop/schema'

// Types are inferred from Zod schemas
const field: ValueField = {
  kind: 'field',
  fieldname: 'title',
  fieldtype: 'Data',
  // TypeScript will catch typos and missing required fields
}

// Use Zod's infer utility for derived types
import { z } from 'zod'
import { DoctypeFieldSchema } from '@stonecrop/schema'

type DoctypeFieldType = z.infer<typeof DoctypeFieldSchema>
```
