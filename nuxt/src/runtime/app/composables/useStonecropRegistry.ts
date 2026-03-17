import type { DoctypeMeta } from '@stonecrop/schema'
import type { RouteContext } from '@stonecrop/stonecrop'

import { useNuxtApp } from 'nuxt/app'

/**
 * Provides a stable, documented API for accessing and configuring the Stonecrop
 * Registry instance after the `@stonecrop/nuxt` plugin has installed it.
 *
 * ## Why This Composable Exists
 *
 * Stonecrop's architecture separates concerns across packages:
 * - **@stonecrop/schema**: Defines doctype schemas and `DoctypeContext` (doctype + recordId)
 * - **@stonecrop/stonecrop**: Core framework with `RouteContext` (path + segments) for routing
 * - **@stonecrop/nuxt**: Nuxt integration that bootstraps the Registry and Stonecrop instances
 *
 * This composable bridges Nuxt's plugin lifecycle with Stonecrop's registry, allowing
 * applications to inject their data-fetching implementations after the framework is mounted.
 * The nuxt module is client-agnostic — use any data source (GraphQL, REST, local storage, etc.).
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
 * Your Data Client → DoctypeMeta
 * ```
 *
 * @example
 * ```ts
 * // app/plugins/stonecrop.client.ts
 * // Example using @stonecrop/graphql-client, but any data source works
 * import { StonecropClient } from '@stonecrop/graphql-client'
 *
 * export default defineNuxtPlugin(() => {
 *   const client = new StonecropClient({ endpoint: '/graphql' })
 *   const { setMeta, setFetchRecord, setFetchRecords } = useStonecropRegistry()
 *
 *   // Bridge RouteContext → DoctypeContext for metadata fetching
 *   setMeta(({ segments }) => {
 *     const doctype = segments[0] // e.g. "plan" → doctype "Plan"
 *     return client.getMeta({ doctype }) // client expects DoctypeContext
 *   })
 *   setFetchRecord((doctype, id) => client.getRecord(doctype, id))
 *   setFetchRecords((doctype) => client.getRecords(doctype))
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

	// The Stonecrop instance carries the injectable fetch implementations.
	const stonecrop = nuxtApp.$stonecrop as
		| {
				_fetchRecord?: (doctype: DoctypeMeta, id: string) => Promise<Record<string, unknown> | null>
				_fetchRecords?: (doctype: DoctypeMeta) => Promise<Record<string, unknown>[]>
		  }
		| undefined

	return {
		/**
		 * The raw Registry instance, for advanced use cases.
		 * Prefer the typed setter methods below for normal configuration.
		 */
		registry,

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

		/**
		 * Set the `fetchRecord` implementation on the Stonecrop instance.
		 * When set, replaces the default REST fetch() stub in `Stonecrop.getRecord()`.
		 *
		 * @param fn - Async function that fetches a single record by doctype + ID.
		 */
		setFetchRecord(fn: (doctype: DoctypeMeta, id: string) => Promise<Record<string, unknown> | null>): void {
			if (stonecrop) {
				stonecrop._fetchRecord = fn
			}
		},

		/**
		 * Set the `fetchRecords` implementation on the Stonecrop instance.
		 * When set, replaces the default REST fetch() stub in `Stonecrop.getRecords()`.
		 *
		 * @param fn - Async function that fetches all records for a doctype.
		 */
		setFetchRecords(fn: (doctype: DoctypeMeta) => Promise<Record<string, unknown>[]>): void {
			if (stonecrop) {
				stonecrop._fetchRecords = fn
			}
		},
	}
}
