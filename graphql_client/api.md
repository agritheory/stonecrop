# Graphql_client API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### DoctypeContext

Vue component exported from @stonecrop/graphql_client.

```typescript
import { DoctypeContext } from '@stonecrop/graphql_client'
```

### DoctypeMeta

Vue component exported from @stonecrop/graphql_client.

```typescript
import { DoctypeMeta } from '@stonecrop/graphql_client'
```

## Interfaces

### GetRecordResult

Result from getRecord - includes the record data and any unknown links requested

**Definition:**

```typescript
export interface GetRecordResult {
  unknownLinks?: string[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| unknownLinks? | `string[]` | Link names that were requested but don't exist in the doctype schema |

### StonecropClientOptions

Options for creating a Stonecrop client

**Definition:**

```typescript
export interface StonecropClientOptions {
  endpoint: string;
  headers?: Record<string, string>;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| endpoint | `string` | GraphQL endpoint URL |
| headers? | `Record<string, string>` | Additional HTTP headers to include in requests |

## Type Aliases

### Meta

The type of the response from the `getMeta` query.

**Definition:**

```typescript
export type Meta = {
    variables: {
        doctype: string;
    };
    response: {
        getMeta: MetaResponse;
    };
};
```

### MetaParser

The type of the response from the `getMeta` query.

**Definition:**

```typescript
export type MetaParser = {
    data: Meta['response'];
};
```

### MetaResponse

The type of the response from the `getRecords` query.

**Definition:**

```typescript
export type MetaResponse = {
    id: string;
    name: string;
    workflow: {
        id: string;
        name: string;
        machineId?: string;
    };
    schema: {
        id: string;
        label: string;
    }[];
    actions: {
        id: string;
        eventName: string;
    }[];
};
```

## Classes

### StonecropClient

Client for interacting with Stonecrop GraphQL API.

Acts as a transport layer — it passes requests to the middleware and returns merged results. Does not construct queries itself.

**Constructor:**

```typescript
new StonecropClient(options: StonecropClientOptions)
```

**Methods:**

#### clearMetaCache

Clear the cached doctype metadata.

Call this if the server-side doctype schema has changed and you need to fetch fresh metadata (e.g., after adding a new field).

```typescript
clearMetaCache(): void
```

#### getAllMeta

Get all doctype metadata

```typescript
getAllMeta(): Promise<DoctypeMeta[]>
```

#### getMeta

Get doctype metadata

```typescript
getMeta(context: DoctypeContext): Promise<DoctypeMeta | null>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| context | `DoctypeContext` | Doctype context containing doctype name |

#### getRecord

Get a single record by ID.

Routes through the stonecropRecord resolver which handles nested data fetching based on the includeNested option.

```typescript
getRecord(doctype: DoctypeRef, recordId: string, options: GetRecordOptions): Promise<GetRecordResult>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeRef` | Doctype reference (name and optional slug) |
| recordId | `string` | Record ID to fetch |
| options | `GetRecordOptions` | Query options (includeNested, maxDepth) |

#### getRecords

Get multiple records with optional filtering and pagination.

Returns flat arrays — the middleware merges connection format ( nodes: [...] ) into plain arrays before returning.

```typescript
getRecords(doctype: DoctypeRef, options: GetRecordsOptions): Promise<Record<string, unknown>[]>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeRef` | Doctype reference (name and optional slug) |
| options | `GetRecordsOptions` | Query options (filters, orderBy, limit, offset) |

#### mutate

Execute a GraphQL mutation. Delegates to query() since both use POST.

```typescript
mutate(mutation: string, variables: Record<string, unknown>): Promise<T>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| mutation | `string` | GraphQL mutation string |
| variables | `Record<string, unknown>` | Mutation variables |

#### query

Execute a GraphQL query against the configured endpoint.

```typescript
query(query: string, variables: Record<string, unknown>): Promise<T>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| query | `string` | GraphQL query string |
| variables | `Record<string, unknown>` | Query variables |

#### runAction

Execute a doctype action

```typescript
runAction(doctype: DoctypeRef, action: string, args: unknown[]): Promise<{
        success: boolean;
        data: unknown;
        error: string | null;
    }>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeRef` | Doctype reference (name and optional slug) |
| action | `string` | Action name to execute |
| args | `unknown[]` | Action arguments |

## Variables

### methods

Get meta information for a doctype

**Type:**

```typescript
export const methods: {
    getMeta: (doctype: string, url?: string) => Promise<MetaResponse>;
}
```

### queries

Queries for the GraphQL API.

**Type:**

```typescript
export const queries: {
    getMeta: string;
}
```

### typeDefs

This is the schema for the GraphQL API.

**Type:**

```typescript
export const typeDefs: string
```

