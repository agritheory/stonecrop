import { App, type Plugin } from 'vue'

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
 * import router from './router'
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
	},
}

export default plugin
