# Utilities API Reference

> This documentation is automatically generated from the TypeScript API.

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

### convertTableToSchema

Converts SQL table to Stonecrop schema format

**Signature:**

```typescript
export declare function convertTableToSchema(table: SQLTable, namingConverter?: (sqlName: string) => {
    fieldname: string;
    label: string;
}): ConversionResult;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| table | `SQLTable` | Parsed SQL table |
| namingConverter | `(sqlName: string) => { fieldname: string; label: string; }` | Function to convert field names |

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

### detectStatusColumn

Detects status/state columns in SQL table

**Signature:**

```typescript
export declare function detectStatusColumn(table: SQLTable): SQLColumn | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| table | `SQLTable` | Parsed SQL table |

### extractStateValues

Extracts state values from status column

**Signature:**

```typescript
export declare function extractStateValues(column: SQLColumn): string[];
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| column | `SQLColumn` | Status column |

### generateTransitionName

Generates transition event names from state pairs

**Signature:**

```typescript
export declare function generateTransitionName(fromState: string, toState: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| fromState | `string` | Source state |
| toState | `string` | Target state |

### generateWorkflowLayout

Generates default workflow layout positions for visual editor

**Signature:**

```typescript
export declare function generateWorkflowLayout(states: string[], horizontal?: boolean): Record<string, {
    position: {
        x: number;
        y: number;
    };
}>;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| states | `string[]` | Array of state names |
| horizontal | `boolean` | Whether to layout horizontally (default) or vertically |

### install

Install all utility components

**Signature:**

```typescript
declare function install(_app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| _app | `App` |  |

### introspectSQL

Introspects SQL DDL and converts all tables to Stonecrop schemas

**Signature:**

```typescript
export declare function introspectSQL(ddl: string, namingConverter?: (sqlName: string) => {
    fieldname: string;
    label: string;
}): ConversionResult[];
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| ddl | `string` | PostgreSQL DDL string |
| namingConverter | `(sqlName: string) => { fieldname: string; label: string; }` | Optional function to convert field names |

### mapSQLTypeToFieldType

Maps PostgreSQL data types to Stonecrop field types

**Signature:**

```typescript
export declare function mapSQLTypeToFieldType(sqlType: string, enumValues?: string[]): StonecropFieldType;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| sqlType | `string` | PostgreSQL data type |
| enumValues | `string[]` | Enum values if type is ENUM |

### parseDDL

Parses a PostgreSQL CREATE TABLE statement

**Signature:**

```typescript
export declare function parseDDL(ddl: string): SQLTable[];
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| ddl | `string` | SQL DDL string |

### scaffoldWorkflow

Scaffolds a basic workflow from detected states

**Signature:**

```typescript
export declare function scaffoldWorkflow(states: string[], machineId: string): WorkflowScaffold;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| states | `string[]` | Array of state names |
| machineId | `string` | Machine identifier |

### scaffoldWorkflowFromTable

Scaffolds workflow from SQL table

**Signature:**

```typescript
export declare function scaffoldWorkflowFromTable(table: SQLTable, machineId?: string): WorkflowScaffold | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| table | `SQLTable` | Parsed SQL table |
| machineId | `string` | Optional machine ID (defaults to table name) |

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

### useKeyboardNav

Keyboard navigation composable

**Signature:**

```typescript
export declare function useKeyboardNav(options: KeyboardNavigationOptions[]): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `KeyboardNavigationOptions[]` | Keyboard navigation options |

## Interfaces

### ConversionResult

Result of SQL to Stonecrop conversion

**Definition:**

```typescript
export interface ConversionResult {
  doctype: string;
  relationships: Array<{
        fieldname: string;
        targetDoctype: string;
        targetField: string;
    }>;
  schema: Array<{
        fieldname: string;
        label: string;
        fieldtype: StonecropFieldType;
        required?: boolean;
        readonly?: boolean;
        options?: string;
        default?: any;
    }>;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| doctype | `string` | Doctype name (from table name) |
| relationships | `Array<{ fieldname: string; targetDoctype: string; targetField: string; }>` | Detected relationships |
| schema | `Array<{ fieldname: string; label: string; fieldtype: StonecropFieldType; required?: boolean; readonly?: boolean; options?: string; default?: any; }>` | Stonecrop schema fields |

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

### SQLColumn

Represents a parsed SQL column with metadata

**Definition:**

```typescript
export interface SQLColumn {
  checkConstraint?: string;
  defaultValue?: string;
  enumValues?: string[];
  foreignKey?: {
        table: string;
        column: string;
    };
  name: string;
  notNull: boolean;
  primaryKey: boolean;
  sqlType: string;
  unique: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| checkConstraint? | `string` | CHECK constraint expression |
| defaultValue? | `string` | Default value expression |
| enumValues? | `string[]` | Enum values for ENUM types |
| foreignKey? | `{ table: string; column: string; }` | Foreign key reference (table.column) |
| name | `string` | Column name from SQL |
| notNull | `boolean` | Whether column is NOT NULL |
| primaryKey | `boolean` | Whether column is PRIMARY KEY |
| sqlType | `string` | PostgreSQL data type |
| unique | `boolean` | Whether column is UNIQUE |

### SQLTable

Represents a parsed SQL table

**Definition:**

```typescript
export interface SQLTable {
  columns: SQLColumn[];
  name: string;
  schema?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| columns | `SQLColumn[]` | List of columns |
| name | `string` | Table name |
| schema? | `string` | Schema name (default: public) |

### WorkflowScaffold

Workflow scaffolding result

**Definition:**

```typescript
export interface WorkflowScaffold {
  actions: Record<string, string[]>;
  sourceColumn?: string;
  workflow: AnyStateNodeConfig;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| actions | `Record<string, string[]>` | Actions map with stubbed action names |
| sourceColumn? | `string` | Source column that workflow was generated from |
| workflow | `AnyStateNodeConfig` | Generated XState machine configuration |

## Type Aliases

### KeyboardNavigationOptions

Keyboard navigation options

**Definition:**

```typescript
export type KeyboardNavigationOptions = {
    parent?: string | HTMLElement | Ref<HTMLElement>;
    selectors?: string | HTMLElement | HTMLElement[] | ComponentPublicInstance[] | Ref<HTMLElement> | Ref<HTMLElement[]> | Ref<ComponentPublicInstance[]>;
    handlers?: KeypressHandlers;
};
```

### KeypressHandlers

Key press handlers

**Definition:**

```typescript
export type KeypressHandlers = {
    [key: string]: (ev: KeyboardEvent) => any;
};
```

### StonecropFieldType

Stonecrop field type

**Definition:**

```typescript
export type StonecropFieldType = 'Data' | 'Text' | 'Int' | 'Float' | 'Check' | 'Datetime' | 'Date' | 'Time' | 'Select' | 'Link' | 'Table' | 'Code' | 'Phone' | 'Currency';
```

## Variables

### defaultKeypressHandlers

Default keypress handlers for keyboard navigation

**Type:**

```typescript
export const defaultKeypressHandlers: KeypressHandlers
```

