// @stonecrop/nuxt fullstack playground
// Demonstrates nuxt-grafserv with all middleware packages plus Stonecrop frontend
import { resolve } from 'node:path'
import NuxtGrafserv, { type ModuleOptions as GrafservOptions } from '@stonecrop/nuxt-grafserv'

import NuxtStonecrop from '../src/module'

const desktopStyles = resolve(__dirname, '../../desktop/dist/desktop.css')

export default defineNuxtConfig({
	compatibilityDate: '2026-01-01',

	modules: [NuxtStonecrop, NuxtGrafserv],

	stonecrop: {
		docbuilder: false,
		routeStrategy: () => [
			{
				name: 'catch-all',
				path: '/:pathMatch(.*)*',
				file: resolve(__dirname, './app/pages/index.vue'),
			},
		],
	},

	grafserv: {
		type: 'schema' as const,
		schema: './server/schema.graphql',
		resolvers: './server/resolvers.ts',
		url: '/graphql/',
		graphiql: true,
	} as GrafservOptions,

	css: [desktopStyles],

	vite: {
		optimizeDeps: {
			include: ['@stonecrop/desktop', '@stonecrop/graphql-client', '@stonecrop/schema'],
		},
	},

	devtools: { enabled: true },

	nitro: {
		storage: {
			cache: {
				driver: 'memory',
			},
		},
		externals: {
			external: ['grafast', 'grafserv', 'grafserv/h3/v1', 'graphile-config', 'debug'],
		},
	},

	devServer: {
		port: 3001,
		host: 'localhost',
	},
})
