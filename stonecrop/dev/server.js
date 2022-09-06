import { createServer } from 'miragejs'

export default createServer({
	routes() {
		this.get('/to-do/', () => [
			{ id: '1', name: 'Luke' },
			{ id: '2', name: 'Leia' },
			{ id: '3', name: 'Anakin' },
		])
	},
})
