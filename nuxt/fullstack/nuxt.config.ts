// @stonecrop/nuxt fullstack playground
// Demonstrates nuxt-grafserv with all middleware packages plus Stonecrop frontend
import { resolve } from 'node:path'
import NuxtGrafserv, { type ModuleOptions as GrafservOptions } from '@stonecrop/nuxt-grafserv'

import NuxtStonecrop from '../src/module'

// Theme path
const themePath = resolve(__dirname, '../../themes/default/default.css')

export default defineNuxtConfig({
	compatibilityDate: '2026-01-01',

	// Load both Stonecrop modules
	modules: [NuxtStonecrop, NuxtGrafserv],

	// Stonecrop frontend configuration
	stonecrop: {
		docbuilder: true,
	},

	// Grafserv GraphQL server configuration
	grafserv: {
		// GraphQL schema and resolvers
		schema: './server/schema.graphql',
		resolvers: './server/resolvers.ts',

		// GraphQL endpoint
		url: '/graphql/',

		// Enable GraphiQL in development
		graphiql: true,

		// Middleware file path (preserves imports/dependencies)
		middlewarePath: './server/middleware.ts',

		// Graphile preset with grafserv options
		preset: {
			grafserv: {
				websockets: false,
			},
			// CSS theme
			css: [themePath, '~/assets/styles/common.css'],

			// Development tools
			devtools: { enabled: true },

			// Nitro server configuration
			nitro: {
				storage: {
					cache: {
						driver: 'memory',
					},
				},
				// Don't bundle grafast - let Node.js handle it natively
				// This fixes ESM/CJS interop issues with the debug package
				externals: {
					external: ['grafast', 'grafserv', 'grafserv/h3/v1', 'graphile-config', 'debug'],
				},
			},

			// Dev server
			devServer: {
				port: 3001, // Different port from regular playground
				host: 'localhost',
			},
		},
	} as GrafservOptions,
})
