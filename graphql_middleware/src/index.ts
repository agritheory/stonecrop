export type { DoctypeMeta, ValidationError } from '@stonecrop/schema'

// PostGraphile adaptor re-exports
export { makePgService } from 'postgraphile/adaptors/pg'

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
	type LoadDoctypesOptions,
} from './registry/doctypes'

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

// Stonecrop preset
export { createStonecropPreset, StonecropPreset } from './preset'
export type { FieldCasing, StonecropPresetOptions } from './types'

// Runtime context types (unique to graphql_middleware)
export type { ActionContext, ActionHandler } from './types'

export { typeDefs } from './typeDefs'
