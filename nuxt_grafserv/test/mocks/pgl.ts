import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { vi } from 'vitest'

// Mock PostGraphile instance for testing
export const pgl = {
	getSchema: vi.fn(async () => {
		return new GraphQLSchema({
			query: new GraphQLObjectType({
				name: 'Query',
				fields: {
					hello: {
						type: GraphQLString,
						resolve: () => 'world from PostGraphile mock',
					},
				},
			}),
		})
	}),
	release: vi.fn(),
}
