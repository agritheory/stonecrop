import type { DataClient } from '@stonecrop/schema'
import type { Doctype, Registry, RouteContext, Stonecrop } from '@stonecrop/stonecrop'

import { useNuxtApp } from 'nuxt/app'

/**
 * Provides a stable, documented API for accessing the configured Stonecrop
 * Registry instance in components and composables.
 *
 * ## When to Use This vs useStonecropSetup()
 *
 * - **`useStonecropRegistry()`** - Call in components or composables to use the configured
 *   framework. Throws if Stonecrop isn't initialized (expected to be ready at this point).
 *
 * - **`useStonecropSetup()`** - Call in Nuxt plugins to configure clients, metadata functions,
 *   and pre-load doctypes. Returns values that may be `undefined` if Stonecrop isn't ready yet.
 *
 * ## Why This Composable Exists
 *
 * Stonecrop's architecture separates concerns across packages:
 * - **@stonecrop/schema**: Defines doctype schemas, `DoctypeContext`, and `DataClient` interface
 * - **@stonecrop/stonecrop**: Core framework with `RouteContext` (path + segments) for routing
 * - **@stonecrop/graphql-client**: Reference `DataClient` implementation using GraphQL
 * - **@stonecrop/nuxt**: Nuxt integration that bootstraps the Registry and Stonecrop instances
 *
 * This composable bridges Nuxt's plugin lifecycle with Stonecrop's registry, providing
 * a clean API for components to interact with the configured framework.
 *
 * ## RouteContext vs DoctypeContext
 *
 * - **RouteContext** (`{ path, segments }`): Raw URL routing context. Used by the router
 *   layer to identify "where we are" in the application (e.g., `/plan/123` → segments `['plan', '123']`).
 *
 * - **DoctypeContext** (`{ doctype, recordId? }`): Semantic doctype context. Used by the
 *   data layer to identify "what we're working with" (e.g., `{ doctype: 'Plan', recordId: '123' }`).
 *
 * Your `setMeta` implementation (configured via `useStonecropSetup()`) bridges these:
 * extract doctype/recordId from the route segments and pass `DoctypeContext` to your data client.
 *
 * ## Data Flow
 *
 * ```
 * URL Route (/plan/123)
 *     ↓
 * RouteContext ({ path: '/plan/123', segments: ['plan', '123'] })
 *     ↓
 * getMeta (configured in plugin via useStonecropSetup)
 *     ↓
 * DoctypeContext ({ doctype: 'Plan', recordId: '123' })
 *     ↓
 * DataClient.getMeta() → Doctype
 * ```
 *
 * @example
 * ```ts
 * // In a component or composable
 * const { registry, stonecrop, dispatchAction } = useStonecropRegistry()
 *
 * // Access the registry
 * const plan = registry.getDoctype('plan')
 *
 * // Dispatch an action
 * await dispatchAction({ name: 'plan' }, 'SUBMIT', [recordId])
 * ```
 *
 * @public
 */
export function useStonecropRegistry() {
	const nuxtApp = useNuxtApp()

	// Access the Registry instance provided by the @stonecrop/nuxt plugin.
	// Using the injection key '$registry' matches what StonecropPlugin provides via
	// `app.provide('$registry', registry)` in @stonecrop/stonecrop's plugin.
	const registry = nuxtApp.$registry as Registry | undefined

	if (!registry) {
		throw new Error(
			'[useStonecropRegistry] The Stonecrop Registry is not available. ' +
				'Ensure @stonecrop/nuxt is installed.\n\n' +
				'If you are calling this from a Nuxt plugin, use useStonecropSetup() instead, ' +
				'which is designed for the plugin initialization context.'
		)
	}

	// The Stonecrop instance carries the data client.
	const stonecrop = nuxtApp.$stonecrop as Stonecrop | undefined

	return {
		/**
		 * The Registry instance for doctype management.
		 * Use this to access doctype metadata, resolve schemas, etc.
		 */
		registry,

		/**
		 * The Stonecrop instance for HST and operation log access.
		 */
		get stonecrop(): Stonecrop {
			if (!stonecrop) {
				throw new Error(
					'[useStonecropRegistry] Stonecrop instance is not available. ' +
						'Ensure @stonecrop/nuxt is installed.\n\n' +
						'If you are calling this from a Nuxt plugin, use useStonecropSetup() instead.'
				)
			}
			return stonecrop
		},

		/**
		 * Set the data client on the Stonecrop instance.
		 * Required before fetching records or dispatching actions.
		 *
		 * @param client - DataClient implementation (e.g., StonecropClient from \@stonecrop/graphql-client)
		 * @throws Error if Stonecrop instance is not available
		 *
		 * @example
		 * ```ts
		 * const client = new StonecropClient({ endpoint: '/graphql' })
		 * setClient(client)
		 * ```
		 */
		setClient(client: DataClient): void {
			if (!stonecrop) {
				throw new Error(
					'[useStonecropRegistry] Stonecrop instance is not available. ' +
						'Ensure @stonecrop/nuxt is installed.\n\n' +
						'If you are calling this from a Nuxt plugin, use useStonecropSetup() instead.'
				)
			}
			stonecrop.setClient(client)
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
		 * @param doctype - Doctype reference object with `name` and optional `slug` properties
		 * @param doctype.name - Doctype name (e.g., 'plan')
		 * @param doctype.slug - Optional doctype slug if it differs from the name (e.g., 'project-plan')
		 * @param action - Action name to execute (e.g., 'SUBMIT', 'APPROVE', 'save')
		 * @param args - Action arguments (typically record ID and/or form data)
		 * @returns Action result with success status, response data, and any error
		 *
		 * @example
		 * ```ts
		 * // Save a record
		 * const result = await dispatchAction({ name: 'plan' }, 'save', [{ id: recordId, data: formData }])
		 *
		 * // Submit for approval
		 * const result = await dispatchAction({ name: 'plan' }, 'SUBMIT', [recordId])
		 * ```
		 */
		dispatchAction(
			doctype: { name: string; slug?: string },
			action: string,
			args?: unknown[]
		): Promise<{ success: boolean; data: unknown; error: string | null }> {
			if (!stonecrop) {
				return Promise.reject(
					new Error(
						'[useStonecropRegistry] Stonecrop instance is not available. ' +
							'Ensure @stonecrop/nuxt is installed.\n\n' +
							'If you are calling this from a Nuxt plugin, use useStonecropSetup() instead.'
					)
				)
			}

			const meta = registry.getDoctype(doctype.slug || doctype.name.toLowerCase())
			if (!meta) {
				return Promise.resolve({
					success: false,
					data: null,
					error: `Doctype '${doctype.name}' not found in registry`,
				})
			}

			return stonecrop.dispatchAction(meta, action, args)
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
		 * @param fn - Function that receives RouteContext and returns Doctype.
		 */
		setMeta(fn: (routeContext: RouteContext) => Doctype | Promise<Doctype>): void {
			// Registry.getMeta is a mutable property (not readonly), so this assignment
			// is supported — we're providing a cleaner API than direct globalProperties access.
			registry.getMeta = fn
		},
	}
}
