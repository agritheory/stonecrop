# Graphql_middleware API Reference

> This documentation is automatically generated from the TypeScript API.

## Other Components

### DoctypeMeta

```typescript
export { DoctypeMeta }
```

### RELATION_FIELDTYPES

```typescript
export { RELATION_FIELDTYPES }
```

## Functions

### buildListQuery

Build a GraphQL connection query to fetch a list of records. Only declares variables ($limit, $offset, $orderBy) that are actually used in the query, avoiding GraphQL spec §5.8.3 violations from unused variable declarations. Excludes Link and Doctype relation fields from the selection set.

**Signature:**

```typescript
declare function buildListQuery(meta: DoctypeMeta, args: {
    limit?: number;
    offset?: number;
    orderBy?: string;
}, connectionFieldName: (t: string) => string, orderByTypeName: (t: string) => string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` |  |
| args | `{ limit?: number; offset?: number; orderBy?: string; }` |  |
| connectionFieldName | `(t: string) => string` |  |
| orderByTypeName | `(t: string) => string` |  |

### buildRecordQuery

Build a GraphQL query to fetch a single record by ID. Excludes Link and Doctype relation fields from the selection set. The PK argument name and type are configurable via `StonecropInflectionConfig.recordArgName` and `StonecropInflectionConfig.recordArgType` to match the target schema's conventions (e.g. `rowId: UUID!` for PostGraphile Amber with row_id columns).

**Signature:**

```typescript
declare function buildRecordQuery(meta: DoctypeMeta, recordFieldName: (t: string) => string, recordArgName: (t: string) => string, recordArgType: (t: string) => string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` |  |
| recordFieldName | `(t: string) => string` |  |
| recordArgName | `(t: string) => string` |  |
| recordArgType | `(t: string) => string` |  |

### clearHandlers

Clear all registered handlers

**Signature:**

```typescript
export declare function clearHandlers(): void;
```

### clearRegistry

Clear all registered doctypes

**Signature:**

```typescript
export declare function clearRegistry(): void;
```

### createStonecropPlugin

Create a PostGraphile plugin that extends the GraphQL schema with Stonecrop functionality

**Signature:**

