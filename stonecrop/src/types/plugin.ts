import type { DataClient } from '@stonecrop/schema'
import type { Component } from 'vue'
import type { Router } from 'vue-router'

import type Doctype from '../doctype'
import type Registry from '../registry'
import type { Stonecrop } from '../stonecrop'
import type { RouteContext } from './registry'

/**
 * Install options for Stonecrop Vue plugin
 * @public
 */
export type InstallOptions = {
	router?: Router
	components?: Record<string, Component>
	getMeta?: (routeContext: RouteContext) => Doctype | Promise<Doctype>
	/**
	 * Data client for fetching doctype metadata and records.
	 * Use \@stonecrop/graphql-client's StonecropClient for GraphQL backends,
	 * or implement DataClient for custom data sources.
	 *
	 * Can be set later via `useStonecropRegistry().setClient()` for deferred configuration.
	 *
	 * @example
	 * ```ts
	 * import { StonecropClient } from '@stonecrop/graphql-client'
	 *
	 * const client = new StonecropClient({ endpoint: '/graphql' })
	 * app.use(StonecropPlugin, { client })
	 * ```
	 */
	client?: DataClient
	/** Automatically run initialization callback after app mounting (default: false) */
	autoInitializeRouter?: boolean
	/** Callback function called after plugin is ready and mounted */
	onRouterInitialized?: (registry: Registry, stonecrop: Stonecrop) => void | Promise<void>
}
