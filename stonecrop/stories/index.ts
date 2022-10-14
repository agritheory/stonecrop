import { createApp } from 'vue'
import { RouteRecordRaw } from 'vue-router'

import { ADate, ATextInput } from '@agritheory/aform'
import Doctype from '@/doctype'
import Stonecrop from '@/index'
import router from '@/router'
import { default as DoctypeComponent } from './components/Doctype.vue'
import Home from './components/Home.vue'
import Records from './components/Records.vue'
import Dev from './Dev.vue'
import makeServer from './server'
import { Meta } from 'types/index'

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

router.beforeEach(async (to, from, next) => {
	const doctypeSlug = to.params.records?.toString()
	if (doctypeSlug) {
		if (to.params.record) {
			const recordId = to.params.record.toString()
			const response = await fetch(`/${doctypeSlug}/${recordId}`)
			const data = await response.json()
			to.params.recordData = data
		} else {
			const response = await fetch(`/${doctypeSlug}`)
			const data = await response.json()
			to.params.recordsData = data
		}
	}
	next()
})

const app = createApp(Dev)
app.use(Stonecrop, {
	router,
	components: {
		ATextInput,
		ADate,
	},
	// TODO: or if doctype is a function [doctype].apply()
	schemaLoader: async (doctype: string): Promise<Doctype> => {
		// TODO: normally this would be configured as a memoized/cached call to a server
		const response = await fetch(`/meta/${doctype}`)
		const data: Meta = await response.json()
		const doctypeClass = new Doctype(doctype, data.events, data.hooks)
		doctypeClass.schema = data.schema
		return doctypeClass
	},
})
app.mount('#app')
