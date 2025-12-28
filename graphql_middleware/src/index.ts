// Types - Zod schemas and inferred types
export {
	// Zod schemas (for custom validation/extension)
	StonecropFieldType,
	FieldOptions,
	FieldMeta,
	ActionDefinition,
	WorkflowMeta,
	DoctypeMeta,
	PostgresType,

	// Validation helpers
	validateDoctype,
	validateField,
	parseDoctype,
	parseField,
} from './types'

// Type-only exports
export type {
	// Validation types
	ValidationResult,
	ValidationError,

	// Runtime context types
	RouteContext,
	ActionContext,
	ActionHandler,
	GraphQLExecutor,

	// Conversion types
	ParsedColumn,
	ParsedTable,
	ConversionOptions,
	ConversionFieldMeta,
} from './types'

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

// DDL to Doctype conversion
export { convertSchema, parseDDL, normalizeType, mapColumnToField, TYPE_MAP, TYPE_ALIASES } from './converter'

export type { ConvertedDoctype } from './converter'

// PostGraphile plugin
export { createStonecropPlugin } from './plugin/postgraphile'

export type { StonecropPluginOptions } from './plugin/postgraphile'

// Client
export { StonecropClient } from './client'

export type { StonecropClientOptions } from './client'
