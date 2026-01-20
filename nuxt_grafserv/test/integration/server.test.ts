// Integration tests for nuxt-grafserv with mocked dependencies

import type { EventHandler, H3Event } from 'h3'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { GrafastContext, MiddlewareFunction, ModuleOptions } from '../../src/types'

// Mock H3 and Nitro
vi.mock('h3', () => ({
	defineEventHandler: (handler: EventHandler) => handler,
}))

vi.mock('nitropack/runtime', () => ({
	useRuntimeConfig: vi.fn(() => ({
		grafserv: {
			schema: 'test.graphql',
			url: '/graphql/',
		},
	})),
}))

// Mock grafserv
const mockHandleGraphQLEvent = vi.fn()
const mockHandleGraphiqlEvent = vi.fn()
const mockHandleGraphiqlStaticEvent = vi.fn()

vi.mock('grafserv/h3/v1', () => ({
	grafserv: vi.fn(() => ({
		handleGraphQLEvent: mockHandleGraphQLEvent,
		handleGraphiqlEvent: mockHandleGraphiqlEvent,
		handleGraphiqlStaticEvent: mockHandleGraphiqlStaticEvent,
	})),
}))

// Mock grafast
vi.mock('grafast', () => ({
	makeGrafastSchema: vi.fn(() => ({ _type: 'MockSchema' })),
}))

// Mock graphql-tools
vi.mock('@graphql-tools/load', () => ({
	loadTypedefs: vi.fn(() =>
		Promise.resolve([
			{
				document: { kind: 'Document', definitions: [] },
			},
		])
	),
}))

vi.mock('@graphql-tools/graphql-file-loader', () => ({
	GraphQLFileLoader: vi.fn(),
}))

describe('Nuxt Grafserv Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Module Configuration', () => {
		it('should export module as a function', async () => {
			const module = await import('../../src/module')
			expect(module.default).toBeDefined()
			expect(typeof module.default).toBe('function')
			// defineNuxtModule returns a setup function
		})

		it('should export types', async () => {
			const module = await import('../../src/module')
			// Check that named exports exist
			expect(module.ModuleOptions).toBeUndefined() // Type-only export
			expect(module.default).toBeDefined() // Default export is the module function
		})
	})

	describe('Handler Endpoints', () => {
		it('should call handleGraphQLEvent for GraphQL handler', async () => {
			const { clearGrafservCache } = await import('../../src/runtime/handler')
			await clearGrafservCache()

			const graphqlHandler = await import('../../src/runtime/graphql')

			const mockEvent = {
				node: {
					req: {
						url: '/graphql/',
						method: 'POST',
						headers: {},
					},
				},
				context: { params: {} },
			}

			await graphqlHandler.default(mockEvent as H3Event)

			expect(mockHandleGraphQLEvent).toHaveBeenCalledWith(mockEvent)
		})

		it('should call handleGraphiqlEvent for Ruru handler', async () => {
			const { clearGrafservCache } = await import('../../src/runtime/handler')
			await clearGrafservCache()

			const ruruHandler = await import('../../src/runtime/ruru')

			const mockEvent = {
				node: {
					req: {
						url: '/graphql/',
						method: 'GET',
						headers: {},
					},
				},
				context: { params: {} },
			}

			await ruruHandler.default(mockEvent as H3Event)

			expect(mockHandleGraphiqlEvent).toHaveBeenCalledWith(mockEvent)
		})

		it('should call handleGraphiqlStaticEvent for static assets handler', async () => {
			const { clearGrafservCache } = await import('../../src/runtime/handler')
			await clearGrafservCache()

			const staticHandler = await import('../../src/runtime/ruru-static')

			const mockEvent = {
				node: {
					req: {
						url: '/ruru-static/app.js',
						method: 'GET',
						headers: {},
					},
				},
				context: { params: {} },
			}

			await staticHandler.default(mockEvent as H3Event)

			expect(mockHandleGraphiqlStaticEvent).toHaveBeenCalledWith(mockEvent)
		})
	})

	describe('Middleware Chain', () => {
		it('should apply middleware in correct order', async () => {
			const { clearGrafservCache } = await import('../../src/runtime/handler')
			await clearGrafservCache()

			const executionOrder: string[] = []

			// Mock middleware virtual module
			vi.doMock('#internal/grafserv/middleware', () => ({
				default: [
					async (ctx, next) => {
						executionOrder.push('middleware1-before')
						ctx.middleware1 = true
						const result = await next()
						executionOrder.push('middleware1-after')
						return result
					},
					async (ctx, next) => {
						executionOrder.push('middleware2-before')
						ctx.middleware2 = true
						const result = await next()
						executionOrder.push('middleware2-after')
						return result
					},
				] as MiddlewareFunction[],
			}))

			const handler = await import('../../src/runtime/handler')
			const mockEvent = {
				node: {
					req: {
						url: '/graphql/',
						method: 'POST',
						headers: { host: 'localhost' },
					},
				},
				context: { params: {} },
			}

			await handler.default(mockEvent as H3Event)

			expect(executionOrder).toEqual([
				'middleware1-before',
				'middleware2-before',
				'middleware2-after',
				'middleware1-after',
			])
		})
	})

	describe('Preset Merging', () => {
		it('should use grafserv options from preset', async () => {
			const { grafserv } = await import('grafserv/h3/v1')
			const { getGrafservInstance, clearGrafservCache } = await import('../../src/runtime/handler')

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
							maxRequestLength: 100000,
							graphqlOverGET: true,
						}),
					}),
				})
			)
		})
	})

	describe('Context Structure', () => {
		it('should create context with Web standard Request object', async () => {
			// Mock middleware to capture context BEFORE importing handler
			let capturedContext: Partial<GrafastContext> = {}
			vi.doMock('#internal/grafserv/middleware', () => ({
				default: [
					async (ctx, next) => {
						capturedContext = ctx
						return next()
					},
				] as MiddlewareFunction[],
			}))

			// Clear cache and re-import handler to pick up mocked middleware
			const { clearGrafservCache } = await import('../../src/runtime/handler')
			await clearGrafservCache()
			vi.resetModules()

			const handler = await import('../../src/runtime/handler')
			const mockEvent = {
				node: {
					req: {
						url: '/graphql/',
						method: 'POST',
						headers: { host: 'localhost', authorization: 'Bearer token' },
					},
				},
				context: { params: { id: '123' } },
			}

			await handler.default(mockEvent as H3Event)

			expect(capturedContext).toBeDefined()
			expect(capturedContext.req).toBeInstanceOf(Request)
			expect(capturedContext.params).toEqual({ id: '123' })
		})
	})
})
