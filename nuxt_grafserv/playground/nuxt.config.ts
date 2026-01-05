// nuxt-grafserv/playground/nuxt.config.ts
import NuxtGrafserv from '../src/module'
import type { ModuleOptions } from '../src/types'

export default defineNuxtConfig({
	compatibilityDate: '2025-01-01',
	modules: [NuxtGrafserv],
	grafserv: {
		// Path to GraphQL schema files
		schema: './server/**/*.graphql',

		// Path to resolvers
		resolvers: './server/resolvers.ts',

		// GraphQL endpoint URL
		url: '/graphql/',

		// Enable GraphiQL in development
		graphiql: true,

		// Middleware chain
		middleware: [
			// Logging middleware
			async (ctx, next) => {
				const start = Date.now()
				const result = await next()
				console.log(`[GraphQL] Request took ${Date.now() - start}ms`)
				return result
			},
		],

		// Grafserv options
		grafserv: {
			websockets: false,
			introspection: true,
		},
	} as ModuleOptions,

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
})
