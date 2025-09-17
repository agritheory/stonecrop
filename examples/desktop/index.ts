import { List, Map } from 'immutable'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@stonecrop/desktop/styles'
import { install as AForm } from '@stonecrop/aform'
import { install as ATable } from '@stonecrop/atable'
import { StonecropDesktop } from '@stonecrop/desktop'
import StonecropPlugin, { DoctypeMeta, type ImmutableDoctype, type MutableDoctype } from '@stonecrop/stonecrop'

import App from './App.vue'
import router, { setGlobalReferences, initializeRouter } from './router'
import { makeServer } from './server'

const app = createApp(App)

// Setup MirageJS server
makeServer()

// Create the getMeta function that will be used by both the plugin and router guards
const getMeta = async (doctype: string) => {
	const response = await fetch(`/api/${doctype}/meta`)
	const data = (await response.json()) as MutableDoctype
	const config: ImmutableDoctype = {
		schema: List(data.schema),
		workflow: data.workflow, // Store the raw workflow config, not an actor
		actions: Map(data.actions!),
	}

	return new DoctypeMeta(data.doctype || doctype, config.schema, config.workflow, config.actions)
}

// Install plugins in correct order following Vue.js best practices
// 1. State management first
const pinia = createPinia()
app.use(pinia)

// 2. Stonecrop plugin (w/ router) - this will create the registry internally and handle initialization automatically
app.use(StonecropPlugin, {
	router,
	getMeta,
	setGlobalReferences, // Will be called automatically after mounting
	initializeRouter, // Will be called automatically after mounting
})

// 3. Component plugins
app.use(AForm)
app.use(ATable)
app.use(StonecropDesktop)

// Mount the app - initialization happens automatically!
app.mount('#app')
