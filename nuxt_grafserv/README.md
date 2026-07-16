# Nuxt Grafserv

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

Pluggable Grafserv GraphQL server as a Nuxt Module. Uses the Grafast execution engine for high-performance GraphQL.

## Features

- 🚀 &nbsp;Grafserv Server Integration
- ⚡️ &nbsp;Grafast Execution Engine (faster than [`graphql-js`](https://github.com/graphql/graphql-js))
- 🔄 &nbsp;Schema Stitching Support
- 🔍 &nbsp;Graphile Preset System for Advanced Configuration
- 📝 &nbsp;TypeScript Support
- 🔍 &nbsp;GraphiQL/Ruru Interface
- ⚡️ &nbsp;Hot Module Reloading
- 🎯 &nbsp;Separate Route Handlers for GraphQL/UI and Static Assets

## Architecture

This module uses modern Grafserv patterns with three key components:

1. **Preset-Based Configuration**: Leverages Graphile's preset system for extensibility and plugin support
2. **Separate Route Handlers**: Two dedicated handlers for GraphQL operations/UI and static assets
3. **Objects Structure**: Uses Grafast's modern `objects/interfaces/enums` schema building pattern for better type safety

The module automatically registers these handlers:
- `{url}` - Unified GraphQL operations and Ruru UI endpoint
- `/ruru-static/**` - Static assets for the Ruru IDE

## Quick Setup

### PostGraphile Integration (Recommended)

For PostGraphile users, this is the recommended configuration approach:

1. Add dependencies:

```bash
# Using pnpm
pnpm add @stonecrop/nuxt-grafserv

# Using yarn
yarn add @stonecrop/nuxt-grafserv

# Using npm
npm install @stonecrop/nuxt-grafserv
```

2. Set `DATABASE_URL` in your environment (`.env` or shell):

```
DATABASE_URL=postgresql://localhost/mydb
```

3. Configure in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    type: 'postgraphile', // Required: specify configuration type
    url: '/graphql',
    graphiql: true,
    // fieldCasing: 'pascal',        // optional — defaults to 'camel'
    // schemas: ['public', 'auth'],  // optional — defaults to ['public']
    // explain: true,                // optional — enables Ruru Explain tab (dev only)
  }
})
```

For custom plugins, a non-standard connection, or advanced configuration, create a preset file:

```ts
// server/graphile.preset.ts
import { createStonecropPreset, makePgService, createStonecropPlugin } from '@stonecrop/graphql-middleware'

export default {
  extends: [createStonecropPreset()],
  pgServices: [
    makePgService({
      connectionString: process.env.DATABASE_URL,
      schemas: ['public'],
    }),
  ],
  plugins: [createStonecropPlugin(), MyCustomPlugin],
}
```

Then reference it in `nuxt.config.ts`:

```ts
grafserv: {
  type: 'postgraphile',
  preset: './server/graphile.preset.ts',
}
```

### Custom Schema Configuration

For custom GraphQL schemas with your own resolvers:

1. Add dependency:

```bash
pnpm add @stonecrop/nuxt-grafserv
```

2. Configure in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    type: 'schema', // Required: specify configuration type
    schema: 'server/**/*.graphql',
    resolvers: 'server/resolvers.ts',
    url: '/graphql',
    graphiql: true,
  }
})
```

## Configuration

The module supports two configuration types using a discriminated union pattern:

### PostGraphile Configuration

Use `type: 'postgraphile'` for PostGraphile-based GraphQL APIs:

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | `'postgraphile'` | ✅ | Configuration type discriminator |
| `preset` | `string` | ❌ | Path to preset file. When omitted, a default preset is synthesized from `DATABASE_URL`. |
| `fieldCasing` | `'camel' \| 'pascal'` | ❌ | Column → field name casing (default: `'camel'`). Ignored when `preset` is set. |
| `schemas` | `string[]` | ❌ | PostgreSQL schemas to expose (default: `['public']`). Ignored when `preset` is set. |
| `explain` | `boolean` | ❌ | Enable Ruru Explain tab. **Never use in production.** Ignored when `preset` is set. |
| `url` | `string` | ❌ | GraphQL endpoint URL (default: `/graphql/`) |
| `graphiql` | `boolean` | ❌ | Serve the Ruru GraphiQL IDE and its static assets. Defaults to `true` in development and `false` in production. |

