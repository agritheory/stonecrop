import { App } from 'vue'

import { InstallOptions } from 'types/index'
import router from './router'
import Registry from './registry'
// import { useStonecrop } from './composable'
// TODO: import { pinia } from "./store"

const Stonecrop = {
	install: (app: App, options: InstallOptions) => {
		const appRouter = options.router || router
		app.use(appRouter)
		app.provide('$registry', new Registry(appRouter, options.doctypeLoader))
		for (const [tag, component] of Object.entries(options.components)) {
			app.component(tag, component)
		}
	},
}

export default Stonecrop
