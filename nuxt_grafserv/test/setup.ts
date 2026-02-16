import { vi } from 'vitest'

// Mock all virtual Nuxt modules that are generated at build time
// These modules don't exist during testing and need to be mocked globally

// Mock the internal resolvers module
vi.mock('#internal/grafserv/resolvers', () => ({
	default: {
		Query: {
			plans: {
				hello: () => 'world',
			},
		},
	},
}))

// Mock the internal middleware module
vi.mock('#internal/grafserv/middleware', () => ({
	default: [],
}))

// Mock the internal PostGraphile instance module
vi.mock('#internal/grafserv/pgl', () => ({
	pgl: {
		getSchema: vi.fn(async () => {
			const { GraphQLSchema, GraphQLObjectType, GraphQLString } = await import('graphql')
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
	},
}))

// Mock the build-time preset module
vi.mock('#build/grafserv-preset', () => ({
	preset: {
		extends: [],
		pgServices: [],
	},
}))
