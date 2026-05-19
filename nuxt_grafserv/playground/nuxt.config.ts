import NuxtGrafserv from '../src/module'
import type { ModuleOptions } from '../src/types'

export default defineNuxtConfig({
	compatibilityDate: '2026-01-01',
	modules: [NuxtGrafserv],

	grafserv: {
		type: 'postgraphile',
		url: '/graphql/',
		graphiql: true,
		explain: true,
	} as ModuleOptions,
})