**Minimal example (no preset file):**

```ts
// nuxt.config.ts — DATABASE_URL is read from process.env automatically
export default defineNuxtConfig({
  grafserv: {
    type: 'postgraphile',
    url: '/graphql/',
    graphiql: true,
  }
})
```

**Explicit preset file (for custom plugins and advanced configuration):**

```ts
// server/graphile.preset.ts
import { createStonecropPreset, makePgService, createStonecropPlugin } from '@stonecrop/graphql-middleware'

export default {
  extends: [createStonecropPreset()],
  pgServices: [
    makePgService({
      connectionString: process.env.DATABASE_URL,
      schemas: ['public'],
    }),
  ],
  plugins: [createStonecropPlugin(), MyCustomPlugin],
}
```

### Schema Configuration

Use `type: 'schema'` for custom GraphQL schemas with Grafast resolvers:

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | `'schema'` | ✅ | Configuration type discriminator |
| `schema` | `string \| string[] \| SchemaProvider` | ✅ | Path(s) to .graphql files or schema provider function |
| `resolvers` | `string` | ❌ | Path to resolvers file (required for .graphql files) |
| `url` | `string` | ❌ | GraphQL endpoint URL (default: `/graphql/`) |
| `graphiql` | `boolean` | ❌ | Serve the Ruru GraphiQL IDE and its static assets. Defaults to `true` in development and `false` in production. |

**Example with files:**

```ts
export default defineNuxtConfig({
  grafserv: {
    type: 'schema',
    schema: 'server/**/*.graphql',
    resolvers: 'server/resolvers.ts',
    url: '/graphql/',
  }
})
```

**Example with schema provider function:**

```ts
export default defineNuxtConfig({
  grafserv: {
    type: 'schema',
    schema: async () => {
      // Return a GraphQLSchema instance
      return myCustomSchema
    },
  }
})
```

### Configuration Comparison

| Feature | PostGraphile Config | Schema Config |
|---------|---------------------|---------------|
| Type discriminator | `type: 'postgraphile'` | `type: 'schema'` |
| Schema source | Generated from preset | Files or function |
| Resolvers | Auto-generated by PostGraphile | Must provide via resolvers file |
| Primary use case | PostgreSQL-backed APIs | Custom GraphQL APIs |
| Setup complexity | Minimal (DB connection only) | Moderate (schema + resolvers) |
| Plugin system | PostGraphile plugins | Grafast standard steps |

## Basic Usage

### Schema Configuration Example

For custom schemas with resolvers:

1. Create your GraphQL schema (`server/schema.graphql`):

```graphql
type Query {
  hello: String!
  ping: Boolean!
}

type Mutation {
  echo(message: String!): String!
}
```

2. Create your resolvers (`server/resolvers.ts`):

```typescript
import { constant, lambda, type GrafastSchemaConfig } from 'grafast'

const resolvers: GrafastSchemaConfig['objects'] = {
  Query: {
    plans: {
      hello: () => constant('world'),
      ping: () => constant(true)
    }
  },
  Mutation: {
    plans: {
      echo: (_source, fieldArgs) => {
        const { $message } = fieldArgs
        return $message
      }
    }
  }
}

export default resolvers
```

3. Configure Nuxt:

```ts
export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    type: 'schema',
    schema: 'server/schema.graphql',
    resolvers: 'server/resolvers.ts',
  }
})
```

### PostGraphile Configuration Example

For database-backed GraphQL APIs:

1. Create your preset file `server/graphile.preset.ts`:

