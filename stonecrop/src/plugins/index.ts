import { App } from 'vue'

import type { InstallOptions } from 'types/index'
import { Stonecrop } from '@/stonecrop'
import { pinia } from '@/stores'
import { useDataStore } from '@/stores/data'
import Registry from '@/registry'
import router from '@/router'

export default {
	install: (app: App, options?: InstallOptions) => {
		const appRouter = options?.router || router
		app.use(appRouter)
		app.use(pinia)

		const registry = new Registry(appRouter, options?.doctypeLoader)
		const store = useDataStore()
		const stonecrop = new Stonecrop(registry, store)
		app.provide('$registry', registry)
		app.provide('$stonecrop', stonecrop)
		app.config.globalProperties.$stonecrop = stonecrop

		if (options?.components) {
			for (const [tag, component] of Object.entries(options.components)) {
				app.component(tag, component)
			}
		}
	},
}
