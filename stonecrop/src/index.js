import router from './router.js'
import Registry from './registry.js'
// import { useStonecrop } from './composable.js'

// TODO: import { pinia } from "./store.js"

const Stonecrop = {
	install: (app, options) => {
		app.use(router)
		app.provide('$registry', new Registry(options.router || router, options.schemaLoader))
	},
}

export default Stonecrop
