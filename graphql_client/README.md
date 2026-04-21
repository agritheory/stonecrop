# @stonecrop/graphql-client

Transport layer for Stonecrop GraphQL APIs. Handles HTTP communication, response parsing, and metadata caching.

## Responsibilities

**Transport** — The client sends requests and parses responses. It doesn't construct queries.

**Caching** — Metadata is cached in memory after first fetch.

**Contract** — The client expects the server to expose these operations:

| Operation | Arguments | Returns |
|-----------|-----------|---------|
| `stonecropRecord` | `doctype`, `id`, `options?` | `{ record, unknownLinks? }` |
| `stonecropRecords` | `doctype`, `filters?`, `orderBy?`, `limit?`, `offset?` | `{ data[], count }` |
| `stonecropMeta` | `doctype` | `DoctypeMeta` |
| `stonecropAllMeta` | — | `DoctypeMeta[]` |
| `stonecropAction` | `doctype`, `action`, `args?` | `{ success, data, error }` |

The client has no opinions about how the server implements these — naming conventions, query construction, nested data merging are all the server's concern.

## Assumptions

- All record operations accept a `doctype` string argument
- `stonecropRecord` accepts `options: { includeNested?, maxDepth? }`
- The server handles query building and field naming

## Usage

```typescript
import { StonecropClient } from '@stonecrop/graphql-client'

const client = new StonecropClient({
  endpoint: 'http://localhost:4000/graphql',
  headers: { Authorization: `Bearer ${token}` }, // optional
})

// Fetch a record
const result = await client.getRecord({ name: 'Recipe' }, 'r1')
result.record  // plain object with the record fields
result.unknownLinks  // links requested but not found in schema

// Fetch with nested links
const withNested = await client.getRecord({ name: 'Recipe' }, 'r1', {
  includeNested: true,
})

// Custom queries
const custom = await client.query<{ myData: unknown[] }>(`query { myData { id } }`)
```

## Data Shapes

- `getRecord` returns `{ record: Record<string, unknown> | null, unknownLinks?: string[] }`. The `record` field contains the record's fields. Nested links are merged into the same object when `includeNested` is used.
- `getRecords` returns `Record<string, unknown>[]` — an array of flat objects. Pagination metadata (`count`) is available in the server response but not currently exposed by the client.
- `unknownLinks` will contain link names you requested that don't exist in the doctype schema — useful for catching typos.

See [API Reference](./api.md) for full method signatures.