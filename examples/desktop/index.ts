import { List, Map } from 'immutable'
import { createApp } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { createMachine } from 'xstate'

import { ADate, ATextInput } from '@stonecrop/aform'
import { ActionSet, CommandPalette, Doctype, Records, SheetNav } from '@stonecrop/desktop'
import { DoctypeMeta, Stonecrop, type ImmutableDoctype, type MutableDoctype } from '@stonecrop/stonecrop'

import Home from './components/Home.vue'
import App from './App.vue'
import router from './router'
import { makeServer } from './server'

const app = createApp(App)
makeServer()

// setup router
const routes: RouteRecordRaw[] = [
	{ path: '/', component: Home, meta: { transition: 'slide-up' } },
	{ path: '/:records', component: Records, meta: { transition: 'slide-up' } },
	{ path: '/:records/:record', component: Doctype, meta: { transition: 'slide-up' } },
]

for (const route of routes) {
	router.addRoute(route)
}

// setup Stonecrop
app.use(Stonecrop, {
	router,
	components: {
		ActionSet,
		ADate,
		ATextInput,
		CommandPalette,
		Doctype,
		Records,
		SheetNav,
	},
	// TODO: or if doctype is a function [doctype].apply()
	getMeta: async (doctype: string) => {
		// TODO: normally this would be configured as a memoized/cached call to a server
		const response = await fetch(`/meta/${doctype}`)
		const data = (await response.json()) as MutableDoctype
		const config: ImmutableDoctype = {
			schema: List(data.schema),
			workflow: createMachine(data.workflow),
			actions: Map(data.actions),
		}

		return new DoctypeMeta(doctype, config.schema, config.workflow, config.actions)
	},
})
app.mount('#app')
