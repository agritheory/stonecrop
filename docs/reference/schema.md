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

### componentCategory

Resolve a component's semantic category, or `undefined` for an absent/unknown component (so callers can fall back to a legacy `fieldtype`-based path during the migration).

**Signature:**

```typescript
export declare function componentCategory(component?: string): ComponentCategory | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| component | `string` |  |

### componentLinkExpansion

Resolve a component's link expansion, or `undefined` for an absent/unmapped component.

**Signature:**

```typescript
export declare function componentLinkExpansion(component?: string): LinkExpansion | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| component | `string` |  |

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

### isActionAllowedInState

Whether a workflow action may run from `currentState`.

Single source of truth for the "is this action available here" rule, shared by the frontend (`getAvailableTransitions`) and the server-side dispatch guard so the two can never disagree. Empty or absent `allowedStates` means the action is available in ALL states — a plain `allowedStates.includes(currentState)` would wrongly block such actions everywhere.

**Signature:**

```typescript
export declare function isActionAllowedInState(action: {
    allowedStates?: string[] | null;
}, currentState: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| action | `{ allowedStates?: string[] \| null; }` |  |
| currentState | `string` |  |

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
export declare function parseField(data: unknown): import('./field').DoctypeField;
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

### resolveLinkRenderMode

Decide how a *declared* link (one with a `LinkDeclaration`) renders.

Two independent axes: the **component** picks inline vs expand, and when expanding the **cardinality** picks record vs table (many → table). The declaration's component wins over the field's, matching the precedence the resolver already uses for the rendered component.

This is the single definition of "does this link expand" — it is consumed by both the client resolver (which builds the nested schema) and the server column builder (which must still SELECT an `inline` link's FK column). Call it; never re-derive the rule at the call site, or the two will drift and the client will render a table for a column the server never selected.

**Signature:**

```typescript
export declare function resolveLinkRenderMode(link: {
    component?: string;
    cardinality?: string;
}, fieldComponent?: string): LinkRenderMode;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| link | `{ component?: string; cardinality?: string; }` | the link declaration (only `component` and `cardinality` are consulted) |
| fieldComponent | `string` | the linked field's own `component`, used when the declaration names none |

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

