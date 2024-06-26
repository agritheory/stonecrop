import { App } from 'vue'

import Registry from '@/registry'
import router from '@/router'
import { pinia } from '@/stores'
import type { InstallOptions } from '@/types'

export default {
	install: (app: App, options?: InstallOptions) => {
		const appRouter = options?.router || router
		const registry = new Registry(appRouter, options?.getMeta)

		app.use(appRouter)
		app.use(pinia)
		app.provide('$registry', registry)

		if (options?.components) {
			for (const [tag, component] of Object.entries(options.components)) {
				app.component(tag, component)
			}
		}
	},
}
