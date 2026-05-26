---
title: Schema API Reference
description: Doctype schema definitions and validation
---

# Schema API Reference

> This documentation is automatically generated from the TypeScript API.

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

Get the default component for a builtin field type. For an open-string fieldtype that may be custom, use `resolveComponent` instead.

**Signature:**

```typescript
export declare function getDefaultComponent(fieldtype: BuiltinFieldType): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| fieldtype | `BuiltinFieldType` | A builtin field type |

### isBuiltinFieldType

Returns `true` when `fieldtype` is one of the builtin types Stonecrop ships with.

**Signature:**

```typescript
export declare function isBuiltinFieldType(fieldtype: string): fieldtype is BuiltinFieldType;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| fieldtype | `string` |  |

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

### resolveComponent

Resolve the component name for any fieldtype string, falling back to `'ATextInput'` for unknown custom types.

**Signature:**

```typescript
export declare function resolveComponent(fieldtype: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| fieldtype | `string` | Any fieldtype string (builtin or custom) |

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

### ColumnSchema

Authoring contract for doctype field declarations that can be rendered as table columns. Pass a `ColumnSchema[]` array to ATable's `:schema` prop; `schemaToColumns` converts it to `TableColumn[]` internally — callers working from a doctype schema never need to construct `TableColumn` directly.

Notes on specific properties: - `align` uses an explicit string union rather than `CanvasTextAlign` — this package is used server-side by the CLI where browser DOM types are absent. The values are identical. - `format` is a serialized function string; the table store's `getFormattedValue` deserializes it via `Function(...)`. `TableColumn.format` widens this to also accept a live function. - `mask` is absent — it is function-typed only and cannot be serialized to JSON. It lives exclusively on `TableColumn`. - `modalComponent` is string-only — functions cannot appear in schema JSON. `TableColumn` widens this to also accept a factory function.

**Definition:**

```typescript
export interface ColumnSchema {
  align?: 'left' | 'right' | 'center' | 'start' | 'end';
  cellComponent?: string;
  cellComponentProps?: Record<string, any>;
  colspan?: number;
  edit?: boolean;
  fieldname: string;
  fieldtype?: string;
  filterable?: boolean;
  filterComponent?: string;
  filterOptions?: any[];
  filterType?: 'text' | 'select' | 'number' | 'date' | 'dateRange' | 'checkbox' | 'component';
  format?: string;
  ganttComponent?: string;
  hidden?: boolean;
  isGantt?: boolean;
  label?: string;
  modalComponent?: string;
  modalComponentExtraProps?: Record<string, any>;
  pinned?: boolean;
  resizable?: boolean;
  sortable?: boolean;
  width?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| align? | `'left' \| 'right' \| 'center' \| 'start' \| 'end'` | Horizontal text alignment for the column cell and header. |
| cellComponent? | `string` | Registered component name rendered inside the table cell instead of the default display. When absent, the table renders the value as plain text in a `<td>`. |
| cellComponentProps? | `Record<string, any>` | Additional props passed to `cellComponent`. Only applicable when `cellComponent` is set. |
| colspan? | `number` | Number of columns this Gantt bar spans across. When absent, the bar stretches to cover all non-pinned columns in the table. Only applicable for Gantt tables. |
| edit? | `boolean` | Whether the column cell is editable in the table. |
| fieldname | `string` | Unique identifier for the field within its doctype. Maps to `name` on `TableColumn`. |
| fieldtype? | `string` | Semantic field type (e.g. `'Data'`, `'Int'`, `'Date'`, `'Check'`). Fields without a `fieldtype` are treated as non-scalar (nested table or fieldset) and excluded by `schemaToColumns`. |
| filterable? | `boolean` | When `true`, a filter control is rendered in the column header. |
| filterComponent? | `string` | Registered component name used when `filterType` is `'component'`. |
| filterOptions? | `any[]` | Static option list for `filterType: 'select'`. When absent, options are derived from the unique values present in the column's rows. |
| filterType? | `'text' \| 'select' \| 'number' \| 'date' \| 'dateRange' \| 'checkbox' \| 'component'` | The type of filter control to render. When absent, a default is derived from `fieldtype` (`Check` → `checkbox`, `Date` → `date`, `Datetime` → `dateRange`, `Select` → `select`, numeric types → `number`, everything else → `text`). |
| format? | `string` | Serialized function string used to format the cell value for display. Deserialized at render time by the table store's `getFormattedValue`. `TableColumn.format` widens this to also accept a live function directly. |
| ganttComponent? | `string` | Registered component name used to render Gantt bars in this column. Only applicable for Gantt tables. |
| hidden? | `boolean` | When `true`, the field is excluded from the derived columns by `schemaToColumns`. |
| isGantt? | `boolean` | When `true`, this column is treated as a Gantt bar column. Only applicable for Gantt tables. |
| label? | `string` | Human-readable column header. When absent, ATable assigns labels alphabetically (A, B, C, …). |
| modalComponent? | `string` | Registered component name rendered in the cell's modal editor. String-only — functions cannot appear in schema JSON. `TableColumn.modalComponent` widens this to also accept a factory function. The following props are automatically passed to the modal component: - `colIndex` — the column index of the current cell - `rowIndex` — the row index of the current cell - `store` — the table data store |
| modalComponentExtraProps? | `Record<string, any>` | Extra props passed to `modalComponent` in addition to the standard cell props. Only applicable when `modalComponent` is set. |
| pinned? | `boolean` | When `true`, the column is pinned to the left side of the table. |
| resizable? | `boolean` | When `true`, the column can be resized by dragging the header edge. |
| sortable? | `boolean` | When `true`, clicking the column header sorts the table by this column. |
| width? | `string` | CSS width of the column (e.g. `'20ch'`, `'200px'`). |

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
  getRecord(doctype: T, recordId: string, options: GetRecordOptions): Promise<GetRecordResult>;
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
  fieldtype: BuiltinFieldType;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| component | `string` | The Vue component name to render this field (e.g., 'ATextInput', 'ADropdown') |
| fieldtype | `BuiltinFieldType` | The semantic field type (e.g., 'Data', 'Int', 'Select') |

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

### GetRecordResult

Result from getRecord - includes the record data

**Definition:**

```typescript
export interface GetRecordResult {
  record: Record<string, unknown> | null;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| record | `Record<string, unknown> \| null` | The record data, or null if not found |

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

### BuiltinFieldType

Union of all builtin fieldtype string literals.

**Definition:**

```typescript
export type BuiltinFieldType = (typeof BUILTIN_FIELD_TYPES)[number];
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

## Variables

### ActionDefinition

Action definition within a workflow

**Type:**

```typescript
export const ActionDefinition: z.ZodObject<{
    label: z.ZodString;
    handler: z.ZodString;
    requiredFields: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allowedStates: z.ZodOptional<z.ZodArray<z.ZodString>>;
    confirm: z.ZodOptional<z.ZodBoolean>;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>
```

### BUILTIN_FIELD_TYPES

The complete list of field types built into Stonecrop. User apps can use any string as a fieldtype; this const is the exhaustive set of types that Stonecrop provides default components for.

**Type:**

```typescript
export const BUILTIN_FIELD_TYPES: readonly ["Data", "Text", "Int", "Float", "Decimal", "Check", "Date", "Time", "Datetime", "Duration", "DateRange", "JSON", "Code", "Link", "Attach", "Currency", "Quantity", "Select", "PrimaryKey"]
```

### Cardinality

Cardinality for relationship links.

**Type:**

```typescript
export const Cardinality: z.ZodEnum<{
    one: "one";
    atMostOne: "atMostOne";
    noneOrMany: "noneOrMany";
    atLeastOne: "atLeastOne";
}>
```

### CustomFetch

Custom fetch strategy - uses a custom handler function.

**Type:**

```typescript
export const CustomFetch: z.ZodObject<{
    method: z.ZodLiteral<"custom">;
    handler: z.ZodString;
}, z.core.$strip>
```

### DoctypeMeta

Doctype metadata - complete definition of a doctype

**Type:**

```typescript
export const DoctypeMeta: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<z.ZodObject<{
        fieldname: z.ZodString;
        fieldtype: z.ZodString;
        component: z.ZodOptional<z.ZodString>;
        label: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodString>;
        align: z.ZodOptional<z.ZodEnum<{
            left: "left";
            center: "center";
            right: "right";
            start: "start";
            end: "end";
        }>>;
        required: z.ZodOptional<z.ZodBoolean>;
        readOnly: z.ZodOptional<z.ZodBoolean>;
        edit: z.ZodOptional<z.ZodBoolean>;
        hidden: z.ZodOptional<z.ZodBoolean>;
        value: z.ZodOptional<z.ZodUnknown>;
        default: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>;
        cardinality: z.ZodOptional<z.ZodEnum<{
            one: "one";
            atMostOne: "atMostOne";
            noneOrMany: "noneOrMany";
            atLeastOne: "atLeastOne";
        }>>;
        mask: z.ZodOptional<z.ZodString>;
        validation: z.ZodOptional<z.ZodObject<{
            errorMessage: z.ZodString;
        }, z.core.$loose>>;
    }, z.core.$strip>>;
    links: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        target: z.ZodString;
        cardinality: z.ZodEnum<{
            one: "one";
            atMostOne: "atMostOne";
            noneOrMany: "noneOrMany";
            atLeastOne: "atLeastOne";
        }>;
        backlink: z.ZodOptional<z.ZodString>;
        component: z.ZodOptional<z.ZodString>;
        fieldname: z.ZodOptional<z.ZodString>;
        fetch: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            method: z.ZodLiteral<"sync">;
            limit: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            method: z.ZodLiteral<"lazy">;
        }, z.core.$strip>, z.ZodObject<{
            method: z.ZodLiteral<"custom">;
            handler: z.ZodString;
        }, z.core.$strip>], "method">>;
        blockWorkflows: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    workflow: z.ZodOptional<z.ZodObject<{
        states: z.ZodOptional<z.ZodArray<z.ZodString>>;
        actions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            label: z.ZodString;
            handler: z.ZodString;
            requiredFields: z.ZodOptional<z.ZodArray<z.ZodString>>;
            allowedStates: z.ZodOptional<z.ZodArray<z.ZodString>>;
            confirm: z.ZodOptional<z.ZodBoolean>;
            args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    inherits: z.ZodOptional<z.ZodString>;
}, z.core.$strip>
```

### FetchStrategy

Fetch strategy for link data loading. - sync: fetched in the initial query - lazy: fetched on demand in a separate query - custom: uses a custom handler function

**Type:**

```typescript
export const FetchStrategy: z.ZodDiscriminatedUnion<[z.ZodObject<{
    method: z.ZodLiteral<"sync">;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    method: z.ZodLiteral<"lazy">;
}, z.core.$strip>, z.ZodObject<{
    method: z.ZodLiteral<"custom">;
    handler: z.ZodString;
}, z.core.$strip>], "method">
```

### FieldMeta

Unified field metadata - the single source of truth for field definitions. Works for both forms (AForm) and tables (ATable).

Core principle: "Text" is "Text" regardless of rendering context.

**Type:**

```typescript
export const FieldMeta: z.ZodObject<{
    fieldname: z.ZodString;
    fieldtype: z.ZodString;
    component: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodString>;
    align: z.ZodOptional<z.ZodEnum<{
        left: "left";
        center: "center";
        right: "right";
        start: "start";
        end: "end";
    }>>;
    required: z.ZodOptional<z.ZodBoolean>;
    readOnly: z.ZodOptional<z.ZodBoolean>;
    edit: z.ZodOptional<z.ZodBoolean>;
    hidden: z.ZodOptional<z.ZodBoolean>;
    value: z.ZodOptional<z.ZodUnknown>;
    default: z.ZodOptional<z.ZodUnknown>;
    options: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>;
    cardinality: z.ZodOptional<z.ZodEnum<{
        one: "one";
        atMostOne: "atMostOne";
        noneOrMany: "noneOrMany";
        atLeastOne: "atLeastOne";
    }>>;
    mask: z.ZodOptional<z.ZodString>;
    validation: z.ZodOptional<z.ZodObject<{
        errorMessage: z.ZodString;
    }, z.core.$loose>>;
}, z.core.$strip>
```

### FieldOptions

Field options - flexible bag for type-specific configuration.

Usage by fieldtype: - Link/Doctype: target doctype slug as string ("customer", "sales-order-item") - Select: array of choices (["Draft", "Submitted", "Cancelled"]) - Decimal: config object ( precision: 10, scale: 2 ) - Code: config object ( language: "python" )

**Type:**

```typescript
export const FieldOptions: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>
```

### FieldValidation

Validation configuration for form fields

**Type:**

```typescript
export const FieldValidation: z.ZodObject<{
    errorMessage: z.ZodString;
}, z.core.$loose>
```

### GQL_SCALAR_MAP

Mapping from standard GraphQL scalar types to Stonecrop field types. These are defined by the GraphQL specification and are always available.

**Type:**

```typescript
export const GQL_SCALAR_MAP: Record<string, FieldTemplate>
```

### INTERNAL_SCALARS

Set of scalar type names that are internal to GraphQL servers and should be skipped during field conversion (they don't represent meaningful data fields).

**Type:**

```typescript
export const INTERNAL_SCALARS: Set<string>
```

### LazyFetch

Lazy fetch strategy - data is fetched on demand in a separate query.

**Type:**

```typescript
export const LazyFetch: z.ZodObject<{
    method: z.ZodLiteral<"lazy">;
}, z.core.$strip>
```

### LinkDeclaration

Link declaration - describes a relationship from one doctype to another.

**Type:**

```typescript
export const LinkDeclaration: z.ZodObject<{
    target: z.ZodString;
    cardinality: z.ZodEnum<{
        one: "one";
        atMostOne: "atMostOne";
        noneOrMany: "noneOrMany";
        atLeastOne: "atLeastOne";
    }>;
    backlink: z.ZodOptional<z.ZodString>;
    component: z.ZodOptional<z.ZodString>;
    fieldname: z.ZodOptional<z.ZodString>;
    fetch: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        method: z.ZodLiteral<"sync">;
        limit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        method: z.ZodLiteral<"lazy">;
    }, z.core.$strip>, z.ZodObject<{
        method: z.ZodLiteral<"custom">;
        handler: z.ZodString;
    }, z.core.$strip>], "method">>;
    blockWorkflows: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>
```

### StonecropFieldType

Stonecrop field type — any non-empty string is valid; Stonecrop provides default components for the builtin types listed in `BUILTIN_FIELD_TYPES`. Custom fieldtypes are supported by supplying an explicit `component` on the field definition.

**Type:**

```typescript
export const StonecropFieldType: z.ZodString
```

### SyncFetch

Sync fetch strategy - data is fetched in the initial query.

**Type:**

```typescript
export const SyncFetch: z.ZodObject<{
    method: z.ZodLiteral<"sync">;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>
```

### TYPE_MAP

Mapping from builtin fieldtypes to their default Vue component. Components can be overridden in the field definition.

**Type:**

```typescript
export const TYPE_MAP: Record<BuiltinFieldType, FieldTemplate>
```

### WELL_KNOWN_SCALARS

Mapping from well-known custom GraphQL scalars to Stonecrop field types. These cover scalars commonly used across GraphQL servers (PostGraphile, Hasura, etc.) without baking in knowledge of any specific server.

Entries here have lower precedence than `customScalars` from options, but higher precedence than unknown/unmapped scalars.

**Type:**

```typescript
export const WELL_KNOWN_SCALARS: Record<string, FieldTemplate>
```

### WorkflowMeta

Workflow metadata - states and actions for a doctype

**Type:**

```typescript
export const WorkflowMeta: z.ZodObject<{
    states: z.ZodOptional<z.ZodArray<z.ZodString>>;
    actions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        label: z.ZodString;
        handler: z.ZodString;
        requiredFields: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allowedStates: z.ZodOptional<z.ZodArray<z.ZodString>>;
        confirm: z.ZodOptional<z.ZodBoolean>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
}, z.core.$strip>
```