```ts
import { createStonecropPreset, makePgService } from '@stonecrop/graphql-middleware'

const preset = {
  extends: [createStonecropPreset()],
  pgServices: [
    makePgService({
      connectionString: process.env.DATABASE_URL,
      schemas: ['public'],
    }),
  ],
}

export default preset
```

2. Configure PostGraphile in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    type: 'postgraphile',
    preset: './server/graphile.preset.ts',
  }
})
```

3. That's it! PostGraphile automatically generates your GraphQL schema from your PostgreSQL database.

## Advanced Usage

### Custom Grafserv Plugins

Add custom plugins for authentication, logging, or rate limiting through your preset file:

```ts
// server/graphile/plugins.ts
import type { GraphileConfig } from 'graphile-config'

const loggingPlugin: GraphileConfig.Plugin = {
  name: 'request-logging',
  version: '1.0.0',
  grafserv: {
    middleware: {
      processGraphQLRequestBody: async (next, event) => {
        console.log('Processing:', event.request.url)
        return next()
      }
    }
  }
}

const authPlugin: GraphileConfig.Plugin = {
  name: 'authentication',
  version: '1.0.0',
  grafserv: {
    middleware: {
      processGraphQLRequestBody: async (next, event) => {
        const token = event.request.headers.get('authorization')
        // Validate token and add user to context
        if (!token) {
          throw new Error('Unauthorized')
        }
        return next()
      }
    }
  }
}

export default [loggingPlugin, authPlugin]
```

Import the plugins in your preset:

```ts
// server/graphile/graphile.preset.ts
import { createStonecropPreset, makePgService } from '@stonecrop/graphql-middleware'
import plugins from './plugins'

const preset = {
  extends: [createStonecropPreset()],
  pgServices: [makePgService({ /* ... */ })],
  plugins
}

export default preset
```

#### Available Middleware Hooks

These are hooks provided by the `grafserv` package itself via the Graphile preset system — they are not specific to `@stonecrop/nuxt-grafserv`. The hook used in the example above (`processGraphQLRequestBody`) is the most common entry point. For the full list of available hooks, refer to the [Grafserv documentation](https://grafast.org/grafserv/).

## PostGraphile Integration

PostGraphile v5+ automatically generates your GraphQL schema from PostgreSQL. When using a custom preset file (`preset` option), you have access to all PostGraphile preset keys — these are PostGraphile features, not Stonecrop-specific ones.

### With Community Plugins

Third-party PostGraphile plugins can be added via the `plugins` array in a custom preset file:

```typescript
// server/graphile.preset.ts
import { createStonecropPreset, makePgService, createStonecropPlugin } from '@stonecrop/graphql-middleware'
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector'

export default {
  extends: [createStonecropPreset()],
  plugins: [createStonecropPlugin(), PgSimplifyInflectorPlugin],
  pgServices: [
    makePgService({
      connectionString: process.env.DATABASE_URL,
      schemas: ['public'],
    }),
  ],
}
```

For further PostGraphile preset configuration (behaviours, JWT, subscriptions, smart tags, etc.), refer to the [PostGraphile v5 documentation](https://postgraphile.org/postgraphile/5/).

### Why File-Based Presets?

PostGraphile presets must be in separate files, not inline in `nuxt.config.ts`.

The module uses PostGraphile's [instance-based approach](https://postgraphile.org/postgraphile/next/usage-library):

1. At build time, the preset file is imported and a PostGraphile instance is created
2. The instance is exposed via Nitro's virtual module system
3. At runtime, handlers call `pgl.getSchema()` to get the schema

This approach avoids GraphQL module duplication, follows PostGraphile's recommended pattern, supports watch mode, and properly handles database connections.

**Your preset file needs a default export:**

```typescript
import { createStonecropPreset } from '@stonecrop/graphql-middleware'

const preset = {
  extends: [createStonecropPreset()],
  // ...
}

