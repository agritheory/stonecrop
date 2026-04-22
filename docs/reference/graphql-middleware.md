---
title: GraphQL Middleware API Reference
description: PostGraphile middleware for Stonecrop
---

# Graphql_middleware API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### DoctypeMeta

Vue component exported from @stonecrop/graphql_middleware.

```typescript
import { DoctypeMeta } from '@stonecrop/graphql_middleware'
```

### ValidationError

Vue component exported from @stonecrop/graphql_middleware.

```typescript
import { ValidationError } from '@stonecrop/graphql_middleware'
```

## Other Components

### RELATION_FIELDTYPES

```typescript
export { RELATION_FIELDTYPES }
```

### StonecropPreset

```typescript
export { StonecropPreset }
```

## Functions

### buildListQuery

Build a GraphQL connection query to fetch a list of records. Only declares variables ($limit, $offset, $orderBy) that are actually used in the query, avoiding GraphQL spec §5.8.3 violations from unused variable declarations. Excludes Link and Doctype relation fields from the selection set.

**Signature:**

```typescript
declare function buildListQuery(meta: DoctypeMeta, args: BuildListQueryArgs, connectionFieldName: (t: string) => string, orderByTypeName: (t: string) => string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` |  |
| args | `BuildListQueryArgs` |  |
| connectionFieldName | `(t: string) => string` |  |
| orderByTypeName | `(t: string) => string` |  |

### buildRecordQuery

Build a GraphQL query to fetch a single record by ID. When includeNested is set, recursively includes descendant link sub-selections.

**Signature:**

```typescript
declare function buildRecordQuery(meta: DoctypeMeta, recordFieldName: (t: string) => string, recordArgName: (t: string) => string, recordArgType: (t: string) => string, getMeta: (slug: string) => DoctypeMeta | undefined, options?: BuildRecordQueryOptions, reverseConnectionNameFn?: (params: ReverseConnectionParams) => string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| meta | `DoctypeMeta` |  |
| recordFieldName | `(t: string) => string` |  |
| recordArgName | `(t: string) => string` |  |
| recordArgType | `(t: string) => string` |  |
| getMeta | `(slug: string) => DoctypeMeta \| undefined` |  |
| options | `BuildRecordQueryOptions` |  |
| reverseConnectionNameFn | `(params: ReverseConnectionParams) => string` |  |

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

### createStonecropPreset

Create a PostGraphile preset configured for Stonecrop.

The returned preset extends PostGraphile Amber, which provides PostgreSQL integration, Relay-style connections, and the standard PostGraphile schema structure. Stonecrop's `createStonecropPlugin` should be added to the `plugins` array to enable Stonecrop's `stonecropRecord`, `stonecropRecords`, `stonecropMeta`, and `stonecropAction` resolvers.

**Signature:**

```typescript
createStonecropPreset: (options?: StonecropPresetOptions) => GraphileConfig.Preset
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `StonecropPresetOptions` | Optional configuration for field casing |

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

### defaultReverseConnectionName

Default reverse connection name: derives PostGraphile's connection field convention. PostGraphile convention: `{targetPlural}By{FkColumnPascal}Id` - When backlink is defined: FK column is derived from the backlink field name - When backlink is absent: FK column is derived from the parent doctype's table name

**Signature:**

```typescript
declare function defaultReverseConnectionName(params: {
    doctype: string;
    linkName: string;
    backlink?: string;
    target: string;
}): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| params | `{ doctype: string; linkName: string; backlink?: string; target: string; }` |  |

### extractListResult

Extract the list of nodes from a PostGraphile connection query result. Returns an empty array if the connection field is absent.

**Signature:**

```typescript
declare function extractListResult(params: ExtractListResultParams): unknown[];
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| params | `ExtractListResultParams` |  |

### extractSingleResult

Extract a single record from a PostGraphile query result using the record field name.

**Signature:**

```typescript
declare function extractSingleResult(params: ExtractSingleResultParams): unknown;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| params | `ExtractSingleResultParams` |  |

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

### mergeNestedResults

Merge nested connection results into flat arrays. For `noneOrMany`/`atLeastOne` links, the query returns `{ nodes: [...] }`. This flattens them to just `[]` for easier consumption.

**Signature:**

```typescript
declare function mergeNestedResults(params: MergeNestedResultsParams): Record<string, unknown>;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| params | `MergeNestedResultsParams` |  |

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

### BuildListQueryArgs

Arguments for buildListQuery

**Definition:**

