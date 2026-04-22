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

Create a PostGraphile plugin that extends the GraphQL schema with Stonecrop functionality. No arguments required — plan step wiring is entirely internal using pgResources from build.

**Signature:**

```typescript
createStonecropPlugin: (options?: StonecropPluginOptions) => GraphileConfig.Plugin
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `StonecropPluginOptions` |  |

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
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| doctype | `DoctypeMeta` | Doctype metadata for the action being executed |

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
  inflection?: StonecropInflectionConfig;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
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

