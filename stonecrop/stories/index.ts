import { List, Map } from 'immutable'
import { createApp } from 'vue'
import { RouteRecordRaw } from 'vue-router'

import { ADate, ATextInput } from '@agritheory/aform'
import Doctype from '@/doctype'
import { Stonecrop } from '@/index'
import router from '@/router'
import { default as DoctypeComponent } from './components/Doctype.vue'
import Home from './components/Home.vue'
import Records from './components/Records.vue'
import Dev from './Dev.vue'
import makeServer from './server'
import { ImmutableDoctype, MutableDoctype } from 'types/index'
import { createMachine } from 'xstate'

// create mirage server
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

const app = createApp(Dev)
app.use(Stonecrop, {
	router,
	components: {
		ATextInput,
		ADate,
	},
	// TODO: or if doctype is a function [doctype].apply()
	doctypeLoader: async (doctype: string) => {
		// TODO: normally this would be configured as a memoized/cached call to a server
		const response = await fetch(`/meta/${doctype}`)
		const data: MutableDoctype = await response.json()
		const config: ImmutableDoctype = {
			schema: List(data.schema),
			events: createMachine(data.events),
			hooks: Map(data.hooks),
		}

		return new Doctype(doctype, config.schema, config.events, config.hooks)
	},
})
app.mount('#app')
