import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { vi } from 'vitest'

export const mockPglSchema = new GraphQLSchema({
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

const preset = { extends: [], pgServices: [] }

// Mock PostGraphile instance, mirroring v5's `PostGraphileInstance`
// (postgraphile/dist/index.d.ts:8-13): createServ / getSchemaResult / getSchema / release.
//
// `createServ` is the ONLY method src/runtime/handler.ts calls (:111). The real one invokes the
// grafserv factory it is handed with `{ preset, schema }` and returns the result
// (postgraphile/dist/index.js:64-75), so this does the same. It was previously absent, which made
// the entire PostGraphile branch of getGrafservInstance unreachable from tests.
export const pgl = {
	createServ: vi.fn((grafserv: (config: { preset: unknown; schema: GraphQLSchema }) => unknown) =>
		grafserv({ preset, schema: mockPglSchema })
	),
	getSchema: vi.fn(async () => mockPglSchema),
	getSchemaResult: vi.fn(async () => ({ schema: mockPglSchema, resolvedPreset: preset })),
	release: vi.fn(),
}
