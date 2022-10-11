import { createServer, Model } from 'miragejs'

export default function makeServer() {
	const server = createServer({
		models: {
			todo: Model,
			issue: Model,
		},

		seeds(server) {
			server.db.loadData({
				todos: [
					{ id: '1', first_name: 'Luke', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '2', first_name: 'Leia', last_name: 'Skywalker', phone: '+1 123 456 7890' },
					{ id: '3', first_name: 'Anakin', last_name: 'Skywalker', phone: '+1 123 456 7890' },
				],
				issues: [
					{ id: '1', subject: 'First Issue', date: '2022-01-01' },
					{ id: '2', subject: 'Second Issue', date: '2022-01-01' },
					{ id: '3', subject: 'Third Issue', date: '2022-01-01' },
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
