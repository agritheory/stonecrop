import { App, type Plugin, nextTick } from 'vue'
import type { Pinia } from 'pinia'

import Registry from '../registry'
import { Stonecrop } from '../stonecrop'
import type { InstallOptions } from '../types'
import { useOperationLogStore } from '../stores/operation-log'

/**
 * Setup auto-initialization for user-defined initialization logic
 * This function handles the post-mount initialization automatically
 */
async function setupAutoInitialization(
	registry: Registry,
	stonecrop: Stonecrop,
	onRouterInitialized: (registry: Registry, stonecrop: Stonecrop) => void | Promise<void>
) {
	// Wait for the next tick to ensure the app is mounted
	await nextTick()

	try {
		await onRouterInitialized(registry, stonecrop)
	} catch {
		// Silent error handling - application should handle initialization errors
	}
}

/**
 * Stonecrop Vue plugin
 * @param app - The Vue app instance
 * @param options - The plugin options
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import Stonecrop from '@stonecrop/stonecrop'
 * import router from './router'
 *
 * const app = createApp(App)
 * app.use(Stonecrop, {
 *   router,
 *   getMeta: async (routeContext) => {
 *     // routeContext contains: { path, segments }
 *     // fetch doctype meta from your API using the route context
 *   },
 *   autoInitializeRouter: true,
 *   onRouterInitialized: async (registry, stonecrop) => {
 *     // your custom initialization logic here
 *   }
 * })
 * app.mount('#app')
 * ```
 * @public
 */
const plugin: Plugin = {
	install: (app: App, options?: InstallOptions) => {
		// Check for existing router installation
		const existingRouter = app.config.globalProperties.$router
		const providedRouter = options?.router
		const router = existingRouter || providedRouter
		if (!existingRouter && providedRouter) {
			app.use(providedRouter)
		}

		// Create registry with available router
		const registry = new Registry(router, options?.getMeta)
		app.provide('$registry', registry)
		app.config.globalProperties.$registry = registry

		// Create and provide a global Stonecrop instance
		const stonecrop = new Stonecrop(registry, undefined, {
			fetchRecord: options?.fetchRecord,
			fetchRecords: options?.fetchRecords,
		})
		app.provide('$stonecrop', stonecrop)
		app.config.globalProperties.$stonecrop = stonecrop

		// Initialize operation log store if Pinia is available
		// This ensures the store is created with the app's Pinia instance
		try {
			const pinia = app.config.globalProperties.$pinia as Pinia | undefined
			if (pinia) {
				// Initialize the operation log store with the app's Pinia instance
				const operationLogStore = useOperationLogStore(pinia)

				// Provide the store so components can access it
				app.provide('$operationLogStore', operationLogStore)
				app.config.globalProperties.$operationLogStore = operationLogStore
			}
		} catch (error) {
			// Pinia not available - operation log won't work, but app should still function
			// eslint-disable-next-line no-console
			console.warn('Pinia not available - operation log features will be disabled:', error)
		}

		// Register custom components
		if (options?.components) {
			for (const [tag, component] of Object.entries(options.components)) {
				app.component(tag, component)
			}
		}

		// Setup auto-initialization if requested
		if (options?.autoInitializeRouter && options.onRouterInitialized) {
			void setupAutoInitialization(registry, stonecrop, options.onRouterInitialized)
		}
	},
}

export default plugin
