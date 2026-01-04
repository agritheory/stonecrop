import { join } from 'node:path'
import { createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'

import type { ModuleOptions } from './types'

const logger = useLogger('nuxt-yoga')

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'nuxt-yoga',
		configKey: 'yoga',
	},

	defaults: _nuxt => ({
		schema: './server/**/*.graphql',
		resolvers: './server/resolvers.ts',
		url: '/graphql/',
		yoga: {
			graphiql: undefined,
			cors: undefined,
			landingPage: undefined,
		},
		remoteSchemas: [],
	}),

	setup(options, nuxt) {
		const { resolve } = createResolver(import.meta.url)

		// Register schema and resolver paths in nitro runtime config
		nuxt.hook('nitro:config', config => {
			const resolverPath = join(nuxt.options.srcDir, options.resolvers)

			config.runtimeConfig = config.runtimeConfig || {}
			config.runtimeConfig.yoga = {
				...options,
				schema: Array.isArray(options.schema)
					? options.schema.map(s => join(nuxt.options.srcDir, s)).toString()
					: join(nuxt.options.srcDir, options.schema),
			}

			// Create virtual modules
			config.virtual = config.virtual || {}

			// Resolver virtual module
			config.virtual['#internal/yoga/resolvers'] = `export { default } from '${resolverPath}'`

			// Middleware virtual module
			const middlewareCode = options.middleware?.length
				? `export default [${options.middleware.map(fn => fn.toString()).join(',')}]`
				: 'export default []'

			config.virtual['#internal/yoga/middleware'] = middlewareCode

			// Add externals
			config.externals = config.externals || {}
			config.externals.inline = config.externals.inline || []
			config.externals.inline.push(
				'graphql-yoga',
				'@graphql-tools/schema',
				'@graphql-tools/load',
				'@graphql-tools/graphql-file-loader'
			)
		})

		// Set up Yoga handler
		nuxt.hook('nitro:config', config => {
			config.handlers = config.handlers || []
			config.handlers.push({
				route: options.url || '/graphql/',
				handler: resolve('./handler'),
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
					name: 'nuxt-yoga',
					title: 'GraphQL Yoga',
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
			const schemaGlobs = Array.isArray(options.schema) ? options.schema : [options.schema]
			let cacheClearing = false

			nuxt.hook('builder:watch', async (event, path) => {
				// Simple path matching without regex
				const isSchemaFile = path.endsWith('.graphql')
				const isResolverFile = path.includes(options.resolvers.replace('./', ''))

				if (isSchemaFile || isResolverFile) {
					logger.info(`${path} changed`)

					// If caching is enabled in dev, clear cache instead of restarting
					if (options.cache?.devMode) {
						if (!cacheClearing) {
							cacheClearing = true
							try {
								logger.info('Clearing Yoga cache...')
								// Import and call the clearYogaCache function
								const { clearYogaCache } = await import(resolve('./handler'))
								await clearYogaCache()
								logger.success('Cache cleared, schema reloaded')
							} catch (error) {
								logger.error('Failed to clear cache:', error)
							} finally {
								cacheClearing = false
							}
						}
					} else {
						// Default behavior: restart server
						logger.info('Restarting server...')
						await nuxt.callHook('restart')
					}
				}
			})
		}
	},
})
