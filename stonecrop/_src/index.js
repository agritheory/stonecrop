import { createOvermind } from 'overmind'
import { createPlugin } from 'overmind-vue'
import { config } from './overmind'
import { router } from './routes.js'
import StonecropConfigLoader from './configLoader'

// let bloom = new Bloom()

function install(app, options) {
	const overmind = createOvermind(config)
	const OvermindPlugin = createPlugin(overmind)
	app.use(OvermindPlugin)
	app.use(router)
	const config = new StonecropConfigLoader()
	// app.use(bloom)
	// app.use(caulis)
}

export default {
	install,
}
