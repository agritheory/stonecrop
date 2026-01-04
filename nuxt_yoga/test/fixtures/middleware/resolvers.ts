// nuxt-yoga/test/fixtures/middleware/resolvers.ts
export default {
	Query: {
		middlewareTest: (_: any, args: any, context: any) => {
			return context.middlewareExecuted ? 'middleware-executed' : 'middleware-not-executed'
		},
		contextTest: (_: any, args: any, context: any) => {
			return context.testHeader || 'no-header'
		},
	},
}
