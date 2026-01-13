// Re-export all schema types from @stonecrop/schema
export {
	// Field types
	StonecropFieldType,
	TYPE_MAP,
	getDefaultComponent,

	// Field schema
	FieldMeta,
	FieldOptions,
	FieldValidation,

	// Doctype schema
	DoctypeMeta,
	WorkflowMeta,
	ActionDefinition,

	// Validation helpers
	validateField,
	validateDoctype,
	parseField,
	parseDoctype,

	// DDL to Doctype conversion
	convertSchema,
	parseDDL,
	normalizeType,
	mapColumnToField,
	PG_TYPE_MAP,
	TYPE_ALIASES,
} from '@stonecrop/schema'

export type {
	ValidationResult,
	ValidationError,
	ConvertedDoctype,
	ConversionFieldMeta,
	ParsedColumn,
	ParsedTable,
	ConversionOptions,
	PostgresType,
} from '@stonecrop/schema'

// Runtime context types (unique to graphql_middleware)
export type { RouteContext, ActionContext, ActionHandler, GraphQLExecutor } from './types'

// Doctype registry
export {
	loadDoctypes,
	loadDoctypesFromObject,
	getMeta,
	getAllMeta,
	hasMeta,
	clearRegistry,
	validateReferences,
	DoctypeValidationError,
} from './registry/doctypes'

export type { LoadDoctypesOptions } from './registry/doctypes'

// Action handlers
export {
	registerHandler,
	getHandler,
	hasHandler,
	clearHandlers,
	registerBuiltinHandlers,
	builtinHandlers,
} from './registry/actions'

// PostGraphile plugin
export { createStonecropPlugin } from './plugin/postgraphile'

export type { StonecropPluginOptions } from './plugin/postgraphile'

// Client
export { StonecropClient } from './client'

export type { StonecropClientOptions } from './client'
