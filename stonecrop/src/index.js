import router from "./router.js"
// import { pinia } from "./store.js"

const Stonecrop = {
	install(app, options) {
		app.use(router)
		// app.use(pinia)
		app.provide('schema', options.schema)
		app.provide('events', options.events)
		app.provide('hooks', options.hooks)
	}
}

export default Stonecrop
