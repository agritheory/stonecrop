# @stonecrop/graphql-client

Client-side TypeScript implementation of the `DataClient` interface for Stonecrop's PostGraphile-based GraphQL API. `StonecropClient` handles HTTP transport, response unwrapping, query building, and metadata caching so application code works with plain TypeScript objects.

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

// Optional: set the doctype registry for nested query support
import { Registry } from '@stonecrop/stonecrop'
const registry = new Registry()
// ... register doctypes ...

const doctypeMap = new Map(Object.entries(registry.registry))
client.setRegistry(doctypeMap)
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

### Reading Records

```typescript
import { GetRecordOptions, GetRecordsOptions } from '@stonecrop/schema'

// Single record by ID (flat — scalar fields only)
const order = await client.getRecord({ name: 'SalesOrder' }, 'uuid-here')

// Single record with all nested descendant links
const recipe = await client.getRecord({ name: 'Recipe' }, 'r1', {
  includeNested: true,
})

// Single record with specific nested links only
const recipe = await client.getRecord({ name: 'Recipe' }, 'r1', {
  includeNested: ['tasks'],
})

// Single record with limited nesting depth
const recipe = await client.getRecord({ name: 'Recipe' }, 'r1', {
  includeNested: true,
  maxDepth: 2,
})

// List with optional filtering and pagination
const orders = await client.getRecords(
  { name: 'SalesOrder' },
  {
    filters: { status: 'Draft' },
    orderBy: 'createdAt',
    limit: 20,
    offset: 0,
  }
)
```

### Actions

```typescript
// Dispatch any registered action
const result = await client.runAction({ name: 'SalesOrder' }, 'submit', ['uuid-here'])
// → { success: boolean; data: unknown; error: string | null }
```

### Raw GraphQL

For queries or mutations not covered by the helpers:

```typescript
const data = await client.query<{ myTable: unknown[] }>(`query { myTable { id name } }`)

const result = await client.mutate<{ createFoo: unknown }>(
  `mutation CreateFoo($input: CreateFooInput!) { createFoo(input: $input) { foo { id } } }`,
  { input: { foo: { name: 'bar' } } }
)
```

### How Nested Queries Work

When `includeNested` is set on `getRecord`:

1. The client fetches doctype metadata (including `links`)
2. Builds a GraphQL query with sub-selections for descendant links
3. Connection fields (`noneOrMany`/`atLeastOne`) emit `{ nodes { ... } }` sub-selections
4. Direct fields (`one`/`atMostOne`) emit object sub-selections
5. Results with connection fields are merged to flat arrays

Example query generated for a Recipe with `tasks` (noneOrMany) and `supersededBy` (atMostOne):

```graphql
query GetRecord($id: UUID!) {
  recipeById(id: $id) {
    id
    name
    status
    RecipeTasksByRecipeId {
      nodes {
        id
        name
        description
      }
    }
    supersededBy {
      id
      name
      status
    }
  }
}
```

The response is merged so `result.tasks` is a flat array and `result.supersededBy` is a direct object.

## References

For full method signatures and parameter details, see [API Reference](./api.md).
