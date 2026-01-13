/**
 * Stonecrop GraphQL Middleware Chain
 *
 * Middleware functions are executed in order for each GraphQL request.
 * Use this to add authentication, logging, rate limiting, etc.
 */

import type { GrafastContext, MiddlewareFunction } from '@stonecrop/nuxt-grafserv'

const middleware: MiddlewareFunction[] = [
	// ============================================
	// 1. Request Logging
	// ============================================
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

	// ============================================
	// 2. Authentication
	// ============================================
	async (ctx: GrafastContext, next) => {
		// Extract auth header
		const authHeader = ctx.req.headers.get('authorization')

		if (authHeader?.startsWith('Bearer ')) {
			const token = authHeader.slice(7)

			// TODO: Implement your token validation logic
			// Example:
			// const user = await validateToken(token)
			// ctx.user = user

			// Placeholder - replace with real validation
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

		return next()
	},

	// ============================================
	// 3. Request Context Enrichment
	// ============================================
	async (ctx: GrafastContext, next) => {
		ctx.timestamp = new Date().toISOString()
		ctx.source = 'stonecrop-app'
		return next()
	},
]

export default middleware
