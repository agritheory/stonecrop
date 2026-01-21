export default defineNuxtConfig({
	modules: ['../../../src/module'],
	grafserv: {
		schema: './schema.graphql',
		resolvers: './resolvers.ts',
		url: '/graphql/',
		graphiql: true,
	},
})
