# @stonecrop/graphql-middleware

GraphQL backend for the Stonecrop framework. Reads doctype schemas and exposes them as Grafast plan resolvers backed by PostGraphile's pgResources.

## What it does

- **Plan execution** — Uses PostGraphile's pgResources to build and execute SQL queries natively via Grafast plan steps
- **Action dispatch** — Routes doctype actions to registered handlers

## How it works

Doctype schemas declare fields, relationships, and workflow. The middleware uses that schema to:

1. Accept a `doctype` and `id` from the client
2. Resolve the record using the pgResource's native get plan step
3. Return flat data to the client

The client never constructs queries.

## Setup

The middleware is a PostGraphile plugin:

```typescript
import { createServer } from 'postgraphile/grafserv/h3/v1'
import { createStonecropPreset, makePgService, createStonecropPlugin, loadDoctypes, registerBuiltinHandlers } from '@stonecrop/graphql-middleware'

loadDoctypes('./doctypes')
registerBuiltinHandlers()

const preset = createStonecropPreset()
preset.plugins = [createStonecropPlugin()]
preset.pgServices = [makePgService({ connectionString: process.env.DATABASE_URL })]
```

## Doctype Schemas

The middleware loads doctype definitions from JSON files. Each file defines a doctype's structure:

```json
{
  "name": "SalesOrder",
  "tableName": "sales_orders",
  "fields": [
    { "fieldname": "id", "fieldtype": "UUID" },
    { "fieldname": "status", "fieldtype": "Select" }
  ],
  "links": {
    "items": {
      "target": "sales-order-item",
      "cardinality": "noneOrMany",
      "backlink": "sales_order"
    }
  },
  "workflow": {
    "states": ["Draft", "Submitted"],
    "actions": {
      "submit": { "label": "Submit", "handler": "submitOrder" }
    }
  }
}
```

## Actions

Actions are custom logic triggered by the client. Register handlers with `registerHandler`:

```typescript
registerHandler('submitOrder', async (args, ctx) => {
  const [orderId] = args as [string]
  return { submitted: true }
})
```

The `args` are passed from the client, and `ctx` provides the doctype metadata.

## API

The middleware exposes these GraphQL operations:

| Operation | Description |
|-----------|-------------|
| `stonecropRecord(doctype, id)` | Fetch a single record |
| `stonecropRecords(doctype, filters?, orderBy?, limit?, offset?)` | Fetch multiple records |
| `stonecropMeta(doctype)` | Fetch doctype metadata |
| `stonecropAllMeta` | Fetch all doctype metadata |
| `stonecropAction(doctype, action, args?)` | Execute a doctype action |

For type signatures and detailed parameters, see [API Reference](./api.md).
