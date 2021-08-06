import { createOvermind } from 'overmind'
import { createPlugin } from 'overmind-vue'
import { config } from './overmind'
import { router } from './routes.js'

// import { hooks } from './hooks'

// let rathad = new Rathad(hooks)

function install(app, options) {
	const overmind = createOvermind(config)
	const OvermindPlugin = createPlugin(overmind)
	app.use(OvermindPlugin)
	app.use(router)
}


if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue)
}

export default {
  version: "0.1.0",
  install,
}
