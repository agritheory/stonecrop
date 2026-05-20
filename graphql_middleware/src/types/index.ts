// =============================================================================
// Runtime Context Types (unique to graphql_middleware)
// =============================================================================

import type { PgClient } from '@dataplan/pg'
import type { DoctypeMeta } from '@stonecrop/schema'

/**
 * Context passed to action handlers.
 * @public
 */
export interface ActionContext {
	/** Doctype metadata for the action being executed */
	doctype: DoctypeMeta
	/** Active database client — available when the action is dispatched via stonecropAction */
	pgClient?: PgClient
	/** Additional context properties */
	[key: string]: unknown
}

/**
 * Action handler function signature
 * @public
 */
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>
