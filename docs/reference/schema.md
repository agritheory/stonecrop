---
title: Schema API Reference
description: Doctype schema definitions and validation
---

# Schema API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### DoctypeMeta

Vue component exported from @stonecrop/schema.

```typescript
import { DoctypeMeta } from '@stonecrop/schema'
```

### FieldMeta

Vue component exported from @stonecrop/schema.

```typescript
import { FieldMeta } from '@stonecrop/schema'
```

### FieldOptions

Vue component exported from @stonecrop/schema.

```typescript
import { FieldOptions } from '@stonecrop/schema'
```

### StonecropFieldType

Vue component exported from @stonecrop/schema.

```typescript
import { StonecropFieldType } from '@stonecrop/schema'
```

### WorkflowMeta

Vue component exported from @stonecrop/schema.

```typescript
import { WorkflowMeta } from '@stonecrop/schema'
```

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

### convertSQLName

Converts SQL column name to Stonecrop field naming convention Handles special cases like ID suffixes

**Signature:**

```typescript
export declare function convertSQLName(sqlName: string): NameConversion;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| sqlName | `string` | SQL column name (snake_case) |

### convertSQLNames

Batch converts multiple SQL column names

**Signature:**

```typescript
export declare function convertSQLNames(sqlNames: string[]): NameConversion[];
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| sqlNames | `string[]` | Array of SQL column names |

### createNameMapping

Creates a bidirectional mapping between SQL and Stonecrop names

**Signature:**

```typescript
export declare function createNameMapping(sqlNames: string[]): {
    sqlToFieldname: Map<string, string>;
    fieldnameToSQL: Map<string, string>;
    conversions: NameConversion[];
};
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| sqlNames | `string[]` | Array of SQL column names |

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

### MapColumnOptions

Options for column to field mapping

**Definition:**

```typescript
export interface MapColumnOptions {
  includeUnmappedMeta?: boolean;
  useCamelCase?: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| includeUnmappedMeta? | `boolean` | Include unmapped type metadata in output |
| useCamelCase? | `boolean` | Use camelCase for field names (default: false, keeps snake_case) |

### NameConversion

Result of name conversion

**Definition:**

```typescript
export interface NameConversion {
  fieldname: string;
  label: string;
  originalName: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| fieldname | `string` | Converted fieldname (camelCase) |
| label | `string` | Human-readable label |
| originalName | `string` | Original SQL name |

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

