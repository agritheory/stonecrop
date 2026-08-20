# @stonecrop/graphql-client

Transport layer for Stonecrop GraphQL APIs. Handles HTTP communication, response parsing, and metadata caching.

## Why transport-only?

This client intentionally never constructs GraphQL queries. All query generation — including PostGraphile-specific field naming (inflection), nested link sub-selections, link display enrichment, and fetch strategy dispatch — lives in the server-side middleware (`@stonecrop/graphql-middleware`).

This boundary exists because PostGraphile's schema naming is configurable. An application might use `ById` for UUID primary keys, `ByRowId` for `row_id` columns, or entirely custom conventions. If the client hardcoded any of these conventions, it would silently produce wrong queries for non-default setups. The middleware owns the single `StonecropInflectionConfig` — the client only knows how to pass `options.includeNested` through to the `stonecropRecord` resolver and receive pre-merged flat data.

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

// Fetch a record
const result = await client.getRecord({ name: 'SalesOrder' }, 'so-1')
result.record  // plain object with the record fields
result.unknownLinks  // links requested but not found in schema

// Fetch with nested links
const withNested = await client.getRecord({ name: 'SalesOrder' }, 'so-1', {
  includeNested: true,
})

// Custom queries
const custom = await client.query<{ myData: unknown[] }>(`query { myData { id } }`)
```

## Data Shapes

- `getRecord` returns `{ record: Record<string, unknown> | null, unknownLinks?: string[] }`. The `record` field contains the record's fields. Nested links are merged into the same object when `includeNested` is used. Inline link fields are enriched by the middleware as `{ id, displayText }` objects where `displayText` comes from the target doctype's `displayField`.
- `getRecords` returns `{ data: Record<string, unknown>[], hasMore: boolean, count?: number }` — flat objects with the same inline link enrichment.
- `unknownLinks` will contain link names you requested that don't exist in the doctype schema — useful for catching typos.

See [API Reference](./api.md) for full method signatures.
