import type { PgClient } from '@dataplan/pg'
import type { LinkDeclaration } from '@stonecrop/schema'

/**
 * Handler for a custom fetch strategy on a link declaration.
 * Called during `stonecropRecord` resolution when `link.fetch.method === 'custom'`.
 *
 * @param pgClient - Active database client for the current request
 * @param parentRecord - Resolved parent record (scalar fields already populated)
 * @param link - The link declaration, giving access to cardinality and other metadata
 * @returns A single linked record or an array depending on `link.cardinality`
 * @public
 */
export type FetchHandler = (
	pgClient: PgClient,
	parentRecord: Record<string, unknown>,
	link: LinkDeclaration
) => Promise<Record<string, unknown> | Record<string, unknown>[]>

const registry = new Map<string, FetchHandler>()

/**
 * Register a custom fetch handler by name.
 * The name must match the `handler` field on a `CustomFetch` strategy declaration.
 * @public
 */
export function registerFetchHandler(name: string, handler: FetchHandler): void {
	registry.set(name, handler)
}

/**
 * Retrieve a registered fetch handler by name.
 * Returns `undefined` if no handler has been registered under that name.
 * @public
 */
export function getFetchHandler(name: string): FetchHandler | undefined {
	return registry.get(name)
}

/**
 * Remove all registered fetch handlers. Primarily for test isolation.
 * @public
 */
export function clearFetchHandlers(): void {
	registry.clear()
}
