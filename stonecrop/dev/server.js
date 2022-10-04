import { createServer, Model } from 'miragejs'

export default function makeServer() {
	let server = createServer({
		models: {
			todo: Model.extend({
				label: 'Subject',
				name: 'subject',
				type: 'Data',
				align: 'left',
				edit: false,
				width: '35ch',
				// component: 'router-link'
			}),
			issue: Model,
		},

		seeds(server) {
			server.db.loadData({
				todos: [
					{ id: '1', first_name: 'Luke', last_name: 'Skywalker', subject: 'First To Do' },
					{ id: '2', first_name: 'Leia', last_name: 'Skywalker', subject: 'Second To Do' },
					{ id: '3', first_name: 'Anakin', last_name: 'Skywalker', subject: 'Third To Do' },
				],
				issues: [
					{ id: '1', first_name: 'luke', last_name: 'Skywalker', subject: 'First To Do' },
					{ id: '2', first_name: 'Leia', last_name: 'Skywalker', subject: 'Second To Do' },
					{ id: '3', first_name: 'Anakin', last_name: 'Skywalker', subject: 'Third To Do' },
				],
			})
		},

		routes() {
			this.get('/to-do', schema => schema.db.todos)
			this.get('/issue', schema => schema.db.issues)
			this.get('/to-do/:id', schema => {
				const todo = schema.todos.first()
				return todo.attrs
			})
			this.get('/issue/:id', schema => {
				const issue = schema.issues.first()
				return issue.attrs
			})
		},
	})

	return server
}
