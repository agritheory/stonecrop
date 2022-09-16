import { createApp } from 'vue'
import Dev from './Dev.vue'
import Stonecrop from '../src/index.js'
import Doctype from '../src/doctype.js'
import { AForm, ATextInput } from '@sedum/aform'
// import server
import createServer from './server.js'

const app = createApp(Dev)

const toDo = new Doctype(
	'ToDo',
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

app.use(Stonecrop, {
	schemaLoader: () => {
		return toDo
	},
})
app.mount('#app')

// run server
// createServer()
