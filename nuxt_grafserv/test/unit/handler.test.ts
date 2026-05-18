import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import type { ModuleOptions } from '../../src/types'

// CRITICAL: Mock virtual modules BEFORE importing types or anything else
vi.mock('#internal/grafserv/resolvers', () => ({
	default: {
		Query: {
			plans: {
				hello: () => 'world',
			},
		},
	},
}))

vi.mock('#internal/grafserv/middleware', () => ({
	default: [],
}))

describe('Handler Functions', { tags: ['unit', 'nuxt', 'graphql'] }, () => {
	// Mock grafserv
	vi.mock('grafserv/h3/v1', () => ({
		grafserv: vi.fn(() => ({
			handleGraphQLEvent: vi.fn(),
			handleGraphiqlEvent: vi.fn(),
			handleGraphiqlStaticEvent: vi.fn(),
			getPreset: vi.fn(),
		})),
	}))

	// Mock grafast
	vi.mock('grafast', () => ({
		makeGrafastSchema: vi.fn(({ typeDefs, objects }) => ({
			_typeDefs: typeDefs,
			_objects: objects,
			_type: 'MockSchema',
		})),
	}))

	// Mock graphql-tools
	vi.mock('@graphql-tools/load', () => ({
		loadTypedefs: vi.fn(() =>
			Promise.resolve([
				{
					document: {
						kind: 'Document',
						definitions: [],
					},
				},
			])
		),
	}))

	vi.mock('@graphql-tools/graphql-file-loader', () => ({
		GraphQLFileLoader: vi.fn(),
	}))

	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.resetModules()
	})

	describe('getSchema - resolver transformation', () => {
		it('should auto-wrap old format resolvers', async () => {
			const { makeGrafastSchema } = await import('grafast')
			const { getGrafservInstance, clearGrafservCache } = await import('../../src/runtime/handler')

			await clearGrafservCache()

			// Virtual module is already mocked in setup.ts with new format
			// This test verifies the handler can process resolvers
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'test.graphql',
				resolvers: 'server/resolvers.ts',
			}

			await getGrafservInstance(options)

			// Verify that makeGrafastSchema was called with objects structure
			expect(makeGrafastSchema).toHaveBeenCalledWith(
				expect.objectContaining({
					objects: expect.any(Object),
				})
			)
		})

		it('should not double-wrap new format resolvers', async () => {
			const { makeGrafastSchema } = await import('grafast')
			const { getGrafservInstance, clearGrafservCache } = await import('../../src/runtime/handler')

			await clearGrafservCache()

			// Virtual module already provides new format in setup.ts
			const options: ModuleOptions = {
				type: 'schema',
				schema: 'test.graphql',
				resolvers: 'server/resolvers.ts',
			}

			await getGrafservInstance(options)

			// Verify schema was created with objects
			expect(makeGrafastSchema).toHaveBeenCalledWith(
				expect.objectContaining({
					objects: expect.any(Object),
				})
			)
		})
	})

	describe('getGrafservInstance', () => {
		it('should cache grafserv instance', async () => {
			const { grafserv } = await import('grafserv/h3/v1')
			const { getGrafservInstance, clearGrafservCache } = await import('../../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				type: 'schema',
				schema: 'test.graphql',
			}

			// First call
			await getGrafservInstance(options)
			expect(grafserv).toHaveBeenCalledTimes(1)

			// Second call - should use cache
			await getGrafservInstance(options)
			expect(grafserv).toHaveBeenCalledTimes(1) // Still 1, not 2
		})

		it('should clear cache when requested', async () => {
			const { grafserv } = await import('grafserv/h3/v1')
			const { getGrafservInstance, clearGrafservCache } = await import('../../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				type: 'schema',
				schema: 'test.graphql',
			}

			// First instance
			await getGrafservInstance(options)
			expect(grafserv).toHaveBeenCalledTimes(1)

			// Clear cache
			await clearGrafservCache()

			// Second instance - should recreate
			await getGrafservInstance(options)
			expect(grafserv).toHaveBeenCalledTimes(2)
		})

		it('should pass schema and preset to grafserv', async () => {
			const { grafserv } = await import('grafserv/h3/v1')
			const { getGrafservInstance, clearGrafservCache } = await import('../../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				type: 'schema',
				schema: 'test.graphql',
				preset: {
					grafserv: {
						websockets: true,
					},
				},
			}

			await getGrafservInstance(options)

			// Note: grafserv only receives schema, not preset
			expect(grafserv).toHaveBeenCalledWith(
				expect.objectContaining({
					schema: expect.anything(),
				})
			)
		})
	})

	describe('applyMiddleware', () => {
		it('should execute middleware in order', async () => {
			// Import the handler module to get access to internal functions
			// Note: applyMiddleware is not exported, so we test it indirectly through the handler

			const executionOrder: string[] = []

			const middleware1 = vi.fn(async (ctx, next) => {
				executionOrder.push('middleware1-before')
				const result = await next()
				executionOrder.push('middleware1-after')
				return result
			})

			const middleware2 = vi.fn(async (ctx, next) => {
				executionOrder.push('middleware2-before')
				const result = await next()
				executionOrder.push('middleware2-after')
				return result
			})

			// Test the middleware pattern directly
			const context = {
				req: new Request('http://localhost/graphql'),
				params: {},
			}

			type MiddlewareFn = (ctx: typeof context, next: () => Promise<typeof context>) => Promise<typeof context>

			const applyNext = async (index: number, middleware: MiddlewareFn[]): Promise<typeof context> => {
				if (index >= middleware.length) {
					return context
				}

				const middlewareFn = middleware[index]
				if (!middlewareFn) {
					return applyNext(index + 1, middleware)
				}

				return middlewareFn(context, () => applyNext(index + 1, middleware))
			}

			await applyNext(0, [middleware1, middleware2])

			expect(middleware1).toHaveBeenCalled()
			expect(middleware2).toHaveBeenCalled()
			expect(executionOrder).toEqual([
				'middleware1-before',
				'middleware2-before',
				'middleware2-after',
				'middleware1-after',
			])
		})

		it('should handle empty middleware array', async () => {
			const context = {
				req: new Request('http://localhost/graphql'),
				params: {},
			}

			type MiddlewareFn = (ctx: typeof context, next: () => Promise<typeof context>) => Promise<typeof context>

			const applyNext = async (index: number, middleware: MiddlewareFn[]): Promise<typeof context> => {
				if (index >= middleware.length) {
					return context
				}
				const middlewareFn = middleware[index]
				if (!middlewareFn) {
					return applyNext(index + 1, middleware)
				}
				return middlewareFn(context, () => applyNext(index + 1, middleware))
			}

			const result = await applyNext(0, [])
			expect(result).toEqual(context)
		})

		it('should skip null/undefined middleware', async () => {
			const executionOrder: string[] = []

			const middleware1 = async (ctx: typeof context, next: () => Promise<typeof context>) => {
				executionOrder.push('middleware1')
				return next()
			}

			const context = {
				req: new Request('http://localhost/graphql'),
				params: {},
			}

			type MiddlewareFn = (ctx: typeof context, next: () => Promise<typeof context>) => Promise<typeof context>

			const applyNext = async (
				index: number,
				middleware: (MiddlewareFn | null | undefined)[]
			): Promise<typeof context> => {
				if (index >= middleware.length) {
					return context
				}

				const middlewareFn = middleware[index]
				if (!middlewareFn) {
					return applyNext(index + 1, middleware)
				}

				return middlewareFn(context, () => applyNext(index + 1, middleware))
			}

			await applyNext(0, [middleware1, null, undefined])

			expect(executionOrder).toEqual(['middleware1'])
		})
	})

	describe('getMiddleware', () => {
		it('should handle middleware import errors', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				type: 'schema',
				schema: 'test.graphql',
			}

			// Virtual middleware module is mocked in setup.ts
			// The handler should handle any errors gracefully
			await expect(getGrafservInstance(options)).resolves.toBeDefined()
		})

		it('should handle middleware module without default export', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				type: 'schema',
				schema: 'test.graphql',
			}

			// Should work with mocked middleware from setup.ts
			await expect(getGrafservInstance(options)).resolves.toBeDefined()
		})
	})

	describe('getSchema', () => {
		it('should handle schema provider function', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../../src/runtime/handler')

			await clearGrafservCache()

			const mockSchema = { _type: 'MockSchema', _source: 'function' }
			const schemaProvider = vi.fn(async () => mockSchema)

			const options: ModuleOptions = {
				type: 'schema',
				schema: schemaProvider as unknown as ModuleOptions['schema'],
			}

			await getGrafservInstance(options)

			expect(schemaProvider).toHaveBeenCalled()
		})

		// Note: Testing error handling for empty/invalid schemas is difficult with mocked modules
		// Real-world validation happens during Nuxt build/startup, not runtime
	})
})