```typescript
createStonecropPlugin: (options: StonecropPluginOptions) => GraphileConfig.Plugin
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `StonecropPluginOptions` | Plugin configuration options |

### defaultConnectionFieldName

Amber default: sales_orders → allSalesOrders

**Signature:**

```typescript
declare function defaultConnectionFieldName(tableName: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| tableName | `string` |  |

### defaultOrderByTypeName

Amber default: sales_orders → SalesOrdersOrderBy

**Signature:**

```typescript
declare function defaultOrderByTypeName(tableName: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| tableName | `string` |  |

### defaultRecordArgName

Default PK argument name: 'id' (standard Relay Global ID pattern). Override via `StonecropInflectionConfig.recordArgName` when using row_id columns; PostGraphile Amber generates `rowId: UUID!` for those fields.

**Signature:**

```typescript
declare function defaultRecordArgName(_tableName: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| _tableName | `string` |  |

### defaultRecordArgType

Default PK argument type: 'UUID!' (PostGraphile Amber default for UUID PKs). Override via `StonecropInflectionConfig.recordArgType` when using non-UUID PKs such as integer serials or Relay Global IDs ('ID!').

**Signature:**

```typescript
declare function defaultRecordArgType(_tableName: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| _tableName | `string` |  |

### defaultRecordFieldName

Amber default: sales_orders → salesOrderById Uses `pluralize` for proper singularization of irregular plurals. Override via `StonecropInflectionConfig.recordFieldName` for non-standard PK columns.

**Signature:**

```typescript
declare function defaultRecordFieldName(tableName: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| tableName | `string` |  |

### getAllMeta

Get all loaded doctypes

**Signature:**

```typescript
export declare function getAllMeta(): DoctypeMeta[];
```

### getHandler

Get a registered handler by name

**Signature:**

```typescript
export declare function getHandler(name: string): ActionHandler | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Name of the action handler to retrieve |

### getMeta

Get a doctype by name

**Signature:**

```typescript
export declare function getMeta(name: string): DoctypeMeta | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Name of the doctype to retrieve |

### hasHandler

Check if a handler is registered

**Signature:**

```typescript
export declare function hasHandler(name: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Name of the action handler to check |

### hasMeta

Check if a doctype is registered

**Signature:**

```typescript
export declare function hasMeta(name: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Name of the doctype to check |

### loadDoctypes

Load doctype definitions from a directory of JSON files

**Signature:**

```typescript
export declare function loadDoctypes(dir: string, options?: LoadDoctypesOptions): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| dir | `string` | Directory path containing doctype JSON files |
| options | `LoadDoctypesOptions` | Options for loading doctypes (continueOnError, onError callback) |

### loadDoctypesFromObject

Load doctypes from an object (for programmatic use)

**Signature:**

```typescript
export declare function loadDoctypesFromObject(doctypes: Record<string, unknown>, options?: LoadDoctypesOptions): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctypes | `Record<string, unknown>` | Object mapping doctype names to doctype definitions |
| options | `LoadDoctypesOptions` | Options for loading doctypes (continueOnError, onError callback) |

### queryableFieldNames

Filter fields to only those directly queryable as scalars, excluding Link and Doctype relation fields that require GraphQL sub-selections.

**Signature:**

```typescript
declare function queryableFieldNames(meta: DoctypeMeta): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` |  |

### registerBuiltinHandlers

Register all built-in handlers

**Signature:**

```typescript
export declare function registerBuiltinHandlers(): void;
```

### registerHandler

Register an action handler

**Signature:**

```typescript
export declare function registerHandler(name: string, handler: ActionHandler): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Unique name for the action handler |
| handler | `ActionHandler` | Action handler function to register |

### validateReferences

Validate cross-doctype references (Link fields, inherits, etc.) Call after all doctypes are loaded.

**Signature:**

```typescript
export declare function validateReferences(): ValidationError[];
```

## Interfaces

### ActionContext

Context passed to action handlers

**Definition:**

```typescript
export interface ActionContext {
  doctype: DoctypeMeta;
  executor: GraphQLExecutor;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| doctype | `DoctypeMeta` | Doctype metadata for the action being executed |
| executor | `GraphQLExecutor` | GraphQL executor for running queries/mutations within the action |

### GraphQLExecutor

GraphQL executor interface for running queries/mutations

**Definition:**

```typescript
export interface GraphQLExecutor {
  mutate(mutation: string, variables: Record<string, unknown>): Promise<T>;
  query(query: string, variables: Record<string, unknown>): Promise<T>;
}
```

### LoadDoctypesOptions

Options for loading doctype definitions

**Definition:**

```typescript
export interface LoadDoctypesOptions {
  continueOnError?: boolean;
  onError?: (file: string, errors: ValidationError[]) => void;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| continueOnError? | `boolean` | Continue loading other files if one fails validation |
| onError? | `(file: string, errors: ValidationError[]) => void` | Callback for validation errors when continueOnError is true |

### StonecropInflectionConfig

Inflection callbacks for mapping table names to GraphQL query field names. Override these when using a non-Amber inflection preset (e.g., V4, SimplifyInflection).

Defaults match the PostGraphile Amber preset conventions.

**Definition:**

```typescript
export interface StonecropInflectionConfig {
  connectionFieldName?: (tableName: string) => string;
  orderByTypeName?: (tableName: string) => string;
  recordArgName?: (tableName: string) => string;
  recordArgType?: (tableName: string) => string;
  recordFieldName?: (tableName: string) => string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| connectionFieldName? | `(tableName: string) => string` | Given a table name, return the GraphQL field name for fetching a list/connection. |
| orderByTypeName? | `(tableName: string) => string` | Given a table name, return the GraphQL OrderBy enum type name. |
| recordArgName? | `(tableName: string) => string` | Given a table name, return the GraphQL argument name used to look up a record by PK. |
| recordArgType? | `(tableName: string) => string` | Given a table name, return the GraphQL variable type for the PK argument. |
| recordFieldName? | `(tableName: string) => string` | Given a table name, return the GraphQL field name for fetching a single record by ID. |

### StonecropPluginOptions

Options for creating a Stonecrop PostGraphile plugin

**Definition:**

```typescript
export interface StonecropPluginOptions {
  executor: GraphQLExecutor;
  inflection?: StonecropInflectionConfig;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| executor | `GraphQLExecutor` | GraphQL executor for running queries/mutations |
| inflection? | `StonecropInflectionConfig` | Override inflection conventions for mapping table names to GraphQL field names. Defaults to PostGraphile Amber preset conventions. |

### ValidationError

Validation error with path information

**Definition:**

```typescript
export interface ValidationError {
  message: string;
  path: (string | number)[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| message | `string` | Error message |
| path | `(string \| number)[]` | Path to the invalid property |

## Type Aliases

### ActionHandler

Action handler function signature

**Definition:**

```typescript
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>;
```

### DoctypeMeta

Doctype metadata type inferred from Zod schema

**Definition:**

```typescript
export type DoctypeMeta = z.infer<typeof DoctypeMeta>;
```

## Classes

### DoctypeValidationError

Error thrown when a doctype definition fails validation

**Constructor:**

```typescript
new DoctypeValidationError(file: string, errors: ValidationError[])
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| errors | `ValidationError[]` | List of validation errors found |
| file | `string` | File path or name where the validation error occurred |

## Variables

### builtinHandlers

Built-in handlers available for registration

**Type:**

```typescript
export const builtinHandlers: Record<string, ActionHandler>
```

