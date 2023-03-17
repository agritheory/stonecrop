import { createServer } from 'miragejs'
import { createGraphQLHandler } from '@miragejs/graphql'

import typeDefs from '@/gql/schema'
// import graphQLSchema from '@/gql/schema.gql'

export function makeServer() {
	return createServer({
		environment: 'test',

		routes() {
			const graphQLHandler = createGraphQLHandler(typeDefs, this.schema)
			this.post('/graphql', graphQLHandler)
		},

		seeds(server) {
			server.create('Doctype', { id: 'Issue', name: 'Issue' })
		},
	})
}
