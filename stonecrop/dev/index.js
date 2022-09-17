import { createApp } from 'vue'
import Dev from './Dev.vue'
import Stonecrop from '../src/index.js'
import Doctype from '../src/doctype.js'
import { ADate, ATextInput } from '@sedum/aform'
// import server
import createServer from './server.js'

const app = createApp(Dev)

const toDo = new Doctype(
	'To Do',
	[
		{
			fieldname: 'first_name',
			component: ATextInput,
			label: 'First Name',
		},
		{
			fieldname: 'last_name',
			component: ATextInput,
			label: 'Last Name',
		},
		{
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

const Issue = new Doctype(
	'Issue',
	[
		{
			fieldname: 'subject',
			component: ATextInput,
			label: 'Subject',
		},
		{
			fieldname: 'date',
			component: ADate,
			label: 'Date',
		},
	],
	undefined,
	[1, 2, 3]
)

const doctypes = {
	'to-do': toDo,
	issue: Issue,
}

app.use(Stonecrop, {
	schemaLoader: doctype => {
		// normally this would be configured as a memoized/cached call to a server
		return doctypes[doctype]
	},
})
app.mount('#app')

// run server
// createServer()
