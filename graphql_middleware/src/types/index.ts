// =============================================================================
// Runtime Context Types (unique to graphql_middleware)
// =============================================================================

import type { PgClient } from '@dataplan/pg'
import type { DoctypeMeta } from '@stonecrop/schema'

/**
 * Context passed to action handlers.
 *
 * The open index signature is the extension point for injecting an
 * application-owned data access layer (see ADR 0003) — in a PostGraphile
 * setup that slot is {@link ActionContext.pgClient}; custom backends inject
 * their own (e.g. an in-memory executor).
 *
 * @public
 */
export interface ActionContext {
	/** Doctype metadata for the action being executed */
	doctype: DoctypeMeta
	/**
	 * Active database client — available when the action is dispatched via stonecropAction.
	 *
	 * Rows returned by raw `pgClient.query()` carry **snake_case column names**,
	 * not the camelCase fieldnames the client expects (see ADR 0004 — the
	 * middleware's own read paths alias columns at the SQL layer, e.g.
	 * `"display_name" AS "displayName"`). Handlers querying with `pgClient`
	 * own the same conversion for their return values — see {@link ActionHandler}.
	 */
	pgClient?: PgClient
	/** Additional context properties */
	[key: string]: unknown
}

/**
 * Action handler function signature.
 *
 * The resolved value is passed through verbatim as `ActionResult.data` —
 * the middleware applies no transformation. Return **API-layer data**: plain
 * objects keyed by camelCase fieldnames, matching what `stonecropRecord`
 * returns (see ADR 0004).
 *
 * When reading from the database via `context.pgClient`, either alias columns
 * in the SQL (`SELECT display_name AS "displayName" ...`, as the middleware's
 * own queries do) or convert row keys with `snakeToCamel` from
 * `@stonecrop/schema` before returning. Returning raw query rows leaks
 * snake_case column names to the client.
 *
 * @public
 */
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>
