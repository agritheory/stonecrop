// Field types
export { StonecropFieldType, TYPE_MAP, getDefaultComponent } from './fieldtype'

// Field schema
export { FieldMeta, FieldOptions, FieldValidation } from './field'

// Doctype schema
export { DoctypeMeta, WorkflowMeta, ActionDefinition } from './doctype'

// Validation helpers
export {
	validateField,
	validateDoctype,
	parseField,
	parseDoctype,
	type ValidationResult,
	type ValidationError,
} from './validation'

// DDL to Doctype conversion
export {
	convertSchema,
	parseDDL,
	normalizeType,
	mapColumnToField,
	PG_TYPE_MAP,
	TYPE_ALIASES,
	type ConvertedDoctype,
	type ConversionFieldMeta,
	type ParsedColumn,
	type ParsedTable,
	type ConversionOptions,
	type PostgresType,
	type MapColumnOptions,
	// Naming utilities
	snakeToCamel,
	camelToSnake,
	snakeToLabel,
	camelToLabel,
	convertSQLName,
	convertSQLNames,
	createNameMapping,
	toPascalCase,
	toSlug,
	type NameConversion,
} from './converter'

// Type-only exports for consumers who just need types
export type { StonecropFieldType as StonecropFieldTypeValue } from './fieldtype'
export type { FieldMeta as FieldMetaType, FieldOptions as FieldOptionsType } from './field'
export type { DoctypeMeta as DoctypeMetaType, WorkflowMeta as WorkflowMetaType } from './doctype'
