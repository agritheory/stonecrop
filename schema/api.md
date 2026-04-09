# Schema API Reference

> This documentation is automatically generated from the TypeScript API.

## Other Components

### ActionDefinition

```typescript
export { ActionDefinition }
```

### Cardinality

```typescript
export { Cardinality }
```

### CustomFetch

```typescript
export { CustomFetch }
```

### DoctypeMeta

```typescript
export { DoctypeMeta }
```

### FetchStrategy

```typescript
export { FetchStrategy }
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

### INTERNAL_SCALARS

```typescript
export { INTERNAL_SCALARS }
```

### LazyFetch

```typescript
export { LazyFetch }
```

### LinkDeclaration

```typescript
export { LinkDeclaration }
```

### StonecropFieldType

```typescript
export { StonecropFieldType }
```

### SyncFetch

```typescript
export { SyncFetch }
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

### buildScalarMap

Build a merged scalar map from the built-in maps and user-provided custom scalars. Precedence (highest to lowest): customScalars → GQL_SCALAR_MAP → WELL_KNOWN_SCALARS

**Signature:**

```typescript
export declare function buildScalarMap(customScalars?: Record<string, Partial<FieldTemplate>>): Record<string, FieldTemplate>;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| customScalars | `Record<string, Partial<FieldTemplate>>` | User-provided scalar overrides |

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

## Interfaces

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

### DataClient

Interface for data clients that fetch doctype metadata and records. Implemented by stonecrop/graphql-client's StonecropClient. Custom implementations can use any backend (REST, local storage, etc.).

**Definition:**

```typescript
export interface DataClient {
  getMeta(context: DoctypeContext): Promise<M | null>;
  getRecord(doctype: T, recordId: string, options: GetRecordOptions): Promise<Record<string, unknown> | null>;
  getRecords(doctype: T, options: GetRecordsOptions): Promise<Record<string, unknown>[]>;
  runAction(doctype: T, action: string, args: unknown[]): Promise<{
        success: boolean;
        data: unknown;
        error: string | null;
    }>;
}
```

### DoctypeContext

Context for identifying what doctype/record we're working with. Used by graphql-middleware and graphql-client to resolve schema metadata.

**Definition:**

```typescript
export interface DoctypeContext {
  doctype: string;
  recordId?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| doctype | `string` | Doctype name (e.g., 'Task', 'Customer') |
| recordId? | `string` | Optional record ID for viewing/editing a specific record |

### DoctypeRef

Base interface for doctype metadata passed to DataClient methods. Only requires properties needed for record fetching.

**Definition:**

```typescript
export interface DoctypeRef {
  name: string;
  slug?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| name | `string` | Doctype name (e.g., 'Task', 'Customer') |
| slug? | `string` | URL-friendly slug (e.g., 'task', 'customer') |

### FieldTemplate

Field template for TYPE_MAP entries. Defines the default component and semantic field type for a field.

**Definition:**

```typescript
export interface FieldTemplate {
  component: string;
  fieldtype: StonecropFieldType;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| component | `string` | The Vue component name to render this field (e.g., 'ATextInput', 'ADropdown') |
| fieldtype | `StonecropFieldType` | The semantic field type (e.g., 'Data', 'Int', 'Select') |

### GetRecordOptions

Options for fetching a single record

**Definition:**

```typescript
export interface GetRecordOptions {
  includeNested?: boolean | string[];
  maxDepth?: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| includeNested? | `boolean \| string[]` | Include nested link sub-selections. - `true`: include all descendant links - `string[]`: include only named links - `false` / omitted: scalar fields only (default) |
| maxDepth? | `number` | Maximum depth for recursive sub-selections. No default — unlimited when omitted. |

### GetRecordsOptions

Options for fetching multiple records

**Definition:**

```typescript
export interface GetRecordsOptions {
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  orderBy?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| filters? | `Record<string, unknown>` | Filter expression (field-value pairs) |
| limit? | `number` | Maximum number of records to return |
| offset? | `number` | Number of records to skip |
| orderBy? | `string` | Order by expression (e.g. 'NAME_ASC') |

### GraphQLConversionFieldMeta

Extended field metadata with optional GraphQL conversion metadata. Only present when `includeUnmappedMeta` is enabled.

**Definition:**

```typescript
export interface GraphQLConversionFieldMeta {
  _graphqlType?: string;
  _isLink?: boolean;
  _unmapped?: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _graphqlType? | `string` | Original GraphQL type name (for debugging/reference) |
| _isLink? | `boolean` | Marks relationship fields that belong in `links`, not `fields` |
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

### ValidationError

Validation error with path information

**Definition:**

```typescript
export interface ValidationError {
  message: string;
  path: PropertyKey[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| message | `string` | Error message |
| path | `PropertyKey[]` | Path to the invalid property |

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

### Cardinality

Cardinality type inferred from Zod schema

**Definition:**

```typescript
export type Cardinality = z.infer<typeof Cardinality>;
```

### CustomFetch

Custom fetch strategy type

**Definition:**

```typescript
export type CustomFetch = z.infer<typeof CustomFetch>;
```

### DoctypeMeta

Doctype metadata type inferred from Zod schema

**Definition:**

```typescript
export type DoctypeMeta = z.infer<typeof DoctypeMeta>;
```

### FetchStrategy

Fetch strategy type

**Definition:**

```typescript
export type FetchStrategy = z.infer<typeof FetchStrategy>;
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

### LazyFetch

Lazy fetch strategy type

**Definition:**

```typescript
export type LazyFetch = z.infer<typeof LazyFetch>;
```

### LinkDeclaration

Link declaration type inferred from Zod schema

**Definition:**

```typescript
export type LinkDeclaration = z.infer<typeof LinkDeclaration>;
```

### SerializedFunction

Serialized function type - a function serialized to a string. Used for custom fetch handlers.

**Definition:**

```typescript
export type SerializedFunction = string;
```

### StonecropFieldType

Stonecrop field type enum inferred from Zod schema

**Definition:**

```typescript
export type StonecropFieldType = z.infer<typeof StonecropFieldType>;
```

### SyncFetch

Sync fetch strategy type

**Definition:**

```typescript
export type SyncFetch = z.infer<typeof SyncFetch>;
```

### WorkflowMeta

Workflow metadata type inferred from Zod schema

**Definition:**

```typescript
export type WorkflowMeta = z.infer<typeof WorkflowMeta>;
```