```typescript
export interface BuildListQueryArgs {
  limit?: number;
  offset?: number;
  options?: Record<string, unknown>;
  orderBy?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| limit? | `number` | Maximum number of records to return |
| offset? | `number` | Number of records to skip |
| options? | `Record<string, unknown>` | Query options (e.g., includeNested) |
| orderBy? | `string` | OrderBy specification |

### BuildRecordQueryOptions

Options for buildRecordQuery nested selection building

**Definition:**

```typescript
export interface BuildRecordQueryOptions {
  includeNested?: boolean | string[];
  maxDepth?: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| includeNested? | `boolean \| string[]` | Include nested/related records |
| maxDepth? | `number` | Maximum nesting depth |

### ExtractListResultParams

Parameters for extractListResult

**Definition:**

```typescript
export interface ExtractListResultParams {
  connectionFieldName: (tableName: string) => string;
  meta: DoctypeMeta;
  result: unknown;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| connectionFieldName | `(tableName: string) => string` | Function to derive the connection field name from a table name |
| meta | `DoctypeMeta` | Doctype metadata |
| result | `unknown` | The raw query result |

### ExtractSingleResultParams

Parameters for extractSingleResult

**Definition:**

```typescript
export interface ExtractSingleResultParams {
  meta: DoctypeMeta;
  recordFieldName: (tableName: string) => string;
  result: unknown;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| meta | `DoctypeMeta` | Doctype metadata |
| recordFieldName | `(tableName: string) => string` | Function to derive the record field name from a table name |
| result | `unknown` | The raw query result |

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

### MergeNestedResultsParams

Parameters for mergeNestedResults

**Definition:**

```typescript
export interface MergeNestedResultsParams {
  getMeta: (slug: string) => DoctypeMeta | undefined;
  meta: DoctypeMeta;
  record: Record<string, unknown>;
  reverseConnectionNameFn?: (params: ReverseConnectionParams) => string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| getMeta | `(slug: string) => DoctypeMeta \| undefined` | Lookup function to get doctype metadata by slug |
| meta | `DoctypeMeta` | Doctype metadata |
| record | `Record<string, unknown>` | The record object with nested connection data |
| reverseConnectionNameFn? | `(params: ReverseConnectionParams) => string` | Function to derive the reverse connection field name from link params |

### ReverseConnectionParams

Parameters for reverse connection name inflection

**Definition:**

```typescript
export interface ReverseConnectionParams {
  backlink?: string;
  doctype: string;
  linkName: string;
  target: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| backlink? | `string` | Link field on the target that points back to the parent (optional) |
| doctype | `string` | Parent doctype slug |
| linkName | `string` | Link key on the parent |
| target | `string` | Target doctype slug |

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
  reverseConnectionName?: (params: {
        doctype: string;
        linkName: string;
        backlink?: string;
        target: string;
    }) => string;
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
| reverseConnectionName? | `(params: { doctype: string; linkName: string; backlink?: string; target: string; }) => string` | Derive the GraphQL connection field name for a reverse-FK link. PostGraphile convention: `{targetPlural}By{FkColumnPascal}Id` - When backlink is provided: FK column is derived from the backlink field - When backlink is absent: FK column is derived from the parent doctype |

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

### StonecropPresetOptions

Options for configuring a StonecropPreset.

**Definition:**

```typescript
export interface StonecropPresetOptions {
  fieldCasing?: FieldCasing;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| fieldCasing? | `FieldCasing` | Field name casing convention for generated GraphQL field names. `'camel'` (default) produces names like `createdAt`, `taskTitle`. `'pascal'` produces names like `CreatedAt`, `TaskTitle`. |

### StonecropRecordOptions

Options for stonecropRecord queries

**Definition:**

```typescript
export interface StonecropRecordOptions {
  includeNested?: boolean | string[];
  maxDepth?: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| includeNested? | `boolean \| string[]` | Include nested/related records |
| maxDepth? | `number` | Maximum nesting depth |

## Type Aliases

### ActionHandler

Action handler function signature

**Definition:**

```typescript
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>;
```

### FieldCasing

Field name casing convention for generated GraphQL field names.

**Definition:**

```typescript
export type FieldCasing = 'camel' | 'pascal';
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

### typeDefs

GraphQL type definitions for Stonecrop's middleware API. Includes stonecropMeta, stonecropRecord, stonecropRecords, stonecropAction, and related types.

**Type:**

```typescript
export const typeDefs: import("graphql").DocumentNode
```

