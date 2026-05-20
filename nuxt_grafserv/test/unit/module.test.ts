import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { addServerHandler } from '@nuxt/kit'

import type { ModuleOptions } from '../../src/types'

interface MockNitroConfig {
	alias: Record<string, string>
	runtimeConfig: {
		grafserv?: ModuleOptions
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
	}
	hook: ReturnType<typeof vi.fn>
}

interface TestModule {
	meta: {
		name: string
		configKey: string
	}
	defaults: (nuxt: MockNuxt) => Partial<ModuleOptions>
	setup: (options: ModuleOptions, nuxt: MockNuxt) => void
}

// Mock @nuxt/kit
const mockLogger = {
	info: vi.fn(),
	success: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
}

vi.mock('@nuxt/kit', () => ({
	addServerHandler: vi.fn(),
	createResolver: vi.fn(() => ({
		resolve: vi.fn((path: string) => `resolved:${path}`),
	})),
	defineNuxtModule: vi.fn(config => config),
	useLogger: vi.fn(() => mockLogger),
}))

// Mock node:fs so preset file checks are controllable in tests
vi.mock('node:fs', () => ({
	existsSync: vi.fn(() => true),
}))

// Mock node:path
vi.mock('node:path', () => ({
	join: vi.fn((...paths: string[]) => paths.join('/')),
}))

