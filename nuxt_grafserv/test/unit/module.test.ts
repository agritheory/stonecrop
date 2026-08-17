import { createRequire } from 'node:module'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { addServerHandler, addServerPlugin } from '@nuxt/kit'

import type { GrafservRuntimeConfig, ModuleOptions, SchemaRuntimeConfig } from '../../src/types'

interface MockNitroConfig {
	alias: Record<string, string>
	runtimeConfig: {
		/**
		 * What the module *writes*, which is not what it *reads*. Authored `ModuleOptions` are
		 * resolved during `nitro:config` into the narrower `GrafservRuntimeConfig` — absolute paths,
		 * `resolversPath` in place of `resolvers`, and concrete `url`/`graphiql`.
		 */
		grafserv?: GrafservRuntimeConfig
	}
	virtual: Record<string, string>
	externals: { external?: string[] }
	handlers: Array<{ route: string; handler: string }>
}

interface MockNuxt {
	options: {
		rootDir: string
		srcDir: string
		dev: boolean
		/** The module's `configKey` — what `grafserv: {...}` in nuxt.config lands on. */
		grafserv?: ModuleOptions
	}
	hook: ReturnType<typeof vi.fn>
}

/**
 * Narrow the captured runtime config to schema mode.
 *
 * `GrafservRuntimeConfig` is a discriminated union and only its schema arm carries `schema`, so the
 * discriminant is asserted rather than cast past. A module that started writing the PostGraphile
 * shape here would fail on the `type` expectation instead of silently reading `undefined`.
 */
function schemaRuntimeConfig(config: MockNitroConfig): SchemaRuntimeConfig {
	const written = config.runtimeConfig.grafserv
	expect(written?.type).toBe('schema')
	return written as SchemaRuntimeConfig
}

/**
 * Invoke the module the way Nuxt does: `module(inlineOptions, nuxt)`. The real export is an async
 * function, so this is the only entry point — there is no `.setup` to reach for.
 */
type InvokableModule = (options: Partial<ModuleOptions>, nuxt: MockNuxt) => Promise<false | void>

interface ModuleExport extends InvokableModule {
	getMeta: () => Promise<{ name?: string; configKey?: string }>
	getOptions: (options: Partial<ModuleOptions>, nuxt: MockNuxt) => Promise<ModuleOptions>
}

// Mock @nuxt/kit
const mockLogger = {
	info: vi.fn(),
	success: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
}

// `defineNuxtModule` is deliberately the REAL implementation. Stubbing it as `config => config`
// returned the raw definition object, giving the export a `.meta` and a `.setup` — neither of which
// exists on what the real kit produces (an async function carrying getMeta/getOptions/…). Tests
// then called `await module(...)` directly, skipping the option normalization Nuxt performs before
// setup ever runs: merging `nuxt.options.grafserv` and the module defaults (kit dist/index.mjs
// getOptions). Going through the real export exercises that path — and is why the empty-options
// early return in src/module.ts is now reachable from a test.
vi.mock('@nuxt/kit', async () => {
	const actual = await vi.importActual<typeof import('@nuxt/kit')>('@nuxt/kit')
	return {
		addServerHandler: vi.fn(),
		addServerPlugin: vi.fn(),
		createResolver: vi.fn(() => ({
			resolve: vi.fn((path: string) => `resolved:${path}`),
		})),
		defineNuxtModule: actual.defineNuxtModule,
		useLogger: vi.fn(() => mockLogger),
	}
})

// Mock node:fs so preset file checks are controllable in tests
vi.mock('node:fs', () => ({
	existsSync: vi.fn(() => true),
}))

// Mock node:path
vi.mock('node:path', () => ({
	join: vi.fn((...paths: string[]) => paths.join('/')),
}))

