---
title: GraphQL Client API Reference
description: GraphQL client utilities
---

# Graphql_client API Reference

> This documentation is automatically generated from the TypeScript API.

## Other Components

### DoctypeMeta

```typescript
export { DoctypeMeta }
```

## Interfaces

### RouteContext

Route context for identifying what doctype/record we're working with. Used by graphql-middleware and graphql-client to resolve schema metadata.

**Definition:**

```typescript
export interface RouteContext {
  doctype: string;
  recordId?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| doctype | `string` | Doctype name (e.g., 'Task', 'Customer') |
| recordId? | `string` | Optional record ID for viewing/editing a specific record |

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

### DoctypeMeta

Doctype metadata type inferred from Zod schema

**Definition:**

```typescript
export type DoctypeMeta = z.infer<typeof DoctypeMeta>;
```

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
getMeta(context: RouteContext): Promise<DoctypeMeta | null>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| context | `RouteContext` | Route context containing doctype name |

#### getRecord

Get a single record by ID

```typescript
getRecord(doctype: DoctypeMeta, recordId: string): Promise<Record<string, unknown> | null>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeMeta` | Doctype metadata |
| recordId | `string` | Record ID to fetch |

#### getRecords

Get multiple records with optional filtering and pagination

```typescript
getRecords(doctype: DoctypeMeta, options: {
        filters?: Record<string, unknown>;
        orderBy?: string;
        limit?: number;
        offset?: number;
    }): Promise<Record<string, unknown>[]>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeMeta` | Doctype metadata |
| options | `{ filters?: Record<string, unknown>; orderBy?: string; limit?: number; offset?: number; }` | Query options (filters, orderBy, limit, offset) |

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
runAction(doctype: DoctypeMeta, action: string, args: unknown[]): Promise<{
        success: boolean;
        data: unknown;
        error: string | null;
    }>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeMeta` | Doctype metadata |
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

