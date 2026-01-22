/**
 * Grafserv Plugins
 * Add custom middleware and hooks via Grafserv plugins
 *
 * @see https://grafast.org/grafserv/plugins
 */

import type { GraphileConfig } from 'graphile-config'

/**
 * Example: Request logging plugin
 */
const loggingPlugin: GraphileConfig.Plugin = {
	name: 'request-logging',
	version: '1.0.0',
	grafserv: {
		middleware: {
			processGraphQLRequestBody: async (next, event) => {
				const start = Date.now()
				console.log('[GraphQL] Request started:', {
					path: event.request.url,
					method: event.request.method,
				})

				const result = await next()

				const duration = Date.now() - start
				console.log(`[GraphQL] Request completed in ${duration}ms`)

				return result
			},
		},
	},
}

/**
 * Example: Authentication plugin
 */
const authPlugin: GraphileConfig.Plugin = {
	name: 'authentication',
	version: '1.0.0',
	grafserv: {
		middleware: {
			processGraphQLRequestBody: async (next, event) => {
				// Extract authentication from headers
				const authHeader = event.request.headers.get('authorization')

				if (authHeader?.startsWith('Bearer ')) {
					const token = authHeader.slice(7)
					// TODO: Validate token and set user context
					console.log('[Auth] Token received:', token)
				} else {
					console.log('[Auth] Anonymous request')
				}

				return next()
			},
		},
	},
}

/**
 * Export all plugins
 * Import these in your nuxt.config.ts:
 *
 * import plugins from './server/plugins'
 *
 * export default defineNuxtConfig({
 *   grafserv: {
 *     preset: {
 *       plugins
 *     }
 *   }
 * })
 */
export const plugins: GraphileConfig.Plugin[] = [
	loggingPlugin,
	// authPlugin, // Uncomment to enable authentication
]

export default plugins
