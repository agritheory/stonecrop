import { List, Map } from 'immutable'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createActor } from 'xstate'

import '@stonecrop/desktop/styles'
import { ADate, ATextInput } from '@stonecrop/aform'
import { StonecropDesktop } from '@stonecrop/desktop'
import Stonecrop, { DoctypeMeta, type ImmutableDoctype, type MutableDoctype } from '@stonecrop/stonecrop'

import App from './App.vue'
import router from './router'
import { makeServer } from './server'

const app = createApp(App)

// Setup MirageJS server
makeServer()

// Install plugins in correct order following Vue.js best practices
// 1. State management first
const pinia = createPinia()
app.use(pinia)

// 2. Router before any plugins that might use it
app.use(router)

// 3. Stonecrop plugin (router already available)
app.use(Stonecrop, {
	components: {
		ADate,
		ATextInput,
	},
	getMeta: async (doctype: string) => {
		const response = await fetch(`/meta/${doctype}`)
		const data = (await response.json()) as MutableDoctype
		const config: ImmutableDoctype = {
			schema: List(data.schema),
			workflow: createActor(data.workflow),
			actions: Map(data.actions!),
		}

		return new DoctypeMeta(doctype, config.schema, config.workflow, config.actions)
	},
})

// 4. Desktop-specific plugin
app.use(StonecropDesktop)

// Mount the app (Pinia becomes active here)
app.mount('#app')
