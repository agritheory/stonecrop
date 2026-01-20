import { join } from 'node:path'
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
		resolvers: 'server/resolvers.ts',
		url: '/graphql/',
		graphiqlPath: undefined, // Will default to url
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

		// Register configuration in nitro runtime config
		nuxt.hook('nitro:config', config => {
			// Add Nitro alias for server directory to handle projects with app/ srcDir
			config.alias = config.alias || {}
			config.alias['#grafserv-server'] = join(nuxt.options.rootDir, 'server')

			// Resolve paths
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
				// Use our custom alias that points to rootDir/server
				// Remove 'server/' prefix and use alias instead
				if (path.startsWith('server/')) {
					return `#grafserv-server/${path.substring(7)}`
				}
				return join(nuxt.options.rootDir, path)
			}

			logger.info(`Nitro srcDir: ${config.srcDir}`)
			logger.info(`Nuxt srcDir: ${nuxt.options.srcDir}`)
			logger.info(`Nuxt rootDir: ${nuxt.options.rootDir}`)
			logger.info(`Grafserv server alias: ${config.alias['#grafserv-server']}`)

			const resolverPath = options.resolvers ? resolveForVirtualModule(options.resolvers) : undefined

			config.runtimeConfig = config.runtimeConfig || {}
			config.runtimeConfig.grafserv = {
				...options,
				// Resolve schema paths from project root
				schema:
					typeof options.schema === 'string'
						? resolveForSchema(options.schema)
						: Array.isArray(options.schema)
						? options.schema.map(s => resolveForSchema(s))
						: options.schema, // function passed through
			}

			// Create virtual modules
			config.virtual = config.virtual || {}

			// Resolver virtual module
			if (resolverPath) {
				logger.info(`Creating virtual module for resolvers: ${resolverPath}`)
				config.virtual['#internal/grafserv/resolvers'] = `export { default } from '${resolverPath}'`
			}

			// Middleware virtual module
			const middlewareCode = options.middlewarePath
				? `export { default } from '${resolveForVirtualModule(options.middlewarePath)}'`
				: 'export default []'
			config.virtual['#internal/grafserv/middleware'] = middlewareCode

			// Externalize Grafast packages to avoid bundling issues with CommonJS dependencies
			config.externals = config.externals || {}
			config.externals.external = config.externals.external || []
			config.externals.external.push(
				'grafast',
				'grafserv',
				'grafserv/h3/v1',
				'graphile-config',
				'@graphql-tools/schema',
				'@graphql-tools/load',
				'@graphql-tools/graphql-file-loader',
				'debug' // CommonJS module that causes interop issues when bundled
			)
		})

		// Set up Grafast handler
		nuxt.hook('nitro:config', config => {
			config.handlers = config.handlers || []

			// GraphQL operations handler
			config.handlers.push({
				route: options.url || '/graphql/',
				handler: resolve('./runtime/graphql'),
			})

			// GraphiQL/Ruru UI handler
			config.handlers.push({
				route: options.graphiqlPath || options.url || '/graphql/',
				handler: resolve('./runtime/ruru'),
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
					logger.info(`${path} changed`)

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
export type { ModuleOptions, GrafastContext, MiddlewareFunction, SchemaProvider } from './types'
