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

## Functions

### buildListQuery

Build a GraphQL connection query to fetch a list of records.

Only declares variables ($limit, $offset, $orderBy) that are actually used, avoiding GraphQL spec violations from unused variable declarations.

**Signature:**

```typescript
export declare function buildListQuery(meta: DoctypeMeta, connectionFieldName: (t: string) => string, orderByTypeName: (t: string) => string, options?: GetRecordsOptions): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` | Doctype metadata |
| connectionFieldName | `(t: string) => string` | Function to derive the connection field name from a table name |
| orderByTypeName | `(t: string) => string` | Function to derive the order-by type name from a table name |
| options | `GetRecordsOptions` | Query options (limit, offset, orderBy) |

### buildRecordQuery

Build a GraphQL query string from doctype metadata.

Generates scalar field selections. When `includeNested` is set, recursively includes descendant link sub-selections derived from the doctype's `links` object.

**Signature:**

```typescript
export declare function buildRecordQuery(meta: DoctypeMeta, recordFieldName: (t: string) => string, recordArgName: (t: string) => string, recordArgType: (t: string) => string, registry?: Map<string, DoctypeMeta>, options?: GetRecordOptions): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` | Doctype metadata to build the query from |
| recordFieldName | `(t: string) => string` | Function to derive the query field name from a table name |
| recordArgName | `(t: string) => string` | Function to derive the argument name from a table name |
| recordArgType | `(t: string) => string` | Function to derive the argument type from a table name |
| registry | `Map<string, DoctypeMeta>` | Doctype registry for resolving link targets. Required when includeNested is set. |
| options | `GetRecordOptions` | Query options (includeNested, maxDepth) |

## Interfaces

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

Client for interacting with Stonecrop GraphQL API

**Constructor:**

```typescript
new StonecropClient(options: StonecropClientOptions)
```

**Methods:**

#### clearMetaCache

Clear the cached doctype metadata

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

When `includeNested` is set, builds a query with sub-selections for descendant links and returns parent + merged children. When omitted, returns flat scalar data.

```typescript
getRecord(doctype: DoctypeRef, recordId: string, options: GetRecordOptions): Promise<Record<string, unknown> | null>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeRef` | Doctype reference (name and optional slug) |
| recordId | `string` | Record ID to fetch |
| options | `GetRecordOptions` | Query options (includeNested, maxDepth) |

#### getRecords

Get multiple records with optional filtering and pagination

```typescript
getRecords(doctype: DoctypeRef, options: GetRecordsOptions): Promise<Record<string, unknown>[]>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeRef` | Doctype reference (name and optional slug) |
| options | `GetRecordsOptions` | Query options (filters, orderBy, limit, offset) |

#### mutate

Execute a GraphQL mutation

```typescript
mutate(mutation: string, variables: Record<string, unknown>): Promise<T>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| mutation | `string` | GraphQL mutation string |
| variables | `Record<string, unknown>` | Mutation variables |

#### query

Execute a GraphQL query

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

#### setRegistry

Set the doctype registry for nested query building.

```typescript
setRegistry(registry: Map<string, DoctypeMeta>): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| registry | `Map<string, DoctypeMeta>` | Map of doctype slug to doctype metadata |

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

