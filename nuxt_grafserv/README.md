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
pnpm add @stonecrop/nuxt-grafserv postgraphile

# Using yarn
yarn add @stonecrop/nuxt-grafserv postgraphile

# Using npm
npm install @stonecrop/nuxt-grafserv postgraphile
```

2. Configure in `nuxt.config.ts`:

```ts
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'

export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    type: 'postgraphile', // Required: specify configuration type
    preset: {
      extends: [PostGraphileAmberPreset],
      pgServices: [
        makePgService({
          connectionString: process.env.DATABASE_URL || 'postgresql://localhost/mydb',
          schemas: ['public'],
        }),
      ],
    },
    url: '/graphql',
    graphiql: true,
  }
})
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
| `preset` | `GraphileConfig.Preset` | ✅ | PostGraphile preset passed to makeSchema() |
| `url` | `string` | ❌ | GraphQL endpoint URL (default: '/graphql/') |
| `graphiql` | `boolean` | ❌ | Enable GraphiQL IDE (default: true in dev, false in prod) |

**Example:**

```ts
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'

export default defineNuxtConfig({
  grafserv: {
    type: 'postgraphile',
    preset: {
      extends: [PostGraphileAmberPreset],
      pgServices: [
        makePgService({
          connectionString: process.env.DATABASE_URL,
          schemas: ['public'],
        }),
      ],
      plugins: [MyCustomPlugin],
    },
    url: '/graphql',
    graphiql: true,
  }
})
```

### Schema Configuration

Use `type: 'schema'` for custom GraphQL schemas with Grafast resolvers:

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | `'schema'` | ✅ | Configuration type discriminator |
| `schema` | `string \| string[] \| SchemaProvider` | ✅ | Path(s) to .graphql files or schema provider function |
| `resolvers` | `string` | ❌ | Path to resolvers file (required for .graphql files) |
| `url` | `string` | ❌ | GraphQL endpoint URL (default: '/graphql/') |
| `graphiql` | `boolean` | ❌ | Enable GraphiQL IDE (default: true in dev, false in prod) |

**Example with files:**

```ts
export default defineNuxtConfig({
  grafserv: {
    type: 'schema',
    schema: 'server/**/*.graphql',
    resolvers: 'server/resolvers.ts',
    url: '/graphql',
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

1. Configure PostGraphile in `nuxt.config.ts`:

```ts
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'

export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    type: 'postgraphile',
    preset: {
      extends: [PostGraphileAmberPreset],
      pgServices: [
        makePgService({
          connectionString: process.env.DATABASE_URL,
          schemas: ['public'],
        }),
      ],
    },
  }
})
```

2. That's it! PostGraphile automatically generates your GraphQL schema from your PostgreSQL database.

## Advanced Usage

## Advanced Usage

### Grafserv Middleware and Plugins

For cross-cutting concerns like authentication, logging, or rate limiting, use Grafserv plugins through the preset configuration. This works for both PostGraphile and Schema configurations.

#### Inline Plugin Configuration (PostGraphile)

```ts
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'

export default defineNuxtConfig({
  grafserv: {
    type: 'postgraphile',
    preset: {
      extends: [PostGraphileAmberPreset],
      pgServices: [makePgService({ /* ... */ })],
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

#### Inline Plugin Configuration (Schema)

```ts
export default defineNuxtConfig({
  grafserv: {
    type: 'schema',
    schema: 'server/**/*.graphql',
    resolvers: 'server/resolvers.ts',
    // Note: For Schema config, advanced plugin configuration should be done
    // through a preset configuration or custom schema provider
  }
})
```

#### Using External Plugin File

```ts
// nuxt.config.ts
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'
import plugins from './server/plugins'

export default defineNuxtConfig({
  grafserv: {
    type: 'postgraphile',
    preset: {
      extends: [PostGraphileAmberPreset],
      pgServices: [makePgService({ /* ... */ })],
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

#### Available Middleware Hooks

- `processRequest` - Process all incoming requests
- `processGraphQLRequestBody` - Process GraphQL request bodies
- `ruruHTML` - Customize Ruru IDE HTML generation
- `onSubscribe` - Handle GraphQL subscriptions

## PostGraphile Integration

This module has first-class support for PostGraphile v5 using the preset configuration pattern. PostGraphile automatically generates your complete GraphQL schema and resolvers from your PostgreSQL database.

### Prerequisites

```bash
pnpm add postgraphile
```

### Basic PostGraphile Setup

```typescript
// nuxt.config.ts
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'

export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    type: 'postgraphile',
    preset: {
      extends: [PostGraphileAmberPreset],
      pgServices: [
        makePgService({
          connectionString: process.env.DATABASE_URL || 'postgresql://localhost/mydb',
          schemas: ['public'],
        }),
      ],
    },
    url: '/graphql',
    graphiql: true,
  }
})
```

### PostGraphile with Custom Plugins

Enhance your PostGraphile setup with community plugins:

```typescript
// nuxt.config.ts
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector'

export default defineNuxtConfig({
  grafserv: {
    type: 'postgraphile',
    preset: {
      extends: [PostGraphileAmberPreset],
      plugins: [PgSimplifyInflectorPlugin],
      pgServices: [
        makePgService({
          connectionString: process.env.DATABASE_URL,
          schemas: ['public'],
        }),
      ],
      schema: {
        defaultBehavior: 'connection', // Enable Relay-style connections
      },
      grafast: {
        explain: process.env.NODE_ENV === 'development', // Plan diagrams in dev
      },
    },
  }
})
```

### Advanced PostGraphile Configuration

```typescript
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'

export default defineNuxtConfig({
  grafserv: {
    type: 'postgraphile',
    preset: {
      extends: [PostGraphileAmberPreset],
      pgServices: [
        makePgService({
          connectionString: process.env.DATABASE_URL,
          schemas: ['public', 'app_private'],
          superuserConnectionString: process.env.SUPERUSER_DATABASE_URL, // For watch mode
          pubsub: true, // Enable LISTEN/NOTIFY for subscriptions
        }),
      ],
      gather: {
        // Smart tags for schema customization
        pgJwtTypes: 'app_public.jwt_token',
      },
      schema: {
        // Behavior overrides
        defaultBehavior: '-insert -update -delete', // Read-only by default
        pgJwtSecret: process.env.JWT_SECRET,
      },
      grafast: {
        explain: true,
        context: (requestContext) => ({
          // Custom context for all resolvers
          userId: requestContext.user?.id,
        }),
      },
    },
  }
})
```

### Benefits of PostGraphile Integration

- **Zero Schema Definition**: Automatically generates GraphQL schema from PostgreSQL
- **Auto-Generated Resolvers**: All queries, mutations, and subscriptions from database
- **Real-time Subscriptions**: Live queries via PostgreSQL LISTEN/NOTIFY
- **Row-Level Security**: Leverages PostgreSQL RLS for fine-grained authorization
- **High Performance**: Grafast execution engine with intelligent query planning
- **Type Safety**: Full TypeScript support for generated schema
- **Plugin Ecosystem**: Rich collection of community plugins for extended functionality

### Accessing Grafserv Instance

For advanced use cases, you can access the grafserv instance directly in server routes:

```ts
// server/api/custom.ts
import { getGrafservInstance } from '@stonecrop/nuxt-grafserv/runtime/handler'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serv = await getGrafservInstance(config.grafserv)

  // Access grafserv methods
  // Note: serv contains the grafserv instance with your schema

  return {
    status: 'GraphQL server is running',
    endpoint: config.grafserv.url
  }
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
