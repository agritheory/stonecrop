import type { DataClient } from '@stonecrop/schema'

/**
 * Pagination metadata from the last {@link Stonecrop.getRecords} for a doctype.
 * Kept beside HST, not in it — see {@link Stonecrop.getPageInfo}.
 * @public
 */
export interface PageInfo {
	/** Whether the backend holds further records beyond what has been fetched */
	hasMore: boolean
	/** Total matching the filters when the caller passed includeTotal */
	count?: number
	/** Offset of the last fetch */
	offset: number
	/** Number of rows in the last page (result.data.length) */
	limit: number
}

/**
 * Options for constructing a Stonecrop instance directly.
 * When using the Vue plugin, pass these via `InstallOptions` instead.
 * @public
 */
export interface StonecropOptions {
	/**
	 * Data client for fetching doctype metadata and records.
	 * Use \@stonecrop/graphql-client's StonecropClient for GraphQL backends,
	 * or implement DataClient for custom data sources.
	 *
	 * Can be set later via `setClient()` for deferred configuration.
	 */
	client?: DataClient
}
