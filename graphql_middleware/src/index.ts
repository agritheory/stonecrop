export type { DoctypeMeta, ValidationError } from '@stonecrop/schema'

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

// Fetch handlers
export { registerFetchHandler, getFetchHandler, clearFetchHandlers } from './registry/fetchHandlers'
export type { FetchHandler } from './registry/fetchHandlers'

// Server-owned workflow transition (guarded by allowedStates)
export { applyGuardedTransition } from './dispatch/transition'
export type { GuardedTransitionIO } from './dispatch/transition'

// PostGraphile plugin
export { createStonecropPlugin } from './plugin/postgraphile'
export type { StonecropPluginOptions, ActionHandler, ActionHandlerContext } from './plugin/postgraphile'

// Debug plugin
export { createDebugPlugin } from './debug'
export type { DebugPluginOptions } from './debug'

export { typeDefs } from './typeDefs'

// Preset
export { createStonecropPreset, StonecropPreset } from './preset'
export type { FieldCasing } from './preset'
export { makePgService } from 'postgraphile/adaptors/pg'
