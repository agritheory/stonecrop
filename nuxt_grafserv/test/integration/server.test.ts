// Integration tests for nuxt-grafserv with mocked dependencies

import type { EventHandler, H3Event } from 'h3'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { ModuleOptions } from '../../src/types'

// Mock virtual modules FIRST before any other imports
vi.mock('#internal/grafserv/resolvers', () => ({
	default: {},
}))

vi.mock('#internal/grafserv/middleware', () => ({
	default: [],
}))

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
		vi.resetModules() // Reset module cache to pick up fresh mocks
	})

	describe('Module Configuration', () => {
		it('should export module as a function', async () => {
			const module = await import('../../src/module')
			expect(module.default).toBeDefined()
			expect(typeof module.default).toBe('function')
			// defineNuxtModule returns a setup function
		})

		it('should export module', async () => {
			const module = await import('../../src/module')
			// Check that default export exists (the module function)
			expect(module.default).toBeDefined()
			expect(typeof module.default).toBe('function')
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
})
