// nuxt-grafserv/playground/server/middleware.ts
import type { GrafastContext, MiddlewareFunction } from '../../src/types'

const middleware: MiddlewareFunction[] = [
	// 1. Logging/Timing middleware
	async (ctx: GrafastContext, next) => {
		const start = Date.now()
		console.log(`[Grafserv] Request started at ${new Date().toISOString()}`)

		const result = await next()

		const duration = Date.now() - start
		console.log(`[Grafserv] Request completed in ${duration}ms`)

		return result
	},

	// 2. Authentication middleware (simulated)
	async (ctx: GrafastContext, next) => {
		// Simulate extracting user from request headers
		const authHeader = ctx.req.headers.get('authorization')

		if (authHeader?.startsWith('Bearer ')) {
			// In a real app, this would validate the token
			const token = authHeader.slice(7)
			ctx.user = {
				id: '1',
				roles: token === 'admin-token' ? ['admin'] : ['user'],
			}
			console.log(`[Auth] User authenticated: ${ctx.user.id} with roles: ${ctx.user.roles.join(', ')}`)
		} else {
			// Anonymous user
			ctx.user = { id: 'anonymous', roles: ['guest'] }
			console.log('[Auth] Anonymous user')
		}

		return next()
	},

	// 3. Request context enrichment
	async (ctx: GrafastContext, next) => {
		// Add request metadata
		ctx.requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
		ctx.timestamp = new Date().toISOString()

		console.log(`[Context] Request ID: ${ctx.requestId}`)

		return next()
	},
]

export default middleware
