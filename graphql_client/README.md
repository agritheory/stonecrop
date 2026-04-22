# @stonecrop/graphql-client

Transport layer for Stonecrop GraphQL APIs. Handles HTTP communication and response parsing.

## Responsibilities

**Transport** — The client sends requests and parses responses. It doesn't construct queries.

**Contract** — The client expects the server to expose these operations:

| Operation | Arguments | Returns |
|-----------|-----------|---------|
| `stonecropRecord` | `doctype`, `id` | `{ record }` |
| `stonecropRecords` | `doctype`, `filters?`, `orderBy?`, `limit?`, `offset?` | `{ data[], count }` |
| `stonecropMeta` | `doctype` | `DoctypeMeta` |
| `stonecropAllMeta` | — | `DoctypeMeta[]` |
| `stonecropAction` | `doctype`, `action`, `args?` | `{ success, data, error }` |

The client has no opinions about how the server implements these.

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

// Fetch multiple records
const records = await client.getRecords({ name: 'Recipe' }, { limit: 20 })
```

## Data Shapes

- `getRecord` returns `{ record: Record<string, unknown> | null }`
- `getRecords` returns `Record<string, unknown>[]`

See [API Reference](./api.md) for full method signatures.
