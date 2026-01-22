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

1. Add `@stonecrop/nuxt-grafserv` dependency to your project:

```bash
# Using pnpm
pnpm add @stonecrop/nuxt-grafserv

# Using yarn
yarn add @stonecrop/nuxt-grafserv

# Using npm
npm install @stonecrop/nuxt-grafserv
```

2. Add `@stonecrop/nuxt-grafserv` to the `modules` section of `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    schema: 'server/**/*.graphql',
    resolvers: 'server/resolvers.ts',
    url: '/graphql/', // Serves both GraphQL API and Ruru UI
  }
})
```

## Configuration

### All Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `schema` | `string \| string[] \| SchemaProvider` | `'server/**/*.graphql'` | Path(s) to GraphQL schema files or schema provider function |
| `resolvers` | `string` | `'server/resolvers.ts'` | Path to resolvers file |
| `url` | `string` | `'/graphql/'` | GraphQL endpoint URL (also serves Ruru UI) |
| `graphiql` | `boolean` | `true` in dev, `false` in prod | Enable GraphiQL IDE |
| `preset` | `GraphileConfig.Preset` | `undefined` | Custom Graphile preset for advanced configuration |

### Full Configuration Example

```ts
export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    // Schema configuration
    schema: 'server/**/*.graphql',
    resolvers: 'server/resolvers.ts',

    // Endpoints
    url: '/graphql/', // Serves both GraphQL API and Ruru UI
    graphiql: true,

    // Graphile preset with grafserv options
    preset: {
      grafserv: {
        websockets: false,
        graphqlOverGET: true, // Enable GET requests for queries
        maxRequestLength: 100000,
        allowedRequestContentTypes: [
          'application/json',
          'application/graphql+json'
        ]
      },
      grafast: {
        explain: true, // Enable plan diagrams
      }
    },
  }
})
```

## Basic Usage

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
import { constant, lambda, access, object, filter, type GrafastSchemaConfig } from 'grafast'

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

## Advanced Usage

### Middleware via Grafserv Plugins

For middleware functionality (authentication, logging, etc.), use Grafserv plugins. The CLI installer creates a `server/plugins.ts` file with examples.

#### Inline Plugin Configuration

```ts
export default defineNuxtConfig({
  grafserv: {
    preset: {
      plugins: [
        {
          name: 'request-logging',
          version: '1.0.0',
          grafserv: {
            middleware: {
              processGraphQLRequestBody: async (next, event) => {
                const start = Date.now()
                console.log('[GraphQL] Request started')

                const result = await next()

                console.log(`[GraphQL] Completed in ${Date.now() - start}ms`)
                return result
              }
            }
          }
        }
      ]
    }
  }
})
```

#### Using External Plugin File

```ts
// nuxt.config.ts
import plugins from './server/plugins'

export default defineNuxtConfig({
  grafserv: {
    schema: 'server/schema.graphql',
    resolvers: 'server/resolvers.ts',
    preset: {
      plugins
    }
  }
})
```

```ts
// server/plugins.ts
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
        // TODO: Validate token and add user to context
        return next()
      }
    }
  }
}

export default [loggingPlugin, authPlugin]
```

#### Available Middleware Hooks

- `processRequest` - Process all incoming requests
- `processGraphQLRequestBody` - Process GraphQL request bodies
- `ruruHTML` - Customize Ruru IDE HTML generation
- `onSubscribe` - Handle GraphQL subscriptions

## Advanced Usage

### Custom Graphile Preset

Leverage the full power of the Graphile ecosystem with custom presets:

```ts
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'

export default defineNuxtConfig({
  grafserv: {
    preset: {
      extends: [PostGraphileAmberPreset],
      grafast: {
        explain: true, // Enable plan diagrams for debugging
        context: {
          // Custom context available in all resolvers
          apiVersion: '1.0'
        }
      },
      grafserv: {
        graphqlOverGET: true,
        maxRequestLength: 200000
      }
    }
  }
})
```

### Accessing Grafserv Instance

For advanced use cases, you can access the grafserv instance directly:

```ts
// server/api/custom.ts
import { getGrafservInstance } from '@stonecrop/nuxt-grafserv/runtime/handler'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serv = await getGrafservInstance(config.grafserv)

  // Access grafserv methods or configuration
  const preset = serv.getPreset()

  return { preset }
})
```

### Schema Building with Objects Structure

The module uses Grafast's modern objects structure for better type safety and performance. Leverage Grafast's standard steps for common operations:

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
- All resolvers return **steps** (constant, lambda, access, object, filter, etc.), not plain values
- Arguments are accessed via `fieldArgs.$argumentName` (note the `$` prefix)
- Use `constant()` for static values
- Use `lambda()` to transform step values at execution time
- Use `access()` to extract object properties (more efficient than lambda for simple property access)
- Use `object()` to compose objects from multiple steps
- Use `filter()` for list filtering operations
- Source objects (`$source`, `$user`, `$order`, etc.) are also steps that need `lambda()` or `access()` to work with their properties

**Standard Steps Reference:**
- `constant()` - Create a step from a static value
- `lambda()` - Transform step values with execution-time callbacks
- `access()` - Extract properties from object steps
- `object()` - Compose objects from multiple steps
- `filter()` - Filter list steps based on conditions
- `list()` - Create lists from step tuples
- `first()`/`last()` - Get first/last elements from lists
- `loadOne()`/`loadMany()` - Batch data loading (DataLoader-style)

For the complete list, see [Grafast Standard Steps](https://grafast.org/grafast/standard-steps)

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm run dev:prepare

# Develop with the playground
pnpm run dev

# Build the module
pnpm run build

# Run ESLint
pnpm run lint

# Run tests
pnpm run test
pnpm run test:watch
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@stonecrop/nuxt-grafserv/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@stonecrop/nuxt-grafserv

[npm-downloads-src]: https://img.shields.io/npm/dm/@stonecrop/nuxt-grafserv.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@stonecrop/nuxt-grafserv

[license-src]: https://img.shields.io/npm/l/@stonecrop/nuxt-grafserv.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@stonecrop/nuxt-grafserv
