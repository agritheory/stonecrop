import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { addServerHandler, addServerPlugin, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

import type { GrafservRuntimeConfig, ModuleOptions, PostGraphileConfig, SchemaConfig } from './types'

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

		// GraphiQL IDE: honor an explicit `graphiql`; otherwise enable in dev, disable in prod.
		// Resolved to a concrete boolean here so the asset handler, the runtime handler, and
		// the docs all agree on one value.
		const graphiqlEnabled = options.graphiql ?? nuxt.options.dev

		const { resolve } = createResolver(import.meta.url)

		// grafast and graphql must be exactly one instance across the preset, the resolvers and the
		// request handler; two copies produce "Now is not a valid time to call currentLayerPlan".
		// Bases are tried in this order: PostGraphile, because it is what builds the plan and so its
		// copy is the one everything else has to match; then the host app, so a linked monorepo
		// checkout of this module cannot drag in a second copy out of common/temp/node_modules; then
		// this module's own dependencies, which is what a normally-installed consumer resolves to and
		// the only base guaranteed to exist in `schema` mode, where PostGraphile need not be installed.
		const selfRequire = createRequire(import.meta.url)
		const hostRequire = createRequire(join(nuxt.options.rootDir, 'package.json'))
		let postgraphileRequire: ReturnType<typeof createRequire> | undefined
		try {
			postgraphileRequire = createRequire(hostRequire.resolve('postgraphile'))
		} catch {
			// `schema` mode does not require PostGraphile at all.
		}
		const resolveOneInstance = (specifier: string): string => {
			for (const from of [postgraphileRequire, hostRequire, selfRequire]) {
				if (!from) continue
				try {
					return from.resolve(specifier)
				} catch {
					// fall through to the next base
				}
			}
			throw new Error(
				`[@stonecrop/nuxt-grafserv] Could not resolve '${specifier}' from PostGraphile, from the app ` +
					`at ${nuxt.options.rootDir}, or from this module's own dependencies.`
			)
		}

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

				config.virtual = config.virtual || {}

				if (!options.preset) {
					// Synthesize a default preset from DATABASE_URL + nuxt.config.ts options.
					// The DATABASE_URL check runs at server startup (startup-check plugin), not here,
					// so build steps and nuxt prepare don't require the env var.
					logger.info('Synthesizing PostGraphile preset from DATABASE_URL')

					const explain = options.debug ? true : (options.explain ?? false)
					const debug = options.debug ?? false
					const fieldCasing = options.fieldCasing || 'camel'
					const schemas = JSON.stringify(options.schemas || ['public'])

					const extraImports = debug ? `, createDebugPlugin` : ``
					const pluginsList = debug
						? `createStonecropPlugin({ debug: true }), createDebugPlugin()`
						: `createStonecropPlugin({ debug: false })`
					const grafservBlock = !debug
						? ``
						: `
							grafserv: {
								maskError(error) {
									console.error('maskError was called with the following error:');
									console.error(error);
									console.error('which had an originalError of:');
									console.error(error.originalError);
									const { GraphQLError } = require('postgraphile/graphql');
									const { isSafeError } = require('postgraphile/grafast');
									if (error.originalError instanceof GraphQLError) {
										return error;
									} else if (error.originalError && isSafeError(error.originalError)) {
										return new GraphQLError(
											error.originalError.message,
											error.nodes,
											error.source,
											error.positions,
											error.path,
											error.originalError,
											error.originalError.extensions ?? null,
										);
									} else {
										const { createHash } = require('node:crypto');
										const hash = createHash('sha1').update(String(error)).digest('base64url');
										console.error(\`Masked GraphQL error (hash: '\${hash}')\`, error);
										return new GraphQLError(
											\`An error occurred (logged with hash: '\${hash}')\`,
											error.nodes,
											error.source,
											error.positions,
											error.path,
											error.originalError,
											{},
										);
									}
								},
							},
						`

					config.virtual['#internal/grafserv/pgl'] = `
						import { postgraphile } from 'postgraphile'
						import { createStonecropPreset, makePgService, createStonecropPlugin${extraImports} } from '@stonecrop/graphql-middleware'

						const synthesizedPreset = {
							extends: [createStonecropPreset({ fieldCasing: '${fieldCasing}' })],
							pgServices: [makePgService({ connectionString: process.env.DATABASE_URL, schemas: ${schemas} })],
							plugins: [${pluginsList}],
							grafast: { explain: ${explain} },${grafservBlock}
						}

						export const pgl = postgraphile(synthesizedPreset)
					`
				} else {
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
									`import { createStonecropPreset, makePgService, createStonecropPlugin } from '@stonecrop/graphql-middleware'\n\n` +
									`export default {\n` +
									`  extends: [createStonecropPreset()],\n` +
									`  pgServices: [makePgService({ connectionString: process.env.DATABASE_URL, schemas: ['public'] })],\n` +
									`  plugins: [createStonecropPlugin()],\n` +
									`}\n`
							)
						}
					}

					logger.info(`Resolved preset path: ${presetPath}`)

					// Create virtual module that imports preset and creates PostGraphile instance
					// This approach follows PostGraphile's library mode pattern and avoids
					// runtime preset imports which cause GraphQL module duplication
					config.virtual['#internal/grafserv/pgl'] = [
						`import { postgraphile } from 'postgraphile'`,
						`import preset from '${presetPath}'`,
						``,
						`// Create PostGraphile instance with the preset`,
						`// This handles schema building, watch mode, and lifecycle`,
						`export const pgl = postgraphile(preset)`,
					].join('\n')
				}

				// Register a no-op stub so the bundler can always resolve this virtual.
				// handler.ts references #internal/grafserv/resolvers behind a runtime guard,
				// but static analysis still attempts to resolve it regardless of mode.
				config.virtual['#internal/grafserv/resolvers'] = 'export default null'

				// Store minimal runtime config. See the note on the schema branch below for why the
				// assignment is cast — Nitro's generated `runtimeConfig` type cannot describe both modes.
				const pgRuntimeConfig: GrafservRuntimeConfig = {
					type: 'postgraphile',
					url: options.url || '/graphql/',
					graphiql: graphiqlEnabled,
				}
				config.runtimeConfig = config.runtimeConfig || {}
				config.runtimeConfig.grafserv = pgRuntimeConfig as NonNullable<typeof config.runtimeConfig>['grafserv']
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

				// `GrafservRuntimeConfig` is the real contract for what the handler reads back. The cast
				// on the assignment is unavoidable: Nitro derives `runtimeConfig`'s type from the
				// *consuming app's* nuxt.config, so it only ever describes whichever mode that app uses.
				// The playground is PostGraphile, so the generated type has no `schema` key at all.
				// Annotating the value first is what keeps the cast honest — the object is still checked.
				const schemaRuntimeConfig: GrafservRuntimeConfig = {
					type: 'schema',
					schema: runtimeSchema,
					resolversPath: resolverPath,
					url: options.url || '/graphql/',
					graphiql: graphiqlEnabled,
				}
				config.runtimeConfig = config.runtimeConfig || {}
				config.runtimeConfig.grafserv = schemaRuntimeConfig as NonNullable<typeof config.runtimeConfig>['grafserv']

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
			config.externals = {
				...config.externals,
				external: [
					...(config.externals?.external ?? []),
					'graphql',
					'grafast',
					'grafserv',
					'postgraphile',
					'postgraphile/graphql',
					'postgraphile/grafast',
					'graphile-config',
					'graphile-build',
					'@dataplan/pg',
					'@graphql-tools/schema',
					'@graphql-tools/load',
					'@graphql-tools/graphql-file-loader',
				],
			}

			// CRITICAL: pin grafast and graphql to one file each. PostGraphile re-exports both under
			// its own name and this repo imports them both ways — graphql_middleware from the
			// PostGraphile subpath, a scaffolded resolvers.ts from the bare specifier — so every
			// spelling has to land on the same module.
			//
			// Rejected: aliasing to `postgraphile/grafast`. That subpath is a forwarder whose entire
			// type is `export * from "grafast"`, and Nitro copies every alias into the generated
			// tsconfig `paths`, which are global — so the forwarder's own specifier is rewritten back
			// to the forwarder. A module that re-exports itself exports nothing, and vue-tsc reports
			// every named grafast import in a scaffolded resolvers.ts as missing.
			config.alias = config.alias || {}
			const grafastPath = resolveOneInstance('grafast')
			const graphqlPath = resolveOneInstance('graphql')
			config.alias['grafast'] = grafastPath
			config.alias['graphql'] = graphqlPath
			if (postgraphileRequire) {
				config.alias['postgraphile/grafast'] = grafastPath
				config.alias['postgraphile/graphql'] = graphqlPath
			}
			// No grafserv alias: it is externalized above, and the previous attempt keyed off
			// `require.resolve('grafserv/package.json')`, which throws ERR_PACKAGE_PATH_NOT_EXPORTED
			// even where grafserv is installed — its exports map has no ./package.json entry — so the
			// aliases were never set on any host.

			// Configure TypeScript module resolution for preset files
			config.typescript = config.typescript || {}
			config.typescript.tsConfig = config.typescript.tsConfig || {}
			config.typescript.tsConfig.compilerOptions = config.typescript.tsConfig.compilerOptions || {}
			config.typescript.tsConfig.compilerOptions.allowImportingTsExtensions = true
			config.typescript.tsConfig.compilerOptions.moduleResolution = 'bundler'
		})

		// Warn at server startup (not build time) when DATABASE_URL is absent and no preset was given
		if (options.type === 'postgraphile' && !options.preset) {
			addServerPlugin(resolve('./runtime/startup-check'))
		}

		// Set up Grafast handlers
		addServerHandler({ route: options.url || '/graphql/', handler: resolve('./runtime/handler') })
		if (graphiqlEnabled) {
			addServerHandler({ route: '/ruru-static/**', handler: resolve('./runtime/ruru-static') })
		}
		if (nuxt.options.dev) {
			addServerHandler({ route: '/graphql/cache', handler: resolve('./runtime/cache') })
		}

		// Add custom devtools tab
		if (options.url) {
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
				const isPresetFile =
					options.type === 'postgraphile' && !!options.preset && path.includes(options.preset.replace('./', ''))

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

// The resolved shape this module writes into Nitro, for anyone reading `useRuntimeConfig().grafserv`.
// It is deliberately narrower than ModuleOptions — see the doc comments in ./types.
export type { GrafservRuntimeConfig, PostGraphileRuntimeConfig, SchemaRuntimeConfig } from './types'
