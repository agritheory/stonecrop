import NuxtGrafserv from '../../../src/module'

export default defineNuxtConfig({
	modules: [NuxtGrafserv],

	grafserv: {
		// Configuration type - 'schema' for file-based schemas
		type: 'schema',

		// Path to GraphQL schema file
		schema: 'server/schema.graphql',

		// Path to resolvers file
		resolvers: 'server/resolvers.ts',

		// GraphQL endpoint URL
		url: '/graphql/',

		// Enable GraphiQL
		graphiql: true,
	},
})
