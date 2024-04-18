import { createGraphQLHandler, mirageGraphQLFieldResolver } from '@miragejs/graphql'
import { createServer, Model } from 'miragejs'

import typeDefs from '../src/gql/schema'
// import graphQLSchema from '@/gql/schema.gql'

export function makeServer() {
	return createServer({
		environment: 'test',

		models: {
			schema: Model,
		},

		fixtures: {
			schemas: { schema: typeDefs },
		},

		routes() {
			// mock REST schema endpoint
			this.get('/schema', schema => {
				return schema.first('schema')?.attrs
			})

			// mock graphQL endpoint
			const graphQLHandler = createGraphQLHandler(typeDefs, this.schema, {
				// adding null parameters to avoid TS errors
				context: null,
				root: null,

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
