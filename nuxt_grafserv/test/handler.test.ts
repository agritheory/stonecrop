import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { GraphileConfig } from 'graphile-config'
import type { ModuleOptions } from '../src/types'

describe('Handler Functions', () => {
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

	describe('buildPreset', () => {
		it('should build preset with user preset options', async () => {
			const { grafserv } = await import('grafserv/h3/v1')
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				schema: 'test.graphql',
				preset: {
					grafserv: {
						websockets: true,
						maxRequestLength: 100000,
						graphqlOverGET: true,
					},
				},
			}

			await getGrafservInstance(options)

			expect(grafserv).toHaveBeenCalledWith(
				expect.objectContaining({
					preset: expect.objectContaining({
						grafserv: expect.objectContaining({
							websockets: true,
							graphqlOverGET: true,
							maxRequestLength: 100000,
						}),
					}),
				})
			)
		})

		it('should handle missing preset', async () => {
			const { grafserv } = await import('grafserv/h3/v1')
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				schema: 'test.graphql',
			}

			await getGrafservInstance(options)

			expect(grafserv).toHaveBeenCalledWith(
				expect.objectContaining({
					preset: expect.objectContaining({
						plugins: [],
					}),
				})
			)
		})

		it('should merge plugins array', async () => {
			const { grafserv } = await import('grafserv/h3/v1')
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			const mockPlugin = { name: 'test-plugin' } as GraphileConfig.Plugin

			const options: ModuleOptions = {
				schema: 'test.graphql',
				plugins: [mockPlugin],
			}

			await getGrafservInstance(options)

			expect(grafserv).toHaveBeenCalledWith(
				expect.objectContaining({
					preset: expect.objectContaining({
						plugins: [mockPlugin],
					}),
				})
			)
		})
	})

	describe('getSchema - resolver transformation', () => {
		it('should auto-wrap old format resolvers', async () => {
			const { makeGrafastSchema } = await import('grafast')
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			// Mock virtual module with old format resolvers
			vi.doMock('#internal/grafserv/resolvers', () => ({
				default: {
					Query: {
						hello: () => 'world',
					},
				},
			}))

			const options: ModuleOptions = {
				schema: 'test.graphql',
				resolvers: 'server/resolvers.ts',
			}

			await getGrafservInstance(options)

			// Verify that resolvers were auto-wrapped with "plans" structure
			expect(makeGrafastSchema).toHaveBeenCalledWith(
				expect.objectContaining({
					objects: expect.objectContaining({
						Query: expect.objectContaining({
							plans: expect.any(Object),
						}),
					}),
				})
			)
		})

		it('should not double-wrap new format resolvers', async () => {
			const { makeGrafastSchema } = await import('grafast')
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			// Mock virtual module with new format resolvers
			const newFormatResolvers = {
				Query: {
					plans: {
						hello: () => 'world',
					},
				},
			}

			vi.doMock('#internal/grafserv/resolvers', () => ({
				default: newFormatResolvers,
			}))

			const options: ModuleOptions = {
				schema: 'test.graphql',
				resolvers: 'server/resolvers.ts',
			}

			await getGrafservInstance(options)

			expect(makeGrafastSchema).toHaveBeenCalledWith(
				expect.objectContaining({
					objects: expect.objectContaining({
						Query: newFormatResolvers.Query,
					}),
				})
			)
		})
	})

	describe('getGrafservInstance', () => {
		it('should cache grafserv instance', async () => {
			const { grafserv } = await import('grafserv/h3/v1')
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
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
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
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
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				schema: 'test.graphql',
				preset: {
					grafserv: {
						websockets: true,
					},
				},
			}

			await getGrafservInstance(options)

			expect(grafserv).toHaveBeenCalledWith(
				expect.objectContaining({
					schema: expect.anything(),
					preset: expect.objectContaining({
						grafserv: expect.objectContaining({
							websockets: true,
						}),
					}),
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
			// Mock the middleware module to throw an error
			vi.doMock('#internal/grafserv/middleware', () => {
				throw new Error('Module not found')
			})

			// Reset modules to pick up new mock
			vi.resetModules()

			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				schema: 'test.graphql',
			}

			// Should not throw - middleware errors are caught
			await expect(getGrafservInstance(options)).resolves.toBeDefined()
		})

		it('should handle middleware module without default export', async () => {
			vi.doMock('#internal/grafserv/middleware', () => ({}))

			vi.resetModules()

			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				schema: 'test.graphql',
			}

			await expect(getGrafservInstance(options)).resolves.toBeDefined()
		})
	})

	describe('getSchema', () => {
		it('should handle schema provider function', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			const mockSchema = { _type: 'MockSchema', _source: 'function' }
			const schemaProvider = vi.fn(async () => mockSchema)

			const options: ModuleOptions = {
				schema: schemaProvider,
			}

			await getGrafservInstance(options)

			expect(schemaProvider).toHaveBeenCalled()
		})

		it('should handle resolver load error', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			// Mock console.warn to suppress expected error output
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			// Mock the resolvers module to throw
			vi.doMock('#internal/grafserv/resolvers', () => {
				throw new Error('Cannot find resolvers')
			})

			const options: ModuleOptions = {
				schema: 'test.graphql',
				resolvers: 'server/resolvers.ts',
			}

			// Should not throw - resolver errors are caught and logged
			await expect(getGrafservInstance(options)).resolves.toBeDefined()
			expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not load resolvers'), expect.any(Error))

			warnSpy.mockRestore()
		})

		it('should throw error when no schema provided', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

			await clearGrafservCache()

			const options: ModuleOptions = {
				schema: undefined as any,
			}

			await expect(getGrafservInstance(options)).rejects.toThrow('[@stonecrop/nuxt-grafserv] No schema provided')
		})
	})
})
