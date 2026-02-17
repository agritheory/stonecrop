# Graphql_middleware API Reference

> This documentation is automatically generated from the TypeScript API.

## Other Components

### ActionDefinition

```typescript
export { ActionDefinition }
```

### DoctypeMeta

```typescript
export { DoctypeMeta }
```

### FieldMeta

```typescript
export { FieldMeta }
```

### FieldOptions

```typescript
export { FieldOptions }
```

### FieldValidation

```typescript
export { FieldValidation }
```

### GQL_SCALAR_MAP

```typescript
export { GQL_SCALAR_MAP }
```

### StonecropFieldType

```typescript
export { StonecropFieldType }
```

### TYPE_MAP

```typescript
export { TYPE_MAP }
```

### WELL_KNOWN_SCALARS

```typescript
export { WELL_KNOWN_SCALARS }
```

### WorkflowMeta

```typescript
export { WorkflowMeta }
```

## Functions

### camelToLabel

Converts camelCase to Title Case label

**Signature:**

```typescript
export declare function camelToLabel(camelCase: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| camelCase | `string` | Camel case string |

### camelToSnake

Converts camelCase to snake_case

**Signature:**

```typescript
export declare function camelToSnake(camelCase: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| camelCase | `string` | Camel case string |

### classifyFieldType

Classify a single GraphQL field into a Stonecrop field definition.

Classification rules (in order): 1. Scalar types → look up in merged scalar map 2. Enum types → `Select` with enum values as options 3. Object types that are entities → `Link` with slug as options 4. Object types that are Connections → `Doctype` with node type slug as options 5. List of entity type → `Doctype` with item type slug as options 6. Anything else → `Data` with `_unmapped: true`

**Signature:**

```typescript
export declare function classifyFieldType(fieldName: string, field: GraphQLField<unknown, unknown>, entityTypes: Set<string>, options?: GraphQLConversionOptions): GraphQLConversionFieldMeta;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| fieldName | `string` | The GraphQL field name |
| field | `GraphQLField<unknown, unknown>` | The GraphQL field definition |
| entityTypes | `Set<string>` | Set of type names classified as entities |
| options | `GraphQLConversionOptions` | Conversion options (for custom scalars, unmapped meta, etc.) |

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

### convertGraphQLSchema

Convert a GraphQL schema to Stonecrop doctype schemas.

Accepts either an `IntrospectionQuery` result object or an SDL string. Entity types are identified using heuristics (or a custom `isEntityType` function) and converted to `DoctypeMeta`-compatible JSON objects.

**Signature:**

```typescript
export declare function convertGraphQLSchema(source: IntrospectionSource, options?: GraphQLConversionOptions): ConvertedGraphQLDoctype[];
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| source | `IntrospectionSource` | GraphQL introspection result or SDL string |
| options | `GraphQLConversionOptions` | Conversion options for controlling output format and behavior |

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

### defaultIsEntityField

Default heuristic to filter fields on entity types. Skips internal fields that don't represent meaningful data.

**Signature:**

```typescript
export declare function defaultIsEntityField(fieldName: string, _field: GraphQLField<unknown, unknown>, _parentType: GraphQLObjectType): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| fieldName | `string` | The GraphQL field name |
| _field | `GraphQLField<unknown, unknown>` | The GraphQL field definition (unused in default implementation) |
| _parentType | `GraphQLObjectType` | The parent entity type (unused in default implementation) |

### defaultIsEntityType

Default heuristic to determine if a GraphQL object type represents an entity. An entity type becomes a Stonecrop doctype.

This heuristic excludes: - Introspection types (`__*`) - Root operation types (`Query`, `Mutation`, `Subscription`) - Types with synthetic suffixes (e.g., `*Connection`, `*Edge`, `*Input`) - Types starting with `Node` interface marker (exact match only)

**Signature:**

```typescript
export declare function defaultIsEntityType(typeName: string, type: GraphQLObjectType): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| typeName | `string` | The GraphQL type name |
| type | `GraphQLObjectType` | The GraphQL object type definition |

### getAllMeta

Get all loaded doctypes

**Signature:**

```typescript
export declare function getAllMeta(): DoctypeMeta[];
```

### getDefaultComponent

Get the default component for a field type

**Signature:**

```typescript
export declare function getDefaultComponent(fieldtype: StonecropFieldType): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| fieldtype | `StonecropFieldType` | The semantic field type |

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

### parseDoctype

Parse and validate a doctype, throwing on failure

**Signature:**

```typescript
export declare function parseDoctype(data: unknown): DoctypeMeta;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| data | `unknown` | Data to parse |

### parseField

Parse and validate a field, throwing on failure

**Signature:**

```typescript
export declare function parseField(data: unknown): FieldMeta;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| data | `unknown` | Data to parse |

### pascalToSnake

Convert PascalCase to snake_case (e.g., for deriving table names from type names)

**Signature:**

```typescript
export declare function pascalToSnake(pascal: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| pascal | `string` | PascalCase string |

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

### snakeToCamel

Converts snake_case to camelCase

**Signature:**

```typescript
export declare function snakeToCamel(snakeCase: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| snakeCase | `string` | Snake case string |

### snakeToLabel

Converts snake_case to Title Case label

**Signature:**

```typescript
export declare function snakeToLabel(snakeCase: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| snakeCase | `string` | Snake case string |

### toPascalCase

Convert table name to PascalCase doctype name

**Signature:**

```typescript
export declare function toPascalCase(tableName: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| tableName | `string` | SQL table name (snake_case) |

### toSlug

Convert to kebab-case slug

**Signature:**

```typescript
export declare function toSlug(name: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Name to convert |

### validateDoctype

Validate a doctype definition

**Signature:**

```typescript
export declare function validateDoctype(data: unknown): ValidationResult;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| data | `unknown` | Data to validate |

### validateField

Validate a field definition

**Signature:**

```typescript
export declare function validateField(data: unknown): ValidationResult;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| data | `unknown` | Data to validate |

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

### ConvertedGraphQLDoctype

Output of GraphQL schema conversion — one per entity type.

**Definition:**

```typescript
export interface ConvertedGraphQLDoctype {
  _graphqlTypeName?: string;
  fields: GraphQLConversionFieldMeta[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _graphqlTypeName? | `string` | Original GraphQL type name (for debugging/reference) |
| fields | `GraphQLConversionFieldMeta[]` | Field definitions with optional GraphQL conversion metadata |

### GraphQLConversionFieldMeta

Extended field metadata with optional GraphQL conversion metadata. Only present when `includeUnmappedMeta` is enabled.

**Definition:**

```typescript
export interface GraphQLConversionFieldMeta {
  _graphqlType?: string;
  _unmapped?: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _graphqlType? | `string` | Original GraphQL type name (for debugging/reference) |
| _unmapped? | `boolean` | Marks fields that couldn't be automatically mapped |

### GraphQLConversionOptions

Options for converting a GraphQL schema to Stonecrop doctype schemas. All hooks are optional — sensible defaults are provided for common GraphQL patterns.

**Definition:**

```typescript
export interface GraphQLConversionOptions {
  classifyField?: (fieldName: string, field: GraphQLField<unknown, unknown>, parentType: GraphQLObjectType) => Partial<FieldMeta> | null;
  customScalars?: Record<string, Partial<FieldTemplate>>;
  deriveTableName?: (typeName: string) => string | undefined;
  exclude?: string[];
  include?: string[];
  includeUnmappedMeta?: boolean;
  isEntityField?: (fieldName: string, field: GraphQLField<unknown, unknown>, parentType: GraphQLObjectType) => boolean;
  isEntityType?: (typeName: string, type: GraphQLObjectType) => boolean;
  typeOverrides?: Record<string, Record<string, Partial<FieldMeta>>>;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| classifyField? | `(fieldName: string, field: GraphQLField<unknown, unknown>, parentType: GraphQLObjectType) => Partial<FieldMeta> \| null` | Escape hatch: fully override the classification of a specific field. When this returns a non-null value, it is used as the field definition (merged with the field name). Return `null` to fall through to default classification. |
| customScalars? | `Record<string, Partial<FieldTemplate>>` | Map custom or non-standard GraphQL scalar types to Stonecrop field types. Merged with the built-in scalar maps (GQL_SCALAR_MAP + WELL_KNOWN_SCALARS). User-provided entries take highest precedence. |
| deriveTableName? | `(typeName: string) => string \| undefined` | Custom function to derive the database table name from a GraphQL type name. The default converts PascalCase to snake_case (e.g., `SalesOrder` → `sales_order`). Return `undefined` to omit `tableName` from the output. |
| exclude? | `string[]` | GraphQL type names to exclude from conversion. Applied after `isEntityType` filtering. |
| include? | `string[]` | Whitelist of GraphQL type names to convert. When provided, only these types are considered (after `isEntityType` filtering). |
| includeUnmappedMeta? | `boolean` | Include `_graphqlType` and `_unmapped` metadata on converted fields. Useful for debugging conversions. Defaults to `false`. |
| isEntityField? | `(fieldName: string, field: GraphQLField<unknown, unknown>, parentType: GraphQLObjectType) => boolean` | Custom function to filter which fields on an entity type are included. When provided, replaces the default field filter. The default filter excludes `nodeId`, `__typename`, and `clientMutationId`. |
| isEntityType? | `(typeName: string, type: GraphQLObjectType) => boolean` | Custom function to determine if a GraphQL object type represents an entity (→ doctype). When provided, replaces the default heuristic entirely. The default heuristic excludes types matching synthetic patterns: `*Connection`, `*Edge`, `*Input`, `*Patch`, `*Payload`, `*Condition`, `*Filter`, `*OrderBy`, `*Aggregate`, `Query`, `Mutation`, `Subscription`, `__*`. |
| typeOverrides? | `Record<string, Record<string, Partial<FieldMeta>>>` | Per-type, per-field overrides for the converted field definitions. Outer key is the GraphQL type name, inner key is the field name. |

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

### RouteContext

Route context for identifying what doctype/record we're working with

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

### StonecropPluginOptions

Options for creating a Stonecrop PostGraphile plugin

**Definition:**

```typescript
export interface StonecropPluginOptions {
  executor: GraphQLExecutor;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| executor | `GraphQLExecutor` | GraphQL executor for running queries/mutations |

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

### ValidationResult

Result of a validation operation

**Definition:**

```typescript
export interface ValidationResult {
  errors: ValidationError[];
  success: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| errors | `ValidationError[]` | List of validation errors (empty if success) |
| success | `boolean` | Whether validation passed |

## Type Aliases

### ActionDefinition

Action definition type inferred from Zod schema

**Definition:**

```typescript
export type ActionDefinition = z.infer<typeof ActionDefinition>;
```

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

### FieldMeta

Field metadata type inferred from Zod schema

**Definition:**

```typescript
export type FieldMeta = z.infer<typeof FieldMeta>;
```

### FieldOptions

Field options type inferred from Zod schema

**Definition:**

```typescript
export type FieldOptions = z.infer<typeof FieldOptions>;
```

### FieldValidation

Field validation type inferred from Zod schema

**Definition:**

```typescript
export type FieldValidation = z.infer<typeof FieldValidation>;
```

### IntrospectionSource

Input source for the GraphQL schema converter. Accepts either a standard GraphQL introspection result or an SDL string.

- `IntrospectionQuery`: The raw result of a GraphQL introspection query (from any server) - `string`: An SDL (Schema Definition Language) string

Note: URL fetching is intentionally not supported in the library API. Use the CLI (`stonecrop-schema generate --endpoint <url>`) for endpoint fetching, or fetch the introspection result yourself and pass it in.

**Definition:**

```typescript
export type IntrospectionSource = IntrospectionQuery | string;
```

### StonecropFieldType

Stonecrop field type enum inferred from Zod schema

**Definition:**

```typescript
export type StonecropFieldType = z.infer<typeof StonecropFieldType>;
```

### WorkflowMeta

Workflow metadata type inferred from Zod schema

**Definition:**

```typescript
export type WorkflowMeta = z.infer<typeof WorkflowMeta>;
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

### builtinHandlers

Built-in handlers available for registration

**Type:**

```typescript
export const builtinHandlers: Record<string, ActionHandler>
```

