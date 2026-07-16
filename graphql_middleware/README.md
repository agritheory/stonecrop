# @stonecrop/graphql-middleware

GraphQL backend for the Stonecrop framework. Reads doctype schemas and exposes them as PostGraphile plan-step resolvers that handle record fetching, fetch-strategy dispatch, and action execution.

## What it does

- **Record fetching** — Resolves `stonecropRecord` and `stonecropRecords` via direct parameterised SQL, batched via `loadOneWithPgClient` from `@dataplan/pg`
- **Fetch-strategy dispatch** — For `stonecropRecord`, iterates `meta.links` and applies `sync` / `lazy` / `custom` strategies; sync links issue additional SQL and merge results into the record; lazy links are absent from the response
- **Action dispatch** — Routes doctype actions to registered handlers via `sideEffectWithPgClient`
- **Preset** — `createStonecropPreset()` wraps `PostGraphileAmberPreset` so user apps never import from PostGraphile directly

## Setup

```typescript
import {
  createStonecropPreset,
  createStonecropPlugin,
  makePgService,
  loadDoctypes,
  registerBuiltinHandlers,
} from '@stonecrop/graphql-middleware'

loadDoctypes('./doctypes')
registerBuiltinHandlers()

const preset: GraphileConfig.Preset = {
  extends: [createStonecropPreset()],
  plugins: [createStonecropPlugin()],
  pgServices: [makePgService({ connectionString: process.env.DATABASE_URL })],
}
```

`createStonecropPlugin()` discovers the `PgExecutor` automatically from `pgServices` — no executor argument is needed. An optional `StonecropPluginOptions` object accepts:

| Option | Default | Description |
|--------|---------|-------------|
| `pkField` | `'id'` | Primary key column name for record lookups |

## Debugging

### Nuxt module shortcut

When using `@stonecrop/nuxt-grafserv`, set `debug: true` in `nuxt.config.ts` to enable all development aids at once:

```typescript
export default defineNuxtConfig({
  grafserv: {
    type: 'postgraphile',
    debug: true,
  },
})
```

`debug: true` automatically:
- Enables the **Ruru Explain** tab (`grafast.explain`) to inspect Grafast plan steps and generated SQL
- Injects `createDebugPlugin()` to log Stonecrop resolver plan construction
- Configures `grafserv.maskError` using PostGraphile's recommended pattern: logs every error server-side, returns `GraphQLError` and safe errors directly, and masks unknown errors with a SHA-1 hash

**Never enable `debug` in production** — it exposes query internals and detailed error messages to clients.

### Custom preset

If you manage your own preset file, import the debug plugin directly:

```typescript
import { createStonecropPlugin, createDebugPlugin } from '@stonecrop/graphql-middleware'

export default {
  plugins: [createStonecropPlugin(), createDebugPlugin()],
  grafast: { explain: true },
}
```

### Environment variables

PostGraphile's native `DEBUG` variables still work alongside Stonecrop's debug plugin:

| Variable | What it shows |
|----------|---------------|
| `DEBUG="@dataplan/pg:PgExecutor"` | SQL queries executed by plan steps |
| `DEBUG="@dataplan/pg:PgExecutor:explain"` | SQL plus `EXPLAIN` output |
| `DEBUG="graphile-build:warn"` | Warnings during schema construction |
| `DEBUG="graphile-build:SchemaBuilder"` | Hook execution order during schema build |

```bash
DEBUG="@dataplan/pg:PgExecutor:explain,graphile-build:warn" node server.js
```

## Doctype Schemas

Each doctype JSON file defines structure, relationships, and workflow:

```json
{
  "name": "SalesOrder",
  "fields": [
    { "fieldname": "id", "component": "ATextInput" },
    { "fieldname": "status", "component": "ADropdown" }
  ],
  "links": {
    "items": {
      "target": "sales-order-item",
      "cardinality": "noneOrMany",
      "backlink": "sales_order_id",
      "fetch": { "method": "sync", "limit": 100 }
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

### Fetch strategies

Each entry in `links` can declare a `fetch` strategy:

| Strategy | Behaviour |
|----------|-----------|
| `{ "method": "sync", "limit": N }` | Linked records are fetched in the same resolver call and merged into `data` |
| `{ "method": "lazy" }` | Link is absent from the response; client retrieves it via `stonecropRecords` with `filters` |
| `{ "method": "custom", "handler": "myHandler" }` | Calls a registered fetch handler (see below) |

When `fetch` is omitted, `noneOrMany`/`atLeastOne` links default to `sync` (limit 50) and `atMostOne`/`one` links default to `lazy`.

### Display-only fields

Fields with `computed: true` have no backing database column and are excluded from all SQL queries:

```json
{ "fieldname": "planner", "component": "Planner", "computed": true, "label": "Resource Planner" }
```

## Actions

Register action handlers with `registerHandler`. Handlers receive the action arguments and an `ActionContext` that includes the active `PgClient`:

```typescript
import { registerHandler } from '@stonecrop/graphql-middleware'

registerHandler('submitOrder', async (args, ctx) => {
  const [orderId] = args as [string]
  // ctx.pgClient is available for additional database work
  return { submitted: true }
})
```

## Custom fetch handlers

Register custom fetch handlers for links that use `{ "method": "custom" }`:

```typescript
import { registerFetchHandler } from '@stonecrop/graphql-middleware'

registerFetchHandler('loadLineItems', async (pgClient, parentRecord, link) => {
  // Returns a single record or an array depending on link.cardinality
  const { rows } = await pgClient.query(...)
  return rows
})
```

## API

| Operation | Description |
|-----------|-------------|
| `stonecropRecord(doctype, id, options?)` | Fetch a single record; `options.includeNested` controls which links are resolved |
| `stonecropRecords(doctype, filters?, orderBy?, limit?, offset?)` | Fetch a list with optional filtering and ordering |
| `stonecropMeta(doctype)` | Fetch doctype metadata |
| `stonecropAllMeta` | Fetch all registered doctype metadata |
| `stonecropAction(doctype, action, args?)` | Execute a doctype action |

`stonecropRecords` accepts `orderBy` as `FIELD_ASC` or `FIELD_DESC` (e.g. `"status_ASC"`). The field name is validated against the doctype's known fields before interpolation.

For full type signatures see [API Reference](./api.md).
