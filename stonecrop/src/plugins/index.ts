import { App, type Plugin } from 'vue'

import Registry from '../registry'
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
 * import router from './router'
 *
 * const app = createApp(App)
 *
 * // Install in correct order
 * app.use(createPinia())
 * app.use(router)
 * app.use(Stonecrop, {
 *  components: {
 *   // register custom components
 *  },
 *  getMeta: async (doctype: string) => {
 *   // fetch doctype meta from API
 *  },
 * })
 *
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

		// Use existing router or provided router for Registry
		const appRouter = existingRouter || providedRouter

		if (!existingRouter && providedRouter) {
			console.warn(
				'[Stonecrop]: Router provided but not installed. ' +
					'Please install router before Stonecrop plugin: app.use(router)'
			)
		}

		// Create registry with available router
		const registry = new Registry(appRouter, options?.getMeta)

		// Provide registry to the application
		app.provide('$registry', registry)
		app.config.globalProperties.$registry = registry

		// Register custom components
		if (options?.components) {
			for (const [tag, component] of Object.entries(options.components)) {
				app.component(tag, component)
			}
		}
	},
}

export default plugin
