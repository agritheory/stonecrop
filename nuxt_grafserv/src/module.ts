import { join } from 'node:path'
import { createRequire } from 'node:module'
import { createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

import type { ModuleOptions } from './types'

const logger = useLogger('@stonecrop/nuxt-grafserv')

const module: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@stonecrop/nuxt-grafserv',
		configKey: 'grafserv',
	},

	defaults: _nuxt => ({
		schema: 'server/**/*.graphql',
		resolvers: undefined, // Optional - not needed for PostGraphile setups
		url: '/graphql/',
		graphiql: undefined, // Will default based on dev mode
		plugins: [],
		preset: {
			grafserv: {
				websockets: false,
			},
		},
	}),

	setup(options, nuxt) {
		const { resolve } = createResolver(import.meta.url)
		const require = createRequire(import.meta.url)

		// Register configuration in nitro runtime config
		nuxt.hook('nitro:config', config => {
			// Add Nitro alias for server directory to handle projects with app/ srcDir
			config.alias = config.alias || {}
			config.alias['#grafserv-server'] = join(nuxt.options.rootDir, 'server')

			// Resolve paths based on schema type
			const resolveForSchema = (path: string) => {
				if (path.startsWith('/')) {
					return path // Already absolute
				}
				return join(nuxt.options.rootDir, path)
			}

			const resolveForVirtualModule = (path: string) => {
				if (path.startsWith('/')) {
					return path // Already absolute
				}
				// Return absolute path for runtime import, not alias
				return join(nuxt.options.rootDir, path)
			}

			logger.info(`Nitro srcDir: ${config.srcDir}`)
			logger.info(`Nuxt srcDir: ${nuxt.options.srcDir}`)
			logger.info(`Nuxt rootDir: ${nuxt.options.rootDir}`)
			logger.info(`Grafserv server alias: ${config.alias['#grafserv-server']}`)

			// Handle resolvers (optional)
			const resolverPath = options.resolvers ? resolveForVirtualModule(options.resolvers) : undefined
			if (resolverPath) {
				logger.info(`Resolved resolver path: ${resolverPath}`)
			} else {
				logger.info('No resolvers configured (normal for PostGraphile setups)')
			}

			// Determine schema type and handle appropriately
			let runtimeSchema: ModuleOptions['schema']
			if (
				typeof options.schema === 'function' ||
				(options.schema && typeof options.schema === 'object' && 'getSchema' in options.schema)
			) {
				// PostGraphile instance or function - pass through directly
				runtimeSchema = options.schema
				logger.info('Using schema provider function or PostGraphile instance')
			} else if (typeof options.schema === 'string') {
				// String path - resolve it
				runtimeSchema = resolveForSchema(options.schema)
				logger.info(`Resolved schema path: ${runtimeSchema}`)
			} else if (Array.isArray(options.schema)) {
				// Array of paths - resolve each
				runtimeSchema = options.schema.map(s => resolveForSchema(s))
				logger.info(`Resolved schema paths: ${runtimeSchema.join(', ')}`)
			} else {
				runtimeSchema = options.schema
			}

			config.runtimeConfig = config.runtimeConfig || {}
			config.runtimeConfig.grafserv = {
				...options,
				// Pass resolved resolver path for direct import
				resolversPath: resolverPath,
				// Pass schema (either resolved paths or function/instance)
				schema: runtimeSchema,
			}

			// Create virtual modules
			config.virtual = config.virtual || {}

			// Resolver virtual module
			if (resolverPath) {
				config.virtual['#internal/grafserv/resolvers'] = `export { default } from '${resolverPath}'`
			}

			// Externalize Grafast to prevent module instance mismatch
			// Only externalize grafast - let other packages bundle normally
			config.externals = config.externals || {}
			config.externals.external = config.externals.external || []
			config.externals.external.push(
				'grafast',
				'@graphql-tools/schema',
				'@graphql-tools/load',
				'@graphql-tools/graphql-file-loader'
			)

			// CRITICAL: Alias grafast to ensure resolver and handler use the same instance
			// This prevents "Now is not a valid time to call currentLayerPlan" errors
			// NOTE: We do NOT externalize the resolver file - it must be bundled for alias to work
			const grafastPath = require.resolve('grafast')
			config.alias = config.alias || {}
			config.alias['grafast'] = grafastPath
		})

		// Set up Grafast handler
		nuxt.hook('nitro:config', config => {
			config.handlers = config.handlers || []

			// Unified GraphQL and Ruru UI handler
			config.handlers.push({
				route: options.url || '/graphql/',
				handler: resolve('./runtime/handler'),
			})

			// Ruru static assets handler
			config.handlers.push({
				route: '/ruru-static/**',
				handler: resolve('./runtime/ruru-static'),
			})

			// Cache API endpoint
			config.handlers.push({
				route: '/graphql/cache',
				handler: resolve('./runtime/cache'),
			})
		})

		// Add custom devtools tab
		if (options.url) {
			// @ts-expect-error - devtools:customTabs hook may not be in all Nuxt versions
			nuxt.hook('devtools:customTabs', (tabs: unknown[]) => {
				tabs.push({
					name: '@stonecrop/nuxt-grafserv',
					title: 'GraphQL (Grafserv)',
					icon: 'simple-icons:graphql',
					view: {
						type: 'iframe',
						src: options.url!,
					},
				})
			})
		}

		// Watch for schema and resolver changes in dev mode
		if (nuxt.options.dev) {
			let cacheClearing = false

			nuxt.hook('builder:watch', async (event, path) => {
				const isSchemaFile = path.endsWith('.graphql')
				const isResolverFile = options.resolvers && path.includes(options.resolvers.replace('./', ''))

				if (isSchemaFile || isResolverFile) {
					if (!cacheClearing) {
						cacheClearing = true
						try {
							logger.info('Clearing Grafserv cache...')
							const { clearGrafservCache } = await import(resolve('./runtime/handler'))
							await clearGrafservCache()
							logger.success('Cache cleared, schema reloaded')
						} catch (error) {
							logger.error('Failed to clear cache:', error)
						} finally {
							cacheClearing = false
						}
					}
				}
			})
		}

		logger.success('[@stonecrop/nuxt-grafserv] Module initialized')
	},
})

export default module

// Re-export types for use in nuxt.config.ts
export type { ModuleOptions, SchemaProvider } from './types'
