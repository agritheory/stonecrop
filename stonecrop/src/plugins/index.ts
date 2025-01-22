import { App, type Plugin } from 'vue'

import Registry from '../registry'
import { pinia } from '../stores'
import type { InstallOptions } from '../types'

/**
 * Stonecrop Vue plugin
 * @param app - The Vue app instance
 * @param options - The plugin options
 * @example
 * ```ts
 *
 * import { createApp } from 'vue'
 * import Stonecrop from 'stonecrop'
 *
 * import App from './App.vue'
 *
 * const app = createApp(App)
 * app.use(Stonecrop, {
 *  router,
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
		// check if the router is already installed via another plugin
		const existingRouter = app.config.globalProperties.$router
		const appRouter = existingRouter || options?.router
		const registry = new Registry(appRouter, options?.getMeta)

		if (!existingRouter && appRouter) {
			app.use(appRouter)
		}

		app.use(pinia)
		app.provide('$registry', registry)

		if (options?.components) {
			for (const [tag, component] of Object.entries(options.components)) {
				app.component(tag, component)
			}
		}
	},
}

export default plugin
