import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

import type { ModuleOptions, PostGraphileConfig, SchemaConfig } from './types'

const logger = useLogger('@stonecrop/nuxt-grafserv')

/**
 * Validate module configuration
 */
function validateConfig(options: Partial<ModuleOptions>): asserts options is ModuleOptions {
	if (!options.type) {
		throw new Error(
			`[@stonecrop/nuxt-grafserv] Configuration error: 'type' field is required. ` +
				`Must be either 'postgraphile' or 'schema'. ` +
				`\nExample: grafserv: { type: 'postgraphile', preset: { ... } }`
		)
	}

	if (options.type === 'postgraphile') {
		const config = options as Partial<PostGraphileConfig>
		if (!config.preset) {
			throw new Error(
				`[@stonecrop/nuxt-grafserv] PostGraphile configuration error: 'preset' field is required when type is 'postgraphile'. ` +
					`\nExample: { type: 'postgraphile', preset: { extends: [PostGraphileAmberPreset], ... } }`
			)
		}
		// Warn if schema/resolvers are provided with postgraphile type
		if ('schema' in config || 'resolvers' in config) {
			logger.warn(
				`PostGraphile configuration should not include 'schema' or 'resolvers' fields. ` +
					`The schema is generated from the 'preset' configuration.`
			)
		}
	} else if (options.type === 'schema') {
		const config = options as Partial<SchemaConfig>
		if (!config.schema) {
			throw new Error(
				`[@stonecrop/nuxt-grafserv] Schema configuration error: 'schema' field is required when type is 'schema'. ` +
					`\nExample: { type: 'schema', schema: 'server/**/*.graphql', resolvers: 'server/resolvers/index.ts' }`
			)
		}
		// Warn if preset is provided with schema type
		if ('preset' in config) {
			logger.warn(
				`Schema configuration should not include 'preset' field. ` +
					`Use type: 'postgraphile' for PostGraphile preset configuration.`
			)
		}
	} else {
		throw new Error(
			`[@stonecrop/nuxt-grafserv] Configuration error: Invalid type '${(options as Partial<ModuleOptions>).type}'. ` +
				`Must be either 'postgraphile' or 'schema'.`
		)
	}
}

const module: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@stonecrop/nuxt-grafserv',
		configKey: 'grafserv',
	},

	// No defaults - user must provide complete config with type discriminator
	// Use undefined instead of {} to ensure user config is passed as-is
	setup(options, nuxt) {
		// Skip validation if options is empty (happens during nuxt-module-build prepare)
		if (Object.keys(options).length === 0) {
			return
		}

		// Validate configuration early
		validateConfig(options)

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

			// Handle configuration based on type
			if (options.type === 'postgraphile') {
				logger.info('Using PostGraphile preset configuration')

				// Resolve preset file path and try common extensions if needed
				let presetPath = resolveForVirtualModule(options.preset)

				// If file doesn't exist, try common extensions
				if (!existsSync(presetPath)) {
					const extensions = ['.ts', '.js', '.mjs']
					let found = false

					for (const ext of extensions) {
						const pathWithExt = presetPath + ext
						if (existsSync(pathWithExt)) {
							presetPath = pathWithExt
							found = true
							break
						}
					}

					if (!found) {
						throw new Error(
							`[@stonecrop/nuxt-grafserv] Preset file not found: ${presetPath}\n` +
								`Tried extensions: ${extensions.join(', ')}\n\n` +
								`Create the preset file with your PostGraphile configuration:\n\n` +
								`// ${options.preset}.ts (or .js, .mjs)\n` +
								`import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'\n` +
								`import { makePgService } from 'postgraphile/adaptors/pg'\n\n` +
								`export default {\n` +
								`  extends: [PostGraphileAmberPreset],\n` +
								`  pgServices: [makePgService({ connectionString: process.env.DATABASE_URL, schemas: ['public'] })],\n` +
								`  plugins: [],\n` +
								`}\n`
						)
					}
				}

				logger.info(`Resolved preset path: ${presetPath}`)

				// Create virtual module that imports preset and creates PostGraphile instance
				// This approach follows PostGraphile's library mode pattern and avoids
				// runtime preset imports which cause GraphQL module duplication
				config.virtual = config.virtual || {}
				config.virtual['#internal/grafserv/pgl'] = [
					`import { postgraphile } from 'postgraphile'`,
					`import preset from '${presetPath}'`,
					``,
					`// Create PostGraphile instance with the preset`,
					`// This handles schema building, watch mode, and lifecycle`,
					`export const pgl = postgraphile(preset)`,
				].join('\n')

				// Register a no-op stub so the bundler can always resolve this virtual.
				// handler.ts references #internal/grafserv/resolvers behind a runtime guard,
				// but static analysis still attempts to resolve it regardless of mode.
				config.virtual['#internal/grafserv/resolvers'] = 'export default null'

				// Store minimal runtime config
				config.runtimeConfig = config.runtimeConfig || {}
				config.runtimeConfig.grafserv = {
					type: 'postgraphile' as const,
					url: options.url || '/graphql/',
					graphiql: options.graphiql,
				}
			} else if (options.type === 'schema') {
				logger.info('Using schema configuration')

				// Handle resolvers (optional)
				const resolverPath = options.resolvers ? resolveForVirtualModule(options.resolvers) : undefined
				if (resolverPath) {
					logger.info(`Resolved resolver path: ${resolverPath}`)
				} else {
					logger.info('No resolvers configured')
				}

				// Determine schema type and handle appropriately
				let runtimeSchema: SchemaConfig['schema']
				if (typeof options.schema === 'function') {
					// Function - pass through directly
					runtimeSchema = options.schema
					logger.info('Using schema provider function')
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
					type: 'schema' as const,
					schema: runtimeSchema,
					resolversPath: resolverPath,
					url: options.url || '/graphql/',
					graphiql: options.graphiql,
				}

				// Create virtual modules for resolvers
				config.virtual = config.virtual || {}
				if (resolverPath) {
					config.virtual['#internal/grafserv/resolvers'] = `export { default } from '${resolverPath}'`
				} else {
					// No resolvers configured; register a no-op stub so the bundler can always
					// resolve the virtual that handler.ts statically references.
					config.virtual['#internal/grafserv/resolvers'] = 'export default null'
				}
			}

			// Externalize Grafast and GraphQL to prevent module instance mismatch
			// CRITICAL: graphql must be externalized to prevent duplicate module errors
			config.externals = config.externals || {}
			config.externals.external = config.externals.external || []
			config.externals.external.push(
				'graphql',
				'grafast',
				'postgraphile',
				'graphile-config',
				'graphile-build',
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

			// Configure TypeScript module resolution for preset files
			config.typescript = config.typescript || {}
			config.typescript.tsConfig = config.typescript.tsConfig || {}
			config.typescript.tsConfig.compilerOptions = config.typescript.tsConfig.compilerOptions || {}
			config.typescript.tsConfig.compilerOptions.allowImportingTsExtensions = true
			config.typescript.tsConfig.compilerOptions.moduleResolution = 'bundler'
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
				const isResolverFile =
					options.type === 'schema' && options.resolvers && path.includes(options.resolvers.replace('./', ''))
				const isPresetFile = options.type === 'postgraphile' && path.includes(options.preset.replace('./', ''))

				if (isSchemaFile || isResolverFile || isPresetFile) {
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
export type { ModuleOptions, PostGraphileConfig, SchemaConfig, SchemaProvider } from './types'
