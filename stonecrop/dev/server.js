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
					{ id: '1', name: 'Luke', subject: 'First To Do' },
					{ id: '2', name: 'Leia', subject: 'Second To Do' },
					{ id: '3', name: 'Anakin', subject: 'Third To Do' },
				],
				issues: [
					{ id: '1', name: 'Luke', subject: 'First To Do' },
					{ id: '2', name: 'Leia', subject: 'Second To Do' },
					{ id: '3', name: 'Anakin', subject: 'Third To Do' },
				],
			})
		},

		routes() {
			this.get('/to-do', schema => schema.db.todos)
			this.get('/issue', schema => schema.db.issues)
		},
	})

	return server
}
