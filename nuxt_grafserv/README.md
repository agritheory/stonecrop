# Nuxt Grafserv

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

Pluggable Grafserv GraphQL server as a Nuxt Module. Uses the Grafast execution engine for high-performance GraphQL.

## Features

- 🚀 &nbsp;Grafserv Server Integration
- ⚡️ &nbsp;Grafast Execution Engine (faster than [`graphql-js`](https://github.com/graphql/graphql-js))
- 🔄 &nbsp;Schema Stitching Support
- 🛠 &nbsp;Middleware Support with File-based Loading
- 📦 &nbsp;Graphile Preset System for Advanced Configuration
- 📝 &nbsp;TypeScript Support
- 🔍 &nbsp;GraphiQL/Ruru Interface
- ⚡️ &nbsp;Hot Module Reloading
- 🎯 &nbsp;Separate Route Handlers for GraphQL, UI, and Static Assets

## Architecture

This module uses modern Grafserv patterns with three key components:

1. **Preset-Based Configuration**: Leverages Graphile's preset system for extensibility and plugin support
2. **Separate Route Handlers**: Three dedicated handlers for GraphQL operations, GraphiQL UI, and static assets
3. **Objects Structure**: Uses Grafast's modern `objects/interfaces/enums` schema building pattern for better type safety

The module automatically registers these handlers:
- `{url}` - GraphQL operations endpoint
- `{graphiqlPath || url}` - GraphiQL/Ruru interactive IDE
- `/ruru-static/**` - Static assets for the IDE

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
    url: '/graphql/',
    graphiqlPath: '/graphql/', // Optional: separate path for GraphiQL UI
  }
})
```

## Configuration

### All Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `schema` | `string \| string[] \| SchemaProvider` | `'server/**/*.graphql'` | Path(s) to GraphQL schema files or schema provider function |
| `resolvers` | `string` | `'server/resolvers.ts'` | Path to resolvers file |
| `url` | `string` | `'/graphql/'` | GraphQL endpoint URL |
| `graphiqlPath` | `string` | Same as `url` | GraphiQL/Ruru UI endpoint URL |
| `graphiql` | `boolean` | `true` in dev, `false` in prod | Enable GraphiQL IDE |
| `middlewarePath` | `string` | `undefined` | **Recommended**: Path to middleware file (e.g., `'server/middleware.ts'`) |
| `middleware` | `MiddlewareFunction[]` | `[]` | **Alternative**: Inline middleware functions (cannot reference external modules) |
| `preset` | `GraphileConfig.Preset` | `{ grafserv: { websockets: false } }` | Custom Graphile preset for advanced configuration |
| `preset.grafserv.websockets` | `boolean` | `false` | Enable WebSocket support |
| `preset.grafserv.graphqlOverGET` | `boolean` | `false` | Enable GraphQL queries over GET requests |
| `preset.grafserv.maxRequestLength` | `number` | `100000` | Maximum request body size in bytes |
| `preset.grafserv.dangerouslyAllowAllCORSRequests` | `boolean` | `false` | ⚠️ Allow all CORS requests (dev only) |
| `preset.grafserv.allowedRequestContentTypes` | `string[]` | `['application/json', 'application/graphql+json']` | Allowed Content-Type headers |
| `preset.grafserv.persistedOperationsDirectory` | `string` | `undefined` | Directory for persisted operations |
| `preset.grafserv.allowUnpersistedOperation` | `boolean \| function` | `true` | Allow unpersisted operations |

### Full Configuration Example

```ts
export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    // Schema configuration
    schema: 'server/**/*.graphql',
    resolvers: 'server/resolvers.ts',

    // Endpoints
    url: '/graphql/',
    graphiqlPath: '/graphiql/', // Separate UI path
    graphiql: true,

    // Middleware (file-based - recommended)
    middlewarePath: 'server/middleware.ts',

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

    // Additional plugins
    plugins: [
      // Add Graphile plugins here
    ]
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
export default {
  Query: {
    hello: () => 'world',
    ping: () => true
  },
  Mutation: {
    echo: (_: unknown, { message }: { message: string }) => message
  }
}
```

## Middleware

### File-Based Middleware (Recommended)

Create a middleware file that exports an array of middleware functions. This approach preserves imports and external dependencies:

**`server/middleware.ts`:**

```typescript
import type { MiddlewareFunction } from '@stonecrop/nuxt-grafserv'

// Logging middleware
const loggingMiddleware: MiddlewareFunction = async (ctx, next) => {
  const start = Date.now()
  const result = await next()
  console.log(`Request took ${Date.now() - start}ms`)
  return result
}

// Authentication middleware (can import external modules)
import { verifyToken } from './auth'

const authMiddleware: MiddlewareFunction = async (ctx, next) => {
  const token = ctx.req.headers.get('authorization')
  if (!token) {
    throw new Error('Unauthorized')
  }

  const user = await verifyToken(token)
  ctx.user = user // Extend context

  return next()
}

export default [loggingMiddleware, authMiddleware]
```

**`nuxt.config.ts`:**

```ts
export default defineNuxtConfig({
  grafserv: {
    middlewarePath: 'server/middleware.ts'
  }
})
```

### Inline Middleware (Alternative)

For simple middleware without external dependencies:

```ts
grafserv: {
  middleware: [
    // Logging middleware
    async (ctx, next) => {
      const start = Date.now()
      const result = await next()
      console.log(`Request took ${Date.now() - start}ms`)
      return result
    },
    // Context enrichment
    async (ctx, next) => {
      ctx.requestId = Math.random().toString(36)
      ctx.timestamp = new Date()
      return next()
    }
  ]
}
```

**Note**: Inline middleware cannot reference external modules or imports. Use `middlewarePath` for middleware with dependencies.

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

The module uses Grafast's modern objects structure for better type safety. Your resolvers are automatically transformed:

```typescript
export default {
  Query: {
    plans: {
      hello: () => 'world'
    }
  }
}
```

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
