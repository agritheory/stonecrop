import { createGraphQLHandler, mirageGraphQLFieldResolver } from '@miragejs/graphql'
import { typeDefs } from '@stonecrop/graphql-middleware'
import { createServer, Model } from 'miragejs'

export function makeServer() {
	return createServer({
		environment: 'test',

		models: {
			schema: Model,
		},

		routes() {
			// mock graphQL endpoint
			const graphQLHandler = createGraphQLHandler(typeDefs, this.schema, {
				context: null,
				root: null,

				resolvers: {
					Query: {
						stonecropMeta(obj, args, context, info) {
							return mirageGraphQLFieldResolver(obj, args, context, info)
						},
						stonecropRecord(obj, args, context, info) {
							return mirageGraphQLFieldResolver(obj, args, context, info)
						},
						stonecropRecords(obj, args, context, info) {
							return mirageGraphQLFieldResolver(obj, args, context, info)
						},
						stonecropAllMeta(obj, args, context, info) {
							return mirageGraphQLFieldResolver(obj, args, context, info)
						},
					},
					Mutation: {
						stonecropAction(obj, args, context, info) {
							return mirageGraphQLFieldResolver(obj, args, context, info)
						},
					},
				},
			})

			this.post('/graphql', graphQLHandler)
		},
	})
}
