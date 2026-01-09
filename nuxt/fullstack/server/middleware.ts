import { createAbility } from '@stonecrop/casl-middleware'
import type { GrafastContext, MiddlewareFunction } from '@stonecrop/nuxt-grafserv'

/**
 * GraphQL middleware chain for the fullstack playground
 */
const middleware: MiddlewareFunction[] = [
	// 1. Request timing and logging
	async (ctx: GrafastContext, next) => {
		const start = Date.now()
		const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
		ctx.requestId = requestId

		console.log(`[${requestId}] GraphQL request started`)

		const result = await next()

		const duration = Date.now() - start
		console.log(`[${requestId}] GraphQL request completed in ${duration}ms`)

		return result
	},

	// 2. Authentication middleware (simulated)
	async (ctx: GrafastContext, next) => {
		const authHeader = ctx.req.headers.get('authorization')

		if (authHeader?.startsWith('Bearer ')) {
			const token = authHeader.slice(7)
			// Simulate token validation
			if (token === 'admin-token') {
				ctx.user = { id: '1', roles: ['admin'], email: 'admin@example.com' }
			} else if (token === 'user-token') {
				ctx.user = { id: '2', roles: ['user'], email: 'user@example.com' }
			} else {
				ctx.user = { id: 'anonymous', roles: ['guest'] }
			}
		} else {
			ctx.user = { id: 'anonymous', roles: ['guest'] }
		}

		const user = ctx.user as { id: string; roles: string[] }
		console.log(`[Auth] User: ${user.id}, Roles: ${user.roles.join(', ')}`)

		// Create CASL ability for the user
		ctx.ability = await createAbility(ctx.user)

		return next()
	},

	// 3. Request context enrichment
	async (ctx: GrafastContext, next) => {
		ctx.timestamp = new Date().toISOString()
		ctx.source = 'fullstack-playground'
		return next()
	},
]

export default middleware
