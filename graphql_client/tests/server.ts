import { createServer } from 'miragejs'
import { createGraphQLHandler, mirageGraphQLFieldResolver } from '@miragejs/graphql'

import typeDefs from '../src/gql/schema'
// import graphQLSchema from '@/gql/schema.gql'

export function makeServer() {
	return createServer({
		environment: 'test',

		routes() {
			const graphQLHandler = createGraphQLHandler(typeDefs, this.schema, {
				resolvers: {
					Query: {
						getMeta(obj, args, context, info) {
							args.name = args.doctype
							delete args.doctype
							return mirageGraphQLFieldResolver(obj, args, context, info)
						},
					},
				},
			})

			this.post('/graphql', graphQLHandler)
		},
	})
}
