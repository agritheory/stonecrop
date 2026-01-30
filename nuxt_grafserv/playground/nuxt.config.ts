import NuxtGrafserv from '../src/module'
import type { ModuleOptions } from '../src/types'

export default defineNuxtConfig({
	compatibilityDate: '2026-01-01',
	modules: [NuxtGrafserv],

	grafserv: {
		// Configuration type - 'schema' for file-based schemas
		type: 'schema',

		// Path to GraphQL schema files
		schema: 'server/schema.graphql',

		// Path to resolvers
		resolvers: 'server/resolvers.ts',

		// GraphQL endpoint URL
		url: '/graphql/',

		// Enable GraphiQL in development
		graphiql: true,
	} as ModuleOptions,
})
