import { join } from 'node:path'
import { createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'

import type { ModuleOptions } from './types'

const logger = useLogger('nuxt-grafserv')

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'nuxt-grafserv',
		configKey: 'grafserv',
	},

	defaults: _nuxt => ({
		schema: './server/**/*.graphql',
		resolvers: './server/resolvers.ts',
		url: '/graphql/',
		graphiql: undefined, // Will default based on dev mode
		middleware: [],
		plugins: [],
		grafserv: {
			websockets: false,
			introspection: undefined, // Will default based on dev mode
		},
	}),

	setup(options, nuxt) {
		const { resolve } = createResolver(import.meta.url)

		// Register configuration in nitro runtime config
		nuxt.hook('nitro:config', config => {
			const resolversPath = options.resolvers ? join(nuxt.options.srcDir, options.resolvers) : undefined

			config.runtimeConfig = config.runtimeConfig || {}
			config.runtimeConfig.grafserv = {
				...options,
				// Resolve schema paths
				schema:
					typeof options.schema === 'string'
						? join(nuxt.options.srcDir, options.schema)
						: Array.isArray(options.schema)
						? options.schema.map(s => join(nuxt.options.srcDir, s))
						: options.schema, // function passed through
				// Add resolved resolver path
				resolversPath: resolversPath,
			}

			// Create virtual modules
			config.virtual = config.virtual || {}

			// Middleware virtual module
			const middlewareCode = options.middleware?.length
				? `export default [${options.middleware.map(fn => fn.toString()).join(',')}]`
				: 'export default []'
			config.virtual['#internal/grafserv/middleware'] = middlewareCode

			// Configure externals - don't inline grafast/grafserv to avoid CommonJS/ESM issues
			config.externals = config.externals || {}
			config.externals.inline = config.externals.inline || []

			// Inline only the graphql-tools packages
			config.externals.inline.push('@graphql-tools/schema', '@graphql-tools/load', '@graphql-tools/graphql-file-loader')

			// External packages should NOT be inlined to preserve their module system
			config.externals.external = config.externals.external || []
			const externalPackages = [
				'grafast',
				'grafserv',
				'grafserv/h3/v1',
				'graphile-config',
				'debug',
				'chalk',
				'@graphile/lru',
			]

			externalPackages.forEach(pkg => {
				if (!config.externals!.external!.includes(pkg)) {
					config.externals!.external!.push(pkg)
				}
			})
		})

		// Set up Grafast handler
		nuxt.hook('nitro:config', config => {
			config.handlers = config.handlers || []
			config.handlers.push({
				route: options.url || '/graphql/',
				handler: resolve('./handler'),
			})
			// Add handler for Ruru static assets
			config.handlers.push({
				route: '/ruru-static/**',
				handler: resolve('./ruru-static'),
			})
			// Add cache API endpoint
			config.handlers.push({
				route: '/graphql/cache',
				handler: resolve('./cache'),
			})
		})

		// Add custom devtools tab
		if (options.url) {
			nuxt.hook('devtools:customTabs', tabs => {
				tabs.push({
					name: 'nuxt-grafserv',
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
							const { clearGrafservCache } = await import(resolve('./handler'))
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
