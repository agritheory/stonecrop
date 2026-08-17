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

An action against a record that does not exist is reported as such, before the guard runs. This depends on the backend distinguishing the two things `undefined` used to mean — `GuardedTransitionIO.readState` returns `null` for a lookup that missed, and `undefined` only for a row that exists with no workflow state. A backend that returns `undefined` for both makes a bad id look like a workflow violation, or, when the action declares no `allowedStates`, makes it look like a success.

### Creating a record

There is no create mutation, no create action, and no separate create write. **Saving a record that does not exist creates it**, because "persist this record's data" is one request whether or not the row is there yet. `GuardedTransitionIO.writeData` is an upsert: it receives an `exists` flag the dispatcher already knows, having read the record's state to run the guard. A backend that omits `writeData` declines both saving and creating, which is the Postgres adapter's position today; the two nuxt hosts implement it.

`allowedStates` is deliberately not consulted on creation — it constrains movement between states, and a record being created is not in one. Its initial state is the backend's to set. Only a self-transition creates: a `nextState` transition against a missing record is a bad id, not a request to create one.

Identity belongs to `writeData`, not the dispatcher. Read the declared `primaryKey` out of the submitted data for a natural-keyed doctype — that value is a field the user filled in — and mint one only when the doctype is surrogate-keyed. The New Record flow dispatches with **no** `id` in the envelope, because an unsaved record has no identity to send; the created record comes back carrying the one the backend assigned.

A `writeData` that only knows how to patch will match no row and return nothing. The dispatcher treats an empty return on the create path as exactly that and fails loudly, rather than letting a save that stored nothing report success.

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
