import type { DataClient } from '@stonecrop/schema'
import type { DoctypeMeta, Registry, RouteContext, Stonecrop } from '@stonecrop/stonecrop'

import { useNuxtApp } from 'nuxt/app'

/**
 * Composable for Stonecrop initialization in Nuxt plugins.
 *
 * Use this during the plugin/initialization phase to configure the framework
 * before components mount. For component/runtime usage, use `useStonecropRegistry()` instead.
 *
 * ## When to Use This vs useStonecropRegistry()
 *
 * - **`useStonecropSetup()`** - Call in Nuxt plugins to configure clients, metadata functions,
 *   and pre-load doctypes. Returns values that may be `undefined` if Stonecrop isn't ready yet.
 *
 * - **`useStonecropRegistry()`** - Call in components or composables to use the configured
 *   framework. Throws if Stonecrop isn't initialized (expected to be ready at this point).
 *
 * ## Example
 *
 * ```ts
 * // app/plugins/stonecrop.client.ts
 * import { StonecropClient } from '@stonecrop/graphql-client'
 *
 * export default defineNuxtPlugin(() => {
 *   const { registerClient, registerMeta, registerDoctype } = useStonecropSetup()
 *
 *   const client = new StonecropClient({ endpoint: '/graphql' })
 *   registerClient(client)
 *
 *   // Configure metadata fetching for lazy-loaded doctypes
 *   registerMeta(({ segments }) => {
 *     const doctype = segments[0]
 *     return client.getMeta({ doctype })
 *   })
 *
 *   // Optionally pre-load doctypes
 *   const planMeta = DoctypeMeta.fromObject({ name: 'plan', fields: [...] })
 *   registerDoctype(planMeta)
 * })
 * ```
 *
 * @public
 */
export function useStonecropSetup() {
	const nuxtApp = useNuxtApp()

	return {
		/**
		 * The Registry instance.
		 * Returns `undefined` if the @stonecrop/nuxt plugin hasn't run yet.
		 */
		get registry(): Registry | undefined {
			return nuxtApp.$registry as Registry | undefined
		},

		/**
		 * The Stonecrop instance.
		 * Returns `undefined` if the @stonecrop/nuxt plugin hasn't run yet.
		 */
		get stonecrop(): Stonecrop | undefined {
			return nuxtApp.$stonecrop as Stonecrop | undefined
		},

		/**
		 * Check if Stonecrop is ready for configuration.
		 * Returns `true` when both Registry and Stonecrop instances are available.
		 */
		get isReady(): boolean {
			return !!(nuxtApp.$registry && nuxtApp.$stonecrop)
		},

		/**
		 * Register the data client on the Stonecrop instance.
		 * Required before fetching records or dispatching actions.
		 *
		 * @param client - DataClient implementation (e.g., StonecropClient from \@stonecrop/graphql-client)
		 * @throws Error if the Stonecrop plugin is not installed
		 *
		 * @example
		 * ```ts
		 * const client = new StonecropClient({ endpoint: '/graphql' })
		 * registerClient(client)
		 * ```
		 */
		registerClient(client: DataClient): void {
			const stonecrop = nuxtApp.$stonecrop as Stonecrop | undefined
			if (!stonecrop) {
				throw new Error(
					'[useStonecropSetup] Stonecrop instance not available. ' +
						'Ensure the @stonecrop/nuxt module is installed and its plugin has run before calling this.'
				)
			}
			stonecrop.setClient(client)
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
		 * @param fn - Function that receives RouteContext and returns DoctypeMeta
		 * @throws Error if the Registry is not available
		 *
		 * @example
		 * ```ts
		 * registerMeta(({ segments }) => {
		 *   const doctype = segments[0] // /plan/123 → 'plan'
		 *   return client.getMeta({ doctype })
		 * })
		 * ```
		 */
		registerMeta(fn: (routeContext: RouteContext) => DoctypeMeta | Promise<DoctypeMeta>): void {
			const registry = nuxtApp.$registry as Registry | undefined
			if (!registry) {
				throw new Error(
					'[useStonecropSetup] Registry not available. ' +
						'Ensure the @stonecrop/nuxt module is installed and its plugin has run before calling this.'
				)
			}
			registry.getMeta = fn
		},

		/**
		 * Load a doctype into the Registry.
		 * Convenience method that calls `registry.addDoctype()` if available.
		 *
		 * @param doctype - The DoctypeMeta instance to register
		 * @throws Error if the Registry is not available
		 *
		 * @example
		 * ```ts
		 * const planMeta = DoctypeMeta.fromObject({ name: 'plan', fields: [...] })
		 * registerDoctype(planMeta)
		 * ```
		 */
		registerDoctype(doctype: DoctypeMeta): void {
			const registry = nuxtApp.$registry as Registry | undefined
			if (!registry) {
				throw new Error(
					'[useStonecropSetup] Registry not available. ' +
						'Ensure the @stonecrop/nuxt module is installed and its plugin has run before calling this.'
				)
			}
			registry.addDoctype(doctype)
		},
	}
}
