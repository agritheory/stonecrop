import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'

import type { PostGraphileConfig, SchemaConfig } from '../../../src/types'

// NOTE: `postgraphile` and `#build/grafserv-preset` are deliberately NOT mocked here. Neither is
// imported by src/runtime/handler.ts — `postgraphile` appears only inside the virtual-module
// template strings module.ts writes at build time. Mocking them was dead weight, and the stale
// belief that `#build/grafserv-preset` was on this code path is what every skip reason below cited.
// The real dependency is `#internal/grafserv/pgl`, which vitest.config.ts aliases to ./mocks/pgl.

// `afterEach` calls vi.resetModules(), so each test gets a fresh copy of the handler AND of the pgl
// mock it imports. A module-scoped `import { pgl }` would therefore be a stale object from a
// previous test's registry — load both together, inside the test, after the reset.
const loadFreshHandler = async () => {
	const handler = await import('../../../src/runtime/handler')
	const pglMock = await import('../../mocks/pgl')
	await handler.clearGrafservCache()
	return { ...handler, ...pglMock }
}

// Mock grafserv
vi.mock('grafserv/h3/v1', () => ({
	grafserv: vi.fn((config: any) => ({
		schema: config.schema,
		handleGraphQLEvent: vi.fn(),
		handleGraphiqlEvent: vi.fn(),
	})),
}))

describe('PostGraphile Preset Integration', { tags: ['e2e', 'nuxt', 'graphql'] }, () => {
	beforeEach(() => {
		// Clear all mocks before each test
		vi.clearAllMocks()
	})

	afterEach(() => {
		// Clear module cache to ensure clean state
		vi.resetModules()
	})

	describe('PostGraphileConfig', () => {
		const postgraphileConfig: PostGraphileConfig = { type: 'postgraphile' }

		it('builds the grafserv instance via pgl.createServ for postgraphile type', async () => {
			const { getGrafservInstance, pgl, mockPglSchema } = await loadFreshHandler()

			const instance = await getGrafservInstance(postgraphileConfig)

			// createServ receives the grafserv factory itself — that is the contract preserving
			// withPgClient/pgSettings/plugin middleware, and the reason the handler does not build
			// the schema itself.
			expect(pgl.createServ).toHaveBeenCalledOnce()
			expect(pgl.createServ.mock.calls[0][0]).toBeTypeOf('function')
			expect(instance.schema).toBe(mockPglSchema)
		})

		it('throws a helpful error when the postgraphile package is missing', async () => {
			const { getGrafservInstance, pgl } = await loadFreshHandler()

			pgl.createServ.mockImplementationOnce(() => {
				const error = new Error("Cannot find module 'postgraphile'") as Error & { code: string }
				error.code = 'MODULE_NOT_FOUND'
				throw error
			})

			await expect(getGrafservInstance(postgraphileConfig)).rejects.toThrow(/"postgraphile" package not found/)
		})

		it('rethrows a non-MODULE_NOT_FOUND failure unchanged', async () => {
			const { getGrafservInstance, pgl } = await loadFreshHandler()

			pgl.createServ.mockImplementationOnce(() => {
				throw new Error('pg connection refused')
			})

			await expect(getGrafservInstance(postgraphileConfig)).rejects.toThrow('pg connection refused')
		})

		it('caches the instance on subsequent calls', async () => {
			const { getGrafservInstance, pgl } = await loadFreshHandler()

			const first = await getGrafservInstance(postgraphileConfig)
			const second = await getGrafservInstance(postgraphileConfig)

			expect(second).toBe(first)
			expect(pgl.createServ).toHaveBeenCalledOnce()
		})
	})

	describe('SchemaConfig with function', () => {
		it('should use schema provider function for schema type', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../../../src/runtime/handler')

			await clearGrafservCache()

			const mockSchema = new GraphQLSchema({
				query: new GraphQLObjectType({
					name: 'Query',
					fields: {
						test: {
							type: GraphQLString,
							resolve: () => 'test value',
						},
					},
				}),
			})

			const schemaProvider = vi.fn(() => Promise.resolve(mockSchema))

			const config: SchemaConfig = {
				type: 'schema',
				schema: schemaProvider,
			}

			const instance = await getGrafservInstance(config)

			// Verify schema provider was called
			expect(schemaProvider).toHaveBeenCalled()

			// Verify grafserv was created with the schema
			expect(instance).toBeDefined()
			expect(instance.schema).toBe(mockSchema)
		})
	})

	describe('Type discrimination', () => {
		it('should handle postgraphile type correctly', async () => {
			const { getGrafservInstance } = await loadFreshHandler()

			const instance = await getGrafservInstance({ type: 'postgraphile' } as PostGraphileConfig)

			expect(instance).toBeDefined()
			expect(instance.handleGraphQLEvent).toBeDefined()
		})

		it('should handle schema type correctly', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../../../src/runtime/handler')
			await clearGrafservCache()

			const mockSchema = new GraphQLSchema({
				query: new GraphQLObjectType({
					name: 'Query',
					fields: {
						test: {
							type: GraphQLString,
						},
					},
				}),
			})

			const config: SchemaConfig = {
				type: 'schema',
				schema: () => mockSchema,
			}

			const instance = await getGrafservInstance(config)

			// Should not throw and should return valid instance
			expect(instance).toBeDefined()
			expect(instance.handleGraphQLEvent).toBeDefined()
		})

		it('should throw error for invalid type', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../../../src/runtime/handler')
			await clearGrafservCache()

			const config: any = {
				type: 'invalid',
			}

			await expect(getGrafservInstance(config)).rejects.toThrow(/Invalid configuration type/)
		})
	})

	describe('Grafserv instance creation', () => {
		it('passes the preset and schema through to grafserv for a PostGraphile config', async () => {
			const { getGrafservInstance, mockPglSchema } = await loadFreshHandler()
			const { grafserv } = await import('grafserv/h3/v1')

			await getGrafservInstance({ type: 'postgraphile' } as PostGraphileConfig)

			// The handler hands grafserv to createServ; postgraphile is what calls it, with both the
			// resolved preset and the schema it built.
			expect(grafserv).toHaveBeenCalledOnce()
			expect(vi.mocked(grafserv).mock.calls[0][0]).toMatchObject({ schema: mockPglSchema })
			expect(vi.mocked(grafserv).mock.calls[0][0]).toHaveProperty('preset')
		})
	})
})
