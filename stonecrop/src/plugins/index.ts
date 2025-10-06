import { App, type Plugin, nextTick } from 'vue'

import Registry from '../registry'
import { Stonecrop } from '../stonecrop'
import type { InstallOptions } from '../types'

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
		const stonecrop = new Stonecrop(registry)
		app.provide('$stonecrop', stonecrop)
		app.config.globalProperties.$stonecrop = stonecrop

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
