import { App } from 'vue'

import type { InstallOptions } from 'types/index'
import Registry from '../registry'
import router from '../router'
import { pinia } from '../stores'
import { useDataStore } from '../stores/data'

export default {
	install: (app: App, options?: InstallOptions) => {
		const appRouter = options?.router || router
		app.use(appRouter)
		app.use(pinia)

		const store = useDataStore()
		app.provide('$registry', new Registry(appRouter, options?.doctypeLoader))
		app.provide('$store', store)

		if (options?.components) {
			for (const [tag, component] of Object.entries(options.components)) {
				app.component(tag, component)
			}
		}
	},
}
