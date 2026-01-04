// nuxt-yoga/playground/nuxt.config.ts
import NuxtYoga from '../src/module'
import type { ModuleOptions } from '../src/types'

export default defineNuxtConfig({
	compatibilityDate: '2025-01-01',
	modules: [NuxtYoga],
	yoga: {
		schema: './server/**/*.graphql',
		resolvers: './server/resolvers.ts',
		url: '/graphql/',

		yoga: {
			graphiql: true,
			cors: true,
			landingPage: true,
		},

		remoteSchemas: [
			{
				url: 'http://localhost:4000/graphql',
				prefix: 'MockRemote_',
				cacheTTL: 30 * 1000, // Cache for 30 seconds
			},
		],

		cache: {
			enabled: true,
			devMode: true, // Enable caching even in development
			ttl: 60 * 1000, // 1 minute for local schema
			remoteTTL: 30 * 1000, // 30 seconds for remote schemas by default
		},

		middleware: [
			// Logging middleware with cache info
			async (ctx, next) => {
				const start = Date.now()
				const result = await next()
				const duration = Date.now() - start

				// Log if request was served from cache (fast) or fresh (slower)
				const cacheStatus = duration < 10 ? 'CACHED' : 'FRESH'
				console.log(`[${cacheStatus}] GraphQL request took ${duration}ms`)

				return result
			},

			// Example auth middleware (without requiring external deps)
			async (ctx, next) => {
				// Check for auth header
				const authHeader = ctx.req.headers.get('authorization')

				// Simple token validation (for demo purposes)
				if (authHeader) {
					const token = authHeader.replace('Bearer ', '')

					// Mock token validation - in production you'd verify JWT, etc.
					if (token === 'demo-token-admin') {
						;(ctx as any).user = { id: '1', roles: ['admin'] }
					} else if (token === 'demo-token-user') {
						;(ctx as any).user = { id: '2', roles: ['user'] }
					}
				}

				return next()
			},

			// Request tracking middleware
			async (ctx, next) => {
				// Track GraphQL operation type
				const body = await ctx.req.text()
				const isQuery = body.includes('query')
				const isMutation = body.includes('mutation')

				console.log(`[GraphQL] ${isQuery ? 'Query' : isMutation ? 'Mutation' : 'Operation'} received`)

				// Restore body for next middleware
				ctx.req = new Request(ctx.req.url, {
					method: ctx.req.method,
					headers: ctx.req.headers,
					body,
				})

				return next()
			},
		],
	} as ModuleOptions,

	// Nitro config for development
	nitro: {
		storage: {
			// Use memory storage for cache in development
			cache: {
				driver: 'memory',
			},
		},
	},

	// Development server config
	devServer: {
		port: 3000,
		host: 'localhost',
	},
})
