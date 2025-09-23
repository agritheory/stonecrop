import { List, Map } from 'immutable'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@stonecrop/desktop/styles'
import { install as AForm } from '@stonecrop/aform'
import { install as ATable } from '@stonecrop/atable'
import { StonecropDesktop } from '@stonecrop/desktop'
import StonecropPlugin, {
	DoctypeMeta,
	Registry,
	Stonecrop,
	type ImmutableDoctype,
	type MutableDoctype,
} from '@stonecrop/stonecrop'

import App from './App.vue'
import router, { setupRouterContext } from './router'
import { makeServer } from './server'

const app = createApp(App)

// Setup MirageJS server
makeServer()

// Create the getMeta function that will be used by the plugin
const getMeta = async (doctype: string) => {
	// Use the route-based meta endpoint - default to list route when only doctype is provided
	const route = `/${doctype}`
	const response = await fetch(`/api/meta?route=${encodeURIComponent(route)}`)
	const data: MutableDoctype = await response.json()

	if ('error' in data) {
		throw new Error(`Failed to get metadata: ${data.error}`)
	}

	const config: ImmutableDoctype = {
		schema: List(data.schema),
		workflow: data.workflow,
		actions: Map(data.actions || {}),
	}

	return new DoctypeMeta(data.doctype || doctype, config.schema, config.workflow, config.actions)
}

// Install plugins in correct order following Vue.js best practices
// 1. State management first
const pinia = createPinia()
app.use(pinia)

// 2. Stonecrop plugin with auto-initialization enabled
app.use(StonecropPlugin, {
	router,
	getMeta,
	autoInitializeRouter: true,
	onRouterInitialized: async (registry: Registry, stonecrop: Stonecrop) => {
		// Setup router context with the provided instances
		await setupRouterContext(registry, stonecrop)
	},
})

// 3. Component plugins
app.use(AForm)
app.use(ATable)
app.use(StonecropDesktop)

// Mount the app - router initialization will happen automatically
app.mount('#app')
