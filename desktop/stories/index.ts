import { List, Map } from 'immutable'
import { createApp } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { createMachine } from 'xstate'

import { ADate, ATextInput } from '@agritheory/aform'
import { Doctype, Stonecrop } from '@agritheory/stonecrop'
import type { ImmutableDoctype, MutableDoctype } from '@agritheory/stonecrop/types'

import ActionSet from '../src/components/ActionSet.vue'
import CommandPalette from '../src/components/CommandPalette.vue'
import { default as DoctypeComponent } from '../src/components/Doctype.vue'
import Records from '../src/components/Records.vue'
import SheetNav from '../src/components/SheetNav.vue'
import router from '../src/router'
import Home from './components/Home.vue'
import App from './App.vue'
import makeServer from './server'

const app = createApp(App)
makeServer()

// setup router
const routes: RouteRecordRaw[] = [
	{ path: '/', component: Home, meta: { transition: 'slide-up' } },
	{ path: '/:records', component: Records, meta: { transition: 'slide-up' } },
	{ path: '/:records/:record', component: DoctypeComponent, meta: { transition: 'slide-up' } },
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
	doctypeLoader: async (doctype: string) => {
		// TODO: normally this would be configured as a memoized/cached call to a server
		const response = await fetch(`/meta/${doctype}`)
		const data: MutableDoctype = await response.json()
		const config: ImmutableDoctype = {
			schema: List(data.schema),
			workflow: createMachine(data.workflow),
			actions: Map(data.actions),
		}

		return new Doctype(doctype, config.schema, config.workflow, config.actions)
	},
})

app.mount('#app')
