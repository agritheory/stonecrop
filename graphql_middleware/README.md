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

`createStonecropPreset()` makes three changes to the schema PostGraphile would otherwise build:

- It moves Relay's global identifier to `nodeId`, so a real `id` column keeps its own name.
- It exposes the many side of any foreign key declared `ON DELETE CASCADE`, so a parent type carries a collection field for the rows it owns and `stonecrop-schema generate` can turn that into a child table. A foreign key without a cascade is a reference, not ownership, and stays one-directional.
- It turns off the mutations Amber generates, a create, update and delete for every table and one for every `VOLATILE` database function, so `stonecropAction` is the only write the API offers.

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
| `{ "method": "lazy" }` | Link is absent from the response; client retrieves it via `stonecropRecord` with `includeNested` naming the link |
| `{ "method": "custom", "handler": "myHandler" }` | Calls a registered fetch handler (see below) |

When `fetch` is omitted, `noneOrMany`/`atLeastOne` links default to `sync` (limit 200, the `defaultRecordLimit`) and `atMostOne`/`one` links default to `lazy`.

### Link order

A `noneOrMany`/`atLeastOne` link reads its rows in identity order: by the target's field marked `primaryKey`, or else its field named `id`. A target with neither reads in no fixed order, and a capped read of it can keep different rows each time. Rows that keep their own position, such as an order's lines, name it with `orderBy`: a field of the target doctype with a database column, ascending unless `direction` is `desc`:

```json
"items": {
  "target": "sales-order-item",
  "cardinality": "noneOrMany",
  "backlink": "salesOrderId",
  "orderBy": { "fieldname": "rowOrder" }
}
```

Values compare as the column's own type, the target's identity breaks ties when it has one, and a capped link keeps the head of this order. Rows with no value in the order field come last ascending and first descending, as Postgres orders them. Ordering by a `json` field fails in Postgres, which has no order for that type (`jsonb` sorts).

A malformed `orderBy` is refused when the doctype loads. Building the schema refuses one naming a field the target lacks or a field with no column, and an `orderBy` on a one-side link, which reads one row. For a doctype loaded after the schema is built, a many-side link's field is checked when the record is read, and a one-side link's `orderBy` is ignored.

A `lazy` link reads in the same order when the client loads it, through `stonecropRecord` with `includeNested`. A `custom` many-side link hands its rows to its handler, which applies `orderBy` itself if it uses it; its field is not checked.

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

The `stonecropAction(doctype, action, args)` mutation dispatches through `applyGuardedTransition`: it reads the record's `status`, rejects the action if the current state is not in `allowedStates` (`isActionAllowedInState`), then writes `nextState`. The record is identified by `args[0].id`. A self-transition (`selfTransition: true`) keeps the state and writes the record's data instead: the Postgres adapter sets each declared field that has a column and whose value differs from the stored record, encoding a JSON, list, range or composite value in the shape its read serves (a string for a JSON column is JSON text), and refuses a value of the wrong shape, naming the field ([ADR 0011](docs/decisions/0011-save-writes-what-changed.md)). It never sets `status`, a column the database fills itself (a generated column, or an identity generated always) or a linked record sent for a link's key, and lists each key it left out in `droppedFields`. When a server-side handler is registered for the self-transition (`actionHandlers`), the handler does that write instead, creating the record too, and must return the record it saved.

An action against a record that does not exist is reported as such, before the guard runs. This depends on the backend distinguishing the two things `undefined` used to mean — `GuardedTransitionIO.readState` returns `null` for a lookup that missed, and `undefined` only for a row that exists with no workflow state. A backend that returns `undefined` for both makes a bad id look like a workflow violation, or, when the action declares no `allowedStates`, makes it look like a success.

### Creating a record

There is no create mutation, no create action, and no separate create write. **Saving a record not created yet creates it**, because "persist this record's data" is one request whether or not the row is there yet. `GuardedTransitionIO.writeData` is an upsert: it receives an `exists` flag the dispatcher already knows, having read the record's state to run the guard. A backend that omits `writeData` declines both saving and creating, unless server code is registered for the Save (`runEffect`), which then does both; the Postgres adapter and the two nuxt hosts implement it.

A Save sent with an id that matches no record is not a create: the record was deleted since the client read it, and creating it would report a lost update as a success. For a self-transition, `readState` throws in that case instead of returning `null`, so nothing is created.

`allowedStates` is deliberately not consulted on creation — it constrains movement between states, and a record being created is not in one. Its initial state is the backend's to set. Only a self-transition creates: a `nextState` transition against a missing record is a bad id, not a request to create one.

Identity belongs to `writeData`, or to a Save's handler when one is registered, not the dispatcher. Read the declared `primaryKey` out of the submitted data for a natural-keyed doctype — that value is a field the user filled in — and mint one only when the doctype is surrogate-keyed. The New Record flow dispatches with **no** `id` in the envelope, because an unsaved record has no identity to send; the created record comes back carrying the one the backend assigned.

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

`stonecropRecords` accepts `orderBy` as `FIELD_ASC` or `FIELD_DESC` (e.g. `"status_ASC"`). The field must be one of the doctype's fields with a database column, checked before it reaches the SQL; values compare as the column's own type, and identity breaks ties. Without `orderBy`, a list reads in identity order. A doctype with no identity has nothing to break ties with: rows tied on the named field, or every row when none is named, come in no fixed order, so its pages can skip or repeat rows.

For full type signatures see [API Reference](./api.md).
