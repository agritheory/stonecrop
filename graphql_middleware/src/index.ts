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

	// GraphQL to Doctype conversion
	convertGraphQLSchema,
	GQL_SCALAR_MAP,
	WELL_KNOWN_SCALARS,
	defaultIsEntityType,
	defaultIsEntityField,
	classifyFieldType,

	// Naming utilities
	toSlug,
	toPascalCase,
	pascalToSnake,
	snakeToCamel,
	camelToSnake,
	snakeToLabel,
	camelToLabel,
} from '@stonecrop/schema'

export type {
	ValidationResult,
	ValidationError,
	IntrospectionSource,
	GraphQLConversionOptions,
	GraphQLConversionFieldMeta,
	ConvertedGraphQLDoctype,
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

export type { StonecropPluginOptions, StonecropInflectionConfig } from './plugin/postgraphile'

// Client
export { StonecropClient } from './client'

export type { StonecropClientOptions } from './client'
