import { describe, it, expect, vi, beforeEach } from 'vitest'

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
vi.mock('@nuxt/kit', () => ({
	createResolver: vi.fn(() => ({
		resolve: vi.fn((path: string) => `resolved:${path}`),
	})),
	defineNuxtModule: vi.fn(config => config),
	useLogger: vi.fn(() => ({
		info: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
	})),
}))

// Mock node:path
vi.mock('node:path', () => ({
	join: vi.fn((...paths: string[]) => paths.join('/')),
}))

describe('Grafserv Module', () => {
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

		it('should provide default options', () => {
			const defaults = module.defaults(mockNuxt)

			expect(defaults).toMatchObject({
				schema: 'server/**/*.graphql',
				resolvers: undefined, // Optional - not needed for PostGraphile
				url: '/graphql/',

				graphiql: undefined,
				plugins: [],
				preset: {
					grafserv: {
						websockets: false,
					},
				},
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
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(mockNuxt.hook).toHaveBeenCalledWith('nitro:config', expect.any(Function))
		})

		it('should configure nitro aliases', () => {
			const options: ModuleOptions = {
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(nitroConfig.alias['#grafserv-server']).toBe('/test/project/server')
		})

		it('should configure runtime config with schema paths', () => {
			const options: ModuleOptions = {
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
				schema: '/absolute/path/schema.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(nitroConfig.runtimeConfig.grafserv?.schema).toBe('/absolute/path/schema.graphql')
		})

		it('should handle array of schema paths', () => {
			const options: ModuleOptions = {
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
			const schemaFn = () => ({ _type: 'MockSchema' } as unknown as import('graphql').GraphQLSchema)
			const options: ModuleOptions = {
				schema: schemaFn,
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(nitroConfig.runtimeConfig.grafserv?.schema).toBe(schemaFn)
		})

		it('should create virtual module for resolvers', () => {
			const options: ModuleOptions = {
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
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			const graphqlHandler = nitroConfig.handlers.find(h => h.handler.includes('handler') && h.route === '/graphql/')
			expect(graphqlHandler).toBeDefined()
			expect(graphqlHandler?.route).toBe('/graphql/')
		})

		it('should register Ruru UI handler', () => {
			const options: ModuleOptions = {
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			const ruruHandler = nitroConfig.handlers.find(h => h.handler.includes('ruru'))
			expect(ruruHandler).toBeDefined()
		})

		it('should register Ruru static assets handler', () => {
			const options: ModuleOptions = {
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			const staticHandler = nitroConfig.handlers.find(h => h.route === '/ruru-static/**')
			expect(staticHandler).toBeDefined()
		})

		it('should register cache handler', () => {
			const options: ModuleOptions = {
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			const cacheHandler = nitroConfig.handlers.find(h => h.route === '/graphql/cache')
			expect(cacheHandler).toBeDefined()
		})
	})

	describe('Development Mode', () => {
		it('should set up file watcher in dev mode', async () => {
			mockNuxt.options.dev = true

			const options: ModuleOptions = {
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
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
				url: '/graphql/',
			}

			module.setup(options, mockNuxt)

			expect(mockNuxt.hook).toHaveBeenCalledWith('devtools:customTabs', expect.any(Function))
		})

		it('should not register devtools tab when url is not provided', () => {
			const options: ModuleOptions = {
				schema: 'server/**/*.graphql',
				resolvers: 'server/resolvers.ts',
			}

			module.setup(options, mockNuxt)

			const devtoolsHookCalls = mockNuxt.hook.mock.calls.filter((call: unknown[]) => call[0] === 'devtools:customTabs')
			expect(devtoolsHookCalls.length).toBe(0)
		})
	})
})
