import { useNuxtApp } from 'nuxt/app'

/**
 * Stonecrop's internal route context — the shape passed to `Registry.getMeta`.
 * Uses `path` + `segments` (resolved from the router at runtime), not the
 * schema-level `{ doctype }` context used by `StonecropClient`.
 *
 * Defined inline here to avoid importing from `@stonecrop/stonecrop`,
 * where `RouteContext` and `DoctypeMeta` are declared separately from
 * `@stonecrop/schema` and would cause TS2322 structural mismatches.
 */
interface StonecropRouteContext {
	/** The full route path, e.g. "/plan/abc-123" */
	path: string
	/** Path split by "/", e.g. ["plan", "abc-123"] */
	segments: string[]
}

/**
 * Minimal structural shape of a resolved DoctypeMeta.
 * Expressed as an interface so any object satisfying this shape is accepted,
 * avoiding nominal type conflicts between the stonecrop dist and @stonecrop/schema.
 */
interface ResolvedDoctypeMeta {
	name: string
	fields: Array<{ fieldname: string; fieldtype: string; [key: string]: unknown }>
	[key: string]: unknown
}

/**
 * Provides a stable, documented API for accessing and configuring the Stonecrop
 * Registry instance after the `@stonecrop/nuxt` plugin has installed it.
 *
 * This is the idiomatic way to wire up `getMeta`, `fetchRecord`, and `fetchRecords`
 * in a Nuxt application — call this composable from your own plugin instead of
 * reaching into `globalProperties` directly.
 *
 * @example
 * ```ts
 * // app/plugins/stonecrop.client.ts
 * import { StonecropClient } from '@stonecrop/graphql-client'
 *
 * export default defineNuxtPlugin(() => {
 *   const client = new StonecropClient({ endpoint: '/graphql' })
 *   const { setMeta, setFetchRecord, setFetchRecords } = useStonecropRegistry()
 *
 *   // getMeta receives the router path/segments; adapt to what your client needs
 *   setMeta(({ segments }) => {
 *     const doctype = segments[0] // e.g. "plan" → doctype "Plan"
 *     return client.getMeta({ doctype })
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
				getMeta?: (routeContext: StonecropRouteContext) => ResolvedDoctypeMeta | Promise<ResolvedDoctypeMeta>
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
				_fetchRecord?: (doctype: ResolvedDoctypeMeta, id: string) => Promise<Record<string, unknown> | null>
				_fetchRecords?: (doctype: ResolvedDoctypeMeta) => Promise<Record<string, unknown>[]>
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
		 * The context received is Stonecrop's router context `{ path, segments }`.
		 * Your implementation must map from the route path to the appropriate doctype.
		 *
		 * @example
		 * ```ts
		 * setMeta(({ segments }) => client.getMeta({ doctype: segments[0] }))
		 * ```
		 *
		 * @param fn - Function that receives a route context and returns DoctypeMeta.
		 */
		setMeta(fn: (routeContext: StonecropRouteContext) => ResolvedDoctypeMeta | Promise<ResolvedDoctypeMeta>): void {
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
		setFetchRecord(fn: (doctype: ResolvedDoctypeMeta, id: string) => Promise<Record<string, unknown> | null>): void {
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
		setFetchRecords(fn: (doctype: ResolvedDoctypeMeta) => Promise<Record<string, unknown>[]>): void {
			if (stonecrop) {
				stonecrop._fetchRecords = fn
			}
		},
	}
}
