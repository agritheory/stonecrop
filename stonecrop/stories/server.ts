import { createServer, Model } from 'miragejs'

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
				todoMeta: {
					schema: [
						{
							name: 'first_name',
							fieldname: 'first_name',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'First Name',
						},
						{
							name: 'last_name',
							fieldname: 'last_name',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Last Name',
						},
						{
							name: 'phone',
							fieldname: 'phone',
							fieldtype: 'Phone',
							component: 'ATextInput',
							label: 'Phone',
							mask: "(locale) => { if (locale === 'en-US') { return '(###) ###-####' } else if (locale === 'en-IN') { return '####-######'} }",
						},
					],
					events: undefined,
					hooks: {
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
					},
				},
				todos: [
					{ id: '1', first_name: 'Luke', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '2', first_name: 'Leia', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '3', first_name: 'Anakin', last_name: 'Skywalker', phone: '+1 123 456 7890' },
				],
				// transitions: load, report, assign, triage, resolve, archive
				issueMeta: {
					schema: [
						{
							name: 'subject',
							fieldname: 'subject',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Subject',
						},
						{
							name: 'date',
							fieldname: 'date',
							fieldtype: 'Date',
							component: 'ADate',
							label: 'Date',
						},
					],
					events: undefined,
					hooks: {},
				},
				issues: [
					{ id: '1', subject: 'First Issue', date: '2022-01-01' },
					{ id: '2', subject: 'Second Issue', date: '2022-01-01' },
					{ id: '3', subject: 'Third Issue', date: '2022-01-01' },
				],
			})
		},

		routes() {
			// meta
			this.get('/meta/to-do', schema => {
				const meta = schema.first('todoMeta')
				return meta.attrs
			})
			this.get('/meta/issue', schema => {
				const meta = schema.first('issueMeta')
				return meta.attrs
			})

			// list
			this.get('/to-do', schema => schema.db.todos)
			this.get('/issue', schema => schema.db.issues)

			// record
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
