import { createServer, Model } from 'miragejs'

import { ADate, ATextInput } from '@agritheory/aform'

export default function makeServer() {
	const server = createServer({
		models: {
			todoMeta: Model,
			todo: Model,
			issueMeta: Model,
			issue: Model,
		},

		seeds(server) {
			server.db.loadData({
				todoMeta: [
					{
						name: 'first_name',
						fieldname: 'first_name',
						fieldtype: 'Data',
						// TODO: figure out why the component isn't rendering
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
				todos: [
					{ id: '1', first_name: 'Luke', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '2', first_name: 'Leia', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '3', first_name: 'Anakin', last_name: 'Skywalker', phone: '+1 123 456 7890' },
				],
				issueMeta: [
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
				issues: [
					{ id: '1', subject: 'First Issue', date: '2022-01-01' },
					{ id: '2', subject: 'Second Issue', date: '2022-01-01' },
					{ id: '3', subject: 'Third Issue', date: '2022-01-01' },
				],
			})
		},

		routes() {
			this.get('/meta/to-do', schema => schema.db.todoMeta)
			this.get('/meta/issue', schema => schema.db.issueMeta)
			this.get('/to-do', schema => schema.db.todos)
			this.get('/issue', schema => schema.db.issues)
			this.get('/to-do/:id', schema => {
				const todo = schema.first('todo')
				return todo.attrs
			})
			this.get('/issue/:id', schema => {
				const issue = schema.first('issue')
				return issue.attrs
			})
		},
	})

	return server
}