describe('Grafserv Module', { tags: ['unit', 'nuxt', 'graphql'] }, () => {
	let module: TestModule
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
		module = moduleExport.default as unknown as TestModule
	})

	describe('Module Definition', () => {
		it('should have correct meta configuration', () => {
			expect(module.meta).toEqual({
				name: '@stonecrop/nuxt-grafserv',
				configKey: 'grafserv',
			})
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

			module.setup(options, mockNuxt)

			expect(mockNuxt.hook).toHaveBeenCalledWith('nitro:config', expect.any(Function))
		})

		it('should configure nitro aliases', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(nitroConfig.alias['#grafserv-server']).toBe('/test/project/server')
		})

		it('should configure runtime config with schema paths', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(nitroConfig.runtimeConfig.grafserv).toBeDefined()
			expect(nitroConfig.runtimeConfig.grafserv?.schema).toBe('/test/project/server/**/*.graphql')
		})

		it('should handle absolute schema paths', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: '/absolute/path/schema.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(nitroConfig.runtimeConfig.grafserv?.schema).toBe('/absolute/path/schema.graphql')
		})

		it('should handle array of schema paths', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: ['server/schema1.graphql', 'server/schema2.graphql'],
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(nitroConfig.runtimeConfig.grafserv?.schema).toEqual([
				'/test/project/server/schema1.graphql',
				'/test/project/server/schema2.graphql',
			])
		})

		it('should handle function schema providers', () => {
			const schemaFn = () => ({ _type: 'MockSchema' }) as unknown as import('graphql').GraphQLSchema
			const options: ModuleOptions = {
				type: 'schema',
				schema: schemaFn,
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(nitroConfig.runtimeConfig.grafserv?.schema).toBe(schemaFn)
		})

		it('should create virtual module for resolvers', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(nitroConfig.virtual['#internal/grafserv/resolvers']).toBeDefined()
			expect(nitroConfig.virtual['#internal/grafserv/resolvers']).toContain('server/resolvers.ts')
		})

		it('should externalize Grafast packages', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(nitroConfig.externals.external).toContain('grafast')
			expect(nitroConfig.externals.external).toContain('@graphql-tools/schema')
			expect(nitroConfig.externals.external).toContain('@graphql-tools/load')
			expect(nitroConfig.externals.external).toContain('@graphql-tools/graphql-file-loader')
		})

		it('should register GraphQL handler', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(vi.mocked(addServerHandler)).toHaveBeenCalledWith(
				expect.objectContaining({ route: '/graphql/', handler: expect.stringContaining('handler') })
			)
		})

		it('should register Ruru static assets handler when graphiql is enabled', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
				graphiql: true,
			}

			module.setup(options, mockNuxt)

			expect(vi.mocked(addServerHandler)).toHaveBeenCalledWith(
				expect.objectContaining({ route: '/ruru-static/**', handler: expect.stringContaining('ruru') })
			)
		})

		it('should not register Ruru static assets handler when graphiql is disabled', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
				graphiql: false,
			}

			module.setup(options, mockNuxt)

			const calls = vi.mocked(addServerHandler).mock.calls
			expect(calls.every(([h]) => h.route !== '/ruru-static/**')).toBe(true)
		})

		it('should register cache handler in dev mode only', () => {
			mockNuxt.options.dev = true
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(vi.mocked(addServerHandler)).toHaveBeenCalledWith(
				expect.objectContaining({ route: '/graphql/cache', handler: expect.stringContaining('cache') })
			)
		})

		it('should not register cache handler in production', () => {
			mockNuxt.options.dev = false
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

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

			module.setup(options, mockNuxt)

			expect(mockNuxt.hook).toHaveBeenCalledWith('builder:watch', expect.any(Function))
		})

		it('should not set up file watcher in production mode', () => {
			mockNuxt.options.dev = false

			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			const watchHookCalls = mockNuxt.hook.mock.calls.filter((call: unknown[]) => call[0] === 'builder:watch')
			expect(watchHookCalls.length).toBe(0)
		})
	})

	describe('Devtools Integration', () => {
		it('should register devtools tab when url is provided', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(mockNuxt.hook).toHaveBeenCalledWith('devtools:customTabs', expect.any(Function))
		})

		it('should not register devtools tab when url is not provided', () => {
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
			}

			module.setup(options, mockNuxt)

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

		it('type postgraphile with no preset synthesizes a virtual module', () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			module.setup(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('createStonecropPreset')
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('makePgService')
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('createStonecropPlugin')
		})

		it("fieldCasing: 'pascal' passes pascal to synthesized preset", () => {
			const options: ModuleOptions = { type: 'postgraphile', fieldCasing: 'pascal' }
			module.setup(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain("fieldCasing: 'pascal'")
		})

		it("fieldCasing omitted defaults to 'camel' in synthesized preset", () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			module.setup(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain("fieldCasing: 'camel'")
		})

		it('schemas array is included in synthesized makePgService call', () => {
			const options: ModuleOptions = { type: 'postgraphile', schemas: ['public', 'auth'] }
			module.setup(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('"public"')
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('"auth"')
		})

		it("schemas omitted defaults to ['public'] in synthesized makePgService call", () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			module.setup(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('["public"]')
		})

		it('explain: true is passed to synthesized preset', () => {
			const options: ModuleOptions = { type: 'postgraphile', explain: true }
			module.setup(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('explain: true')
		})

		it('explain omitted defaults to false in synthesized preset', () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			module.setup(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('explain: false')
		})

		it('debug: true enables explain, injects debug plugin, passes debug to stonecrop plugin, and configures careful maskError', () => {
			const options: ModuleOptions = { type: 'postgraphile', debug: true }
			module.setup(options, mockNuxt)
			const virtual = nitroConfig.virtual['#internal/grafserv/pgl']
			expect(virtual).toContain('explain: true')
			expect(virtual).toContain('createStonecropPlugin({ debug: true })')
			expect(virtual).toContain('createDebugPlugin()')
			expect(virtual).toContain('maskError(error)')
			expect(virtual).toContain('isSafeError')
			expect(virtual).toContain('createHash')
		})

		it('debug: true overrides explain: false', () => {
			const options: ModuleOptions = { type: 'postgraphile', debug: true, explain: false }
			module.setup(options, mockNuxt)
			expect(nitroConfig.virtual['#internal/grafserv/pgl']).toContain('explain: true')
		})

		it('debug omitted sets debug: false on stonecrop plugin and excludes debug plugin', () => {
			const options: ModuleOptions = { type: 'postgraphile' }
			module.setup(options, mockNuxt)
			const virtual = nitroConfig.virtual['#internal/grafserv/pgl']
			expect(virtual).toContain('createStonecropPlugin({ debug: false })')
			expect(virtual).not.toContain('createDebugPlugin')
			expect(virtual).not.toContain('maskError')
		})

		it('warns when DATABASE_URL is not set', () => {
			delete process.env.DATABASE_URL
			const options: ModuleOptions = { type: 'postgraphile' }
			module.setup(options, mockNuxt)
			expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('DATABASE_URL'))
		})

		it('does not throw when DATABASE_URL is unset — warns only', () => {
			delete process.env.DATABASE_URL
			const options: ModuleOptions = { type: 'postgraphile' }
			expect(() => module.setup(options, mockNuxt)).not.toThrow()
		})

		it('explicit preset uses file path and does not synthesize', () => {
			const options: ModuleOptions = { type: 'postgraphile', preset: './server/graphile.preset.ts' }
			module.setup(options, mockNuxt)
			const virtual = nitroConfig.virtual['#internal/grafserv/pgl']
			expect(virtual).toContain("import preset from '")
			expect(virtual).not.toContain('createStonecropPreset')
		})
	})
})
