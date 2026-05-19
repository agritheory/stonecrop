// =============================================================================
// Runtime Context Types (unique to graphql_middleware)
// =============================================================================

import type { DoctypeMeta } from '@stonecrop/schema'

/**
 * Context passed to action handlers.
 * @public
 */
export interface ActionContext {
	/** Doctype metadata for the action being executed */
	doctype: DoctypeMeta
	/** Additional context properties */
	[key: string]: unknown
}

/**
 * Action handler function signature
 * @public
 */
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>
