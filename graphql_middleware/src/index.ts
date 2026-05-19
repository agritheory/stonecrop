export type { DoctypeMeta, ValidationError } from '@stonecrop/schema'

// Runtime context types (unique to graphql_middleware)
export type { ActionContext, ActionHandler } from './types'

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

export { typeDefs } from './typeDefs'

// Preset
export { createStonecropPreset, StonecropPreset } from './preset'
export type { FieldCasing } from './preset'
export { makePgService } from 'postgraphile/adaptors/pg'
