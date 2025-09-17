import { App, type Plugin, nextTick } from 'vue'

import Registry from '../registry'
import { Stonecrop } from '../stonecrop'
import type { InstallOptions } from '../types'

/**
 * Setup auto-initialization for user-defined initialization logic
 * This function handles the post-mount initialization automatically
 */
async function setupAutoInitialization(
	app: App,
	registry: Registry,
	stonecrop: Stonecrop,
	onRouterInitialized?: (registry: Registry, stonecrop: Stonecrop) => void | Promise<void>
) {
	// Wait for the next tick to ensure the app is mounted
	await nextTick()

	try {
		// Emit a global event that can be picked up by user modules
		if (typeof window !== 'undefined') {
			const event = new CustomEvent('stonecrop:plugin-ready', {
				detail: { registry, stonecrop },
			})
			window.dispatchEvent(event)
		}

		// Call user-provided initialization callback
		if (onRouterInitialized) {
			await onRouterInitialized(registry, stonecrop)
		}

		// Silent success - no console.log in production code
	} catch (error) {
		// Silent error handling - applications can listen to events if needed
		if (typeof window !== 'undefined') {
			const errorEvent = new CustomEvent('stonecrop:init-error', {
				detail: { error },
			})
			window.dispatchEvent(errorEvent)
		}
	}
}

/**
 * Stonecrop Vue plugin
 * @param app - The Vue app instance
 * @param options - The plugin options
 * @example
 * ```ts
 *
 * import { createApp } from 'vue'
 * import { createPinia } from 'pinia'
 * import Stonecrop from '@stonecrop/stonecrop'
 *
 * import App from './App.vue'
 * import router from './router'
 *
 * const app = createApp(App)
 *
 * // Install in correct order
 * app.use(createPinia())
 * app.use(Stonecrop, {
 *  router,
 *  getMeta: async (doctype: string) => {
 *   // fetch doctype meta from your API
 *  },
 *  autoInitializeRouter: true,
 *  onRouterInitialized: async (registry, stonecrop) => {
 *   // your custom initialization logic here
 *   // e.g., preload data, setup routes, etc.
 *  }
 * })
 * app.mount('#app')
 * ```
 *
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
		if (options?.autoInitializeRouter) {
			void setupAutoInitialization(app, registry, stonecrop, options.onRouterInitialized)
		}
	},
}

export default plugin
