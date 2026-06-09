import { resolve } from 'node:path'

export default defineNuxtConfig({
	compatibilityDate: '2026-04-09',

	modules: ['@stonecrop/nuxt', 'nuxt-graphql-middleware'],

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

	ssr: false,

	typescript: { strict: true },
	devtools: { enabled: true },
})
