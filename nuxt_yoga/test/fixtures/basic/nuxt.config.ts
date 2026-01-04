// nuxt-yoga/test/fixtures/basic/nuxt.config.ts
export default defineNuxtConfig({
	modules: ['../../../src/module'],
	yoga: {
		schema: './schema.graphql',
		resolvers: './resolvers.ts',
		url: '/graphql/',
		cache: {
			enabled: true,
			devMode: true,
		},
	},
})
