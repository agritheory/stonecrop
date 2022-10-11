import { createApp } from 'vue'

import { ADate, ATextInput } from '@agritheory/aform'

import Doctype from '@/doctype'
import Stonecrop from '@/index'
import router from '@/router'
import { default as DoctypeComponent } from '@/components/Doctype.vue'
import Home from '@/components/Home.vue'
import Records from '@/components/Records.vue'
import Dev from './Dev.vue'
import makeServer from './server'

// create mirage server
makeServer()

// to-do events
// load + some side effect
// save

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
	undefined, // FSM
	{
		load: [
			() => {
				console.log('load event')
			},
			() => {
				console.log('load event side effect')
			},
		],
		save: [
			() => {
				console.log('save event')
			},
			() => {
				console.log('after save event')
			},
		],
		delete: [
			() => {
				console.log('delete event')
			},
			() => {
				console.log('after delete event')
			},
		],
	}
)

// transitions: load, report, assign, triage, resolve, archive
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

// setup app with schema loader
const doctypes = {
	'to-do': toDo,
	issue,
}

const app = createApp(Dev)
app.use(Stonecrop, {
	router,
	schemaLoader: (doctype: string) => {
		// normally this would be configured as a memoized/cached call to a server
		return doctypes[doctype] // or if doctype is a function [doctype].apply()
	},
})
app.mount('#app')
