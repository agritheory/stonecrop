import { createServer } from 'miragejs'
import { createGraphQLHandler } from '@miragejs/graphql'
import graphQLSchema from './schema.gql'

export function makeServer() {
	return createServer({
		routes() {
			const graphQLHandler = createGraphQLHandler(graphQLSchema, this.schema)
			this.post('/graphql', graphQLHandler)
		},
	})
}