export default preset
```

**Import Requirements:**

Relative imports in preset files work with file extensions:

```typescript
// server/graphile/graphile.preset.ts
import { createStonecropPreset, makePgService } from '@stonecrop/graphql-middleware'
import { MyPlugin } from './plugins/my-plugin'
import { AnotherPlugin } from './plugins/another'

const preset = {
  extends: [createStonecropPreset()],
  pgServices: [makePgService({/*...*/})],
  plugins: [MyPlugin, AnotherPlugin],
}

export default preset
```

### Schema Building with Grafast

Grafast uses a step-based execution model. Common patterns:

```typescript
import { constant, lambda, access, object, filter, type GrafastSchemaConfig } from 'grafast'

const resolvers: GrafastSchemaConfig['objects'] = {
  Query: {
    plans: {
      // Static values use constant()
      hello: () => constant('world'),

      // Arguments accessed via fieldArgs with $ prefix
      user: (_source, fieldArgs) => {
        const { $id } = fieldArgs
        return lambda($id, (id) => getUserById(id))
      },

      // Use filter() for list filtering
      userOrders: (_source, fieldArgs) => {
        const { $userId } = fieldArgs
        const $allOrders = constant(getAllOrders())
        return filter($allOrders, $order =>
          lambda([access($order, 'userId'), $userId],
            ([orderUserId, userId]) => orderUserId === userId
          )
        )
      }
    }
  },

  Mutation: {
    plans: {
      // Use object() to compose objects from steps
      createUser: (_source, fieldArgs) => {
        const { $name, $email } = fieldArgs
        const $id = constant(generateId())
        const $now = constant(new Date().toISOString())

        const $user = object({
          id: $id,
          name: $name,
          email: $email,
          role: constant('user'),
          createdAt: $now,
          updatedAt: $now
        })

        return lambda($user, user => {
          saveUser(user)
          return user
        })
      }
    }
  },

  // Field resolvers for types
  User: {
    plans: {
      fullName: ($user) => {
        return lambda($user, (user) => {
          const typed = user as { firstName: string; lastName: string }
          return `${typed.firstName} ${typed.lastName}`
        })
      }
    }
  },

  // Related type resolvers
  Order: {
    plans: {
      // Use access() to extract properties before lookups
      user: ($order) => {
        const $userId = access($order, 'userId')
        return lambda($userId, userId => getUserById(userId as string) ?? null)
      }
    }
  }
}

export default resolvers
```

**Key Concepts:**
- Resolvers return **steps** (constant, lambda, access, object, filter), not plain values
- Arguments are accessed via `fieldArgs.$argumentName`
- `constant()` - static values
- `lambda()` - transform step values at execution time
- `access()` - extract object properties efficiently
- `object()` - compose objects from steps
- `filter()` - filter list steps

See [Grafast Standard Steps](https://grafast.org/grafast/standard-steps) for the complete reference.

## Development

This package lives inside the Stonecrop Rush monorepo. Use `rushx` instead of `pnpm run` to invoke scripts.

```bash
# Install all monorepo dependencies (run from the repo root)
rush install

# Bootstrap the playground database (first time only — requires Docker)
cd playground && node scripts/bootstrap.mjs

# Generate type stubs
rushx dev:prepare

# Develop with the playground (from nuxt_grafserv/)
rushx dev

# Build the module
rushx build

# Run ESLint
rushx lint

# Run tests
rushx test
rushx test:watch
```

The playground runs against a PostgreSQL container managed by Docker Compose. The bootstrap script handles container startup, `.env` creation, and running the initial migration. On subsequent runs `rushx dev` is all that's needed (the container persists via a named volume).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@stonecrop/nuxt-grafserv/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@stonecrop/nuxt-grafserv

[npm-downloads-src]: https://img.shields.io/npm/dm/@stonecrop/nuxt-grafserv.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@stonecrop/nuxt-grafserv

[license-src]: https://img.shields.io/npm/l/@stonecrop/nuxt-grafserv.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@stonecrop/nuxt-grafserv