Validate a field definition against the DoctypeField discriminated union

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
  component?: string;
  doctype?: string;
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
| component? | `string` | Rendering component (e.g. `'ATextInput'`, `'ANumericInput'`, `'ADate'`). The component-primary replacement for `fieldtype`: default cell formatting and filter widgets derive from its `ComponentCategory`, falling back to `fieldtype` while both are present. |
| doctype? | `string` | Target doctype slug — marks this column as a link (replaces `fieldtype: 'Link'`). When set and no `cellComponent` is given, `schemaToColumns` copies it to `TableColumn.linkDoctype`, which ACell uses to resolve a bare id to display text. |
| edit? | `boolean` | Whether the column cell is editable in the table. |
| fieldname | `string` | Unique identifier for the field within its doctype. Maps to `name` on `TableColumn`. |
| fieldtype? | `string` | Semantic field type (e.g. `'Data'`, `'Int'`, `'Date'`, `'Check'`). Legacy — being replaced by `component`. Fields without a `fieldtype` *and* without a `component` are treated as non-scalar (nested table or fieldset) and excluded by `schemaToColumns`. |
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
  fields: ValueField[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _graphqlTypeName? | `string` | Original GraphQL type name (for debugging/reference) |
| fields | `ValueField[]` | Field definitions — GraphQL conversion metadata stripped; same shape as DoctypeMeta.fields |

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

### FieldsetField

A layout container that groups other fields. Resolves to a nested AForm.

**Definition:**

```typescript
export interface FieldsetField {
  collapsible?: boolean;
  component?: string;
  fieldname: string;
  kind: 'fieldset';
  label?: string;
  mode?: InteractionMode;
  schema: DoctypeField[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| collapsible? | `boolean` | Whether the fieldset can be collapsed |
| component? | `string` | Vue component to render this fieldset. Defaults to `'AFieldset'` in resolveSchema. |
| fieldname | `string` | Unique identifier for this fieldset within its doctype |
| kind | `'fieldset'` | Discriminator — identifies this as a fieldset container |
| label? | `string` | Human-readable label for the fieldset legend |
| mode? | `InteractionMode` | Interaction mode for all children inside this fieldset |
| schema | `DoctypeField[]` | Nested field definitions — resolved recursively by resolveSchema |

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
  fieldtype?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _graphqlType? | `string` | Original GraphQL type name (for debugging/reference) |
| _isLink? | `boolean` | Marks relationship fields that belong in `links`, not `fields` |
| _unmapped? | `boolean` | Marks fields that couldn't be automatically mapped |
| fieldtype? | `string` | Semantic field type - optional for link fields which don't have a fieldtype |

### GraphQLConversionOptions

Options for converting a GraphQL schema to Stonecrop doctype schemas. All hooks are optional — sensible defaults are provided for common GraphQL patterns.

**Definition:**

```typescript
export interface GraphQLConversionOptions {
  classifyField?: (fieldName: string, field: GraphQLField<unknown, unknown>, parentType: GraphQLObjectType) => Omit<Partial<ValueField>, 'kind'> | null;
  customScalars?: Record<string, Partial<FieldTemplate>>;
  exclude?: string[];
  include?: string[];
  includeUnmappedMeta?: boolean;
  isEntityField?: (fieldName: string, field: GraphQLField<unknown, unknown>, parentType: GraphQLObjectType) => boolean;
  isEntityType?: (typeName: string, type: GraphQLObjectType) => boolean;
  typeOverrides?: Record<string, Record<string, Omit<Partial<ValueField>, 'kind'>>>;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| classifyField? | `(fieldName: string, field: GraphQLField<unknown, unknown>, parentType: GraphQLObjectType) => Omit<Partial<ValueField>, 'kind'> \| null` | Escape hatch: fully override the classification of a specific field. When this returns a non-null value, it is used as the field definition (merged with the field name). Return `null` to fall through to default classification. |
| customScalars? | `Record<string, Partial<FieldTemplate>>` | Map custom or non-standard GraphQL scalar types to Stonecrop field types. Merged with the built-in scalar maps (GQL_SCALAR_MAP + WELL_KNOWN_SCALARS). User-provided entries take highest precedence. |
| exclude? | `string[]` | GraphQL type names to exclude from conversion. Applied after `isEntityType` filtering. |
| include? | `string[]` | Whitelist of GraphQL type names to convert. When provided, only these types are considered (after `isEntityType` filtering). |
| includeUnmappedMeta? | `boolean` | Include `_graphqlType` and `_unmapped` metadata on converted fields. Useful for debugging conversions. Defaults to `false`. |
| isEntityField? | `(fieldName: string, field: GraphQLField<unknown, unknown>, parentType: GraphQLObjectType) => boolean` | Custom function to filter which fields on an entity type are included. When provided, replaces the default field filter. The default filter excludes `nodeId`, `__typename`, and `clientMutationId`. |
| isEntityType? | `(typeName: string, type: GraphQLObjectType) => boolean` | Custom function to determine if a GraphQL object type represents an entity (→ doctype). When provided, replaces the default heuristic entirely. The default heuristic excludes types matching synthetic patterns: `*Connection`, `*Edge`, `*Input`, `*Patch`, `*Payload`, `*Condition`, `*Filter`, `*OrderBy`, `*Aggregate`, `Query`, `Mutation`, `Subscription`, `__*`. |
| typeOverrides? | `Record<string, Record<string, Omit<Partial<ValueField>, 'kind'>>>` | Per-type, per-field overrides for the converted field definitions. Outer key is the GraphQL type name, inner key is the field name. |

### TableField

An inline table whose columns are defined directly in the schema (no linked doctype). Use when the table data does not warrant a separate doctype.

**Definition:**

```typescript
export interface TableField {
  columns: ColumnSchema[];
  component?: string;
  config?: TableViewConfig;
  fieldname: string;
  kind: 'table';
  label?: string;
  mode?: InteractionMode;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| columns | `ColumnSchema[]` | Column definitions — use ColumnSchema (fieldname key) from stonecrop/schema |
| component? | `string` | Vue component to render this table. Defaults to `'ATable'` in resolveSchema. |
| config? | `TableViewConfig` | View configuration — defaults to `{ view: 'list' }` in resolveSchema when absent |
| fieldname | `string` | Unique identifier for this table within its doctype |
| kind | `'table'` | Discriminator — identifies this as an inline table |
| label? | `string` | Human-readable label |
| mode? | `InteractionMode` | Interaction mode for all cells inside this table |

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

### ValueField

A field that holds a scalar value, a link to another record, or a select choice. The most common kind of field. `fieldtype` determines the default component and behavior.

**Definition:**

```typescript
export interface ValueField {
  align?: 'left' | 'center' | 'right' | 'start' | 'end';
  cardinality?: 'atMostOne' | 'one' | 'noneOrMany' | 'atLeastOne';
  component?: string;
  computed?: boolean;
  default?: unknown;
  doctype?: string;
  edit?: boolean;
  fieldname: string;
  fieldtype?: string;
  format?: string;
  hidden?: boolean;
  kind: 'field';
  label?: string;
  language?: string;
  mask?: string;
  mode?: InteractionMode;
  options?: FieldOptions;
  primaryKey?: boolean;
  readOnly?: boolean;
  required?: boolean;
  source?: 'introspected';
  validation?: FieldValidation;
  width?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| align? | `'left' \| 'center' \| 'right' \| 'start' \| 'end'` | Text alignment |
| cardinality? | `'atMostOne' \| 'one' \| 'noneOrMany' \| 'atLeastOne'` | Cardinality for Link fields — authoritative value on LinkDeclaration takes precedence |
| component? | `string` | Vue component that renders this field — the primary rendering axis. |
| computed? | `boolean` | True for a computed/display field with no backing DB column — excluded from SQL SELECT (replaces `fieldtype: 'Display'`). |
| default? | `unknown` | Default value for new records |
| doctype? | `string` | Target doctype slug — this field is a link to that doctype (replaces `fieldtype: 'Link'` and the legacy convention of a string-valued `options`). Presence is what makes a field a link. How it renders is decided by `component`, not by this: `AFormLink` renders an inline id-picker, while `AForm`/`ATable` expand the target (see `linkRenderMode`). Expansion metadata — backlink, fetch strategy, authoritative cardinality — lives in the doctype's `links` map, which is additive and never required for a plain foreign key. |
| edit? | `boolean` | Whether the field is editable in table cell context |
| fieldname | `string` | Unique identifier for this field within its doctype |
| fieldtype? | `string` | Semantic field type (legacy). Optional during the component-primary migration — `component` is now the primary rendering axis. Retained so un-migrated fields keep working; removed once every field carries `component`. |
| format? | `string` | Serialized `(value) => string` function for display formatting — distinct from `mask` (input). Spreads through `schemaToColumns` to `ColumnSchema.format`; deserialized at render time by ATable's `getFormattedValue`. |
| hidden? | `boolean` | Whether the field is hidden from the UI |
| kind | `'field'` | Discriminator — identifies this as a value-holding field |
| label? | `string` | Human-readable label |
| language? | `string` | Editor language for code fields (e.g. `'json'`, `'typescript'`) — disambiguates JSON vs Code, which share `ACodeEditor`. |
| mask? | `string` | Input mask pattern or serialized function |
| mode? | `InteractionMode` | Per-field interaction mode override |
| options? | `FieldOptions` | Type-specific options: Select choices, Decimal precision config, etc. A string value is the legacy link target — superseded by `doctype`, tolerated until the migration completes. |
| primaryKey? | `boolean` | True for the field that identifies the record's primary-key column (replaces `fieldtype: 'PrimaryKey'`). |
| readOnly? | `boolean` | Whether the field is read-only |
| required? | `boolean` | Whether the field is required |
| source? | `'introspected'` | Provenance marker — stamped only by the GraphQL converter; absence means hand-authored. When present, the docbuilder freezes the field's identity set (`fieldname`, `primaryKey`, `required`, `options`, `cardinality`, `doctype`), since `fieldname` is the GraphQL/column binding and `doctype` is the FK's target. `component` is deliberately **not** frozen: it chooses the widget, which is an authoring decision the database has no opinion about. |
| validation? | `FieldValidation` | Validation configuration |
| width? | `string` | CSS width (e.g. `"40ch"`, `"200px"`) |

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

### ComponentCategory

Semantic category for a rendering component.

As `component` replaces `fieldtype` as the primary field axis, the runtime consumers that used to branch on `fieldtype` (atable cell formatting / filter widgets, record-default init) instead derive their behaviour from the component's category. This is the single source of "what kind of value does this component render", keyed by the canonical registered component names — each consumer maps the category to its own concern (filter widget, default value, …).

**Definition:**

```typescript
export type ComponentCategory = 'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'code' | 'link' | 'attach';
```

### CustomFetch

Custom fetch strategy type

**Definition:**

```typescript
export type CustomFetch = z.infer<typeof CustomFetch>;
```

### DoctypeField

Union of all authoring-time field variants. Use `kind` to discriminate: `'field'` | `'fieldset'` | `'table'`.

**Definition:**

```typescript
export type DoctypeField = ValueField | FieldsetField | TableField;
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

### InteractionMode

Controls the level of user interaction for a field, container, or table.

- `'edit'` — field is fully interactive; user can change the value - `'read'` — field is non-interactive but displayed with form chrome (input outline, etc.) - `'display'` — field is non-interactive and displayed as plain text; no form chrome

Applied at authoring time via `mode` on any `DoctypeField` variant. Propagated through `resolveSchema()` into the resolved output types. Nested `AForm` and `ATable` components inherit `mode` from their parent unless overridden at the field level.

**Definition:**

```typescript
export type InteractionMode = 'edit' | 'read' | 'display';
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

### LinkExpansion

Whether a link component expands its target doctype, or renders the link inline.

This is the *only* axis the component decides. It deliberately does not choose between an embedded record and an embedded table: `cardinality` states whether the value is a scalar or an array, which is a fact about the data rather than a rendering preference, so a component must not be able to override it (an `AForm` over a `noneOrMany` link would be handed an array it cannot render). Component names encode both axes — `AFormLink`/`ATableLink` are the inline pair, `AForm`/`ATable` the expanding pair — but only the inline/expand half is authoritative.

**Definition:**

```typescript
export type LinkExpansion = 'inline' | 'expand';
```

### LinkRenderMode

How a link field renders.

- `inline` — a scalar id-picker; the target is *not* expanded (the field keeps its own value and carries a `doctype` prop for async display-text resolution and navigation). - `record` — the target doctype is resolved and embedded as a nested form. - `table` — the target doctype is resolved and embedded as a child table.

**Definition:**

```typescript
export type LinkRenderMode = 'inline' | 'record' | 'table';
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

### TableViewConfig

Table view configuration type inferred from Zod schema

**Definition:**

```typescript
export type TableViewConfig = z.infer<typeof TableViewConfig>;
```

### TriggerDefinition

Trigger definition type inferred from Zod schema

**Definition:**

```typescript
export type TriggerDefinition = z.infer<typeof TriggerDefinition>;
```

### WorkflowLayout

Workflow layout type inferred from Zod schema

**Definition:**

```typescript
export type WorkflowLayout = z.infer<typeof WorkflowLayout>;
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
    requiredFields: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allowedStates: z.ZodOptional<z.ZodArray<z.ZodString>>;
    nextState: z.ZodOptional<z.ZodString>;
    stateless: z.ZodOptional<z.ZodBoolean>;
    selfTransition: z.ZodOptional<z.ZodBoolean>;
    clientHandler: z.ZodOptional<z.ZodString>;
}, z.core.$strip>
```

### BUILTIN_FIELD_TYPES

The complete list of field types built into Stonecrop. User apps can use any string as a fieldtype; this const is the exhaustive set of types that Stonecrop provides default components for.

**Type:**

```typescript
export const BUILTIN_FIELD_TYPES: readonly ["Data", "Text", "Int", "Float", "Decimal", "Check", "Date", "Time", "Datetime", "Duration", "DateRange", "JSON", "Code", "Link", "Attach", "Currency", "Quantity", "Select", "PrimaryKey", "Fieldset", "Display"]
```

### CANONICAL_COMPONENTS

Every component Stonecrop ships with that can render a value field, sorted by name.

The union of the two maps above is the definition, not a copy of it: a shipped component either categorises a value (`COMPONENT_CATEGORY`) or is one of the link containers that has no value of its own (`COMPONENT_LINK_EXPANSION`'s `AForm`/`ATable`). `AFieldset` is absent by the same rule — it is a `kind: 'fieldset'` container, so it is never a value field's component.

`component` is an **open** axis: any string is valid, and naming a custom component is how an app renders a field Stonecrop ships no widget for. This list is therefore the set to *suggest* to an author, and to check first-party data against — never a set to validate arbitrary input against.

**Type:**

```typescript
export const CANONICAL_COMPONENTS: readonly string[]
```

### Cardinality

Cardinality for relationship links.

**Type:**

```typescript
export const Cardinality: z.ZodEnum<{
    atMostOne: "atMostOne";
    one: "one";
    noneOrMany: "noneOrMany";
    atLeastOne: "atLeastOne";
}>
```

### COMPONENT_CATEGORY

Canonical component → semantic category. Only the components Stonecrop ships with appear here; custom/unknown component names have no category and consumers fall back to their default.

**Type:**

```typescript
export const COMPONENT_CATEGORY: Record<string, ComponentCategory>
```

### COMPONENT_LINK_EXPANSION

Canonical link component → expansion. Only components Stonecrop ships with appear here; an unmapped (custom) component has none, and callers treat that as `expand` — the behaviour that predates this map, so a custom component can never silently collapse a link to a picker.

**Type:**

```typescript
export const COMPONENT_LINK_EXPANSION: Record<string, LinkExpansion>
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

### DoctypeFieldSchema

Zod runtime validation schema for the DoctypeField discriminated union. Validates all three field variants: `'field'`, `'fieldset'`, `'table'`.

**Type:**

```typescript
export const DoctypeFieldSchema: z.ZodType<DoctypeField, unknown, z.core.$ZodTypeInternals<DoctypeField, unknown>>
```

### DoctypeMeta

Doctype metadata - complete definition of a doctype

**Type:**

```typescript
export const DoctypeMeta: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<z.ZodType<import("./field").DoctypeField, unknown, z.core.$ZodTypeInternals<import("./field").DoctypeField, unknown>>>;
    links: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        target: z.ZodString;
        cardinality: z.ZodEnum<{
            atMostOne: "atMostOne";
            one: "one";
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
            requiredFields: z.ZodOptional<z.ZodArray<z.ZodString>>;
            allowedStates: z.ZodOptional<z.ZodArray<z.ZodString>>;
            nextState: z.ZodOptional<z.ZodString>;
            stateless: z.ZodOptional<z.ZodBoolean>;
            selfTransition: z.ZodOptional<z.ZodBoolean>;
            clientHandler: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        triggers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            label: z.ZodOptional<z.ZodString>;
            on: z.ZodArray<z.ZodString>;
            clientHandler: z.ZodString;
        }, z.core.$strip>>>;
        layout: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            position: z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>;
            targetPosition: z.ZodOptional<z.ZodEnum<{
                left: "left";
                right: "right";
                top: "top";
                bottom: "bottom";
            }>>;
            sourcePosition: z.ZodOptional<z.ZodEnum<{
                left: "left";
                right: "right";
                top: "top";
                bottom: "bottom";
            }>>;
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

### FieldOptions

Field options - flexible bag for type-specific configuration.

Usage: - Select: array of choices (["Draft", "Submitted", "Cancelled"]) - Decimal: config object ( precision: 10, scale: 2 ) - Code: config object ( language: "python" ) - Link target as a bare string ("customer") — **legacy**, superseded by `ValueField.doctype`. Tolerated until every fixture migrates; the `z.string()` branch is dropped after that, which leaves this a clean choices-or-config bag with no shape-encodes-meaning overload.

**Type:**

```typescript
export const FieldOptions: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>
```

### FieldsetFieldSchema

Zod runtime validation schema for FieldsetField. Recursive — FieldsetField.schema is validated against DoctypeFieldSchema.

**Type:**

```typescript
export const FieldsetFieldSchema: z.ZodObject<{
    kind: z.ZodLiteral<"fieldset">;
    fieldname: z.ZodString;
    component: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
    collapsible: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodEnum<{
        edit: "edit";
        read: "read";
        display: "display";
    }>>;
    schema: z.ZodLazy<z.ZodArray<z.ZodType<DoctypeField, unknown, z.core.$ZodTypeInternals<DoctypeField, unknown>>>>;
}, z.core.$strip>
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
        atMostOne: "atMostOne";
        one: "one";
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

### TableFieldSchema

Zod runtime validation schema for TableField.

**Type:**

```typescript
export const TableFieldSchema: z.ZodObject<{
    kind: z.ZodLiteral<"table">;
    fieldname: z.ZodString;
    component: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
    columns: z.ZodArray<z.ZodObject<{
        fieldname: z.ZodString;
    }, z.core.$loose>>;
    config: z.ZodOptional<z.ZodObject<{
        view: z.ZodOptional<z.ZodEnum<{
            list: "list";
            uncounted: "uncounted";
            "list-expansion": "list-expansion";
            tree: "tree";
            gantt: "gantt";
            "tree-gantt": "tree-gantt";
        }>>;
        fullWidth: z.ZodOptional<z.ZodBoolean>;
        defaultTreeExpansion: z.ZodOptional<z.ZodEnum<{
            root: "root";
            branch: "branch";
            leaf: "leaf";
        }>>;
        dependencyGraph: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    mode: z.ZodOptional<z.ZodEnum<{
        edit: "edit";
        read: "read";
        display: "display";
    }>>;
}, z.core.$strip>
```

### TableViewConfig

JSON-safe view configuration for table fields in doctype authoring.

This is the authoring-time subset of `@stonecrop/atable`'s `TableConfig`. It covers the view discriminator and structural options that can be expressed in static JSON. `rowActions` (which requires function-typed handlers) stays in the runtime `TableConfig`.

**Type:**

```typescript
export const TableViewConfig: z.ZodObject<{
    view: z.ZodOptional<z.ZodEnum<{
        list: "list";
        uncounted: "uncounted";
        "list-expansion": "list-expansion";
        tree: "tree";
        gantt: "gantt";
        "tree-gantt": "tree-gantt";
    }>>;
    fullWidth: z.ZodOptional<z.ZodBoolean>;
    defaultTreeExpansion: z.ZodOptional<z.ZodEnum<{
        root: "root";
        branch: "branch";
        leaf: "leaf";
    }>>;
    dependencyGraph: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>
```

### TriggerDefinition

Reactive field-validation trigger — advisory, client-side only.

A Trigger is a docbuilder-authored validator: when any field in `on` is edited, its `clientHandler` runs (client-side, no rollback) and may flag a field inline to block save in the UI. It is deliberately a **sibling** to `ActionDefinition`, not a member of it — a reactive validator is not a user-invoked action, so it lives in the `triggers` map on `WorkflowMeta` and never appears to action readers (transition/command dropdowns, the FSM graph).

The two bindings are independent: `on` is the fire-set (which fields' edits run it), while the `setError(field, msg)` call inside `clientHandler` chooses which field displays the error.

**Type:**

```typescript
export const TriggerDefinition: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    on: z.ZodArray<z.ZodString>;
    clientHandler: z.ZodString;
}, z.core.$strip>
```

### TYPE_MAP

Mapping from builtin fieldtypes to their default Vue component. Components can be overridden in the field definition.

**Type:**

```typescript
export const TYPE_MAP: Record<BuiltinFieldType, FieldTemplate>
```

### ValueFieldSchema

Zod runtime validation schema for ValueField.

**Type:**

```typescript
export const ValueFieldSchema: z.ZodObject<{
    kind: z.ZodLiteral<"field">;
    fieldname: z.ZodString;
    fieldtype: z.ZodOptional<z.ZodString>;
    component: z.ZodOptional<z.ZodString>;
    primaryKey: z.ZodOptional<z.ZodBoolean>;
    computed: z.ZodOptional<z.ZodBoolean>;
    language: z.ZodOptional<z.ZodString>;
    doctype: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodString>;
    align: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        center: "center";
        start: "start";
        end: "end";
    }>>;
    edit: z.ZodOptional<z.ZodBoolean>;
    mask: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        edit: "edit";
        read: "read";
        display: "display";
    }>>;
    options: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>;
    required: z.ZodOptional<z.ZodBoolean>;
    readOnly: z.ZodOptional<z.ZodBoolean>;
    hidden: z.ZodOptional<z.ZodBoolean>;
    default: z.ZodOptional<z.ZodUnknown>;
    validation: z.ZodOptional<z.ZodObject<{
        errorMessage: z.ZodString;
    }, z.core.$loose>>;
    cardinality: z.ZodOptional<z.ZodEnum<{
        atMostOne: "atMostOne";
        one: "one";
        noneOrMany: "noneOrMany";
        atLeastOne: "atLeastOne";
    }>>;
    source: z.ZodOptional<z.ZodLiteral<"introspected">>;
}, z.core.$strip>
```

### WELL_KNOWN_SCALARS

Mapping from well-known custom GraphQL scalars to Stonecrop field types. These cover scalars commonly used across GraphQL servers (PostGraphile, Hasura, etc.) without baking in knowledge of any specific server.

Entries here have lower precedence than `customScalars` from options, but higher precedence than unknown/unmapped scalars.

**Type:**

```typescript
export const WELL_KNOWN_SCALARS: Record<string, FieldTemplate>
```

### WorkflowLayout

DocBuilder graph layout — node positions for the workflow-state graph, keyed by state name. Pure authoring view-state: persisted in the doctype JSON so an author's manual arrangement survives reloads, but — exactly like `WorkflowMeta`'s `triggers` — it is client-only and never mirrored into the runtime GraphQL SDL (see the WorkflowMeta type in the host SDLs, which expose only `states`/`actions`). The shape mirrors VueFlow's node fields; `position` is the node's canvas coordinate and `targetPosition`/`sourcePosition` are the handle sides.

**Type:**

```typescript
export const WorkflowLayout: z.ZodRecord<z.ZodString, z.ZodObject<{
    position: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>;
    targetPosition: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        top: "top";
        bottom: "bottom";
    }>>;
    sourcePosition: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        top: "top";
        bottom: "bottom";
    }>>;
}, z.core.$strip>>
```

### WorkflowMeta

Workflow metadata - states and actions for a doctype

**Type:**

```typescript
export const WorkflowMeta: z.ZodObject<{
    states: z.ZodOptional<z.ZodArray<z.ZodString>>;
    actions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        label: z.ZodString;
        requiredFields: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allowedStates: z.ZodOptional<z.ZodArray<z.ZodString>>;
        nextState: z.ZodOptional<z.ZodString>;
        stateless: z.ZodOptional<z.ZodBoolean>;
        selfTransition: z.ZodOptional<z.ZodBoolean>;
        clientHandler: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    triggers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        label: z.ZodOptional<z.ZodString>;
        on: z.ZodArray<z.ZodString>;
        clientHandler: z.ZodString;
    }, z.core.$strip>>>;
    layout: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        position: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strip>>;
        targetPosition: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
            top: "top";
            bottom: "bottom";
        }>>;
        sourcePosition: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
            top: "top";
            bottom: "bottom";
        }>>;
    }, z.core.$strip>>>;
}, z.core.$strip>
```

