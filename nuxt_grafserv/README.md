# Nuxt Grafserv

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Pluggable Grafserv GraphQL server as a Nuxt Module. Uses the Grafast execution engine for high-performance GraphQL.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 🚀 &nbsp;Grafserv Server Integration
- ⚡️ &nbsp;Grafast Execution Engine (faster than graphql-js)
- 🔄 &nbsp;Schema Stitching Support
- 🛠 &nbsp;Middleware Support
- 📝 &nbsp;TypeScript Support
- 🔍 &nbsp;GraphiQL Interface
- ⚡️ &nbsp;Hot Module Reloading

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
    schema: './server/**/*.graphql',
    resolvers: './server/resolvers.ts',
    url: '/graphql/',
  }
})
```

## Configuration

Here's a full example of all available options:

```ts
export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt-grafserv'],
  grafserv: {
    // Path to your GraphQL schema files
    schema: './server/**/*.graphql',
    
    // Path to your resolvers
    resolvers: './server/resolvers.ts',
    
    // GraphQL endpoint URL (default: /graphql/)
    url: '/graphql/',
    
    // Enable GraphiQL IDE (default: true in dev, false in prod)
    graphiql: true,
    
    // Middleware functions
    middleware: [
      async (ctx, next) => {
        const start = Date.now()
        const result = await next()
        console.log(`Request took ${Date.now() - start}ms`)
        return result
      }
    ],
    
    // Grafserv-specific options
    grafserv: {
      websockets: false,
      introspection: true
    }
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

Add middleware functions to process requests:

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
    // Authentication middleware
    async (ctx, next) => {
      const token = ctx.req.headers.get('authorization')
      if (!token) throw new Error('Unauthorized')
      return next()
    }
  ]
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

## License

[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@stonecrop/nuxt-grafserv/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@stonecrop/nuxt-grafserv

[npm-downloads-src]: https://img.shields.io/npm/dm/@stonecrop/nuxt-grafserv.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@stonecrop/nuxt-grafserv

[license-src]: https://img.shields.io/npm/l/@stonecrop/nuxt-grafserv.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@stonecrop/nuxt-grafserv

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
