import { List, Map } from 'immutable'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@stonecrop/desktop/styles'
import { install as AForm } from '@stonecrop/aform'
import { StonecropDesktop } from '@stonecrop/desktop'
import StonecropPlugin, {
	Doctype,
	Registry,
	Stonecrop,
	type ImmutableDoctype,
	type MutableDoctype,
	type RouteContext,
} from '@stonecrop/stonecrop'

import App from './App.vue'
import { RestDataClient } from './client'
import router, { setupRouterContext } from './router'
import { makeServer } from './server'

// Import field trigger actions - this registers them globally
import './actions'

const app = createApp(App)

// Setup MirageJS server
makeServer()

// Create the getMeta function that will be used by the plugin
const getMeta = async (routeContext: RouteContext) => {
	const response = await fetch(`/api/meta?route=${encodeURIComponent(routeContext.path)}`)
	const data: MutableDoctype = await response.json()

	if ('error' in data) {
		throw new Error(`Failed to get metadata: ${data.error}`)
	}

	const config: ImmutableDoctype = {
		schema: List(data.schema),
		workflow: data.workflow,
		actions: Map(data.actions || {}),
	}

	return new Doctype(data.doctype!, config.schema, config.workflow, config.actions)
}

// Install plugins in correct order following Vue.js best practices
// 1. State management first
const pinia = createPinia()
app.use(pinia)

// 2. Stonecrop plugin with auto-initialization enabled
app.use(StonecropPlugin, {
	router,
	getMeta,
	client: new RestDataClient(),
	autoInitializeRouter: true,
	onRouterInitialized: async (registry: Registry, stonecrop: Stonecrop) => {
		// Setup router context with the provided instances
		await setupRouterContext(registry, stonecrop)
	},
})

// 3. Component plugins
// Note: AForm internally installs ATable, so ATable must not be installed separately
app.use(AForm)
app.use(StonecropDesktop)

// Mount the app - router initialization will happen automatically
app.mount('#app')
