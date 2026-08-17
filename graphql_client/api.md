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

### buildListRecordQuery

Build a native PostGraphile query for fetching multiple records.

**Signature:**

```typescript
export declare function buildListRecordQuery(meta: DoctypeMeta, options: QueryBuilderOptions & {
    first?: number;
    offset?: number;
    orderBy?: string;
    condition?: Record<string, unknown>;
}): BuiltQuery;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` |  |
| options | `QueryBuilderOptions & { first?: number; offset?: number; orderBy?: string; condition?: Record<string, unknown>; }` |  |

### buildRelationshipName

Build the PostGraphile relationship field name for a foreign key.

PostGraphile names relationships as `targetTypeByFkField` in camelCase.

**Signature:**

```typescript
export declare function buildRelationshipName(targetDoctypeName: string, fkFieldname: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| targetDoctypeName | `string` |  |
| fkFieldname | `string` |  |

### buildSingleRecordQuery

Build a native PostGraphile query for fetching a single record by ID.

**Signature:**

```typescript
export declare function buildSingleRecordQuery(meta: DoctypeMeta, options: QueryBuilderOptions): BuiltQuery;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` |  |
| options | `QueryBuilderOptions` |  |

### doctypeToListQuery

Convert a PascalCase doctype name to the PostGraphile list query name.

**Signature:**

```typescript
export declare function doctypeToListQuery(doctypeName: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctypeName | `string` |  |

### doctypeToQueryName

Convert a PascalCase doctype name to the camelCase query name PostGraphile uses.

**Signature:**

```typescript
export declare function doctypeToQueryName(doctypeName: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctypeName | `string` |  |

### doctypeToSingleQuery

Convert a PascalCase doctype name to the PostGraphile single-record query name.

**Signature:**

```typescript
export declare function doctypeToSingleQuery(doctypeName: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctypeName | `string` |  |

### transformNativeRecord

Transform a record fetched via native PostGraphile query to the flat format expected by the Stonecrop client. Link fields become objects with `id` and `displayText`.

**Signature:**

```typescript
export declare function transformNativeRecord(record: Record<string, unknown>, linkFields: string[], meta: DoctypeMeta, allMeta: DoctypeMeta[]): Record<string, unknown>;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| record | `Record<string, unknown>` |  |
| linkFields | `string[]` |  |
| meta | `DoctypeMeta` |  |
| allMeta | `DoctypeMeta[]` |  |

## Interfaces

### BuiltQuery

Result of building a native query

**Definition:**

```typescript
export interface BuiltQuery {
  linkFields: string[];
  query: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| linkFields | `string[]` | Field names that are link fields with nested selections. The consumer can use this to know which fields will have relationship data. |
| query | `string` | The GraphQL query string |

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

### QueryBuilderOptions

Options for building queries

**Definition:**

```typescript
export interface QueryBuilderOptions {
  allMeta: DoctypeMeta[];
  maxDepth?: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| allMeta | `DoctypeMeta[]` | All available doctype metadata. Used to resolve target doctypes for link fields. |
| maxDepth? | `number` | Maximum depth for nested link resolution. Defaults to 1 (immediate links only). Set to 0 to disable link expansion. |

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

#### getNativeRecord

Get a single record by ID using PostGraphile's native query with relationship expansion.

Unlike `getRecord()` which uses the `stonecropRecord` resolver returning a JSON blob, this method builds a native PostGraphile query that leverages the ORM's relationship resolution for efficient single-query fetches with JOINs.

Link fields are returned as `{ id, displayText }` objects where `displayText` is resolved from the target doctype's `displayField`.

```typescript
getNativeRecord(doctype: DoctypeRef, recordId: string): Promise<GetRecordResult>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeRef` | Doctype reference (name and optional slug) |
| recordId | `string` | Record ID to fetch |

#### getNativeRecords

Get multiple records using PostGraphile's native query with relationship expansion.

Unlike `getRecords()` which uses the `stonecropRecords` resolver returning JSON blobs, this method builds a native PostGraphile query that leverages the ORM's relationship resolution for efficient single-query fetches with JOINs.

Link fields are returned as `{ id, displayText }` objects where `displayText` is resolved from the target doctype's `displayField`.

```typescript
getNativeRecords(doctype: DoctypeRef, options: {
        limit?: number;
        offset?: number;
    }): Promise<GetRecordsResult>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeRef` | Doctype reference (name and optional slug) |
| options | `{ limit?: number; offset?: number; }` | Query options (limit, offset) |

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
getRecords(doctype: DoctypeRef, options: GetRecordsOptions): Promise<GetRecordsResult>
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

