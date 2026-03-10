# @stonecrop/graphql-client

Client-side TypeScript interface to the Stonecrop GraphQL API. `StonecropClient` wraps the `stonecrop*` operations added to a PostGraphile schema by `@stonecrop/graphql-middleware`, handling HTTP transport, response unwrapping, and metadata caching so application code works with plain TypeScript objects rather than raw GraphQL.

The client is intentionally thin — it has no knowledge of doctype definitions itself and fetches metadata from the server on demand, caching it in memory for the lifetime of the instance.

While designed to pair with `@stonecrop/graphql-middleware`, the client works against any GraphQL endpoint that implements the `stonecrop*` operation conventions (`stonecropMeta`, `stonecropRecord`, `stonecropRecords`, `stonecropAction`). You can use your own server implementation as long as it conforms to those operation names and the expected response shapes. The `query` and `mutate` methods are also available for interacting with any other operations your schema exposes.

## Installation

```bash
pnpm add @stonecrop/graphql-client
```

## Usage

```typescript
import { StonecropClient } from '@stonecrop/graphql-client'

const client = new StonecropClient({
  endpoint: 'http://localhost:4000/graphql',
  headers: { Authorization: `Bearer ${token}` }, // optional
})
```

### Metadata

```typescript
// Fetch DoctypeMeta for a single doctype (cached after first call)
const meta = await client.getMeta({ doctype: 'SalesOrder' })

// Fetch all registered doctypes
const allMeta = await client.getAllMeta()

// Bust the in-memory cache
client.clearMetaCache()
```

### Reading records

```typescript
// Single record by ID
const order = await client.getRecord(meta, 'uuid-here')
// → Record<string, unknown> | null

// List with optional filtering and pagination
const orders = await client.getRecords(meta, {
  filters: { status: 'Draft' },
  orderBy: 'createdAt',
  limit: 20,
  offset: 0,
})
// → Record<string, unknown>[]
```

### Actions

```typescript
// Dispatch any registered action
const result = await client.runAction(meta, 'submit', ['uuid-here'])
// → { success: boolean; data: unknown; error: string | null }
```

### Raw GraphQL

For queries or mutations not covered by the helpers:

```typescript
const data = await client.query<{ myTable: unknown[] }>(
  `query { myTable { id name } }`
)

const result = await client.mutate<{ createFoo: unknown }>(
  `mutation CreateFoo($input: CreateFooInput!) { createFoo(input: $input) { foo { id } } }`,
  { input: { foo: { name: 'bar' } } }
)
```

## References

For full method signatures and parameter details, see [API Reference](./api.md).
