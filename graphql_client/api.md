# Graphql_client API Reference

> This documentation is automatically generated from the TypeScript API.

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

