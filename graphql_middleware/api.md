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

### PG_TYPE_MAP

```typescript
export { PG_TYPE_MAP }
```

### PostgresType

```typescript
export { PostgresType }
```

### StonecropFieldType

```typescript
export { StonecropFieldType }
```

### TYPE_ALIASES

```typescript
export { TYPE_ALIASES }
```

### TYPE_MAP

```typescript
export { TYPE_MAP }
```

### WorkflowMeta

```typescript
export { WorkflowMeta }
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

### convertSchema

Convert PostgreSQL DDL to Stonecrop doctype schemas

**Signature:**

```typescript
export declare function convertSchema(sql: string, options?: ConversionOptions): ConvertedDoctype[];
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| sql | `string` |  |
| options | `ConversionOptions` |  |

### createStonecropPlugin

Create a PostGraphile plugin that extends the GraphQL schema with Stonecrop functionality

**Signature:**

```typescript
createStonecropPlugin: (options: StonecropPluginOptions) => ReturnType<typeof makeExtendSchemaPlugin>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `StonecropPluginOptions` | Plugin configuration options |

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
| name | `string` |  |

### getMeta

Get a doctype by name

**Signature:**

```typescript
export declare function getMeta(name: string): DoctypeMeta | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` |  |

### hasHandler

Check if a handler is registered

**Signature:**

```typescript
export declare function hasHandler(name: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` |  |

### hasMeta

Check if a doctype is registered

**Signature:**

```typescript
export declare function hasMeta(name: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` |  |

### loadDoctypes

Load doctype definitions from a directory of JSON files

**Signature:**

```typescript
export declare function loadDoctypes(dir: string, options?: LoadDoctypesOptions): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| dir | `string` |  |
| options | `LoadDoctypesOptions` |  |

### loadDoctypesFromObject

Load doctypes from an object (for programmatic use)

**Signature:**

```typescript
export declare function loadDoctypesFromObject(doctypes: Record<string, unknown>, options?: LoadDoctypesOptions): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctypes | `Record<string, unknown>` |  |
| options | `LoadDoctypesOptions` |  |

### mapColumnToField

Map a parsed column to a Stonecrop field definition

**Signature:**

```typescript
export declare function mapColumnToField(column: ParsedColumn, _tableRegistry: Map<string, ParsedTable>, options?: MapColumnOptions): ConversionFieldMeta;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| column | `ParsedColumn` |  |
| _tableRegistry | `Map<string, ParsedTable>` |  |
| options | `MapColumnOptions` |  |

### normalizeType

Normalize raw PostgreSQL type string to canonical PostgresType

**Signature:**

```typescript
export declare function normalizeType(rawType: string): PostgresType;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| rawType | `string` |  |

### parseDDL

Parse PostgreSQL DDL and extract table definitions

**Signature:**

```typescript
export declare function parseDDL(sql: string): ParsedTable[];
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| sql | `string` |  |

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
| name | `string` |  |
| handler | `ActionHandler` |  |

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
| doctype | `DoctypeMeta` |  |
| executor | `GraphQLExecutor` |  |

### ConversionFieldMeta

Extended field with conversion metadata (only used during schema-tools output)

**Definition:**

```typescript
export interface ConversionFieldMeta {
  _pgType?: string;
  _unmapped?: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _pgType? | `string` |  |
| _unmapped? | `boolean` |  |

### ConversionOptions

Options for DDL to doctype conversion

**Definition:**

```typescript
export interface ConversionOptions {
  exclude?: string[];
  includeUnmappedMeta?: boolean;
  inheritanceMode: 'flatten' | 'reference';
  schema?: string;
  typeOverrides?: Record<string, Partial<FieldMeta>>;
  useCamelCase?: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| exclude? | `string[]` | Tables to exclude |
| includeUnmappedMeta? | `boolean` | Include unmapped type metadata in output |
| inheritanceMode | `'flatten' \| 'reference'` | How to handle inherited fields |
| schema? | `string` | Schema to filter tables by |
| typeOverrides? | `Record<string, Partial<FieldMeta>>` | Override type mappings |
| useCamelCase? | `boolean` | Use camelCase for field names (default: false, keeps snake_case) |

### ConvertedDoctype

Output of schema conversion - uses DoctypeMeta but with optional conversion metadata

**Definition:**

```typescript
export interface ConvertedDoctype {
  fields: ConversionFieldMeta[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| fields | `ConversionFieldMeta[]` |  |

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

### ParsedColumn

Intermediate representation of a parsed column (from DDL)

**Definition:**

```typescript
export interface ParsedColumn {
  arrayDimensions: number;
  dataType: string;
  defaultValue?: string;
  isGenerated: boolean;
  length?: number;
  name: string;
  normalizedType: PostgresType;
  nullable: boolean;
  precision?: number;
  reference?: {
        schema?: string;
        table: string;
        column: string;
        onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    };
  scale?: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| arrayDimensions | `number` |  |
| dataType | `string` |  |
| defaultValue? | `string` |  |
| isGenerated | `boolean` |  |
| length? | `number` |  |
| name | `string` |  |
| normalizedType | `PostgresType` |  |
| nullable | `boolean` |  |
| precision? | `number` |  |
| reference? | `{ schema?: string; table: string; column: string; onDelete?: 'CASCADE' \| 'SET NULL' \| 'RESTRICT' \| 'NO ACTION'; }` |  |
| scale? | `number` |  |

### ParsedTable

Intermediate representation of a parsed table (from DDL)

**Definition:**

```typescript
export interface ParsedTable {
  columns: ParsedColumn[];
  comment?: string;
  doctypeName?: string;
  inherits?: string[];
  name: string;
  schema?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| columns | `ParsedColumn[]` |  |
| comment? | `string` | Table comment from COMMENT ON TABLE statement |
| doctypeName? | `string` | Doctype name extracted from comment (if using doctype convention) |
| inherits? | `string[]` |  |
| name | `string` |  |
| schema? | `string` |  |

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
| doctype | `string` |  |
| recordId? | `string` |  |

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
| endpoint | `string` |  |
| headers? | `Record<string, string>` |  |

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
| executor | `GraphQLExecutor` |  |

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

**Definition:**

```typescript
export type DoctypeMeta = z.infer<typeof DoctypeMeta>;
```

### FieldMeta

**Definition:**

```typescript
export type FieldMeta = z.infer<typeof FieldMeta>;
```

### FieldOptions

**Definition:**

```typescript
export type FieldOptions = z.infer<typeof FieldOptions>;
```

### FieldValidation

**Definition:**

```typescript
export type FieldValidation = z.infer<typeof FieldValidation>;
```

### PostgresType

**Definition:**

```typescript
export type PostgresType = z.infer<typeof PostgresType>;
```

### StonecropFieldType

**Definition:**

```typescript
export type StonecropFieldType = z.infer<typeof StonecropFieldType>;
```

### WorkflowMeta

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
| errors | `ValidationError[]` |  |
| file | `string` |  |

### StonecropClient

Client for interacting with Stonecrop GraphQL API

**Constructor:**

```typescript
new StonecropClient(options: StonecropClientOptions)
```

**Methods:**

#### clearMetaCache

```typescript
clearMetaCache(): void
```

#### getAllMeta

```typescript
getAllMeta(): Promise<DoctypeMeta[]>
```

#### getMeta

```typescript
getMeta(context: RouteContext): Promise<DoctypeMeta | null>
```

#### getRecord

```typescript
getRecord(doctype: DoctypeMeta, recordId: string): Promise<Record<string, unknown> | null>
```

#### getRecords

```typescript
getRecords(doctype: DoctypeMeta, options: {
        filters?: Record<string, unknown>;
        orderBy?: string;
        limit?: number;
        offset?: number;
    }): Promise<Record<string, unknown>[]>
```

#### mutate

```typescript
mutate(mutation: string, variables: Record<string, unknown>): Promise<T>
```

#### query

```typescript
query(query: string, variables: Record<string, unknown>): Promise<T>
```

#### runAction

```typescript
runAction(doctype: DoctypeMeta, action: string, args: unknown[]): Promise<{
        success: boolean;
        data: unknown;
        error: string | null;
    }>
```

## Variables

### builtinHandlers

Built-in handlers available for registration

**Type:**

```typescript
export const builtinHandlers: Record<string, ActionHandler>
```