describe('Grafserv Module', { tags: ['unit', 'nuxt', 'graphql'] }, () => {
	let module: ModuleExport
	let mockNuxt: MockNuxt

	beforeEach(async () => {
		// Reset mocks
		vi.clearAllMocks()

		// Create mock Nuxt instance
		mockNuxt = {
			options: {
				rootDir: '/test/project',
				srcDir: '/test/project',
				dev: false,
			},
			hook: vi.fn(),
		}

		// Import module
		const moduleExport = await import('../../src/module')
		module = moduleExport.default as unknown as ModuleExport
	})

	describe('Module Definition', () => {
		it('should have correct meta configuration', async () => {
			expect(await module.getMeta()).toEqual({
				name: '@stonecrop/nuxt-grafserv',
				configKey: 'grafserv',
			})
		})
	})

	// These two exercise the option normalization Nuxt performs before setup runs. They are only
	// reachable through the module's real entry point — calling `.setup()` directly, as these tests
	// used to, skips getOptions entirely and neither path could be tested at all.
	describe('Option normalization', () => {
		it('returns without configuring anything when invoked with no options', async () => {
			// nuxt-module-build's prepare step invokes every module with empty options. Without the
			// early return in src/module.ts, validateConfig would throw on the absent `type`.
			await expect(module({}, mockNuxt)).resolves.not.toThrow()
			expect(mockNuxt.hook).not.toHaveBeenCalled()
		})

		it('picks up config from nuxt.options.grafserv when no inline options are given', async () => {
			// The `configKey` in meta is what makes `grafserv: {...}` in nuxt.config work at all.
			mockNuxt.options.grafserv = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module({}, mockNuxt)

			expect(mockNuxt.hook).toHaveBeenCalledWith('nitro:config', expect.any(Function))
		})
	})

	describe('Setup Hook', () => {
		let nitroConfig: MockNitroConfig

		beforeEach(() => {
			nitroConfig = {
				alias: {},
				runtimeConfig: {},
				virtual: {},
				externals: {},
				handlers: [],
			}

			// Mock the hook implementation to capture the callback
			mockNuxt.hook = vi.fn((hookName: string, callback: (config: MockNitroConfig) => void) => {
				if (hookName === 'nitro:config') {
					// Execute the callback immediately with our mock config
					callback(nitroConfig)
				}
				return () => {}
			})
		})

		it('should register nitro:config hooks', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(mockNuxt.hook).toHaveBeenCalledWith('nitro:config', expect.any(Function))
		})

		it('should configure nitro aliases', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(nitroConfig.alias['#grafserv-server']).toBe('/test/project/server')
		})

		// grafast and graphql have to be ONE module instance across the preset, the resolvers and the
		// request handler; two copies produce "Now is not a valid time to call currentLayerPlan".
		//
		// The assertion is a fixed point rather than a literal path, because the way to get this wrong
		// is to alias a forwarding stub. `postgraphile/grafast` is nothing but `export * from
		// "grafast"`, so it resolves, imports and behaves like grafast. Nitro copies every alias into
		// the generated tsconfig `paths`, which are global, so aliasing to the stub rewrites the stub's
		// own specifier back to itself — a module that re-exports itself, which exports nothing.
		// Resolving the specifier from the aliased file's own directory is what separates the two:
		// only the real package comes back to itself.
		it('aliases grafast and graphql to the real package rather than a forwarding stub', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			for (const specifier of ['grafast', 'graphql']) {
				const aliased = nitroConfig.alias[specifier]
				if (!aliased) throw new Error(`no alias registered for '${specifier}'`)
				expect(createRequire(aliased).resolve(specifier)).toBe(aliased)
			}
		})

		// Both spellings are in live use — graphql_middleware imports from `postgraphile/grafast`, a
		// scaffolded resolvers.ts from bare `grafast` — so they have to land on the same file for the
		// single-instance guarantee above to mean anything.
		it('lands every spelling of grafast and graphql on the same file', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(nitroConfig.alias['postgraphile/grafast']).toBe(nitroConfig.alias['grafast'])
			expect(nitroConfig.alias['postgraphile/graphql']).toBe(nitroConfig.alias['graphql'])
		})

		it('should configure runtime config with schema paths', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(nitroConfig.runtimeConfig.grafserv).toBeDefined()
			expect(schemaRuntimeConfig(nitroConfig).schema).toBe('/test/project/server/**/*.graphql')
		})

		it('should handle absolute schema paths', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: '/absolute/path/schema.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(schemaRuntimeConfig(nitroConfig).schema).toBe('/absolute/path/schema.graphql')
		})

		it('should handle array of schema paths', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: ['server/schema1.graphql', 'server/schema2.graphql'],
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(schemaRuntimeConfig(nitroConfig).schema).toEqual([
				'/test/project/server/schema1.graphql',
				'/test/project/server/schema2.graphql',
			])
		})

		it('should handle function schema providers', async () => {
			const schemaFn = () => ({ _type: 'MockSchema' }) as unknown as import('graphql').GraphQLSchema
			const options: ModuleOptions = {
				type: 'schema',
				schema: schemaFn,
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(schemaRuntimeConfig(nitroConfig).schema).toBe(schemaFn)
		})

		it('should create virtual module for resolvers', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(nitroConfig.virtual['#internal/grafserv/resolvers']).toBeDefined()
			expect(nitroConfig.virtual['#internal/grafserv/resolvers']).toContain('server/resolvers.ts')
		})

		it('should externalize Grafast packages', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(nitroConfig.externals.external).toContain('grafast')
			expect(nitroConfig.externals.external).toContain('@graphql-tools/schema')
			expect(nitroConfig.externals.external).toContain('@graphql-tools/load')
			expect(nitroConfig.externals.external).toContain('@graphql-tools/graphql-file-loader')
		})

		it('should register GraphQL handler', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(vi.mocked(addServerHandler)).toHaveBeenCalledWith(
				expect.objectContaining({ route: '/graphql/', handler: expect.stringContaining('handler') })
			)
		})

		it('should register Ruru static assets handler when graphiql is enabled', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
				graphiql: true,
			}

			await module(options, mockNuxt)

			expect(vi.mocked(addServerHandler)).toHaveBeenCalledWith(
				expect.objectContaining({ route: '/ruru-static/**', handler: expect.stringContaining('ruru') })
			)
		})

		it('should not register Ruru static assets handler when graphiql is disabled', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
				graphiql: false,
			}

			await module(options, mockNuxt)

			const calls = vi.mocked(addServerHandler).mock.calls
			expect(calls.every(([h]) => h.route !== '/ruru-static/**')).toBe(true)
		})

		it('should register cache handler in dev mode only', async () => {
			mockNuxt.options.dev = true
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(vi.mocked(addServerHandler)).toHaveBeenCalledWith(
				expect.objectContaining({ route: '/graphql/cache', handler: expect.stringContaining('cache') })
			)
		})

		it('should not register cache handler in production', async () => {
			mockNuxt.options.dev = false
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			const calls = vi.mocked(addServerHandler).mock.calls
			expect(calls.every(([h]) => h.route !== '/graphql/cache')).toBe(true)
		})
	})

	describe('Development Mode', () => {
		it('should set up file watcher in dev mode', async () => {
			mockNuxt.options.dev = true

			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(mockNuxt.hook).toHaveBeenCalledWith('builder:watch', expect.any(Function))
		})

		it('should not set up file watcher in production mode', async () => {
			mockNuxt.options.dev = false

			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			const watchHookCalls = mockNuxt.hook.mock.calls.filter((call: unknown[]) => call[0] === 'builder:watch')
			expect(watchHookCalls.length).toBe(0)
		})
	})

	describe('Devtools Integration', () => {
		it('should register devtools tab when url is provided', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			await module(options, mockNuxt)

			expect(mockNuxt.hook).toHaveBeenCalledWith('devtools:customTabs', expect.any(Function))
		})

		it('should not register devtools tab when url is not provided', async () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
			}

			await module(options, mockNuxt)

			const devtoolsHookCalls = mockNuxt.hook.mock.calls.filter((call: unknown[]) => call[0] === 'devtools:customTabs')
			expect(devtoolsHookCalls.length).toBe(0)
		})
	})

	describe('Synthesized PostGraphile Preset', () => {
		let nitroConfig: MockNitroConfig
		const originalDatabaseUrl = process.env.DATABASE_URL

		beforeEach(() => {
			nitroConfig = {
				alias: {},
				runtimeConfig: {},
				virtual: {},
				externals: {},
				handlers: [],
			}

			mockNuxt.hook = vi.fn((hookName: string, callback: (config: MockNitroConfig) => void) => {
				if (hookName === 'nitro:config') {
					callback(nitroConfig)
				}
				return () => {}
			})

			process.env.DATABASE_URL = 'postgresql://localhost/test'
			mockLogger.warn.mockClear()
		})

		afterEach(() => {
			if (originalDatabaseUrl === undefined) {
				delete process.env.DATABASE_URL
			} else {
				process.env.DATABASE_URL = originalDatabaseUrl
			}
		})

		it('type postgraphile with no preset synthesizes a virtual module', async () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			await module(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('createStonecropPreset')
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('makePgService')
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('createStonecropPlugin')
		})

		it("fieldCasing: 'pascal' passes pascal to synthesized preset", async () => {
			const options: ModuleOptions = { type: 'postgraphile', fieldCasing: 'pascal' }
			await module(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain("fieldCasing: 'pascal'")
		})

		it("fieldCasing omitted defaults to 'camel' in synthesized preset", async () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			await module(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain("fieldCasing: 'camel'")
		})

		it('schemas array is included in synthesized makePgService call', async () => {
			const options: ModuleOptions = { type: 'postgraphile', schemas: ['public', 'auth'] }
			await module(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('"public"')
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('"auth"')
		})

		it("schemas omitted defaults to ['public'] in synthesized makePgService call", async () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			await module(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('["public"]')
		})

		it('explain: true is passed to synthesized preset', async () => {
			const options: ModuleOptions = { type: 'postgraphile', explain: true }
			await module(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('explain: true')
		})

		it('explain omitted defaults to false in synthesized preset', async () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			await module(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('explain: false')
		})

		it('debug: true enables explain, injects debug plugin, passes debug to stonecrop plugin, and configures careful maskError', async () => {
			const options: ModuleOptions = { type: 'postgraphile', debug: true }
			await module(options, mockNuxt)
			const virtual = nitroConfig.virtual['#internal/grafserv/pgl']
			expect(virtual).toContain('explain: true')
			expect(virtual).toContain('createStonecropPlugin({ debug: true })')
			expect(virtual).toContain('createDebugPlugin()')
			expect(virtual).toContain('maskError(error)')
			expect(virtual).toContain('isSafeError')
			expect(virtual).toContain('createHash')
		})

		it('debug: true overrides explain: false', async () => {
			const options: ModuleOptions = { type: 'postgraphile', debug: true, explain: false }
			await module(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('explain: true')
		})

		it('debug omitted sets debug: false on stonecrop plugin and excludes debug plugin', async () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			await module(options, mockNuxt)
			const virtual = nitroConfig.virtual['#internal/grafserv/pgl']
			expect(virtual).toContain('createStonecropPlugin({ debug: false })')
			expect(virtual).not.toContain('createDebugPlugin')
			expect(virtual).not.toContain('maskError')
		})

		it('registers startup-check plugin when no preset is given', async () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			await module(options, mockNuxt)
			expect(vi.mocked(addServerPlugin)).toHaveBeenCalledWith(expect.stringContaining('startup-check'))
		})

		it('does not throw when DATABASE_URL is unset — warns only', async () => {
			delete process.env.DATABASE_URL
			const options: ModuleOptions = { type: 'postgraphile' }
			await expect(module(options, mockNuxt)).resolves.not.toThrow()
		})

		it('explicit preset uses file path and does not synthesize', async () => {
			const options: ModuleOptions = { type: 'postgraphile', preset: './server/graphile.preset.ts' }
			await module(options, mockNuxt)
			const virtual = nitroConfig.virtual['#internal/grafserv/pgl']
			expect(virtual).toContain("import preset from '")
			expect(virtual).not.toContain('createStonecropPreset')
		})
	})
})
