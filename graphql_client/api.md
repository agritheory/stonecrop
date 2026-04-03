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
export declare function buildListQuery(meta: DoctypeMeta, connectionFieldName: (t: string) => string, orderByTypeName: (t: string) => string, options?: BuildListQueryOptions): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` | Doctype metadata |
| connectionFieldName | `(t: string) => string` | Function to derive the connection field name from a table name |
| orderByTypeName | `(t: string) => string` | Function to derive the order-by type name from a table name |
| options | `BuildListQueryOptions` | Query options (limit, offset, orderBy) |

### buildRecordQuery

Build a GraphQL query string from doctype metadata.

Generates scalar field selections. When `includeNested` is set, recursively includes descendant link sub-selections derived from the doctype's `links` object.

**Signature:**

```typescript
export declare function buildRecordQuery(meta: DoctypeMeta, recordFieldName: (t: string) => string, recordArgName: (t: string) => string, recordArgType: (t: string) => string, options?: BuildRecordQueryOptions): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` | Doctype metadata to build the query from |
| recordFieldName | `(t: string) => string` | Function to derive the query field name from a table name |
| recordArgName | `(t: string) => string` | Function to derive the argument name from a table name |
| recordArgType | `(t: string) => string` | Function to derive the argument type from a table name |
| options | `BuildRecordQueryOptions` | Query options |

## Interfaces

### BuildListQueryOptions

Options for building a list query

**Definition:**

```typescript
export interface BuildListQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| limit? | `number` | Maximum number of records to return |
| offset? | `number` | Number of records to skip |
| orderBy? | `string` | Order by expression (e.g. 'NAME_ASC', 'CREATED_AT_DESC') |

### BuildRecordQueryOptions

Options for building a record query

**Definition:**

```typescript
export interface BuildRecordQueryOptions {
  doctypeRegistry?: Map<string, DoctypeMeta>;
  includeNested?: boolean | string[];
  maxDepth?: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| doctypeRegistry? | `Map<string, DoctypeMeta>` | Registry of doctype metadata for resolving link targets. Required when `includeNested` is truthy. |
| includeNested? | `boolean \| string[]` | Include nested link sub-selections. - `true`: include all descendant links - `string[]`: include only named links - `false` / omitted: scalar fields only (default) |
| maxDepth? | `number` | Maximum depth for recursive sub-selections. No default — unlimited when omitted. |

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

Get a single record by ID

```typescript
getRecord(doctype: DoctypeRef, recordId: string): Promise<Record<string, unknown> | null>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeRef` | Doctype reference (name and optional slug) |
| recordId | `string` | Record ID to fetch |

#### getRecords

Get multiple records with optional filtering and pagination

```typescript
getRecords(doctype: DoctypeRef, options: {
        filters?: Record<string, unknown>;
        orderBy?: string;
        limit?: number;
        offset?: number;
    }): Promise<Record<string, unknown>[]>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeRef` | Doctype reference (name and optional slug) |
| options | `{ filters?: Record<string, unknown>; orderBy?: string; limit?: number; offset?: number; }` | Query options (filters, orderBy, limit, offset) |

#### getRecordWithNested

Get a single record with nested data from descendant links.

Uses `buildRecordQuery()` to generate a GraphQL query that includes sub-selections for descendant links declared in the doctype's `links`.

```typescript
getRecordWithNested(doctype: DoctypeRef, recordId: string, options: BuildRecordQueryOptions): Promise<Record<string, unknown> | null>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeRef` | Doctype reference (name and optional slug) |
| recordId | `string` | Record ID to fetch |
| options | `BuildRecordQueryOptions` | Query options (includeNested, doctypeRegistry, maxDepth) |

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

