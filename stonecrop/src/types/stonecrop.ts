import type { DataClient } from '@stonecrop/schema'

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
