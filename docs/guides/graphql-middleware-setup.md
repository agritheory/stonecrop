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
  registerBuiltinHandlers,
} from '@stonecrop/graphql-middleware'

loadDoctypes('./doctypes')
registerBuiltinHandlers()

export default {
  extends: [createStonecropPreset()],
  plugins: [createStonecropPlugin()],
  pgServices: [makePgService({ connectionString: process.env.DATABASE_URL })],
}
```

`loadDoctypes` reads JSON doctype definitions from a directory. `registerBuiltinHandlers` registers Stonecrop's built-in action handlers. Both calls should happen before the GraphQL schema is built.

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
      { fieldname: 'id', fieldtype: 'Data' },
      { fieldname: 'name', fieldtype: 'Data' },
    ],
  },
})
```

---

## Configuring the preset

`createStonecropPreset` extends PostGraphile's Amber preset with Stonecrop defaults.

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

### Primary key column

The plugin defaults to `id` as the primary key column for all record lookups:

```typescript
createStonecropPlugin()                    // uses "id"
createStonecropPlugin({ pkField: 'uuid' }) // uses "uuid"
```

Override `pkField` only if all your tables use a different primary key column name. This is a global setting; per-table overrides are not supported.

The plugin compares primary keys using text equality (`pkColumn::text = $1`), so the GraphQL `id: String!` argument works with any underlying column type — `integer`, `uuid`, `text`, or `bigint`.

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
  registerBuiltinHandlers,
} from '@stonecrop/graphql-middleware'

loadDoctypes('./doctypes')
registerBuiltinHandlers()

export default {
  extends: [createStonecropPreset()],
  plugins: [createStonecropPlugin({ pkField: 'id' })],
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

Doctype registration and handler setup must still happen before any GraphQL request executes. The right place in a Nuxt app is a Nitro server plugin, which runs at server startup:

```typescript
// server/plugins/stonecrop.ts
import { loadDoctypesFromObject, registerBuiltinHandlers } from '@stonecrop/graphql-middleware'
import userDoctype from '../doctypes/user.json'
import orderDoctype from '../doctypes/order.json'

export default defineNitroPlugin(() => {
  loadDoctypesFromObject({ User: userDoctype, Order: orderDoctype })
  registerBuiltinHandlers()
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
