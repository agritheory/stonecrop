# Nuxt Yoga

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

GraphQL Yoga integration for Nuxt 3, providing a modern, flexible, and feature-rich GraphQL server.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- 🚀 &nbsp;GraphQL Yoga Server Integration
- 🔄 &nbsp;Schema Stitching Support
- 🛠 &nbsp;Middleware Support
- 📝 &nbsp;TypeScript Support
- 🔍 &nbsp;GraphiQL Interface
- ⚡️ &nbsp;Hot Module Reloading

## Quick Setup

1. Add `nuxt-yoga` dependency to your project:

```bash
# Using pnpm
pnpm add -D nuxt-yoga

# Using yarn
yarn add --dev nuxt-yoga

# Using npm
npm install --save-dev nuxt-yoga
```

2. Add `nuxt-yoga` to the `modules` section of `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-yoga'],
  yoga: {
    // Your GraphQL configuration (see options below)
  }
})
```

## Configuration

Here's a full example of all available options:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-yoga'],
  yoga: {
    // Path to your GraphQL schema files
    schema: './server/**/*.graphql',
    
    // Path to your resolvers
    resolvers: './server/resolvers.ts',
    
    // GraphQL endpoint URL (default: /graphql/)
    url: '/graphql/',
    
    // Remote schemas to stitch
    remoteSchemas: [
      {
        url: 'https://api.example.com/graphql',
        prefix: 'Remote_'  // Optional prefix for type names
      }
    ],
    
    // Middleware functions
    middleware: [
      async (ctx, next) => {
        const start = Date.now()
        const result = await next()
        console.log(`Request took ${Date.now() - start}ms`)
        return result
      }
    ],
    
    // Yoga-specific options
    yoga: {
      graphiql: true,
      cors: true,
      landingPage: true
    }
  }
})
```

## Basic Usage

1. Create your GraphQL schema (`server/base.graphql`):
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

## Schema Stitching

You can combine multiple GraphQL schemas using the `remoteSchemas` option:

```ts
yoga: {
  remoteSchemas: [
    {
      url: 'https://api.example.com/graphql',
      prefix: 'Remote_'  // Optional: prefix remote types to avoid conflicts
    }
  ]
}
```

## Middleware

Add middleware functions to process requests:

```ts
yoga: {
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

# Build the playground
pnpm run dev:build

# Run ESLint
pnpm run lint

# Run Vitest
pnpm run test
pnpm run test:watch

# Release new version
pnpm run release
```

## License

[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-yoga/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-yoga

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-yoga.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-yoga

[license-src]: https://img.shields.io/npm/l/nuxt-yoga.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-yoga

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com