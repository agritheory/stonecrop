---
title: Setting Up the GraphQL Middleware
description: How to configure @stonecrop/graphql-middleware in a Nuxt or Node application
---

# Setting Up the GraphQL Middleware

This guide walks through configuring `@stonecrop/graphql-middleware` in a new or existing Nuxt or Node application.

---

## Install the package

```bash
pnpm add @stonecrop/graphql-middleware
```

---

## Minimal setup

```typescript
import {
  createStonecropPreset,
  createStonecropPlugin,
  makePgService,
  loadDoctypes,
} from '@stonecrop/graphql-middleware'

loadDoctypes('./doctypes')

export default {
  extends: [createStonecropPreset()],
  plugins: [createStonecropPlugin()],
  pgServices: [makePgService({ connectionString: process.env.DATABASE_URL })],
}
```

`loadDoctypes` reads JSON doctype definitions from a directory. It must run before the GraphQL schema is built.

---

## Loading doctypes

### From a directory

```typescript
import { loadDoctypes } from '@stonecrop/graphql-middleware'

loadDoctypes('./doctypes')           // relative to process.cwd()
loadDoctypes('/app/config/doctypes') // absolute path
```

### From objects

Useful in tests or when definitions come from an API rather than files on disk. Keys become the doctype `name`, overriding any `name` field in the value:

```typescript
import { loadDoctypesFromObject } from '@stonecrop/graphql-middleware'

loadDoctypesFromObject({
  Customer: {
    fields: [
      { fieldname: 'id', component: 'ATextInput' },
      { fieldname: 'name', component: 'ATextInput' },
    ],
  },
})
```

---

## Configuring the preset

`createStonecropPreset` extends PostGraphile's Amber preset with Stonecrop defaults.

### Identity naming

Amber gives Relay's global object identifier the field name `id`, and moves any real column called
`id` out of the way to `rowId`. Stonecrop can use neither name: the middleware resolves columns with
raw SQL, so `id` would be an opaque base64 node id with no column behind it, and `rowId` would name a
`row_id` column that does not exist.

The preset therefore moves Relay's identifier to `nodeId` and leaves your `id` column named `id`:

```graphql
type Uom {          # keyed on `code`, no `id` column
  nodeId: ID!       # Relay's identifier — still available
  code: String!
  uomName: String!
}
```

This is applied unconditionally — a doctype generated against the un-overridden schema declares
`primaryKey` on the node id, and every read of it then fails on a missing column. Relay is not
disabled; `node(nodeId: …)` still resolves.

### Field casing

By default, PostgreSQL column names are converted to camelCase in GraphQL (`my_column` → `myColumn`). Switch to PascalCase with:

```typescript
createStonecropPreset({ fieldCasing: 'pascal' })
// my_column → MyColumn
```

If your database columns are already camelCase, or you use `@name` smart tags on your column comments, the default is fine.

### Using the preset constant directly

When you don't need to customise any options, import `StonecropPreset` instead of calling the function:

```typescript
import { StonecropPreset } from '@stonecrop/graphql-middleware'

export default {
  extends: [StonecropPreset],
  // ...
}
```

---

## Configuring the plugin

`createStonecropPlugin` extends the GraphQL schema with the `stonecropRecord`, `stonecropRecords`, `stonecropMeta`, `stonecropAllMeta`, and `stonecropAction` fields.

### Primary key

The primary key is declared per doctype, not globally — mark the identifying field with `primaryKey: true` in the doctype's `fields`. The middleware detects it via `meta.fields.find(f => f.primaryKey)`:

```json
{ "fieldname": "id", "component": "ATextInput", "primaryKey": true }
```

A doctype with no `primaryKey` field cannot be fetched by id — `stonecropRecord` returns `{ data: null }` — but still supports list/filter/sort via `stonecropRecords`. The plugin compares primary keys using text equality (`pkColumn::text = $1`), so the GraphQL `id: String!` argument works with any underlying column type — `integer`, `uuid`, `text`, or `bigint`.

### Table name

By default the PostgreSQL `FROM` target is `camelToSnake(doctype.name)`. Override it per doctype with the `tables` option — for a doctype that projects a shared table, or a schema-qualified name:

```typescript
createStonecropPlugin({ tables: { Planner: 'plan', Invoice: 'billing.invoice' } })
```

### orderBy format

The `stonecropRecords` field accepts an `orderBy: String` argument. The format is `FIELD_DIRECTION` (underscore-separated), where direction must be `ASC` or `DESC`:

```graphql
# Correct
stonecropRecords(doctype: "Invoice", orderBy: "status_ASC")

# For columns with underscores in their name, the LAST underscore separates field and direction
stonecropRecords(doctype: "Invoice", orderBy: "created_at_DESC")
```

---

## Configuring the database connection

`makePgService` is re-exported from `postgraphile/adaptors/pg`. The most common configuration:

```typescript
makePgService({ connectionString: process.env.DATABASE_URL })
```

To restrict introspection to a specific schema:

```typescript
makePgService({
  connectionString: process.env.DATABASE_URL,
  schemas: ['public'],
})
```

---

## Complete example

```typescript
import {
  createStonecropPreset,
  createStonecropPlugin,
  makePgService,
  loadDoctypes,
} from '@stonecrop/graphql-middleware'

loadDoctypes('./doctypes')

export default {
  extends: [createStonecropPreset()],
  plugins: [createStonecropPlugin()],
  pgServices: [
    makePgService({
      connectionString: process.env.DATABASE_URL,
      schemas: ['public'],
    }),
  ],
}
```

---

## Using with Nuxt

When using `@stonecrop/nuxt-grafserv`, the zero-config path (`type: 'postgraphile'` with no `preset` option) synthesises the PostGraphile preset automatically from `DATABASE_URL`. You do not need a separate preset file.

Doctype registration must still happen before any GraphQL request executes. The right place in a Nuxt app is a Nitro server plugin, which runs at server startup:

```typescript
// server/plugins/stonecrop.ts
import { loadDoctypesFromObject } from '@stonecrop/graphql-middleware'
import userDoctype from '../doctypes/user.json'
import orderDoctype from '../doctypes/order.json'

export default defineNitroPlugin(() => {
  loadDoctypesFromObject({ User: userDoctype, Order: orderDoctype })
})
```

With `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    type: 'postgraphile',
    url: '/graphql/',
    graphiql: true,
  },
})
```

Nuxt picks up any file in `server/plugins/` automatically — no registration step needed. The plugin runs once when the Nitro server initialises, before the first request reaches the GraphQL endpoint.

If you need a custom preset (additional PostGraphile plugins, non-standard connection settings), create `server/graphile.preset.ts` and reference it with the `preset` option. In that case `loadDoctypes` can be called at the top of the preset file instead of in a Nitro plugin, since the preset is imported at schema-build time.
