import type { DataClient, DoctypeMeta } from '@stonecrop/schema'
import type { RouteContext } from '@stonecrop/stonecrop'

import { useNuxtApp } from 'nuxt/app'

/**
 * Provides a stable, documented API for accessing and configuring the Stonecrop
 * Registry instance after the `@stonecrop/nuxt` plugin has installed it.
 *
 * ## Why This Composable Exists
 *
 * Stonecrop's architecture separates concerns across packages:
 * - **@stonecrop/schema**: Defines doctype schemas, `DoctypeContext`, and `DataClient` interface
 * - **@stonecrop/stonecrop**: Core framework with `RouteContext` (path + segments) for routing
 * - **@stonecrop/graphql-client**: Reference `DataClient` implementation using GraphQL
 * - **@stonecrop/nuxt**: Nuxt integration that bootstraps the Registry and Stonecrop instances
 *
 * This composable bridges Nuxt's plugin lifecycle with Stonecrop's registry, allowing
 * applications to inject their data client and configure metadata fetching after the
 * framework is mounted.
 *
 * ## RouteContext vs DoctypeContext
 *
 * - **RouteContext** (`{ path, segments }`): Raw URL routing context. Used by the router
 *   layer to identify "where we are" in the application (e.g., `/plan/123` → segments `['plan', '123']`).
 *
 * - **DoctypeContext** (`{ doctype, recordId? }`): Semantic doctype context. Used by the
 *   data layer to identify "what we're working with" (e.g., `{ doctype: 'Plan', recordId: '123' }`).
 *
 * Your `setMeta` implementation bridges these: extract doctype/recordId from the route
 * segments and pass `DoctypeContext` to your data client.
 *
 * ## Data Flow
 *
 * ```
 * URL Route (/plan/123)
 *     ↓
 * RouteContext ({ path: '/plan/123', segments: ['plan', '123'] })
 *     ↓
 * getMeta (your implementation)
 *     ↓
 * DoctypeContext ({ doctype: 'Plan', recordId: '123' })
 *     ↓
 * DataClient.getMeta() → DoctypeMeta
 * ```
 *
 * @example
 * ```ts
 * // app/plugins/stonecrop.client.ts
 * import { StonecropClient } from '@stonecrop/graphql-client'
 *
 * export default defineNuxtPlugin(() => {
 *   const client = new StonecropClient({ endpoint: '/graphql' })
 *   const { setClient, setMeta } = useStonecropRegistry()
 *
 *   // Set the data client for record fetching
 *   setClient(client)
 *
 *   // Bridge RouteContext → DoctypeContext for metadata fetching
 *   setMeta(({ segments }) => {
 *     const doctype = segments[0] // e.g. "plan" → doctype "Plan"
 *     return client.getMeta({ doctype }) // client expects DoctypeContext
 *   })
 * })
 * ```
 *
 * @public
 */
export function useStonecropRegistry() {
	const nuxtApp = useNuxtApp()

	// Access the Registry instance provided by the @stonecrop/nuxt plugin.
	// Using the injection key '$registry' matches what StonecropPlugin provides via
	// `app.provide('$registry', registry)` in @stonecrop/stonecrop's plugin.
	const registry = nuxtApp.$registry as
		| {
				getMeta?: (routeContext: RouteContext) => DoctypeMeta | Promise<DoctypeMeta>
		  }
		| undefined

	if (!registry) {
		throw new Error(
			'[useStonecropRegistry] The Stonecrop Registry is not available. ' +
				'Ensure @stonecrop/nuxt is installed and the plugin has run before calling this composable.'
		)
	}

	// The Stonecrop instance carries the data client.
	const stonecrop = nuxtApp.$stonecrop as
		| {
				setClient: (client: DataClient) => void
				getClient: () => DataClient | undefined
				dispatchAction: (
					doctype: { name: string; slug?: string },
					action: string,
					args?: unknown[]
				) => Promise<{ success: boolean; data: unknown; error: string | null }>
		  }
		| undefined

	return {
		/**
		 * The raw Registry instance, for advanced use cases.
		 * Prefer the typed setter methods below for normal configuration.
		 */
		registry,

		/**
		 * Set the data client on the Stonecrop instance.
		 * Required before fetching records or dispatching actions.
		 *
		 * @param client - DataClient implementation (e.g., StonecropClient from \@stonecrop/graphql-client)
		 *
		 * @example
		 * ```ts
		 * const client = new StonecropClient({ endpoint: '/graphql' })
		 * setClient(client)
		 * ```
		 */
		setClient(client: DataClient): void {
			if (stonecrop) {
				stonecrop.setClient(client)
			}
		},

		/**
		 * Get the currently configured data client.
		 * @returns The DataClient instance or undefined if not set
		 */
		getClient(): DataClient | undefined {
			return stonecrop?.getClient()
		},

		/**
		 * Dispatch an action to the server via the configured data client.
		 * All state changes flow through this single mutation endpoint.
		 *
		 * @param doctype - Doctype reference (name and optional slug)
		 * @param action - Action name to execute (e.g., 'SUBMIT', 'APPROVE', 'save')
		 * @param args - Action arguments (typically record ID and/or form data)
		 * @returns Action result with success status, response data, and any error
		 *
		 * @example
		 * ```ts
		 * // Save a record
		 * const result = await dispatchAction(doctype, 'save', [{ id: recordId, data: formData }])
		 *
		 * // Submit for approval
		 * const result = await dispatchAction(doctype, 'SUBMIT', [recordId])
		 * ```
		 */
		dispatchAction(
			doctype: { name: string; slug?: string },
			action: string,
			args?: unknown[]
		): Promise<{ success: boolean; data: unknown; error: string | null }> {
			if (!stonecrop) {
				throw new Error(
					'[useStonecropRegistry] Stonecrop instance is not available. ' +
						'Ensure @stonecrop/nuxt is installed and the plugin has run.'
				)
			}
			return stonecrop.dispatchAction(doctype, action, args)
		},

		/**
		 * Set the `getMeta` function on the Registry.
		 * Called by `useStonecrop()` to lazy-load doctype metadata for the current route.
		 *
		 * You must bridge `RouteContext` → `DoctypeContext`:
		 * - Extract doctype name from `segments` (e.g., `segments[0]`)
		 * - Extract record ID from `segments` if present (e.g., `segments[1]`)
		 * - Pass `DoctypeContext` to your data client
		 *
		 * @example
		 * ```ts
		 * // Map route to doctype
		 * setMeta(({ segments }) => {
		 *   const doctype = segments[0] // /plan/123 → 'plan'
		 *   return client.getMeta({ doctype }) // client expects DoctypeContext
		 * })
		 * ```
		 *
		 * @param fn - Function that receives RouteContext and returns DoctypeMeta.
		 */
		setMeta(fn: (routeContext: RouteContext) => DoctypeMeta | Promise<DoctypeMeta>): void {
			// Registry.getMeta is a mutable property (not readonly), so this assignment
			// is supported — we're providing a cleaner API than direct globalProperties access.
			registry.getMeta = fn
		},
	}
}
