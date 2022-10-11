import { App } from 'vue'

import { InstallOptions } from 'types/index'
import router from './router'
import Registry from './registry'
// import { useStonecrop } from './composable'
// TODO: import { pinia } from "./store"

const Stonecrop = {
	install: (app: App, options: InstallOptions) => {
		app.use(router)
		app.provide('$registry', new Registry(options.router || router, options.schemaLoader))
	},
}

export default Stonecrop
