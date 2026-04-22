import type { DoctypeMeta } from '@stonecrop/schema'
import type { WithPgClient } from 'postgraphile/@dataplan/pg'

/**
 * Context passed to action handlers
 * @public
 */
export interface ActionContext {
	/** Doctype metadata for the action being executed */
	doctype: DoctypeMeta
	/** Database access function; available when handler is called from a GraphQL mutation */
	withPgClient?: WithPgClient
	/** Additional context properties */
	[key: string]: unknown
}

/**
 * Action handler function signature
 * @public
 */
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>
