import { resolve } from 'node:path'

import NuxtStonecrop from '../src/module'

export default defineNuxtConfig({
	compatibilityDate: '2026-04-09',

	modules: [NuxtStonecrop, 'nuxt-graphql-middleware'],

	stonecrop: {
		docbuilder: false,
		doctypesDir: 'doctypes',
		routeStrategy: () => [
			{
				name: 'doctype-list',
				path: '/:doctype',
				file: resolve(__dirname, './app/pages/index.vue'),
			},
			{
				name: 'doctype-detail',
				path: '/:doctype/:id',
				file: resolve(__dirname, './app/pages/index.vue'),
			},
		],
	},

	graphqlMiddleware: {
		graphqlEndpoint: 'https://countries.trevorblades.com/graphql',
		downloadSchema: 'dev-only',
		autoImportPatterns: ['./app/graphql/**/*.graphql'],
	},

	vite: {
		optimizeDeps: {
			include: ['@stonecrop/desktop', '@stonecrop/stonecrop'],
		},
	},

	devServer: {
		port: 3002,
		host: 'localhost',
	},

	typescript: { strict: true },
	devtools: { enabled: true },
})
