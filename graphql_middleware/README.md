# @stonecrop/graphql-middleware

GraphQL backend for the Stonecrop framework. Reads doctype schemas and exposes them as GraphQL resolvers that handle query construction, response parsing, and action dispatch.

Currently integrated with PostGraphile (to be extracted into a swappable adapter in the future).

## What it does

- **Query construction** — Builds GraphQL queries from doctype metadata, respecting fetch strategies and nesting depth
- **Response merging** — Flattens connection format (`{ nodes: [...] }`) into plain arrays
- **Action dispatch** — Routes doctype actions to registered handlers

## How it works

Doctype schemas declare fields, relationships, and workflow. The middleware uses that schema to:

1. Accept a `doctype` and optional `options` from the client
2. Build a query with field selections and (if `includeNested` is set) nested sub-selections for related records
3. Execute against the GraphQL engine and merge the response
4. Return flat data to the client

The client never constructs queries — it passes `includeNested` through and receives pre-merged results.

## Setup

The middleware is a PostGraphile plugin. It needs an executor to bridge between the middleware's query strings and your GraphQL engine:

```typescript
import {
  createStonecropPreset,
  createStonecropPlugin,
  makePgService,
  loadDoctypes,
  registerBuiltinHandlers,
} from '@stonecrop/graphql-middleware'

// Scan doctype JSON files and register them with the middleware
loadDoctypes('./doctypes')

// Register built-in action handlers (submit, approve, etc.)
registerBuiltinHandlers()

// PostGraphile configuration
const preset: GraphileConfig.Preset = {
  extends: [createStonecropPreset()], // Stonecrop preset (wraps PostGraphile Amber)
  plugins: [createStonecropPlugin()], // Stonecrop GraphQL resolvers
  pgServices: [makePgService({ connectionString: process.env.DATABASE_URL })], // Database connection
}
```

The middleware builds PostGraphile-formatted query strings (e.g., `SalesOrderById`, `SalesOrderItemsBySalesOrderId`). The executor runs them — it doesn't control what queries are constructed.

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

The `links` object declares relationships used when `includeNested` is requested. The `workflow` object enables action dispatch.

### Display-only fields

Fields with `fieldtype: "Display"` are excluded from the auto-generated scalar query. Use this for composite UI components (e.g. a canvas visualisation) that have no backing database column:

```json
{ "fieldname": "planner", "fieldtype": "Display", "component": "Planner", "label": "Resource Planner" }
```

All other non-`Link` fieldtypes are assumed to map to a scalar DB column and are included in the query.

## Architecture

### Why the middleware builds queries

The client (`@stonecrop/graphql-client`) is intentionally transport-only — it sends requests and receives flat data. It never constructs GraphQL queries. All query generation lives in the middleware, which is the only layer aware of PostGraphile naming conventions (inflection).

This boundary exists because PostGraphile's schema naming is configurable. A single application might use `ById` for UUID primary keys, `ByRowId` for `row_id` columns, or entirely custom conventions. If the client hardcoded any of these conventions, it would silently generate wrong queries for any non-default setup. By keeping query construction server-side, the middleware's `StonecropInflectionConfig` becomes the single source of truth.

## Actions

Actions are custom logic triggered by the client. Register handlers with `registerHandler`:

```typescript
registerHandler('submitOrder', async (args, ctx) => {
  const [orderId] = args as [string]
  return { submitted: true }
})
```

The `args` are passed from the client, and `ctx` provides the doctype metadata and GraphQL executor.

## API

The middleware exposes these GraphQL operations:

| Operation | Description |
|-----------|-------------|
| `stonecropRecord(doctype, id, options?)` | Fetch a single record, optionally with nested links |
| `stonecropRecords(doctype, filters?, orderBy?, limit?, offset?, options?)` | Fetch multiple records |
| `stonecropMeta(doctype)` | Fetch doctype metadata |
| `stonecropAllMeta` | Fetch all doctype metadata |
| `stonecropAction(doctype, action, args?)` | Execute a doctype action |

For type signatures and detailed parameters, see [API Reference](./api.md).