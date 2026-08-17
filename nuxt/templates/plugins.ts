/**
 * Grafserv Plugins
 * Add custom middleware and hooks via Grafserv plugins
 *
 * @see https://grafast.org/grafserv/plugins
 */

// `GraphileConfig` is an ambient global declared by graphile-config's own types, so it needs no
// import. The `import type { GraphileConfig } from 'graphile-config'` that used to be here never
// resolved — graphile-config is an optional peer dependency, so it is not installed — and an
// unresolved type silently degrades everything annotated with it to `any`.

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

				// `event.request` is optional: a GraphQL-over-WebSocket message carries no HTTP request.
				// It is grafserv's own RequestDigest, not a Web `Request` — the path lives on `path`
				// (there is no `url`), and headers are read with `getHeader()`, not `headers.get()`.
				console.log('[GraphQL] Request started:', {
					path: event.request?.path,
					method: event.request?.method,
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
const _authPlugin: GraphileConfig.Plugin = {
	name: 'authentication',
	version: '1.0.0',
	grafserv: {
		middleware: {
			processGraphQLRequestBody: async (next, event) => {
				// Extract authentication from headers. See the logging plugin above for why `request`
				// is optional and why this is `getHeader()` rather than `headers.get()`.
				const authHeader = event.request?.getHeader('authorization')

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
 * Export all plugins.
 *
 * Reference them from your PostGraphile preset file — `grafserv.preset` is a **path to that file**,
 * not an inline object. Inline presets are not supported: Nitro's build/runtime split cannot
 * serialize the functions and plugin instances a preset contains.
 *
 * ```ts
 * // server/graphile.preset.ts
 * import { createStonecropPreset, makePgService, createStonecropPlugin } from '@stonecrop/graphql-middleware'
 * import plugins from './plugins'
 *
 * export default {
 *   extends: [createStonecropPreset()],
 *   pgServices: [makePgService({ connectionString: process.env.DATABASE_URL, schemas: ['public'] })],
 *   plugins: [createStonecropPlugin(), ...plugins],
 * }
 *
 * // nuxt.config.ts
 * export default defineNuxtConfig({
 *   modules: ['@stonecrop/nuxt-grafserv'],
 *   grafserv: { type: 'postgraphile', preset: './server/graphile.preset.ts' },
 * })
 * ```
 */
export const plugins: GraphileConfig.Plugin[] = [
	loggingPlugin,
	// authPlugin, // Uncomment to enable authentication
]

export default plugins
