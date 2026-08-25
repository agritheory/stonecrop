# CASL GraphQL Middleware

A middleware solution for integrating CASL authorization with GraphQL servers, with specific support for Postgraphile and Nuxt GraphQL Server.

## Features

- CASL integration with GraphQL resolvers
- Framework-specific helpers for Postgraphile and Nuxt
- Type-safe ability definitions
- Support for field-level permissions
- Ability to combine multiple authorization rules

## Installation

```bash
pnpm add @stonecrop/casl-middleware
```

## Basic Usage

### Core Middleware

```typescript
import { createCaslMiddleware } from '@stonecrop/casl-middleware'

const middleware = createCaslMiddleware({
  subjectMap: {
    User: 'User',
    Item: 'Item'
  },
  fieldPermissions: {
    'Item.price': [{ action: 'read', subject: 'item' }]
  }
})
```

### Postgraphile Integration

```typescript
// graphile.config.js
import { pglCaslPlugin } from '@stonecrop/casl-middleware'
import { postgraphile } from 'postgraphile'

export default {
  pgServices: [
    makePgService({
      connectionString: 'postgres://testuser:testpass@postgres:5432/testdb',
      schemas: ['public'],
    }),
  ],
  plugins: [pglCaslPlugin],
}
```

### Testing Abilities in GraphiQL

Create an ability:
```graphql
mutation CreateAbility {
  createAbility(input: {
    userId: "123",
    roles: ["admin"]
  }) {
    success
    ability
    message
  }
}
```

Test protected queries:
```graphql
query GetSecretData {
  getSecretData {
    id
    content
  }
}
```

## Development

### Prerequisites

- Node.js >= 20
- pnpm
- Docker and Docker Compose

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd casl-middleware
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the Postgraphile example:
```bash
pnpm dev:postgraphile
```

### Project Structure

```
.
├── src/
│   ├── middleware/         # Core CASL middleware
│   ├── types/             # TypeScript types
│   └── index.ts           # Main exports
```

## Framework Support

### Postgraphile
- Implements CASL as a Postgraphile plugin
- Supports ability creation and management
- Integrates with Postgraphile's schema extension system

### Nuxt GraphQL Server
- Provides middleware for Nuxt's GraphQL module
- Handles ability creation on request
- Integrates with Nuxt's context system

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License

## TODOs

- [ ] Add test suite
- [ ] Add more framework integrations
- [ ] Implement ability persistence
- [ ] Add more examples for different use cases
- [ ] Add documentation for advanced usage scenarios
