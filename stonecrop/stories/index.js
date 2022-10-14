import { createApp } from 'vue'

import { ADate, ATextInput } from '@agritheory/aform'

import Doctype from '@/doctype.js'
import Stonecrop from '@/index.js'
import router from '@/router.js'
import { default as DoctypeComponent } from '@/components/Doctype.vue'
import Home from '@/components/Home.vue'
import Records from '@/components/Records.vue'
import Dev from './Dev.vue'
import makeServer from './server.js'

// create mirage server
makeServer()

// setup doctype schemas
const toDo = new Doctype(
	'To Do',
	[
		{
			name: 'first_name',
			fieldname: 'first_name',
			fieldtype: 'Data',
			component: ATextInput,
			label: 'First Name',
		},
		{
			name: 'last_name',
			fieldname: 'last_name',
			fieldtype: 'Data',
			component: ATextInput,
			label: 'Last Name',
		},
		{
			name: 'phone',
			fieldname: 'phone',
			fieldtype: 'Phone',
			component: ATextInput,
			label: 'Phone',
			mask: "(locale) => { if (locale === 'en-US') { return '(###) ###-####' } else if (locale === 'en-IN') { return '####-######'} }",
		},
	],
	undefined,
	[1, 2, 3]
)

const issue = new Doctype(
	'Issue',
	[
		{
			name: 'subject',
			fieldname: 'subject',
			fieldtype: 'Data',
			component: ATextInput,
			label: 'Subject',
		},
		{
			name: 'date',
			fieldname: 'date',
			fieldtype: 'Date',
			component: ADate,
			label: 'Date',
		},
	],
	undefined,
	[1, 2, 3]
)

// setup router
const routes = [
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
			const response = await fetch(`/${doctypeSlug}/${to.params.record}`)
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

// setup app with schema loader
const doctypes = {
	'to-do': toDo,
	issue,
}

const app = createApp(Dev)
app.use(Stonecrop, {
	router,
	schemaLoader: doctype => {
		// normally this would be configured as a memoized/cached call to a server
		return doctypes[doctype] // or if doctype is a function [doctype].apply()
	},
})
app.mount('#app')
