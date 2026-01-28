import NuxtGrafserv from '../../../src/module'

export default defineNuxtConfig({
	modules: [NuxtGrafserv],

	grafserv: {
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
