# @stonecrop/graphql-middleware

GraphQL backend for the Stonecrop framework. Reads doctype schemas and exposes them as PostGraphile plan-step resolvers that handle record fetching, fetch-strategy dispatch, and action execution.

## What it does

- **Record fetching** — Resolves `stonecropRecord` and `stonecropRecords` via direct parameterised SQL, batched via `loadOneWithPgClient` from `@dataplan/pg`
- **Fetch-strategy dispatch** — For `stonecropRecord`, iterates `meta.links` and applies `sync` / `lazy` / `custom` strategies; sync links issue additional SQL and merge results into the record; lazy links are absent from the response
- **Action dispatch** — Runs a doctype's declared `workflow.actions` as guarded state transitions (`applyGuardedTransition`) via `sideEffectWithPgClient`
- **Preset** — `createStonecropPreset()` wraps `PostGraphileAmberPreset` so user apps never import from PostGraphile directly

## Setup

```typescript
import {
  createStonecropPreset,
  createStonecropPlugin,
  makePgService,
  loadDoctypes,
} from '@stonecrop/graphql-middleware'

loadDoctypes('./doctypes')

const preset: GraphileConfig.Preset = {
  extends: [createStonecropPreset()],
  plugins: [createStonecropPlugin()],
  pgServices: [makePgService({ connectionString: process.env.DATABASE_URL })],
}
```

`createStonecropPlugin()` discovers the `PgExecutor` automatically from `pgServices` — no executor argument is needed. An optional `StonecropPluginOptions` object accepts:

| Option | Default | Description |
|--------|---------|-------------|
| `debug` | `false` | Log SQL run inside custom `loadOneWithPgClient` callbacks (prefixed `[@stonecrop/graphql-middleware]`) |
| `tables` | `{}` | Override the PostgreSQL `FROM` target per doctype (name → table; bare `'plan'` or schema-qualified `'orpin.plan'`). Defaults to `camelToSnake(name)`. |

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
      "submit": { "label": "Submit", "allowedStates": ["Draft"], "nextState": "Submitted" }
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

Actions are declared per doctype in `workflow.actions`. Each action names the states it may run from (`allowedStates`) and the state the record moves to (`nextState`):

```json
"workflow": {
  "states": ["Draft", "Submitted", "Cancelled"],
  "actions": {
    "submit": { "label": "Submit", "allowedStates": ["Draft"], "nextState": "Submitted" },
    "cancel": { "label": "Cancel", "allowedStates": ["Draft", "Submitted"], "nextState": "Cancelled" }
  }
}
```

The `stonecropAction(doctype, action, args)` mutation dispatches through `applyGuardedTransition`: it reads the record's `status`, rejects the action if the current state is not in `allowedStates` (`isActionAllowedInState`), then writes `nextState`. The record is identified by `args[0].id`. Self-transitions (`selfTransition: true`) have no state target and no data-write path on this backend, so they are rejected rather than silently succeeding.

### Server-side effects

A doctype can express two outcomes — a `nextState` transition and a `selfTransition` data write — and nothing else. An action that is neither, a stateless command like `Recalculate Total`, has nothing for the dispatcher to apply and fails loudly. Register an effect to give it one:

```typescript
createStonecropPlugin({
  actionHandlers: {
    Order: {
      async recalculateTotal({ pgClient, recordId }) {
        const { rows } = await pgClient.query({
          text: 'UPDATE "order" SET total = (SELECT COALESCE(SUM(amount), 0) FROM order_item WHERE order_id = $1) WHERE id = $1 RETURNING *',
          values: [recordId],
        })
        return rows[0] // becomes the client's writeback payload
      },
    },
  },
})
```

Handlers are keyed `[doctype name][action key]`, and **the doctype never names one**. The two are authored by different people: a doctype is runtime data edited in DocBuilder by whoever models the workflow, while handlers run behind the GraphQL surface and belong to whoever owns the database. So the doctype keeps the guard (`allowedStates`, `nextState`) and the adapter keeps the effect — the routing between them is resolved on the server and never published to the client.

The guard always runs first, so a handler is never the thing that grants permission. It then runs before any state is written: throwing rejects the action and the record does not move. An action may carry both a handler and a `nextState`, in which case both apply.

Handler return values are API-layer data — camelCase fieldname keys, per [ADR 0007](docs/decisions/0007-handler-result-casing-documentation-over-mechanism.md). Raw `pgClient.query()` rows carry snake_case column names; alias them in SQL or convert with `snakeToCamel` from `@stonecrop/schema`.

`context.data` is the record data the client sent. `args` is an opaque `JSON` scalar that nothing validates, so treat it as untrusted input: parameterize it into SQL and whitelist the fields the action may touch.

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
