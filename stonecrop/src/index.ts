import { App } from 'vue'

import type { InstallOptions } from 'types/index'
import { useStonecrop } from './composable'
import DoctypeMeta from './doctype'
import Registry from './registry'
import router from './router'
import { pinia } from './stores'

const Stonecrop = {
	install: (app: App, options: InstallOptions) => {
		const appRouter = options.router || router
		app.use(appRouter)
		app.use(pinia)
		app.provide('$registry', new Registry(appRouter, options.doctypeLoader))
		for (const [tag, component] of Object.entries(options.components)) {
			app.component(tag, component)
		}
	},
}

export { DoctypeMeta, Registry, Stonecrop, useStonecrop }
