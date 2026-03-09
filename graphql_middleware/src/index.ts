export type { DoctypeMeta, ValidationError } from '@stonecrop/schema'

// Runtime context types (unique to graphql_middleware)
export type { ActionContext, ActionHandler, GraphQLExecutor } from './types'

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
export { createStonecropPlugin, registerWriteHandlers } from './plugin/postgraphile'

export type { StonecropPluginOptions, StonecropInflectionConfig } from './plugin/postgraphile'

// Query builders and inflection helpers (exported for testing and advanced usage)
export {
	defaultRecordFieldName,
	defaultConnectionFieldName,
	defaultOrderByTypeName,
	defaultRecordArgName,
	defaultRecordArgType,
	defaultCreateMutationName,
	defaultUpdateMutationName,
	defaultDeleteMutationName,
	defaultRecordTypeName,
	buildRecordQuery,
	buildListQuery,
	buildCreateMutation,
	buildUpdateMutation,
	buildDeleteMutation,
	queryableFieldNames,
	RELATION_FIELDTYPES,
	BUILTIN_WRITE_ACTIONS,
	extractMutationResult,
} from './plugin/postgraphile'
