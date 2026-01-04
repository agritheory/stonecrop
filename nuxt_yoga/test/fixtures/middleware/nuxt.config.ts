// nuxt-yoga/test/fixtures/middleware/nuxt.config.ts
export default defineNuxtConfig({
	modules: ['../../../src/module'],
	yoga: {
		schema: './schema.graphql',
		resolvers: './resolvers.ts',
		middleware: [
			async (ctx, next) => {
				// Add something to context
				ctx.middlewareExecuted = true
				ctx.testHeader = ctx.req.headers.get('x-test-header')
				return next()
			},
		],
	},
})
