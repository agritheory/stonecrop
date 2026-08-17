# @stonecrop/graphql-client

Transport layer for Stonecrop GraphQL APIs. Handles HTTP communication, response parsing, and metadata caching. Optionally builds native PostGraphile queries for efficient link display text resolution.

## Two query paths

This client offers two approaches for fetching records:

### Standard path (`getRecord`, `getRecords`)

These methods use `stonecropRecord` and `stonecropRecords` resolvers which return JSON blobs. Query construction stays server-side. Use this when you don't need display text for linked records, or when you're using the client-side `aformLinkResolver` fallback.

### Native path (`getNativeRecord`, `getNativeRecords`)

These methods build native PostGraphile queries with nested selections for link fields:

```graphql
query { salesOrderById(id: $id) { id customerId partyByCustomerId { id partyName } } }
```

PostGraphile resolves relationships via JOINs in a single database query. Link fields are returned as `{ id, displayText }` objects where `displayText` comes from the target doctype's `displayField`. Use this when you need link display text without N+1 queries.

## Responsibilities

**Transport** — The client sends requests and parses responses. It doesn't construct queries.

**Caching** — Metadata is cached in memory after first fetch.

**Contract** — The client expects the server to expose these operations:

| Operation | Arguments | Returns |
|-----------|-----------|---------|
| `stonecropRecord` | `doctype`, `id`, `options?` | `{ data, unknownLinks? }` |
| `stonecropRecords` | `doctype`, `filters?`, `orderBy?`, `limit?`, `offset?`, `options?` | `{ data[], count }` |
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

// Standard path — uses stonecropRecord resolver
const result = await client.getRecord({ name: 'SalesOrder' }, 'so-1')
result.record  // { id: 'so-1', customerId: 'party-uuid', ... }

// Native path — uses PostGraphile's native queries with relationship expansion
const native = await client.getNativeRecord({ name: 'SalesOrder' }, 'so-1')
native.record  // { id: 'so-1', customerId: { id: 'party-uuid', displayText: 'Acme Corp' }, ... }

// Native list query
const list = await client.getNativeRecords({ name: 'SalesOrder' }, { limit: 50 })
list.data  // Array of records with link fields as { id, displayText } objects

// Custom queries
const custom = await client.query<{ myData: unknown[] }>(`query { myData { id } }`)
```

## Data Shapes

### Standard methods

- `getRecord` returns `{ record: Record<string, unknown> | null, unknownLinks?: string[] }`. The `record` field contains the record's fields with scalar FK values. Nested links are merged when `includeNested` is used.
- `getRecords` returns `{ data: Record<string, unknown>[], hasMore: boolean, count?: number }` — flat objects with scalar FK values.

### Native methods

- `getNativeRecord` returns `{ record: Record<string, unknown> | null }`. Link fields are `{ id, displayText }` objects where `displayText` is resolved from the target doctype's `displayField`.
- `getNativeRecords` returns `{ data: Record<string, unknown>[], hasMore: boolean }`. Each record has link fields as `{ id, displayText }` objects.

See [API Reference](./api.md) for full method signatures.