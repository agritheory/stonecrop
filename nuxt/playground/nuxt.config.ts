import { resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'

import NuxtStonecrop from '../src/module'

const themePath = resolve(__dirname, '../../themes/default/default.css')

export default defineNuxtConfig({
	modules: [NuxtStonecrop, 'nuxt-graphql-middleware'],
	devtools: { enabled: true },
	compatibilityDate: '2026-04-09',
	stonecrop: {
		docbuilder: true,
		doctypesDir: 'doctypes',
		routeStrategy: () => [
			{
				name: 'doctype-list',
				path: '/:doctype',
				file: resolve(__dirname, './app/views/DoctypePage.vue'),
			},
			{
				name: 'doctype-detail',
				path: '/:doctype/:id',
				file: resolve(__dirname, './app/views/DoctypePage.vue'),
			},
		],
	},
	graphqlMiddleware: {
		graphqlEndpoint: 'https://countries.trevorblades.com/graphql',
		downloadSchema: 'dev-only',
		autoImportPatterns: ['./app/graphql/**/*.graphql'],
	},
	css: [themePath, '~/assets/styles/common.css'],
	vite: {
		optimizeDeps: {
			include: ['pinia', '@stonecrop/desktop', '@stonecrop/stonecrop'],
		},
	},
	typescript: { strict: true },
})
