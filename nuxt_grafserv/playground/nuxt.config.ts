import NuxtGrafserv from '../src/module'
import type { ModuleOptions } from '../src/types'

export default defineNuxtConfig({
	compatibilityDate: '2026-01-01',
	modules: [NuxtGrafserv],

	grafserv: {
		// Path to GraphQL schema files
		schema: 'server/schema.graphql',

		// Path to resolvers
		resolvers: 'server/resolvers.ts',

		// GraphQL endpoint URL
		url: '/graphql/',

		// Enable GraphiQL in development
		graphiql: true,

		// Graphile preset with grafserv options
		preset: {
			grafserv: {
				websockets: false,
			},

			// Nitro config for development
			nitro: {
				storage: {
					cache: {
						driver: 'memory',
					},
				},
			},

			// Development server config
			devServer: {
				port: 3000,
				host: 'localhost',
			},
		},
	} as ModuleOptions,
})
