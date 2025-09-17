import { App, nextTick, type Plugin } from 'vue'

import Registry from '../registry'
import { Stonecrop } from '../stonecrop'
import type { InstallOptions } from '../types'

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
 * import router, { setGlobalReferences, initializeRouter } from './router'
 *
 * const app = createApp(App)
 *
 * // Install in correct order
 * app.use(createPinia())
 * app.use(Stonecrop, {
 *  router,
 *  components: {
 *   // register custom components
 *  },
 *  getMeta: async (doctype: string) => {
 *   // fetch doctype meta from API
 *  },
 *  setGlobalReferences,  // Will be called automatically
 *  initializeRouter,     // Will be called automatically
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

		// Auto-initialize after mounting if enabled (default: true)
		const autoInitialize = options?.autoInitialize !== false
		if (autoInitialize && (options?.setGlobalReferences || options?.initializeRouter)) {
			// Use nextTick to ensure the app is fully mounted
			void nextTick(() => {
				// Call setGlobalReferences if provided
				if (options?.setGlobalReferences) {
					options.setGlobalReferences(registry, stonecrop)
				}

				// Call initializeRouter if provided
				if (options?.initializeRouter) {
					void options.initializeRouter().catch(error => {
						// eslint-disable-next-line no-console
						console.error('Failed to initialize router:', error)
					})
				}
			})
		}
	},
}

export default plugin
